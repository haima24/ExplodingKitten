import type { Action } from '@wb/engine/types';
import {
  BOT_AVATARS,
  BOT_NAMES,
  formatName,
  parseCode,
  sameName,
  validateIdentity,
  type ClientPayload,
  type ClientType,
  type DisplayName,
  type ErrorCode,
} from '@wb/protocol';
import type { Connection } from './connection';
import { generateCode } from './codes';
import { applyEngine, resetToLobby, sendSnapshot, startGame } from './gameService';
import type { Hub } from './hub';
import { findMember, present, type Member, type Room } from './room';
import { newPlayerId, newToken, safeEqual, seededRngFor, secureRng, sha256 } from './util';

export interface Ctx {
  hub: Hub;
  conn: Connection;
  id: string | undefined;
}

let roomSeq = 0;

// ------------------------------------------------------------------ helpers

const fail = (ctx: Ctx, code: ErrorCode, message?: string): void =>
  ctx.hub.error(ctx.conn, ctx.id, code, message ? { message } : undefined);

/**
 * Failures on join paths use a small random delay and count against the
 * limiters, so timing and volume do not help someone guess codes (US-061).
 */
function failJoin(
  ctx: Ctx,
  code: ErrorCode,
  opts: { count?: boolean; data?: { taken?: string[] } } = {},
): void {
  const { hub, conn } = ctx;
  if (opts.count ?? true) {
    hub.joinFailsByIp.hit(conn.ip);
    hub.joinFailsByConn.hit(conn.id);
  }
  const { failDelayMinMs: lo, failDelayMaxMs: hi } = hub.config;
  const reply = (): void =>
    hub.error(conn, ctx.id, code, opts.data ? { data: opts.data } : undefined);
  if (hi <= 0) reply();
  else setTimeout(reply, lo + Math.floor(Math.random() * (hi - lo + 1)));
}

const joinBlocked = (ctx: Ctx): boolean =>
  ctx.hub.joinFailsByIp.isBlocked(ctx.conn.ip) || ctx.hub.joinFailsByConn.isBlocked(ctx.conn.id);

function bound(ctx: Ctx): { room: Room; member: Member } | null {
  const b = ctx.conn.bound;
  const room = b ? ctx.hub.rooms.get(b.code) : undefined;
  const member = room && b ? findMember(room, b.playerId) : undefined;
  if (!room || !member || member.conn !== ctx.conn || member.left) {
    fail(ctx, 'NOT_IN_ROOM');
    return null;
  }
  return { room, member };
}

/** Host-only requests: identity comes from the bound connection, never the payload. */
function asHost(ctx: Ctx): { room: Room; member: Member } | null {
  const b = bound(ctx);
  if (!b) return null;
  if (b.room.hostId !== b.member.playerId) {
    fail(ctx, 'NOT_HOST');
    return null;
  }
  return b;
}

function uniqueName(room: Room, base: DisplayName): DisplayName {
  const taken = present(room).map((m) => m.name);
  const name: DisplayName = { adjective: base.adjective, noun: base.noun };
  if (!taken.some((t) => sameName(t, name))) return name;
  for (let suffix = 2; ; suffix++) {
    const candidate: DisplayName = { ...name, suffix };
    if (!taken.some((t) => sameName(t, candidate))) return candidate;
  }
}

function addMember(
  room: Room,
  input: { name: DisplayName; avatarId: string; isBot: boolean },
): { member: Member; token: string | null } {
  const token = input.isBot ? null : newToken();
  const member: Member = {
    playerId: newPlayerId(),
    tokenHash: token ? sha256(token) : null,
    name: uniqueName(room, input.name),
    avatarId: input.avatarId,
    isBot: input.isBot,
    joinIndex: room.joinCounter++,
    connected: input.isBot,
    conn: null,
    left: false,
  };
  room.members.push(member);
  return { member, token };
}

function attach(room: Room, member: Member, conn: Connection): void {
  member.conn = conn;
  member.connected = true;
  conn.bound = { code: room.code, playerId: member.playerId };
}

