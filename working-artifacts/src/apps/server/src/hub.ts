import type {
  ErrorCode,
  RoomEndedReason,
  RoomNotice,
  RoomView,
  ServerPayloads,
  ServerType,
} from '@wb/protocol';
import { serverMessage } from '@wb/protocol';
import { formatName } from '@wb/protocol';
import type { Config } from './config';
import type { Connection } from './connection';
import { expireNopeWindow, runBot } from './gameService';
import { WindowLimiter } from './limits';
import { findMember, connectedHumans, deciderId, toRoomView, type Room } from './room';
import { codeHash, type Clock, type Logger } from './util';

interface Tombstone {
  closedAt: number;
  reason: RoomEndedReason;
}

/** Owns every room, the shared limiters, broadcast helpers, and the sweep loop. */
export class Hub {
  readonly rooms = new Map<string, Room>();
  readonly tombstones = new Map<string, Tombstone>();
  readonly connections = new Set<Connection>();
  private readonly roomsByIp = new Map<string, number>();
  private timer: NodeJS.Timeout | null = null;
  shuttingDown = false;

  readonly joinFailsByIp: WindowLimiter;
  readonly joinFailsByConn: WindowLimiter;
  readonly newConnections: WindowLimiter;

  constructor(
    readonly config: Config,
    readonly clock: Clock,
    readonly log: Logger,
  ) {
    const { joinFailLimit, joinFailWindowMs, joinBlockMs } = config;
    this.joinFailsByIp = new WindowLimiter(joinFailLimit, joinFailWindowMs, joinBlockMs, clock);
    this.joinFailsByConn = new WindowLimiter(joinFailLimit, joinFailWindowMs, joinBlockMs, clock);
    this.newConnections = new WindowLimiter(config.connPerMinute, 60_000, 60_000, clock);
  }

  // ------------------------------------------------------------------ sending

  send<T extends ServerType>(conn: Connection, t: T, p: ServerPayloads[T], id?: string): void {
    conn.send(serverMessage(t, p, id));
  }

  ack(conn: Connection, id: string | undefined): void {
    if (id !== undefined) this.send(conn, 'ack', {}, id);
  }

  error(
    conn: Connection,
    id: string | undefined,
    code: ErrorCode,
    extra?: { message?: string; data?: { taken?: string[] } },
  ): void {
    this.send(conn, 'error', { code, ...extra }, id);
  }

  roomView(room: Room): RoomView {
    return toRoomView(room, this.config);
  }

  broadcastRoom(room: Room, notices?: RoomNotice[], except?: Connection): void {
    const payload: ServerPayloads['room.update'] = { room: this.roomView(room) };
    if (notices && notices.length > 0) payload.notices = notices;
    for (const m of room.members) {
      if (m.conn && m.conn !== except) this.send(m.conn, 'room.update', payload);
    }
  }

  broadcastAbsent(room: Room): void {
    for (const m of room.members) {
      if (m.conn) this.send(m.conn, 'absent.update', { absent: room.absent, hostId: room.hostId });
    }
  }

  // ------------------------------------------------------------------- rooms

  roomCountForIp(ip: string): number {
    return this.roomsByIp.get(ip) ?? 0;
  }

  registerRoom(room: Room): void {
    this.rooms.set(room.code, room);
    this.roomsByIp.set(room.creatorIp, this.roomCountForIp(room.creatorIp) + 1);
  }

  isCodeTaken = (code: string): boolean => this.rooms.has(code) || this.tombstones.has(code);

  touch(room: Room): void {
    room.lastActivityAt = this.clock.now();
  }

  /** Closes a room: notify, revoke, clean up, and leave a code-only tombstone. */
  dispose(room: Room, reason: RoomEndedReason): void {
    if (room.phase === 'CLOSED') return;
    room.phase = 'CLOSED';
    for (const m of room.members) {
      const conn = m.conn;
      if (conn) {
        this.send(conn, 'room.ended', { reason });
        conn.bound = null;
        conn.close(1000, 'room ended');
      }
      m.conn = null;
      m.connected = false;
      m.tokenHash = null;
    }
    this.rooms.delete(room.code);
    const left = this.roomCountForIp(room.creatorIp) - 1;
    if (left > 0) this.roomsByIp.set(room.creatorIp, left);
    else this.roomsByIp.delete(room.creatorIp);
    this.tombstones.set(room.code, { closedAt: this.clock.now(), reason });
    room.members = [];
    room.game = null;
    room.bans.clear();
    room.dedupe.clear();
    this.log.info('room_closed', {
      codeHash: codeHash(room.code),
      reason,
      ageMs: this.clock.now() - room.createdAt,
    });
  }

  // -------------------------------------------------------------------- host

