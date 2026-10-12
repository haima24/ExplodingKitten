import type { Card, GameState } from './types';

/** The Boom Cat held outside the draw pile during a Defuse decision, if any. */
export function pendingBoomCard(state: GameState): Card | null {
  const p = state.pending;
  return p && (p.kind === 'TREAT_DECISION' || p.kind === 'REINSERT') ? p.boomCard : null;
}
