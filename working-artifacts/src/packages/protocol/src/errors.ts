import { ENGINE_ERROR_CODES, type EngineErrorCode } from '@wb/engine/types';

export const ROOM_ERROR_CODES = [
  'INVALID_MESSAGE',
  'RATE_LIMITED',
  'INVALID_CODE',
  'ROOM_NOT_FOUND',
  'ROOM_FULL',
  'GAME_STARTED',
  'ROOM_CLOSED',
  'INVALID_NAME',
  'INVALID_AVATAR',
  'AVATAR_TAKEN',
  'ALREADY_IN_ROOM',
  'NOT_HOST',
  'NOT_IN_ROOM',
  'BAD_TOKEN',
  'REMOVED',
  'TOO_MANY_ROOMS',
  'NOT_ENOUGH_PLAYERS',
  'WRONG_ROOM_PHASE',
  'SERVER_ERROR',
] as const;

export type RoomErrorCode = (typeof ROOM_ERROR_CODES)[number];
export type ErrorCode = RoomErrorCode | EngineErrorCode;

export const ALL_ERROR_CODES: readonly ErrorCode[] = [...ROOM_ERROR_CODES, ...ENGINE_ERROR_CODES];

export const ROOM_ENDED_REASONS = [
  'HOST_CLOSED',
  'EXPIRED',
  'REMOVED',
  'EMPTY',
  'SERVER_RESTART',
  'ERROR',
  'REPLACED',
] as const;
export type RoomEndedReason = (typeof ROOM_ENDED_REASONS)[number];
