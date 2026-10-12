// Shared engine types. This module is client-safe (types only).

export type CardKind =
  | 'BOOM_CAT'
  | 'TREAT'
  | 'HOP_OVER'
  | 'PEEK'
  | 'SHAKE_UP'
  | 'COZY_CAT'
  | 'PASS_IT_ON'
  | 'ASK_A_FRIEND';

/** Ids are opaque random strings and never encode kind or position. */
export interface Card {
  id: string;
  kind: CardKind;
  variant?: 1 | 2 | 3 | 4 | 5;
}

export type DeckProfileName = 'mvp' | 'mvp+should';

export type Phase = 'turn' | 'decision' | 'finished';
export type PlayerStatus = 'active' | 'out';
export type OutReason = 'BOOM' | 'LEFT' | 'REMOVED' | 'SKIPPED';

export interface PlayerState {
  id: string;
  seat: number;
  hand: Card[];
  status: PlayerStatus;
  outReason?: OutReason;
}

export type Pending =
  | { kind: 'TREAT_DECISION'; playerId: string; boomCard: Card }
  | { kind: 'REINSERT'; playerId: string; boomCard: Card }
  | { kind: 'FAVOR_PICK'; playerId: string; requesterId: string };

export interface GameStats {
  turnsPlayed: number;
  treatsUsed: number;
}

export interface GameState {
  version: number;
  /** Per-game event sequence counter. */
  seq: number;
  phase: Phase;
  players: PlayerState[];
  currentPlayerId: string;
  pendingTurns: number;
  /** Index 0 is the top of the pile. */
  drawPile: Card[];
  /** Index 0 is the most recent discard. */
  discardPile: Card[];
  pending: Pending | null;
  winnerId?: string;
  stats: GameStats;
  firstPlayerId: string;
  /** Number of cards in the game; used by the conservation invariant. */
  totalCards: number;
}

export type InsertPosition = 'TOP' | 'MIDDLE' | 'BOTTOM' | 'RANDOM';
export const INSERT_POSITIONS: readonly InsertPosition[] = ['TOP', 'MIDDLE', 'BOTTOM', 'RANDOM'];

/** Actions sent by players. The server injects `playerId` from the connection. */
export type PlayerAction =
  | { type: 'PLAY_CARD'; cardId: string; targetId?: string }
  | { type: 'DRAW' }
  | { type: 'USE_TREAT' }
  | { type: 'REINSERT_BOOM'; position: InsertPosition }
  | { type: 'PICK_FAVOR_CARD'; cardId: string };

/** Actions only the server may issue. */
export type ServerAction = { type: 'LEAVE' } | { type: 'REMOVE' } | { type: 'SKIP_ABSENT' };

export type Action = (PlayerAction | ServerAction) & { playerId: string };

export type EngineErrorCode =
  | 'GAME_FINISHED'
  | 'NOT_IN_GAME'
  | 'PLAYER_OUT'
  | 'NOT_YOUR_TURN'
  | 'WRONG_PHASE'
  | 'CARD_NOT_IN_HAND'
  | 'NOT_PLAYABLE'
  | 'INVALID_TARGET'
  | 'INVALID_POSITION'
  | 'INVALID_CONFIG';

export const ENGINE_ERROR_CODES: readonly EngineErrorCode[] = [
  'GAME_FINISHED',
  'NOT_IN_GAME',
  'PLAYER_OUT',
  'NOT_YOUR_TURN',
  'WRONG_PHASE',
  'CARD_NOT_IN_HAND',
  'NOT_PLAYABLE',
  'INVALID_TARGET',
  'INVALID_POSITION',
  'INVALID_CONFIG',
];

export interface EngineError {
  code: EngineErrorCode;
  message: string;
}

export type EventType =
  // public
  | 'CARD_PLAYED'
  | 'CARD_DRAWN'
  | 'PEEKED'
  | 'DECK_SHUFFLED'
  | 'TREAT_USED'
  | 'BOOM_TUCKED'
  | 'PLAYER_OUT'
  | 'FAVOR_REQUESTED'
  | 'FAVOR_GIVEN'
  | 'TURN_STARTED'
  | 'GAME_FINISHED'
  // private
  | 'DRAWN_CARD'
  | 'PEEK_RESULT'
  | 'BOOM_DRAWN'
  | 'FAVOR_RECEIVED';

export type EventVisibility = 'PUBLIC' | { to: string };

export interface GameEvent {
  seq: number;
  type: EventType;
  visibility: EventVisibility;
  data: Record<string, unknown>;
}

export interface OtherPlayerView {
  id: string;
  seat: number;
  handCount: number;
  status: PlayerStatus;
  outReason?: OutReason;
}

export interface YouView {
  id: string;
  seat: number;
  hand: Card[];
  status: PlayerStatus;
  outReason?: OutReason;
}

export type DecisionView =
  | { kind: 'TREAT_DECISION' }
  | { kind: 'REINSERT' }
  | { kind: 'FAVOR_PICK'; requesterId: string };

/** The only game data ever sent to a device. */
export interface PlayerView {
  version: number;
  phase: Phase;
  you: YouView;
  others: OtherPlayerView[];
  currentPlayerId: string;
  pendingTurns: number;
  drawCount: number;
  discardPile: Card[];
  /** Only present for the player who must decide. */
  decision?: DecisionView;
  /** Public id of the player everyone is waiting for during a decision. */
  waitingFor?: string;
  winnerId?: string;
  stats?: GameStats;
}

export type Result<T> = ({ ok: true } & T) | { ok: false; error: EngineError };
export type GameResult = Result<{ state: GameState; events: GameEvent[] }>;
