import { applyAction, checkInvariants, createGame, viewFor, visibleEvents } from '@wb/engine';
import type { Action, EngineError, GameEvent, GameState } from '@wb/engine/types';
import { chooseAction } from './bots';
import type { Hub } from './hub';
import { botToAct, findMember, present, type Member, type Room } from './room';
import { codeHash } from './util';

/** Thrown by the test/dev leak guard when a payload would expose hidden cards. */
export class LeakError extends Error {}

function assertNoLeak(game: GameState, recipientId: string, payload: unknown): void {
  const json = JSON.stringify(payload);
  const forbidden: string[] = game.drawPile.map((c) => c.id);
  for (const p of game.players) if (p.id !== recipientId) forbidden.push(...p.hand.map((c) => c.id));
  if (game.pending && (game.pending.kind === 'TREAT_DECISION' || game.pending.kind === 'REINSERT')) {
    forbidden.push(game.pending.boomCard.id);
  }

  // The recipient's own See the Future result legitimately contains draw-pile ids.
  const peeked = new Set<string>();
  for (const e of (payload as { events?: GameEvent[] }).events ?? []) {
    if (e.type === 'PEEK_RESULT') {
      for (const c of (e.data['cards'] as { id: string }[] | undefined) ?? []) peeked.add(c.id);
    }
  }
  for (const id of forbidden) {
    if (!peeked.has(id) && json.includes(`"${id}"`)) throw new LeakError('hidden card id in payload');
  }
}

/** Sends each connected member only their own projection. */
export function broadcastGame(hub: Hub, room: Room, events: GameEvent[]): void {
  const game = room.game;
  if (!game) return;
  for (const m of room.members) {
    if (!m.conn) continue;
    const view = viewFor(game, m.playerId);
    if (view.nopeWindow && room.nopeDeadlineAt !== null) view.nopeDeadlineAt = room.nopeDeadlineAt;
    const payload = { version: game.version, view, events: visibleEvents(events, m.playerId) };
    if (!hub.config.production) assertNoLeak(game, m.playerId, payload);
    hub.send(m.conn, 'game.update', payload);
  }
}

/** Full snapshot for one member (reconnect): no event replay. */
export function sendSnapshot(hub: Hub, room: Room, member: Member): void {
  const game = room.game;
  if (!game || !member.conn) return;
  const view = viewFor(game, member.playerId);
  if (view.nopeWindow && room.nopeDeadlineAt !== null) view.nopeDeadlineAt = room.nopeDeadlineAt;
  const payload = { version: game.version, view, events: [] };
  if (!hub.config.production) assertNoLeak(game, member.playerId, payload);
  hub.send(member.conn, 'game.update', payload);
}

/** Shared tail of every accepted engine action. Returns false if the room was closed. */
function afterStateChange(hub: Hub, room: Room, events: GameEvent[]): boolean {
  const game = room.game;
  if (!game) return false;
  hub.touch(room);

  const problems = checkInvariants(game);
  if (problems.length > 0) {
    hub.log.error('invariant_violation', { codeHash: codeHash(room.code), problems });
    hub.dispose(room, 'ERROR');
    return false;
  }

  trackNopeWindow(hub, room);
  const clockChanged = syncTurnClock(hub, room, false);

  if (game.phase === 'finished' && room.phase !== 'FINISHED') {
    room.phase = 'FINISHED';
    room.finishedAt = hub.clock.now();
    room.turn = null;
    hub.broadcastRoom(room);
  } else if (clockChanged) {
    hub.broadcastRoom(room);
  }
  broadcastGame(hub, room, events);
  hub.recomputeAbsent(room);
  scheduleBot(hub, room);
  return true;
}

/**
 * The engine has no clock, so the server times the Nope window: a new window, or
 * a new Nope inside one, restarts the countdown; when it ends the server issues
 * EXPIRE_NOPE so slow or disconnected players cannot hold the game up.
 */
function trackNopeWindow(hub: Hub, room: Room): void {
  const pending = room.game?.pending;
  if (!pending || pending.kind !== 'NOPE_WINDOW') {
    room.nopeDeadlineAt = null;
    room.nopeKey = null;
    return;
  }
  const key = `${pending.card.id}:${pending.nopes}`;
  if (room.nopeKey !== key) {
    room.nopeKey = key;
    room.nopeDeadlineAt = hub.clock.now() + hub.config.nopeWindowMs;
  }
}