// -------------------------------------------------------------- room: create

function onCreate(ctx: Ctx, p: ClientPayload<'room.create'>): void {
  const { hub, conn } = ctx;
  if (conn.bound) return fail(ctx, 'ALREADY_IN_ROOM');
  const idError = validateIdentity(p);
  if (idError) return fail(ctx, idError);
  if (hub.shuttingDown) return fail(ctx, 'SERVER_ERROR');
  if (hub.roomCountForIp(conn.ip) >= hub.config.maxRoomsPerIp || hub.rooms.size >= hub.config.maxRooms) {
    return fail(ctx, 'TOO_MANY_ROOMS');
  }
  const code = generateCode(hub.isCodeTaken);
  if (!code) return fail(ctx, 'SERVER_ERROR');

  const now = hub.clock.now();
  const room: Room = {
    code,
    phase: 'LOBBY',
    hostId: '',
    members: [],
    createdAt: now,
    lastActivityAt: now,
    creatorIp: conn.ip,
    game: null,
    rng: hub.config.testMode
      ? seededRngFor(`${process.env['TEST_SEED'] ?? 'wb'}-${roomSeq++}`)
      : secureRng,
    joinCounter: 0,
    bans: new Set(),
    hostAwayDeadline: null,
    absent: null,
    emptySince: null,
    finishedAt: null,
    previousFirstJoinIndex: null,
    idleWarning: null,
    dedupe: new Map(),
    botActorId: null,
    botDueAt: null,
    nopeDeadlineAt: null,
    nopeKey: null,
    turnTimerSec: hub.config.turnTimerDefaultSec,
    turn: null,
  };
  const { member, token } = addMember(room, { name: p.name, avatarId: p.avatarId, isBot: false });
  room.hostId = member.playerId;
  attach(room, member, conn);
  hub.registerRoom(room);
  hub.send(
    conn,
    'room.joined',
    { playerId: member.playerId, token: token ?? '', isHost: true, room: hub.roomView(room) },
    ctx.id,
  );
}

// ---------------------------------------------------------------- room: join

function onJoin(ctx: Ctx, p: ClientPayload<'room.join'>): void {
  const { hub, conn } = ctx;
  if (joinBlocked(ctx)) return failJoin(ctx, 'RATE_LIMITED', { count: false });
  if (conn.bound) return fail(ctx, 'ALREADY_IN_ROOM');
  const code = parseCode(p.code);
  if (!code) return failJoin(ctx, 'INVALID_CODE');
  const idError = validateIdentity(p);
  if (idError) return failJoin(ctx, idError, { count: false });

  const room = hub.rooms.get(code);
  if (!room) return failJoin(ctx, hub.tombstones.has(code) ? 'ROOM_CLOSED' : 'ROOM_NOT_FOUND');
  if (room.phase !== 'LOBBY') return failJoin(ctx, 'GAME_STARTED');
  const members = present(room);
  if (members.length >= hub.config.roomCapacity) return failJoin(ctx, 'ROOM_FULL');
  const taken = members.map((m) => m.avatarId);
  if (taken.includes(p.avatarId)) {
    return failJoin(ctx, 'AVATAR_TAKEN', { count: false, data: { taken } });
  }

  const { member, token } = addMember(room, { name: p.name, avatarId: p.avatarId, isBot: false });
  attach(room, member, conn);
  hub.touch(room);
  hub.send(
    conn,
    'room.joined',
    { playerId: member.playerId, token: token ?? '', isHost: false, room: hub.roomView(room) },
    ctx.id,
  );
  hub.broadcastRoom(room, [{ kind: 'JOINED', name: formatName(member.name), who: member.name }], conn);
}

