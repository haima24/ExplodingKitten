import { CARD_CATALOG } from './cards';
import { clone } from './clone';
import { buildDeal, MAX_PLAYERS, MIN_PLAYERS } from './deck';
import { eliminate } from './eliminate';
import { emit, engineError } from './events';
import { shuffle, type Rng } from './rng';
import { endTurnUnit, getPlayer, passTurnTo, startTurn } from './turn';
import {
  INSERT_POSITIONS,
  type Action,
  type DeckProfileName,
  type EngineError,
  type GameEvent,
  type GameResult,
  type GameState,
} from './types';

export interface GameConfig {
  deckProfile: DeckProfileName;
  /** Seat that starts. If unset the engine picks one with the Rng. */
  firstPlayerId?: string;
}

export interface PlayerSeed {
  id: string;
}

function fail(code: EngineError['code'], message?: string): GameResult {
  return { ok: false, error: engineError(code, message) };
}

export function createGame(config: GameConfig, seeds: PlayerSeed[], rng: Rng): GameResult {
  if (seeds.length < MIN_PLAYERS || seeds.length > MAX_PLAYERS) {
    return fail('INVALID_CONFIG', 'Player count out of range');
  }
  const ids = new Set(seeds.map((s) => s.id));
  if (ids.size !== seeds.length || seeds.some((s) => !s.id)) {
    return fail('INVALID_CONFIG', 'Player ids must be unique');
  }
  if (config.firstPlayerId !== undefined && !ids.has(config.firstPlayerId)) {
    return fail('INVALID_CONFIG', 'Unknown first player');
  }

  const dealt = buildDeal(config.deckProfile, seeds.length, rng);
  if (!dealt.ok) return { ok: false, error: dealt.error };
  const { deal } = dealt;

  const firstPlayerId = config.firstPlayerId ?? (seeds[rng.nextInt(seeds.length)] as PlayerSeed).id;
  const state: GameState = {
    version: 0,
    seq: 0,
    phase: 'turn',
    players: seeds.map((s, seat) => ({
      id: s.id,
      seat,
      hand: deal.hands[seat] ?? [],
      status: 'active' as const,
    })),
    currentPlayerId: firstPlayerId,
    pendingTurns: 1,
    drawPile: deal.drawPile,
    discardPile: [],
    pending: null,
    stats: { turnsPlayed: 0, treatsUsed: 0 },
    firstPlayerId,
    totalCards: deal.totalCards,
  };
  const events: GameEvent[] = [];
  startTurn(state, events);
  return { ok: true, state, events };
}

/**
 * Applies one action. Pure: the input state is never mutated; on error the
 * returned result carries no state and the caller keeps the old one.
 */
export function applyAction(state: GameState, action: Action, rng: Rng): GameResult {
  if (state.phase === 'finished') return fail('GAME_FINISHED', 'The game is over');
  const actor = state.players.find((p) => p.id === action.playerId);
  if (!actor) return fail('NOT_IN_GAME');
  if (actor.status === 'out') return fail('PLAYER_OUT');

  const next = clone(state);
  const events: GameEvent[] = [];
  const error = dispatch(next, action, rng, events);
  if (error) return { ok: false, error };
  next.version += 1;
  return { ok: true, state: next, events };
}

function dispatch(s: GameState, a: Action, rng: Rng, ev: GameEvent[]): EngineError | null {
  switch (a.type) {
    case 'PLAY_CARD':
      return playCard(s, a.playerId, a.cardId, a.targetId, rng, ev);
    case 'DRAW':
      return draw(s, a.playerId, ev);
    case 'USE_TREAT':
      return useTreat(s, a.playerId, ev);
    case 'REINSERT_BOOM':
      return reinsertBoom(s, a.playerId, a.position, rng, ev);
    case 'PICK_FAVOR_CARD':
      return pickFavorCard(s, a.playerId, a.cardId, ev);
    case 'LEAVE':
      eliminate(s, a.playerId, 'LEFT', ev);
      return null;
    case 'REMOVE':
      eliminate(s, a.playerId, 'REMOVED', ev);
      return null;
    case 'SKIP_ABSENT':
      eliminate(s, a.playerId, 'SKIPPED', ev);
      return null;
    default:
      return engineError('WRONG_PHASE', 'Unknown action');
  }
}

