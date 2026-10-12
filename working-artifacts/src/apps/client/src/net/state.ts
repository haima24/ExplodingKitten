import type { Card, CardKind, PlayerView } from '@wb/engine/types';
import type { AbsentInfo, RoomEndedReason, RoomView } from '@wb/protocol/shared';
import type { CopyKey } from '../copy';
import { loadSession, type Session } from '../lib/session';
import { loadSettings, type Settings } from '../lib/settings';

export type ConnStatus = 'idle' | 'connecting' | 'online' | 'reconnecting' | 'offline';

/**
 * A log line is stored as a catalog key plus values, not as finished text, so
 * switching language re-words the whole history (US-064). Card names are kept as
 * kinds for the same reason.
 */
export interface LogEntry {
  seq: number;
  key: CopyKey;
  params?: Record<string, string | number>;
  cards?: Record<string, CardKind>;
}

export interface Message {
  id: number;
  text: string;
}

/** A queued animation (US-069): a bomb that explodes, or the winner with a trophy. */
export interface AnimItem {
  id: number;
  kind: 'explosion' | 'trophy';
  playerId: string;
}

export interface TipsState {
  /** Tip currently on screen, or null. */
  visible: number | null;
  /** Tips already dismissed this session. */
  done: number[];
  /** Triggered while another tip was showing. */
  queued: number[];
  /** True once the user chose "Skip tips" or finished all four. */
  hidden: boolean;
}

export interface State {
  connection: { status: ConnStatus; since: number; offset: number };
  session: Session | null;
  room: { view: RoomView | null; ended: RoomEndedReason | 'NO_SEAT' | null };
  game: { view: PlayerView | null; log: LogEntry[]; playedThisTurn: boolean };
  absent: AbsentInfo | null;
  /** Where the taker is pointing in the fan, relayed live (US-066). */
  hover: { playerId: string; position: number | null } | null;
  ui: {
    selectedCardId: string | null;
    /** Second Cat card of a pair (US-065). */
    pairCardId: string | null;
    pendingActionId: string | null;
    pendingSince: number;
    inlineMessage: Message | null;
    toast: Message | null;
    /** Secret See the Future result: memory only, cleared on close. */
    peek: Card[] | null;
    nap: boolean;
    /** The card just taken, flipped face up for a moment (taker only). */
    reveal: Card | null;
    /** A card just received, marked "new" in the hand while pop-ups are hidden (US-070). */
    newCardId: string | null;
    /** Animations waiting to play, first one on screen (US-069). */
    anim: AnimItem[];
    /** The out player's nap message waits until their explosion has played. */
    napPending: boolean;
    /** Until this time (ms) the next turn is held for an animation, as the server holds it. */
    holdUntil: number;
    /** Player whose chip is briefly highlighted (Attack). */
    flash: { playerId: string; id: number } | null;
    menuOpen: boolean;
    /** Count of open modal dialogs; controls are inert while > 0. */
    overlays: number;
    tips: TipsState;
  };
  settings: Settings;
}

export function initialState(): State {
  const settings = loadSettings();
  return {
    connection: { status: 'idle', since: Date.now(), offset: 0 },
    session: loadSession(),
    room: { view: null, ended: null },
    game: { view: null, log: [], playedThisTurn: false },
    absent: null,
    hover: null,
    ui: {
      selectedCardId: null,
      pairCardId: null,
      pendingActionId: null,
      pendingSince: 0,
      inlineMessage: null,
      toast: null,
      peek: null,
      nap: false,
      reveal: null,
      newCardId: null,
      anim: [],
      napPending: false,
      holdUntil: 0,
      flash: null,
      menuOpen: false,
      overlays: 0,
      tips: { visible: null, done: [], queued: [], hidden: settings.tipsSeen },
    },
    settings,
  };
}

export type Action =
  | { type: 'conn/status'; status: ConnStatus }
  | { type: 'conn/offset'; offset: number }
  | { type: 'session/set'; session: Session | null }
  | { type: 'room/view'; view: RoomView }
  | { type: 'room/ended'; reason: RoomEndedReason | 'NO_SEAT' }
  | { type: 'room/reset' }
  | { type: 'game/update'; view: PlayerView; log: LogEntry[]; playedThisTurn: boolean }
  | { type: 'game/clear' }
  | { type: 'absent/set'; absent: AbsentInfo | null }
  | { type: 'ui/select'; cardId: string | null }
  | { type: 'ui/pair'; cardId: string | null }
  | { type: 'ui/pending'; id: string | null }
  | { type: 'ui/inline'; message: Message | null }
  | { type: 'ui/toast'; message: Message | null }
  | { type: 'ui/peek'; cards: Card[] | null }
  | { type: 'ui/nap'; on: boolean }
  | { type: 'game/hover'; hover: { playerId: string; position: number | null } | null }
  | { type: 'ui/reveal'; card: Card | null }
  | { type: 'ui/new'; cardId: string | null }
  | { type: 'anim/push'; items: AnimItem[] }
  | { type: 'anim/shift' }
  | { type: 'anim/hold'; until: number }
  | { type: 'ui/napPending'; on: boolean }
  | { type: 'ui/flash'; flash: { playerId: string; id: number } | null }
  | { type: 'ui/menu'; open: boolean }
  | { type: 'ui/overlay'; delta: 1 | -1 }
  | { type: 'tips/trigger'; tip: number }
  | { type: 'tips/dismiss' }
  | { type: 'tips/skip' }
  | { type: 'tips/reset' }
  | { type: 'settings/set'; settings: Settings }
  /** Merges into the latest settings, so a slow toggle cannot undo a newer change. */
  | { type: 'settings/patch'; patch: Partial<Settings> };

