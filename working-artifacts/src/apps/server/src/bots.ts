import type { PlayerAction, PlayerView } from '@wb/engine/types';
import type { Rng } from '@wb/engine';

/**
 * Gentle bot. It receives only its own PlayerView, so it cannot cheat by
 * construction. Returns null when there is nothing for it to do.
 */
export function chooseAction(view: PlayerView, rng: Rng): PlayerAction | null {
  if (view.you.status !== 'active' || view.phase === 'finished') return null;

  if (view.decision) {
    switch (view.decision.kind) {
      case 'NOPE_WINDOW':
        // Gentle: stop the odd card, never chain Nopes.
        return view.decision.nopes === 0 && rng.nextInt(100) < 25 ? { type: 'NOPE' } : { type: 'PASS_NOPE' };
      case 'TREAT_DECISION':
        return { type: 'USE_TREAT' };
      case 'REINSERT':
        return { type: 'REINSERT_BOOM', position: 'RANDOM' };
      case 'FAVOR_PICK': {
        const hand = view.you.hand;
        const pick = hand[rng.nextInt(hand.length)];
        return pick ? { type: 'PICK_FAVOR_CARD', cardId: pick.id } : null;
      }
    }
  }

  if (view.phase !== 'turn' || view.currentPlayerId !== view.you.id) return null;

  // Gentle: now and then play a pair of matching Cat cards at someone who holds a card.
  const targets = view.others.filter((o) => o.status === 'active' && o.handCount >= 1);
  const cats = view.you.hand.filter((c) => c.kind === 'COZY_CAT');
  const twin = cats.find((c) => cats.some((o) => o.id !== c.id && o.variant === c.variant));
  const other = twin ? cats.find((o) => o.id !== twin.id && o.variant === twin.variant) : undefined;
  if (twin && other && targets.length > 0 && rng.nextInt(100) < 25) {
    const target = targets[rng.nextInt(targets.length)];
    if (target) return { type: 'PLAY_PAIR', cardIds: [twin.id, other.id], targetId: target.id };
  }

  const hop = view.you.hand.find((c) => c.kind === 'HOP_OVER');
  if (hop && rng.nextInt(100) < 30) return { type: 'PLAY_CARD', cardId: hop.id };
  const shake = view.you.hand.find((c) => c.kind === 'SHAKE_UP');
  if (shake && rng.nextInt(100) < 20) return { type: 'PLAY_CARD', cardId: shake.id };
  return { type: 'DRAW' };
}