function playCard(
  s: GameState,
  playerId: string,
  cardId: string,
  targetId: string | undefined,
  rng: Rng,
  ev: GameEvent[],
): EngineError | null {
  if (s.currentPlayerId !== playerId) return engineError('NOT_YOUR_TURN');
  if (s.phase !== 'turn') return engineError('WRONG_PHASE');
  const me = getPlayer(s, playerId);
  const index = me.hand.findIndex((c) => c.id === cardId);
  if (index < 0) return engineError('CARD_NOT_IN_HAND');
  const card = me.hand[index]!;
  const info = CARD_CATALOG[card.kind];
  if (!info.playable) return engineError('NOT_PLAYABLE', info.notPlayableReason);

  if (card.kind === 'ASK_A_FRIEND') {
    const target = targetId === undefined ? undefined : s.players.find((p) => p.id === targetId);
    if (!target || target.id === playerId || target.status !== 'active' || target.hand.length < 1) {
      return engineError('INVALID_TARGET');
    }
  }

  me.hand.splice(index, 1);
  s.discardPile.unshift(card);
  emit(s, ev, 'CARD_PLAYED', { playerId, kind: card.kind, cardId: card.id });

  switch (card.kind) {
    case 'HOP_OVER':
      endTurnUnit(s, ev);
      break;
    case 'PEEK':
      emit(s, ev, 'PEEKED', { playerId });
      emit(s, ev, 'PEEK_RESULT', { cards: s.drawPile.slice(0, 3) }, playerId);
      break;
    case 'SHAKE_UP':
      s.drawPile = shuffle(s.drawPile, rng);
      emit(s, ev, 'DECK_SHUFFLED', { playerId });
      break;
    case 'PASS_IT_ON':
      passTurnTo(s, 2, ev);
      break;
    case 'ASK_A_FRIEND':
      emit(s, ev, 'FAVOR_REQUESTED', { requesterId: playerId, targetId });
      s.pending = { kind: 'FAVOR_PICK', playerId: targetId as string, requesterId: playerId };
      s.phase = 'decision';
      break;
    default:
      break;
  }
  return null;
}

function draw(s: GameState, playerId: string, ev: GameEvent[]): EngineError | null {
  if (s.currentPlayerId !== playerId) return engineError('NOT_YOUR_TURN');
  if (s.phase !== 'turn') return engineError('WRONG_PHASE');
  if (s.drawPile.length === 0) return engineError('WRONG_PHASE', 'The draw pile is empty');
  const me = getPlayer(s, playerId);
  const top = s.drawPile.shift()!;
  emit(s, ev, 'CARD_DRAWN', { playerId });

  if (top.kind !== 'BOOM_CAT') {
    me.hand.push(top);
    emit(s, ev, 'DRAWN_CARD', { card: top }, playerId);
    endTurnUnit(s, ev);
    return null;
  }

  if (me.hand.some((c) => c.kind === 'TREAT')) {
    s.pending = { kind: 'TREAT_DECISION', playerId, boomCard: top };
    s.phase = 'decision';
    emit(s, ev, 'BOOM_DRAWN', { hasTreat: true }, playerId);
    return null;
  }

  s.discardPile.unshift(top);
  emit(s, ev, 'BOOM_DRAWN', { hasTreat: false }, playerId);
  eliminate(s, playerId, 'BOOM', ev);
  return null;
}

function useTreat(s: GameState, playerId: string, ev: GameEvent[]): EngineError | null {
  const pending = s.pending;
  if (!pending || pending.kind !== 'TREAT_DECISION') return engineError('WRONG_PHASE');
  if (pending.playerId !== playerId) return engineError('NOT_YOUR_TURN');
  const me = getPlayer(s, playerId);
  const at = me.hand.findIndex((c) => c.kind === 'TREAT');
  if (at < 0) return engineError('CARD_NOT_IN_HAND');
  const [treat] = me.hand.splice(at, 1);
  s.discardPile.unshift(treat!);
  s.stats.treatsUsed += 1;
  s.pending = { kind: 'REINSERT', playerId, boomCard: pending.boomCard };
  emit(s, ev, 'TREAT_USED', { playerId });
  return null;
}

function reinsertBoom(
  s: GameState,
  playerId: string,
  position: string,
  rng: Rng,
  ev: GameEvent[],
): EngineError | null {
  const pending = s.pending;
  if (!pending || pending.kind !== 'REINSERT') return engineError('WRONG_PHASE');
  if (pending.playerId !== playerId) return engineError('NOT_YOUR_TURN');
  if (!(INSERT_POSITIONS as readonly string[]).includes(position)) {
    return engineError('INVALID_POSITION');
  }
  const n = s.drawPile.length;
  const at =
    position === 'TOP'
      ? 0
      : position === 'MIDDLE'
        ? Math.floor(n / 2)
        : position === 'BOTTOM'
          ? n
          : rng.nextInt(n + 1);
  s.drawPile.splice(at, 0, pending.boomCard);
  s.pending = null;
  s.phase = 'turn';
  emit(s, ev, 'BOOM_TUCKED', { playerId });
  endTurnUnit(s, ev);
  return null;
}

function pickFavorCard(
  s: GameState,
  playerId: string,
  cardId: string,
  ev: GameEvent[],
): EngineError | null {
  const pending = s.pending;
  if (!pending || pending.kind !== 'FAVOR_PICK') return engineError('WRONG_PHASE');
  if (pending.playerId !== playerId) return engineError('NOT_YOUR_TURN');
  const giver = getPlayer(s, playerId);
  const at = giver.hand.findIndex((c) => c.id === cardId);
  if (at < 0) return engineError('CARD_NOT_IN_HAND');
  const [card] = giver.hand.splice(at, 1);
  const requester = getPlayer(s, pending.requesterId);
  requester.hand.push(card!);
  s.pending = null;
  s.phase = 'turn';
  emit(s, ev, 'FAVOR_GIVEN', { fromId: playerId, toId: requester.id });
  emit(s, ev, 'FAVOR_RECEIVED', { card }, requester.id);
  return null;
}
