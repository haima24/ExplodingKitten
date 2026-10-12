import type { GameEvent, GameState, OutReason } from './types';
import { emit } from './events';
import { resolveWindow } from './nope';
import { pendingBoomCard } from './pending';
import type { Rng } from './rng';
import { getPlayer, nextActive, startTurn } from './turn';

/** The single elimination path (Exploding Kitten, leave, removal, skip). Mutates `state`. */
export function eliminate(
  state: GameState,
  playerId: string,
  reason: OutReason,
  events: GameEvent[],
  rng: Rng,
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
    } else if (pending.kind === 'NOPE_WINDOW') {
      if (pending.playerId === playerId) {
        // The player whose card is waiting left: the card is dropped.
        state.pending = null;
      } else if (pending.responders.includes(playerId)) {
        pending.responders = pending.responders.filter((id) => id !== playerId);
        if (pending.responders.length === 0) resolveWindow(state, rng, events);
      }
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
 * A player who leaves without drawing an Exploding Kitten leaves one Exploding Kitten too many
 * (I1: Exploding Kittens = active players - 1). Move the surplus from the deepest
 * position of the draw pile to the public discard pile. Which position it came
 * from is not revealed.
 */
function retireSurplusBoomCats(state: GameState, allowed: number): void {
  const pendingBoom = pendingBoomCard(state) ? 1 : 0;
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
  const boom = pendingBoomCard(state);
  if (boom) state.discardPile.unshift(boom);
  state.pending = null;
  state.phase = 'finished';
  const winner = state.players.find((p) => p.status === 'active');
  if (winner) state.winnerId = winner.id;
  emit(state, events, 'GAME_FINISHED', {
    winnerId: state.winnerId ?? null,
    stats: { ...state.stats },
  });
}