/** Turning pop-ups off removes the one on screen at once (US-070 AC03). */
function withToastRule(state: State): State {
  return state.settings.toasts || state.ui.toast === null ? state : { ...state, ui: { ...state.ui, toast: null } };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'conn/status':
      if (state.connection.status === action.status) return state;
      return {
        ...state,
        connection: { ...state.connection, status: action.status, since: Date.now() },
      };
    case 'conn/offset':
      return { ...state, connection: { ...state.connection, offset: action.offset } };
    case 'session/set':
      return { ...state, session: action.session };
    case 'room/view':
      return { ...state, room: { ...state.room, view: action.view, ended: null } };
    case 'room/ended':
      return {
        ...state,
        session: null,
        room: { view: null, ended: action.reason },
        game: { view: null, log: [], playedThisTurn: false },
        absent: null,
        ui: { ...state.ui, selectedCardId: null, pendingActionId: null, peek: null, nap: false, menuOpen: false, anim: [], napPending: false, holdUntil: 0 },
      };
    case 'room/reset':
      return {
        ...state,
        room: { view: null, ended: null },
        game: { view: null, log: [], playedThisTurn: false },
        absent: null,
      };
    case 'game/update': {
      const keep = state.ui.selectedCardId;
      const stillHeld = keep !== null && action.view.you.hand.some((c) => c.id === keep);
      const pairKeep = state.ui.pairCardId;
      const pairHeld = stillHeld && pairKeep !== null && action.view.you.hand.some((c) => c.id === pairKeep);
      return {
        ...state,
        game: { view: action.view, log: action.log, playedThisTurn: action.playedThisTurn },
        hover: action.view.steal ? state.hover : null,
        // Pending actions are resolved by the next snapshot; a stale selection is dropped.
        ui: {
          ...state.ui,
          pendingActionId: null,
          selectedCardId: stillHeld ? keep : null,
          pairCardId: pairHeld ? pairKeep : null,
        },
      };
    }
    case 'game/clear':
      return {
        ...state,
        game: { view: null, log: [], playedThisTurn: false },
        absent: null,
        ui: { ...state.ui, selectedCardId: null, pendingActionId: null, peek: null, nap: false, anim: [], napPending: false, holdUntil: 0 },
      };
    case 'absent/set':
      return { ...state, absent: action.absent };
    case 'ui/select':
      return { ...state, ui: { ...state.ui, selectedCardId: action.cardId, pairCardId: null } };
    case 'ui/pair':
      return { ...state, ui: { ...state.ui, pairCardId: action.cardId } };
    case 'ui/pending':
      return {
        ...state,
        ui: { ...state.ui, pendingActionId: action.id, pendingSince: action.id ? Date.now() : 0 },
      };
    case 'ui/inline':
      return { ...state, ui: { ...state.ui, inlineMessage: action.message } };
    case 'ui/toast':
      return { ...state, ui: { ...state.ui, toast: action.message } };
    case 'ui/peek':
      return { ...state, ui: { ...state.ui, peek: action.cards } };
    case 'ui/nap':
      return { ...state, ui: { ...state.ui, nap: action.on } };
    case 'game/hover':
      return { ...state, hover: action.hover };
    case 'anim/push':
      return { ...state, ui: { ...state.ui, anim: [...state.ui.anim, ...action.items] } };
    case 'anim/shift':
      return { ...state, ui: { ...state.ui, anim: state.ui.anim.slice(1) } };
    case 'anim/hold':
      return { ...state, ui: { ...state.ui, holdUntil: action.until } };
    case 'ui/napPending':
      return { ...state, ui: { ...state.ui, napPending: action.on } };
    case 'ui/new':
      return { ...state, ui: { ...state.ui, newCardId: action.cardId } };
    case 'ui/reveal':
      return { ...state, ui: { ...state.ui, reveal: action.card } };
    case 'ui/flash':
      return { ...state, ui: { ...state.ui, flash: action.flash } };
    case 'ui/menu':
      return { ...state, ui: { ...state.ui, menuOpen: action.open } };
    case 'ui/overlay':
      return {
        ...state,
        ui: { ...state.ui, overlays: Math.max(0, state.ui.overlays + action.delta) },
      };
    case 'tips/trigger': {
      const tips = state.ui.tips;
      if (tips.hidden || tips.done.includes(action.tip) || tips.visible === action.tip) return state;
      if (tips.visible !== null) {
        if (tips.queued.includes(action.tip)) return state;
        return { ...state, ui: { ...state.ui, tips: { ...tips, queued: [...tips.queued, action.tip] } } };
      }
      return { ...state, ui: { ...state.ui, tips: { ...tips, visible: action.tip } } };
    }
    case 'tips/dismiss': {
      const tips = state.ui.tips;
      if (tips.visible === null) return state;
      const done = [...tips.done, tips.visible];
      const [next, ...queued] = [...tips.queued].sort((a, b) => a - b);
      const hidden = done.length >= 4;
      return {
        ...state,
        ui: { ...state.ui, tips: { visible: hidden ? null : (next ?? null), done, queued, hidden } },
        settings: hidden ? { ...state.settings, tipsSeen: true } : state.settings,
      };
    }
    case 'tips/skip':
      return {
        ...state,
        ui: { ...state.ui, tips: { visible: null, done: [], queued: [], hidden: true } },
        settings: { ...state.settings, tipsSeen: true },
      };
    case 'tips/reset':
      return {
        ...state,
        ui: { ...state.ui, tips: { visible: null, done: [], queued: [], hidden: false } },
        settings: { ...state.settings, tipsSeen: false },
      };
    case 'settings/set':
      return withToastRule({ ...state, settings: action.settings });
    case 'settings/patch':
      return withToastRule({ ...state, settings: { ...state.settings, ...action.patch } });
  }
}
