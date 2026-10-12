import type { PlayerView } from '@wb/engine/types';
import type { MemberView, RoomView } from '@wb/protocol/shared';
import { displayName } from '../../copy/names';
import { t, type CopyKey, type CopyParams } from '../../copy';
import { cardName } from '../../copy/cards';
import { CARD_CATALOG } from '@wb/engine/cards';
import type { State } from '../../net/state';

export function nameOf(room: RoomView | null, playerId: string | undefined): string {
  const member = room?.members.find((m) => m.playerId === playerId);
  return member ? displayName(member.name) : t('common.someone');
}

export const selectMyId = (s: State): string | null =>
  s.game.view?.you.id ?? s.session?.playerId ?? null;

export function selectIsHost(s: State): boolean {
  const me = selectMyId(s);
  return me !== null && s.room.view?.hostId === me;
}

/** Advisory only: the server is authoritative and re-validates everything. */
export function selectCanAct(s: State): boolean {
  const view = s.game.view;
  const me = selectMyId(s);
  return (
    s.connection.status === 'online' &&
    view !== null &&
    me !== null &&
    view.you.status === 'active' &&
    view.phase === 'turn' &&
    view.currentPlayerId === me &&
    s.ui.pendingActionId === null &&
    s.ui.holdUntil <= Date.now() &&
    !s.ui.menuOpen &&
    s.ui.overlays === 0
  );
}

export type BannerKind = 'MY_TURN' | 'OTHER_TURN' | 'WAITING' | 'OFFLINE' | 'OUT' | 'NOPE';

export interface Banner {
  kind: BannerKind;
  name?: string;
  card?: string;
}

export function selectBanner(s: State): Banner {
  const view = s.game.view;
  if (!view) return { kind: 'OFFLINE' };
  if (s.connection.status !== 'online') return { kind: 'OFFLINE' };
  if (view.you.status === 'out') return { kind: 'OUT' };
  if (view.nopeWindow) {
    return {
      kind: 'NOPE',
      name: nameOf(s.room.view, view.nopeWindow.actorId),
      card: cardName(view.nopeWindow.cardKind),
    };
  }
  if (view.waitingFor) {
    if (view.waitingFor !== view.you.id) {
      return { kind: 'WAITING', name: nameOf(s.room.view, view.waitingFor) };
    }
    return { kind: 'MY_TURN', name: nameOf(s.room.view, view.you.id) };
  }
  if (view.currentPlayerId === view.you.id) {
    return { kind: 'MY_TURN', name: nameOf(s.room.view, view.you.id) };
  }
  return { kind: 'OTHER_TURN', name: nameOf(s.room.view, view.currentPlayerId) };
}

export interface Chip {
  id: string;
  name: string;
  avatarId: string;
  isBot: boolean;
  isMe: boolean;
  cards: number;
  status: 'active' | 'waiting' | 'out';
  connected: boolean;
  /** "2 turns" badge (Attack). */
  twoTurns: boolean;
  thinking: boolean;
  /** Briefly highlighted after an Attack. */
  flash: boolean;
}

export function selectChips(s: State): Chip[] {
  const view = s.game.view;
  const room = s.room.view;
  if (!view || !room) return [];
  const members = new Map<string, MemberView>(room.members.map((m) => [m.playerId, m]));
  const rows: { id: string; seat: number; cards: number; out: boolean }[] = [
    { id: view.you.id, seat: view.you.seat, cards: view.you.hand.length, out: view.you.status === 'out' },
    ...view.others.map((o) => ({ id: o.id, seat: o.seat, cards: o.handCount, out: o.status === 'out' })),
  ].sort((a, b) => a.seat - b.seat);

  return rows.map((r) => {
    const m = members.get(r.id);
    const current = view.phase !== 'finished' && r.id === view.currentPlayerId && !r.out;
    return {
      id: r.id,
      name: m ? displayName(m.name) : t('common.someone'),
      avatarId: m?.avatarId ?? 'biscuit',
      isBot: m?.isBot ?? false,
      isMe: r.id === view.you.id,
      cards: r.cards,
      status: r.out ? 'out' : current ? 'active' : 'waiting',
      connected: m?.connected ?? true,
      twoTurns: current && view.pendingTurns > 1,
      thinking: room.thinkingId === r.id,
      flash: s.ui.flash?.playerId === r.id,
    };
  });
}

export interface Hint {
  key: CopyKey;
  params?: CopyParams;
}

/** First matching rule wins (US-031). */
export function selectHint(s: State): Hint | null {
  const view: PlayerView | null = s.game.view;
  if (!view) return null;
  if (s.connection.status !== 'online') return { key: 'hint.reconnecting' };
  if (view.you.status === 'out') return { key: 'hint.out' };
  if (view.decision?.kind === 'NOPE_WINDOW') return { key: 'hint.nopeMine' };
  if (view.nopeWindow) return { key: 'hint.nope' };
  if (view.decision) {
    if (view.decision.kind === 'TREAT_DECISION') return { key: 'hint.treat' };
    if (view.decision.kind === 'REINSERT') return { key: 'hint.reinsert' };
    if (view.decision.kind === 'STEAL_PICK') return { key: 'steal.hint' };
    return { key: 'hint.favor' };
  }
  if (view.waitingFor && view.waitingFor !== view.you.id) {
    return { key: 'hint.waiting', params: { name: nameOf(s.room.view, view.waitingFor) } };
  }
  const myTurn = view.currentPlayerId === view.you.id;
  if (myTurn) {
    const selected = view.you.hand.find((c) => c.id === s.ui.selectedCardId);
    if (selected?.kind === 'COZY_CAT') {
      if (s.ui.pairCardId !== null) return { key: 'hint.pairReady' };
      const twin = view.you.hand.some((c) => c.kind === 'COZY_CAT' && c.id !== selected.id && c.variant === selected.variant);
      return twin
        ? { key: 'hint.pairNext', params: { card: cardName(selected.kind, selected.variant) } }
        : { key: 'hint.catAlone' };
    }
    if (selected && CARD_CATALOG[selected.kind].playable) {
      return { key: 'hint.selected', params: { card: cardName(selected.kind) } };
    }
    if (s.game.playedThisTurn) return { key: 'hint.playedMore' };
    return { key: 'hint.myTurn' };
  }
  return { key: 'hint.otherTurn', params: { name: nameOf(s.room.view, view.currentPlayerId) } };
}

export function hintText(hint: Hint | null): string {
  return hint ? t(hint.key, hint.params) : '';
}