  /** Atomic host transfer. Returns false when no successor exists. */
  transferHost(room: Room, voluntary: boolean): boolean {
    const candidates = room.members
      .filter((m) => !m.isBot && !m.left && m.playerId !== room.hostId)
      .sort((a, b) => a.joinIndex - b.joinIndex);
    const successor = candidates.find((m) => m.connected) ?? (voluntary ? candidates[0] : undefined);
    if (!successor) return false;
    room.hostId = successor.playerId;
    room.hostAwayDeadline = null;
    this.broadcastRoom(room, [{ kind: 'NEW_HOST', name: formatName(successor.name) }]);
    if (room.absent) this.broadcastAbsent(room);
    return true;
  }

  // ----------------------------------------------------------------- presence

  /** Recomputes who the game is waiting for and whether they are away. */
  recomputeAbsent(room: Room): void {
    let next = null as Room['absent'];
    const game = room.game;
    if (room.phase === 'PLAYING' && game && game.phase !== 'finished') {
      const id = deciderId(game);
      const member = findMember(room, id);
      if (member && !member.isBot && !member.left && !member.connected) {
        const now = this.clock.now();
        next =
          room.absent && room.absent.playerId === id
            ? room.absent
            : {
                playerId: id,
                since: now,
                deadlineAt: now + this.config.reconnectWindowMs,
                hostMayDecide: false,
              };
      }
    }
    const changed = JSON.stringify(next) !== JSON.stringify(room.absent);
    room.absent = next;
    if (changed) this.broadcastAbsent(room);
  }

  onClose(conn: Connection): void {
    this.connections.delete(conn);
    const bound = conn.bound;
    conn.bound = null;
    if (!bound) return;
    const room = this.rooms.get(bound.code);
    const member = room ? findMember(room, bound.playerId) : undefined;
    if (!room || !member || member.conn !== conn) return;

    member.conn = null;
    member.connected = false;
    const notices: RoomNotice[] = [];
    if (member.playerId === room.hostId && !member.left) {
      room.hostAwayDeadline = this.clock.now() + this.config.hostAwayMs;
      notices.push({ kind: 'LOST_CONNECTION', name: formatName(member.name) });
    }
    this.broadcastRoom(room, notices);
    this.recomputeAbsent(room);
  }

  // -------------------------------------------------------------------- sweep

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.sweep(), 250);
    this.timer.unref();
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  sweep(): void {
    const now = this.clock.now();
    for (const room of [...this.rooms.values()]) {
      try {
        this.sweepRoom(room, now);
      } catch {
        this.log.error('sweep_failed', { codeHash: codeHash(room.code) });
      }
    }
    for (const [code, t] of this.tombstones) {
      if (now - t.closedAt >= this.config.codeQuarantineMs) this.tombstones.delete(code);
    }
    this.joinFailsByIp.prune();
    this.joinFailsByConn.prune();
    this.newConnections.prune();
    for (const conn of this.connections) {
      if (now - conn.lastSeen > this.config.deadAfterMs) conn.ws.terminate();
    }
  }

  private sweepRoom(room: Room, now: number): void {
    const cfg = this.config;

    // Empty room: no connected human member for the grace period.
    if (connectedHumans(room).length === 0) {
      room.emptySince ??= now;
      if (now - room.emptySince >= cfg.emptyRoomGraceMs) return this.dispose(room, 'EMPTY');
    } else {
      room.emptySince = null;
    }

    // Host away too long: transfer (before the absent rule so the new host decides).
    if (room.hostAwayDeadline !== null && now >= room.hostAwayDeadline) {
      room.hostAwayDeadline = null;
      this.transferHost(room, false);
    }

    // Absent decider: after the window the host may decide.
    if (room.absent && !room.absent.hostMayDecide && now >= room.absent.deadlineAt) {
      room.absent = { ...room.absent, hostMayDecide: true };
      this.broadcastAbsent(room);
    }

    // Lifetime and idle expiry, with a warning shortly before.
    const idleAt =
      room.phase === 'LOBBY'
        ? room.lastActivityAt + cfg.idleLobbyMs
        : room.phase === 'PLAYING'
          ? room.lastActivityAt + cfg.idleGameMs
          : Math.max(room.finishedAt ?? 0, room.lastActivityAt) + cfg.finishedTtlMs;
    const absoluteAt = room.createdAt + cfg.maxLifetimeMs;
    if (now >= idleAt || now >= absoluteAt) return this.dispose(room, 'EXPIRED');

    let warning: Room['idleWarning'] = null;
    if (idleAt - now <= cfg.idleWarnMs) warning = { expiresAt: idleAt, absolute: false };
    if (absoluteAt - now <= cfg.idleWarnMs && (!warning || absoluteAt < warning.expiresAt)) {
      warning = { expiresAt: absoluteAt, absolute: true };
    }
    if (JSON.stringify(warning) !== JSON.stringify(room.idleWarning)) {
      room.idleWarning = warning;
      this.broadcastRoom(room);
    }

    // Nope window out of time.
    if (room.nopeDeadlineAt !== null && now >= room.nopeDeadlineAt) expireNopeWindow(this, room);

    // Bot waiting to act.
    if (room.botDueAt !== null && now >= room.botDueAt) runBot(this, room);
  }
}
