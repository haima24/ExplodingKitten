import type { DeckProfileName, GameEvent, PlayerView } from '@wb/engine/types';
import type { AvatarId, DisplayName } from './identity';
import type { ErrorCode, RoomEndedReason } from './errors';

export const PROTOCOL_VERSION = 1;


/** Turn timer choices for the host, in seconds. 0 means Off (US-063). */
export const TURN_TIMER_OPTIONS = [0, 15, 30, 60] as const;
export type TurnTimerSec = (typeof TURN_TIMER_OPTIONS)[number];

/**
 * How long each animation shows (US-069). The server holds the game for the
 * explosion so the next turn, its clock and bot moves start after it.
 */
export const ANIMATION_MS = { explosion: 3000, trophy: 4000 } as const;

export type RoomPhase = 'LOBBY' | 'PLAYING' | 'FINISHED' | 'CLOSED';
export type MemberStatus = 'LOBBY' | 'ACTIVE' | 'OUT' | 'LEFT';

export interface MemberView {
  playerId: string;
  name: DisplayName;
  avatarId: AvatarId | string;
  isHost: boolean;
  isBot: boolean;
  connected: boolean;
  status: MemberStatus;
}

/** Never includes tokens, token hashes, or IP addresses. */
export interface RoomView {
  code: string;
  phase: RoomPhase;
  hostId: string;
  capacity: number;
  deckProfile: DeckProfileName;
  members: MemberView[];
  /** Bot that is currently "thinking" (US-023). */
  thinkingId?: string;
  idleWarning?: { expiresAt: number; absolute?: boolean };
  /** Seconds per turn chosen by the host; 0 = Off (US-063). */
  turnTimerSec: TurnTimerSec;
  /**
   * The running turn clock. `deadlineAt` is server time in ms, or null while the
   * clock is paused (Nope window, or the player is away).
   */
  turnClock?: { playerId: string; deadlineAt: number | null };
}

export interface RoomNotice {
  kind: 'JOINED' | 'LEFT' | 'REMOVED' | 'NEW_HOST' | 'LOST_CONNECTION';
  /** Plain English text, kept for old clients. */
  name: string;
  /** The name's words, so each device can show it in its own language (US-067). */
  who?: DisplayName;
}

export interface AbsentInfo {
  playerId: string;
  since: number;
  deadlineAt: number;
  hostMayDecide: boolean;
}

export interface ServerPayloads {
  hello: { serverTime: number; protocol: number };
  ack: Record<string, never>;
  error: { code: ErrorCode; message?: string; data?: { taken?: string[] } };
  'room.joined': { playerId: string; token: string; isHost: boolean; room: RoomView };
  'room.update': { room: RoomView; notices?: RoomNotice[] };
  'game.update': { version: number; view: PlayerView; events: GameEvent[] };
  'absent.update': { absent: AbsentInfo | null; hostId: string };
  /** Where the taker is pointing in the fan, or null; relayed to everyone else (US-066). */
  'game.hover': { playerId: string; position: number | null };
  'room.ended': { reason: RoomEndedReason };
  pong: { t?: number; serverTime: number };
}

export type ServerType = keyof ServerPayloads;

export interface ServerMessage<T extends ServerType = ServerType> {
  v: typeof PROTOCOL_VERSION;
  t: T;
  id?: string;
  p: ServerPayloads[T];
}

export function serverMessage<T extends ServerType>(
  t: T,
  p: ServerPayloads[T],
  id?: string,
): ServerMessage<T> {
  return id === undefined ? { v: PROTOCOL_VERSION, t, p } : { v: PROTOCOL_VERSION, t, id, p };
}