function onRejoin(ctx: Ctx, p: ClientPayload<'room.rejoin'>): void {
  const { hub, conn } = ctx;
  if (joinBlocked(ctx)) return failJoin(ctx, 'RATE_LIMITED', { count: false });
  if (conn.bound) return fail(ctx, 'ALREADY_IN_ROOM');
  const code = parseCode(p.code);
  if (!code) return failJoin(ctx, 'INVALID_CODE');
  const room = hub.rooms.get(code);
  if (!room) return failJoin(ctx, hub.tombstones.has(code) ? 'ROOM_CLOSED' : 'ROOM_NOT_FOUND');

  const hash = sha256(p.token);
  if (room.bans.has(hash.toString('hex'))) return failJoin(ctx, 'REMOVED');
  // Compare against every member (no early exit) with a timing-safe check.
  let match: Member | undefined;
  for (const m of room.members) {
    if (!m.isBot && !m.left && m.tokenHash && safeEqual(m.tokenHash, hash)) match = m;
  }
  if (!match) return failJoin(ctx, 'BAD_TOKEN');

  const previous = match.conn;
  if (previous && previous !== conn) {
    hub.send(previous, 'room.ended', { reason: 'REPLACED' });
    previous.bound = null;
    previous.close(1000, 'replaced');
  }
  attach(room, match, conn);
  if (match.playerId === room.hostId) room.hostAwayDeadline = null;
  hub.touch(room);

  hub.send(
    conn,
    'room.joined',
    {
      playerId: match.playerId,
      token: p.token,
      isHost: match.playerId === room.hostId,
      room: hub.roomView(room),
    },
    ctx.id,
  );
  if (room.game && room.phase !== 'LOBBY') sendSnapshot(hub, room, match);
  hub.send(conn, 'absent.update', { absent: room.absent, hostId: room.hostId });
  hub.broadcastRoom(room, undefined, conn);
  hub.recomputeAbsent(room);
}

// ------------------------------------------------------ room: leave / remove

/** Removes a member by their own choice (`LEAVE`) or by the host (`KICK`). */
function removeMember(hub: Hub, room: Room, member: Member, how: 'LEAVE' | 'KICK'): void {
  const name = formatName(member.name);
  const who = member.name;
  if (room.hostId === member.playerId) hub.transferHost(room, true);

  const conn = member.conn;
  if (how === 'KICK' && member.tokenHash) room.bans.add(member.tokenHash.toString('hex'));
  member.tokenHash = null;
  member.conn = null;
  member.connected = false;
  if (conn) {
    conn.bound = null;
    if (how === 'KICK') hub.send(conn, 'room.ended', { reason: 'REMOVED' });
  }

  if (room.phase === 'LOBBY') room.members = room.members.filter((m) => m !== member);
  else member.left = true;

  if (!room.members.some((m) => !m.isBot && !m.left)) return hub.dispose(room, 'EMPTY');

  if (room.phase === 'PLAYING' && room.game) {
    applyEngine(hub, room, { type: how === 'KICK' ? 'REMOVE' : 'LEAVE', playerId: member.playerId });
  }
  if (room.phase === 'CLOSED') return;
  hub.broadcastRoom(room, [{ kind: how === 'KICK' ? 'REMOVED' : 'LEFT', name, who }]);
  hub.recomputeAbsent(room);
}

function onLeave(ctx: Ctx): void {
  const b = bound(ctx);
  if (!b) return;
  ctx.hub.ack(ctx.conn, ctx.id);
  removeMember(ctx.hub, b.room, b.member, 'LEAVE');
}

function onKick(ctx: Ctx, p: ClientPayload<'room.kick'>): void {
  const b = asHost(ctx);
  if (!b) return;
  const target = findMember(b.room, p.playerId);
  if (!target || target.left) return fail(ctx, 'NOT_IN_ROOM');
  if (target === b.member) return fail(ctx, 'INVALID_MESSAGE');
  if (b.room.phase !== 'LOBBY' && b.room.phase !== 'PLAYING') return fail(ctx, 'WRONG_ROOM_PHASE');
  ctx.hub.ack(ctx.conn, ctx.id);
  removeMember(ctx.hub, b.room, target, 'KICK');
}

function onClose(ctx: Ctx): void {
  const b = asHost(ctx);
  if (!b) return;
  ctx.hub.ack(ctx.conn, ctx.id);
  ctx.hub.dispose(b.room, 'HOST_CLOSED');
}

