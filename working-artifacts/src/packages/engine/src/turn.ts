import type { GameEvent, GameState, PlayerState } from './types';
import { emit } from './events';

export function getPlayer(state: GameState, id: string): PlayerState {
  const p = state.players.find((x) => x.id === id);
  if (!p) throw new Error('engine: unknown player');
  return p;
}

/** Next active player after `fromId` in seat order (wraps). */
export function nextActive(state: GameState, fromId: string): string {
  const n = state.players.length;
  const start = state.players.findIndex((p) => p.id === fromId);
  for (let k = 1; k <= n; k++) {
    const p = state.players[(start + k) % n] as PlayerState;
    if (p.status === 'active') return p.id;
  }
  throw new Error('engine: no active player');
}

export function startTurn(state: GameState, events: GameEvent[]): void {
  emit(state, events, 'TURN_STARTED', {
    playerId: state.currentPlayerId,
    pendingTurns: state.pendingTurns,
  });
}

/** Consumes one turn unit of the current player. */
export function endTurnUnit(state: GameState, events: GameEvent[]): void {
  state.stats.turnsPlayed += 1;
  if (state.pendingTurns > 1) {
    state.pendingTurns -= 1;
  } else {
    state.currentPlayerId = nextActive(state, state.currentPlayerId);
    state.pendingTurns = 1;
  }
  startTurn(state, events);
}

/** Ends every remaining unit; the next player gets exactly `turns` units (never added). */
export function passTurnTo(state: GameState, turns: number, events: GameEvent[]): void {
  state.stats.turnsPlayed += 1;
  state.currentPlayerId = nextActive(state, state.currentPlayerId);
  state.pendingTurns = turns;
  startTurn(state, events);
}
