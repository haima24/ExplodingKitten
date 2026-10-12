import type { DeckProfileName, GameEvent, PlayerView } from '@wb/engine/types';
import type { AvatarId, DisplayName } from './identity';
import type { ErrorCode, RoomEndedReason } from './errors';

export const PROTOCOL_VERSION = 1;


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
}

export interface RoomNotice {
  kind: 'JOINED' | 'LEFT' | 'REMOVED' | 'NEW_HOST' | 'LOST_CONNECTION';
  name: string;
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