// ---------------------------------------------------------- room: game flow

function onStart(ctx: Ctx): void {
  const b = asHost(ctx);
  if (!b) return;
  const { hub } = ctx;
  const { room } = b;
  if (room.phase !== 'LOBBY') return fail(ctx, 'WRONG_ROOM_PHASE');
  if (present(room).length < hub.config.minPlayers) return fail(ctx, 'NOT_ENOUGH_PLAYERS');
  room.phase = 'PLAYING'; // lock first so concurrent joins get GAME_STARTED
  hub.ack(ctx.conn, ctx.id);
  if (!startGame(hub, room)) {
    room.phase = 'LOBBY';
    hub.error(ctx.conn, undefined, 'SERVER_ERROR');
  }
}

function onRematch(ctx: Ctx): void {
  const b = asHost(ctx);
  if (!b) return;
  if (b.room.phase !== 'FINISHED') return fail(ctx, 'WRONG_ROOM_PHASE');
  ctx.hub.ack(ctx.conn, ctx.id);
  resetToLobby(ctx.hub, b.room);
}

function onEndGame(ctx: Ctx): void {
  const b = asHost(ctx);
  if (!b) return;
  if (b.room.phase !== 'PLAYING') return fail(ctx, 'WRONG_ROOM_PHASE');
  ctx.hub.ack(ctx.conn, ctx.id);
  resetToLobby(ctx.hub, b.room);
}

function onAddBot(ctx: Ctx): void {
  const b = asHost(ctx);
  if (!b) return;
  const { hub } = ctx;
  const { room } = b;
  if (room.phase !== 'LOBBY') return fail(ctx, 'WRONG_ROOM_PHASE');
  const members = present(room);
  if (members.length >= hub.config.roomCapacity) return fail(ctx, 'ROOM_FULL');
  const usedAvatars = members.map((m) => m.avatarId);
  const avatarId = BOT_AVATARS.find((a) => !usedAvatars.includes(a)) ?? BOT_AVATARS[0];
  const name = BOT_NAMES[members.filter((m) => m.isBot).length % BOT_NAMES.length] ?? BOT_NAMES[0]!;
  addMember(room, { name, avatarId, isBot: true });
  hub.ack(ctx.conn, ctx.id);
  hub.broadcastRoom(room);
}

function onSettings(ctx: Ctx, p: ClientPayload<'room.settings'>): void {
  const b = asHost(ctx);
  if (!b) return;
  if (b.room.phase !== 'LOBBY') return fail(ctx, 'WRONG_ROOM_PHASE');
  b.room.turnTimerSec = p.turnTimerSec;
  ctx.hub.touch(b.room);
  ctx.hub.ack(ctx.conn, ctx.id);
  ctx.hub.broadcastRoom(b.room);
}

function onKeepAlive(ctx: Ctx): void {
  const b = bound(ctx);
  if (!b) return;
  ctx.hub.ack(ctx.conn, ctx.id);
  if (b.room.idleWarning && !b.room.idleWarning.absolute) {
    b.room.idleWarning = null;
    ctx.hub.broadcastRoom(b.room);
  }
}

// ----------------------------------------------------------------- game

