import { pendingBoomCard } from './pending';
import type { GameState } from './types';

/** Returns a list of violated invariants (empty when the state is healthy). */
export function checkInvariants(state: GameState): string[] {
  const problems: string[] = [];
  const active = state.players.filter((p) => p.status === 'active');
  const pendingBoom = pendingBoomCard(state);

  const pileBooms = state.drawPile.filter((c) => c.kind === 'BOOM_CAT').length;
  const boomTotal = pileBooms + (pendingBoom ? 1 : 0);
  if (boomTotal !== Math.max(active.length - 1, 0)) {
    problems.push(`I1: ${boomTotal} Exploding Kittens for ${active.length} active players`);
  }
  if (active.length >= 2 && !pendingBoom && pileBooms < 1) {
    problems.push('I2: draw pile has no Exploding Kitten');
  }

  const ids: string[] = [
    ...state.drawPile.map((c) => c.id),
    ...state.discardPile.map((c) => c.id),
    ...state.players.flatMap((p) => p.hand.map((c) => c.id)),
    ...(pendingBoom ? [pendingBoom.id] : []),
  ];
  if (ids.length !== state.totalCards) problems.push(`I3: ${ids.length} cards, expected ${state.totalCards}`);
  if (new Set(ids).size !== ids.length) problems.push('I8: duplicate card ids');

  if (state.phase !== 'finished') {
    const current = state.players.find((p) => p.id === state.currentPlayerId);
    if (!current || current.status !== 'active') problems.push('I4: current player is not active');
  }
  if (state.pendingTurns < 1) problems.push('I5: pendingTurns < 1');
  if (state.players.some((p) => p.status === 'out' && p.hand.length > 0)) {
    problems.push('I6: out player holds cards');
  }
  if ((state.phase === 'decision') !== (state.pending !== null)) {
    problems.push('I7: phase and pending disagree');
  }
  return problems;
}
