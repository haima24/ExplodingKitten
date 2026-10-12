import type { GameEvent, GameState, OutReason } from './types';
import { emit } from './events';
import { getPlayer, nextActive, startTurn } from './turn';

/** The single elimination path (Boom Cat, leave, removal, skip). Mutates `state`. */
export function eliminate(
  state: GameState,
  playerId: string,
  reason: OutReason,
  events: GameEvent[],
): void {
  const player = getPlayer(state, playerId);
  const wasCurrent = state.currentPlayerId === playerId;

  player.status = 'out';
  player.outReason = reason;
  for (const card of player.hand.splice(0)) state.discardPile.unshift(card);
  emit(state, events, 'PLAYER_OUT', { playerId, reason });

  const pending = state.pending;
  if (pending) {
    if (
      (pending.kind === 'TREAT_DECISION' || pending.kind === 'REINSERT') &&
      pending.playerId === playerId
    ) {
      state.discardPile.unshift(pending.boomCard);
      state.pending = null;
    } else if (
      pending.kind === 'FAVOR_PICK' &&
      (pending.playerId === playerId || pending.requesterId === playerId)
    ) {
      state.pending = null;
    }
  }

  const active = state.players.filter((p) => p.status === 'active');
  retireSurplusBoomCats(state, Math.max(active.length - 1, 0));
  if (active.length <= 1) {
    finishGame(state, events);
    return;
  }

  if (wasCurrent) {
    state.currentPlayerId = nextActive(state, playerId);
    state.pendingTurns = 1;
    startTurn(state, events);
  }
  if (!state.pending) state.phase = 'turn';
}

/**
 * A player who leaves without drawing a Boom Cat leaves one Boom Cat too many
 * (I1: Boom Cats = active players - 1). Move the surplus from the deepest
 * position of the draw pile to the public discard pile. Which position it came
 * from is not revealed.
 */
function retireSurplusBoomCats(state: GameState, allowed: number): void {
  const pendingBoom = state.pending && state.pending.kind !== 'FAVOR_PICK' ? 1 : 0;
  let total = state.drawPile.filter((c) => c.kind === 'BOOM_CAT').length + pendingBoom;
  while (total > allowed) {
    let at = -1;
    for (let i = state.drawPile.length - 1; i >= 0; i--) {
      if (state.drawPile[i]!.kind === 'BOOM_CAT') {
        at = i;
        break;
      }
    }
    if (at < 0) return;
    const [boom] = state.drawPile.splice(at, 1);
    state.discardPile.unshift(boom!);
    total -= 1;
  }
}

function finishGame(state: GameState, events: GameEvent[]): void {
  const pending = state.pending;
  if (pending && pending.kind !== 'FAVOR_PICK') state.discardPile.unshift(pending.boomCard);
  state.pending = null;
  state.phase = 'finished';
  const winner = state.players.find((p) => p.status === 'active');
  if (winner) state.winnerId = winner.id;
  emit(state, events, 'GAME_FINISHED', {
    winnerId: state.winnerId ?? null,
    stats: { ...state.stats },
  });
}
