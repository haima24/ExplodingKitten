import { z } from 'zod';
import { PROTOCOL_VERSION } from './types';

// ---------------------------------------------------------------- envelope

export const envelopeSchema = z.object({
  v: z.literal(PROTOCOL_VERSION),
  t: z.string().min(1).max(40),
  id: z.string().min(1).max(64).optional(),
  p: z.record(z.unknown()).default({}),
});
export type Envelope = z.infer<typeof envelopeSchema>;

// ---------------------------------------------------------- client -> server

const text = (max: number) => z.string().max(max);
const nameSchema = z.object({ adjective: text(32), noun: text(32) });
const empty = z.object({});

const gameActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('PLAY_CARD'),
    cardId: text(64),
    targetId: text(64).optional(),
  }),
  z.object({ type: z.literal('DRAW') }),
  z.object({ type: z.literal('USE_TREAT') }),
  z.object({
    type: z.literal('REINSERT_BOOM'),
    position: z.enum(['TOP', 'MIDDLE', 'BOTTOM', 'RANDOM']),
  }),
  z.object({ type: z.literal('PICK_FAVOR_CARD'), cardId: text(64) }),
  z.object({
    type: z.literal('PLAY_PAIR'),
    cardIds: z.tuple([text(64), text(64)]),
    targetId: text(64),
  }),
  z.object({ type: z.literal('PICK_STEAL'), position: z.number().int().min(0).max(99) }),
  z.object({ type: z.literal('NOPE') }),
  z.object({ type: z.literal('PASS_NOPE') }),
]);

/** Payload schemas by message type. Unknown fields are stripped, never trusted. */
export const clientSchemas = {
  'room.create': z.object({ name: nameSchema, avatarId: text(32) }),
  'room.join': z.object({ code: text(32), name: nameSchema, avatarId: text(32) }),
  'room.rejoin': z.object({ code: text(32), token: text(128) }),
  'room.leave': empty,
  'room.close': empty,
  'room.kick': z.object({ playerId: text(64) }),
  'room.start': empty,
  'room.rematch': empty,
  'room.keepAlive': empty,
  'room.addBot': empty,
  'room.settings': z.object({
    turnTimerSec: z.union([z.literal(0), z.literal(15), z.literal(30), z.literal(60)]),
  }),
  'game.action': z.object({ actionId: z.string().min(1).max(64), action: gameActionSchema }),
  'game.end': empty,
  'game.skipAbsent': z.object({ playerId: text(64), decision: z.enum(['WAIT', 'SKIP']) }),
  /** The taker's finger position over the fan, shown live to the others (US-066). */
  'game.hover': z.object({ position: z.number().int().min(0).max(99).nullable() }),
  ping: z.object({ t: z.number().optional() }),
} as const;

export type ClientType = keyof typeof clientSchemas;
export type ClientPayload<T extends ClientType> = z.infer<(typeof clientSchemas)[T]>;
export type GameActionPayload = z.infer<typeof gameActionSchema>;

export function isClientType(t: string): t is ClientType {
  return Object.prototype.hasOwnProperty.call(clientSchemas, t);
}
