import { emit } from './events';
import { shuffle, type Rng } from './rng';
import { endTurnUnit, getPlayer, passTurnTo } from './turn';
import type { Card, GameEvent, GameState } from './types';

/** Resolves the effect of an action card that was played and not stopped by a Nope. */
export function applyEffect(
  s: GameState,
  card: Card,
  actorId: string,
  targetId: string | undefined,
  rng: Rng,
  ev: GameEvent[],
): void {
  emit(s, ev, 'EFFECT_APPLIED', { playerId: actorId, kind: card.kind });
  switch (card.kind) {
    case 'HOP_OVER':
      endTurnUnit(s, ev);
      break;
    case 'PEEK':
      emit(s, ev, 'PEEKED', { playerId: actorId });
      emit(s, ev, 'PEEK_RESULT', { cards: s.drawPile.slice(0, 3) }, actorId);
      break;
    case 'SHAKE_UP':
      s.drawPile = shuffle(s.drawPile, rng);
      emit(s, ev, 'DECK_SHUFFLED', { playerId: actorId });
      break;
    case 'PASS_IT_ON':
      passTurnTo(s, 2, ev);
      break;
    case 'ASK_A_FRIEND': {
      // The target may have left or run out of cards while the window was open.
      const target = targetId === undefined ? undefined : s.players.find((p) => p.id === targetId);
      const actor = getPlayer(s, actorId);
      if (!target || target.status !== 'active' || target.hand.length < 1 || actor.status !== 'active') break;
      emit(s, ev, 'FAVOR_REQUESTED', { requesterId: actorId, targetId });
      s.pending = { kind: 'FAVOR_PICK', playerId: target.id, requesterId: actorId };
      s.phase = 'decision';
      break;
    }
    case 'COZY_CAT': {
      // A pair of Cat cards: the taker will choose one of the target's cards (US-065, US-066).
      const target = targetId === undefined ? undefined : s.players.find((p) => p.id === targetId);
      const actor = getPlayer(s, actorId);
      if (!target || target.status !== 'active' || target.hand.length < 1 || actor.status !== 'active') break;
      // The taker now picks one face-down slot. The order is shuffled for this steal,
      // so a slot reveals nothing about the card behind it (US-066).
      const order = shuffle(
        target.hand.map((c) => c.id),
        rng,
      );
      s.pending = { kind: 'STEAL_PICK', playerId: actorId, targetId: target.id, order };
      s.phase = 'decision';
      emit(s, ev, 'STEAL_STARTED', { thiefId: actorId, targetId: target.id, count: order.length });
      break;
    }
    default:
      break;
  }
}