function onGameAction(ctx: Ctx, p: ClientPayload<'game.action'>): void {
  const b = bound(ctx);
  if (!b) return;
  const { hub } = ctx;
  const { room, member } = b;
  if (room.phase !== 'PLAYING' && room.phase !== 'FINISHED') return fail(ctx, 'WRONG_ROOM_PHASE');

  // Idempotency: a repeated action id gets the original reply and is not re-applied.
  const seen = room.dedupe.get(member.playerId) ?? new Map<string, string>();
  room.dedupe.set(member.playerId, seen);
  const earlier = seen.get(p.actionId);
  if (earlier !== undefined) {
    if (earlier === 'ack') hub.ack(ctx.conn, ctx.id);
    else hub.error(ctx.conn, ctx.id, earlier as ErrorCode);
    return;
  }

  const a = p.action;
  const playerId = member.playerId;
  let action: Action;
  switch (a.type) {
    case 'PLAY_CARD':
      action = {
        type: 'PLAY_CARD',
        playerId,
        cardId: a.cardId,
        ...(a.targetId !== undefined ? { targetId: a.targetId } : {}),
      };
      break;
    case 'REINSERT_BOOM':
      action = { type: 'REINSERT_BOOM', playerId, position: a.position };
      break;
    case 'PICK_FAVOR_CARD':
      action = { type: 'PICK_FAVOR_CARD', playerId, cardId: a.cardId };
      break;
    case 'DRAW':
      action = { type: 'DRAW', playerId };
      break;
    case 'USE_TREAT':
      action = { type: 'USE_TREAT', playerId };
      break;
    case 'PLAY_PAIR':
      action = { type: 'PLAY_PAIR', playerId, cardIds: a.cardIds, targetId: a.targetId };
      break;
    case 'PICK_STEAL':
      action = { type: 'PICK_STEAL', playerId, position: a.position };
      break;
    case 'NOPE':
      action = { type: 'NOPE', playerId };
      break;
    case 'PASS_NOPE':
      action = { type: 'PASS_NOPE', playerId };
      break;
  }

  const error = applyEngine(hub, room, action);
  seen.set(p.actionId, error ? error.code : 'ack');
  if (seen.size > hub.config.actionDedupeWindow) {
    const oldest = seen.keys().next().value;
    if (oldest !== undefined) seen.delete(oldest);
  }
  if (error) hub.error(ctx.conn, ctx.id, error.code, { message: error.message });
  else hub.ack(ctx.conn, ctx.id);
}

function onSkipAbsent(ctx: Ctx, p: ClientPayload<'game.skipAbsent'>): void {
  const b = asHost(ctx);
  if (!b) return;
  const { hub } = ctx;
  const { room } = b;
  const absent = room.absent;
  if (room.phase !== 'PLAYING' || !absent || absent.playerId !== p.playerId || !absent.hostMayDecide) {
    return fail(ctx, 'WRONG_ROOM_PHASE');
  }
  hub.ack(ctx.conn, ctx.id);
  if (p.decision === 'WAIT') {
    room.absent = {
      ...absent,
      deadlineAt: hub.clock.now() + hub.config.reconnectWindowMs,
      hostMayDecide: false,
    };
    hub.broadcastAbsent(room);
    return;
  }
  applyEngine(hub, room, { type: 'SKIP_ABSENT', playerId: absent.playerId });
}

/** Relays the taker's finger position to everyone else; ignored from anyone who is not the taker. */
function onHover(ctx: Ctx, p: ClientPayload<'game.hover'>): void {
  const b = bound(ctx);
  if (!b) return;
  const pending = b.room.game?.pending;
  if (!pending || pending.kind !== 'STEAL_PICK' || pending.playerId !== b.member.playerId) return;
  if (p.position !== null && p.position >= pending.order.length) return;
  for (const m of b.room.members) {
    if (m.conn && m !== b.member) ctx.hub.send(m.conn, 'game.hover', { playerId: b.member.playerId, position: p.position });
  }
}

function onPing(ctx: Ctx, p: ClientPayload<'ping'>): void {
  ctx.hub.send(
    ctx.conn,
    'pong',
    { ...(p.t !== undefined ? { t: p.t } : {}), serverTime: ctx.hub.clock.now() },
    ctx.id,
  );
}

type Handlers = { [K in ClientType]: (ctx: Ctx, payload: ClientPayload<K>) => void };

export const handlers: Handlers = {
  'room.create': onCreate,
  'room.join': onJoin,
  'room.rejoin': onRejoin,
  'room.leave': onLeave,
  'room.close': onClose,
  'room.kick': onKick,
  'room.start': onStart,
  'room.rematch': onRematch,
  'room.keepAlive': onKeepAlive,
  'room.addBot': onAddBot,
  'room.settings': onSettings,
  'game.action': onGameAction,
  'game.end': onEndGame,
  'game.skipAbsent': onSkipAbsent,
  'game.hover': onHover,
  ping: onPing,
};
