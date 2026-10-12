import { applyEffect } from './effects';
import { emit } from './events';
import type { Rng } from './rng';
import type { Card, GameEvent, GameState } from './types';

/** Active players holding a Nope, except those in `exclude`. */
export function nopeHolders(s: GameState, exclude: string[]): string[] {
  return s.players
    .filter((p) => p.status === 'active' && !exclude.includes(p.id) && p.hand.some((c) => c.kind === 'NOPE'))
    .map((p) => p.id);
}

/**
 * An action card was just played. If another player holds a Nope, open a
 * response window; otherwise resolve the card at once.
 */
export function openWindowOrResolve(
  s: GameState,
  card: Card,
  actorId: string,
  targetId: string | undefined,
  rng: Rng,
  ev: GameEvent[],
): void {
  const responders = nopeHolders(s, [actorId]);
  if (responders.length === 0) {
    applyEffect(s, card, actorId, targetId, rng, ev);
    return;
  }
  s.pending = {
    kind: 'NOPE_WINDOW',
    playerId: actorId,
    card,
    ...(targetId !== undefined ? { targetId } : {}),
    nopes: 0,
    responders,
  };
  s.phase = 'decision';
}

/** Closes the window: an odd number of Nopes stops the card, an even number lets it through. */
export function resolveWindow(s: GameState, rng: Rng, ev: GameEvent[]): void {
  const p = s.pending;
  if (!p || p.kind !== 'NOPE_WINDOW') return;
  s.pending = null;
  s.phase = 'turn';
  const cancelled = p.nopes % 2 === 1;
  emit(s, ev, 'NOPE_RESOLVED', { cancelled, kind: p.card.kind, playerId: p.playerId });
  if (!cancelled) applyEffect(s, p.card, p.playerId, p.targetId, rng, ev);
}
