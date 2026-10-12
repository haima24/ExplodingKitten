import type {
  DecisionView,
  GameEvent,
  GameState,
  OtherPlayerView,
  PlayerView,
  YouView,
} from './types';

/**
 * Per-player projection. It never includes other hands, the draw pile contents
 * or order, a pending Exploding Kitten, re-insert positions, or See the Future results.
 */
export function viewFor(state: GameState, playerId: string): PlayerView {
  const me = state.players.find((p) => p.id === playerId);
  if (!me) throw new Error('engine: unknown player');

  const you: YouView = {
    id: me.id,
    seat: me.seat,
    hand: me.hand.map((c) => ({ ...c })),
    status: me.status,
    ...(me.outReason ? { outReason: me.outReason } : {}),
  };
  const others: OtherPlayerView[] = state.players
    .filter((p) => p.id !== playerId)
    .map((p) => ({
      id: p.id,
      seat: p.seat,
      handCount: p.hand.length,
      status: p.status,
      ...(p.outReason ? { outReason: p.outReason } : {}),
    }));

  const view: PlayerView = {
    version: state.version,
    phase: state.phase,
    you,
    others,
    currentPlayerId: state.currentPlayerId,
    pendingTurns: state.pendingTurns,
    drawCount: state.drawPile.length,
    discardPile: state.discardPile.map((c) => ({ ...c })),
  };

  const pending = state.pending;
  if (pending && pending.kind === 'NOPE_WINDOW') {
    // Everyone sees that a card is waiting; only players who may respond get a decision.
    view.nopeWindow = { actorId: pending.playerId, cardKind: pending.card.kind, nopes: pending.nopes };
    if (pending.responders.includes(playerId)) {
      view.decision = {
        kind: 'NOPE_WINDOW',
        actorId: pending.playerId,
        cardKind: pending.card.kind,
        nopes: pending.nopes,
      };
    }
  } else if (pending) {
    view.waitingFor = pending.playerId;
    if (pending.kind === 'STEAL_PICK') {
      // Everyone sees that a pick is under way and how many cards are in the fan; the slot order stays on the server.
      view.steal = { thiefId: pending.playerId, targetId: pending.targetId, count: pending.order.length };
    }
    if (pending.playerId === playerId) {
      const decision: DecisionView =
        pending.kind === 'FAVOR_PICK'
          ? { kind: 'FAVOR_PICK', requesterId: pending.requesterId }
          : pending.kind === 'STEAL_PICK'
            ? { kind: 'STEAL_PICK', targetId: pending.targetId, count: pending.order.length }
            : { kind: pending.kind };
      view.decision = decision;
    }
  }
  if (state.phase === 'finished') {
    if (state.winnerId !== undefined) view.winnerId = state.winnerId;
    view.stats = { ...state.stats };
  }
  return view;
}

/** Public events plus the private events addressed to `playerId`. */
export function visibleEvents(events: readonly GameEvent[], playerId: string): GameEvent[] {
  return events.filter(
    (e) => e.visibility === 'PUBLIC' || e.visibility.to === playerId,
  );
}