/** Called by the sweep loop: close a Nope window whose time ran out. */
export function expireNopeWindow(hub: Hub, room: Room): void {
  room.nopeDeadlineAt = null;
  const pending = room.game?.pending;
  if (pending?.kind === 'NOPE_WINDOW') {
    applyEngine(hub, room, { type: 'EXPIRE_NOPE', playerId: pending.playerId });
  }
}

// --------------------------------------------------------------- turn clock

interface ClockSubject {
  key: string;
  playerId: string;
  /** A Nope window is open: the clock pauses and keeps its remaining time. */
  paused: boolean;
}

/** Who the game is waiting for, and on what; null when no clock applies. */
function clockSubject(room: Room): ClockSubject | null {
  const game = room.game;
  if (!game || room.phase !== 'PLAYING' || game.phase === 'finished') return null;
  const turnKey = `TURN:${game.currentPlayerId}:${game.stats.turnsPlayed}`;
  const pending = game.pending;
  if (pending?.kind === 'NOPE_WINDOW') return { key: turnKey, playerId: game.currentPlayerId, paused: true };
  if (!pending) return { key: turnKey, playerId: game.currentPlayerId, paused: false };
  return {
    key: `${pending.kind}:${pending.playerId}:${game.stats.turnsPlayed}`,
    playerId: pending.playerId,
    paused: false,
  };
}

/**
 * Keeps `room.turn` in step with the game (US-063). A new turn or decision starts
 * at full time; a Nope window pauses and later resumes; a player who is away is
 * left to the absent-player rules and gets a full clock when they return. Bots
 * never get a clock. Returns true if the clock the clients see changed.
 */
export function syncTurnClock(hub: Hub, room: Room, broadcast = true): boolean {
  const before = JSON.stringify(room.turn);
  const now = hub.clock.now();
  const limitMs = room.turnTimerSec * 1000;
  const subject = limitMs > 0 ? clockSubject(room) : null;
  const owner = subject ? findMember(room, subject.playerId) : undefined;

  if (!subject || !owner || owner.isBot || owner.left) {
    room.turn = null;
  } else {
    const cur = room.turn && room.turn.key === subject.key ? room.turn : null;
    const away = room.absent !== null && room.absent.playerId === subject.playerId;
    if (subject.paused) {
      room.turn = {
        key: subject.key,
        playerId: subject.playerId,
        deadlineAt: null,
        remainingMs: cur ? (cur.deadlineAt !== null ? Math.max(0, cur.deadlineAt - now) : cur.remainingMs) : limitMs,
      };
    } else if (away) {
      room.turn = { key: subject.key, playerId: subject.playerId, deadlineAt: null, remainingMs: null };
    } else if (cur && cur.deadlineAt !== null) {
      room.turn = cur;
    } else if (cur && cur.remainingMs !== null) {
      room.turn = { ...cur, deadlineAt: now + cur.remainingMs, remainingMs: null };
    } else {
      room.turn = { key: subject.key, playerId: subject.playerId, deadlineAt: now + limitMs, remainingMs: null };
    }
  }
  const changed = JSON.stringify(room.turn) !== before;
  if (changed && broadcast) hub.broadcastRoom(room);
  return changed;
}

/** Called by the sweep: the active player ran out of time, so the engine plays the default move. */
export function expireTurn(hub: Hub, room: Room): void {
  const turn = room.turn;
  if (!turn || turn.deadlineAt === null) return;
  const error = applyEngine(hub, room, { type: 'TIMEOUT', playerId: turn.playerId });
  if (error && room.turn === turn) {
    // Nothing changed (should not happen): try again after a full interval instead of spinning.
    hub.log.warn('turn_timeout_failed', { codeHash: codeHash(room.code), code: error.code });
    room.turn = { ...turn, deadlineAt: hub.clock.now() + room.turnTimerSec * 1000 };
    hub.broadcastRoom(room);
  }
}

