import type { GameState } from '@wb/engine/types';
import type { Rng } from '@wb/engine';
import type { AbsentInfo, DisplayName, MemberView, RoomPhase, RoomView, TurnTimerSec } from '@wb/protocol';
import type { Connection } from './connection';
import type { Config } from './config';

export interface Member {
  playerId: string;
  /** SHA-256 of the rejoin token; null for bots and for members who left. */
  tokenHash: Buffer | null;
  name: DisplayName;
  avatarId: string;
  isBot: boolean;
  joinIndex: number;
  connected: boolean;
  conn: Connection | null;
  /** Left the room or was removed; kept until the next rematch so recaps keep names. */
  left: boolean;
}

export interface Room {
  code: string;
  phase: RoomPhase;
  hostId: string;
  members: Member[];
  createdAt: number;
  lastActivityAt: number;
  /** Used only for per-IP room counts; never sent to clients or logged. */
  creatorIp: string;
  game: GameState | null;
  rng: Rng;
  joinCounter: number;
  bans: Set<string>;
  hostAwayDeadline: number | null;
  absent: AbsentInfo | null;
  emptySince: number | null;
  finishedAt: number | null;
  previousFirstJoinIndex: number | null;
  idleWarning: { expiresAt: number; absolute: boolean } | null;
  /** Recent action ids per player, with the original reply. */
  dedupe: Map<string, Map<string, string>>;
  botActorId: string | null;
  botDueAt: number | null;
  /** When the open Nope window times out, and which window it belongs to. */
  nopeDeadlineAt: number | null;
  nopeKey: string | null;
  /** Until when the game is held for an animation (US-069); actions wait, clocks and bots start after. */
  holdUntil: number | null;
  /** Host setting: seconds per turn, 0 = Off (US-063). */
  turnTimerSec: TurnTimerSec;
  turn: TurnClock | null;
}

/**
 * The server-side turn clock. `key` names the thing being waited on, so a new
 * turn, decision or Favor re-arms the clock at full time. `deadlineAt` is null
 * while paused; `remainingMs` is kept only for a Nope-window pause.
 */
export interface TurnClock {
  key: string;
  playerId: string;
  deadlineAt: number | null;
  remainingMs: number | null;
}

export const present = (room: Room): Member[] => room.members.filter((m) => !m.left);

export const findMember = (room: Room, playerId: string): Member | undefined =>
  room.members.find((m) => m.playerId === playerId);

export const connectedHumans = (room: Room): Member[] =>
  room.members.filter((m) => !m.isBot && !m.left && m.connected);

/** The player everyone is waiting for (decision owner or current player). */
export function deciderId(game: GameState): string {
  return game.pending?.playerId ?? game.currentPlayerId;
}

/**
 * The bot that should act now: the first bot still allowed to answer a Nope
 * window, or the bot whose decision/turn it is.
 */
export function botToAct(room: Room): string | null {
  const game = room.game;
  if (!game || game.phase === 'finished') return null;
  const isBot = (id: string): boolean => findMember(room, id)?.isBot === true;
  if (game.pending?.kind === 'NOPE_WINDOW') {
    return game.pending.responders.find(isBot) ?? null;
  }
  const id = deciderId(game);
  return isBot(id) ? id : null;
}

export function toRoomView(room: Room, config: Config): RoomView {
  const game = room.game;
  const members: MemberView[] = room.members.map((m) => {
    let status: MemberView['status'] = 'LOBBY';
    if (room.phase !== 'LOBBY') {
      const player = game?.players.find((p) => p.id === m.playerId);
      status = m.left ? 'LEFT' : player?.status === 'out' ? 'OUT' : 'ACTIVE';
    }
    return {
      playerId: m.playerId,
      name: { ...m.name },
      avatarId: m.avatarId,
      isHost: m.playerId === room.hostId,
      isBot: m.isBot,
      connected: m.connected,
      status,
    };
  });
  const view: RoomView = {
    code: room.code,
    phase: room.phase,
    hostId: room.hostId,
    capacity: config.roomCapacity,
    deckProfile: config.deckProfile,
    members,
    turnTimerSec: room.turnTimerSec,
  };
  if (room.botActorId && room.botDueAt !== null) view.thinkingId = room.botActorId;
  if (room.idleWarning) view.idleWarning = { ...room.idleWarning };
  if (room.turn) view.turnClock = { playerId: room.turn.playerId, deadlineAt: room.turn.deadlineAt };
  return view;
}