/** Applies an engine action for a room; returns the engine error, if any. */
export function applyEngine(hub: Hub, room: Room, action: Action): EngineError | null {
  const game = room.game;
  if (!game) return { code: 'WRONG_PHASE', message: 'No game in progress' };
  const result = applyAction(game, action, room.rng);
  if (!result.ok) return result.error;
  room.game = result.state;
  afterStateChange(hub, room, result.events);
  return null;
}

/** Starts a game from the lobby. `room.phase` must already be PLAYING. */
export function startGame(hub: Hub, room: Room): boolean {
  const members = present(room).sort((a, b) => a.joinIndex - b.joinIndex);
  let firstPlayerId: string | undefined;
  if (room.previousFirstJoinIndex !== null) {
    const prev = room.previousFirstJoinIndex;
    firstPlayerId = (members.find((m) => m.joinIndex > prev) ?? members[0])?.playerId;
  }
  const result = createGame(
    { deckProfile: hub.config.deckProfile, ...(firstPlayerId ? { firstPlayerId } : {}) },
    members.map((m) => ({ id: m.playerId })),
    room.rng,
  );
  if (!result.ok) {
    hub.log.error('create_game_failed', { codeHash: codeHash(room.code), code: result.error.code });
    return false;
  }
  room.game = result.state;
  room.dedupe.clear();
  room.finishedAt = null;
  room.absent = null;
  room.nopeDeadlineAt = null;
  room.nopeKey = null;
  room.turn = null;
  hub.touch(room);
  syncTurnClock(hub, room, false);
  hub.broadcastRoom(room);
  broadcastGame(hub, room, result.events);
  hub.recomputeAbsent(room);
  scheduleBot(hub, room);
  return true;
}

/** Shared by rematch (FINISHED) and end game (PLAYING): discard the game, back to lobby. */
export function resetToLobby(hub: Hub, room: Room): void {
  const first = room.game ? findMember(room, room.game.firstPlayerId) : undefined;
  if (first) room.previousFirstJoinIndex = first.joinIndex;
  room.members = room.members.filter((m) => !m.left);
  room.game = null;
  room.phase = 'LOBBY';
  room.finishedAt = null;
  room.absent = null;
  room.botActorId = null;
  room.botDueAt = null;
  room.nopeDeadlineAt = null;
  room.nopeKey = null;
  room.turn = null;
  room.dedupe.clear();
  hub.touch(room);
  hub.broadcastRoom(room);
  hub.broadcastAbsent(room);
}

// --------------------------------------------------------------------- bots

export function scheduleBot(hub: Hub, room: Room): void {
  const botId = room.phase === 'PLAYING' ? botToAct(room) : null;
  const actor = botId ? findMember(room, botId) : undefined;

  if (!actor || !actor.isBot || actor.left) {
    if (room.botActorId !== null) {
      room.botActorId = null;
      room.botDueAt = null;
      hub.broadcastRoom(room);
    }
    return;
  }
  if (room.botActorId === actor.playerId && room.botDueAt !== null) return;

  const { botMinDelayMs, botMaxDelayMs } = hub.config;
  const delay = botMinDelayMs + room.rng.nextInt(Math.max(1, botMaxDelayMs - botMinDelayMs + 1));
  room.botActorId = actor.playerId;
  room.botDueAt = hub.clock.now() + delay;
  hub.broadcastRoom(room);
}

export function runBot(hub: Hub, room: Room): void {
  const botId = room.botActorId;
  room.botDueAt = null;
  const game = room.game;
  if (!botId || !game || botToAct(room) !== botId) {
    scheduleBot(hub, room);
    return;
  }
  const action = chooseAction(viewFor(game, botId), room.rng);
  let error: EngineError | null = action
    ? applyEngine(hub, room, { ...action, playerId: botId } as Action)
    : { code: 'WRONG_PHASE', message: 'No bot action' };

  if (error && room.phase === 'PLAYING' && room.game?.phase === 'turn') {
    error = applyEngine(hub, room, { type: 'DRAW', playerId: botId });
  } else if (error && room.game?.pending?.kind === 'NOPE_WINDOW') {
    error = applyEngine(hub, room, { type: 'PASS_NOPE', playerId: botId });
  }
  if (error && room.phase === 'PLAYING') {
    hub.log.warn('bot_stuck', { codeHash: codeHash(room.code), code: error.code });
    room.botDueAt = hub.clock.now() + 5_000;
  }
}
