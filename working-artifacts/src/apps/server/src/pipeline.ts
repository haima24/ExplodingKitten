import type { RawData } from 'ws';
import { clientSchemas, envelopeSchema, isClientType } from '@wb/protocol';
import type { Connection } from './connection';
import { handlers, type Ctx } from './handlers';
import type { Hub } from './hub';
import { codeHash } from './util';

const MAX_VIOLATIONS = 10;
const MAX_THROTTLED = 50;

function toText(data: RawData): string {
  if (Buffer.isBuffer(data)) return data.toString('utf8');
  if (Array.isArray(data)) return Buffer.concat(data).toString('utf8');
  return Buffer.from(data).toString('utf8');
}

/**
 * parse -> size check -> envelope -> payload schema -> rate limit -> route -> ack/error.
 * Handlers run synchronously, so each room is effectively a single queue.
 */
export function handleFrame(hub: Hub, conn: Connection, data: RawData, isBinary: boolean): void {
  conn.lastSeen = hub.clock.now();

  const invalid = (id?: string): void => {
    hub.error(conn, id, 'INVALID_MESSAGE');
    if (++conn.violations >= MAX_VIOLATIONS) conn.close(1008, 'too many invalid messages');
  };

  if (isBinary) return conn.close(1003, 'text frames only');
  const text = toText(data);
  if (Buffer.byteLength(text) > hub.config.maxMessageBytes) return conn.close(1009, 'too large');

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return invalid();
  }
  const envelope = envelopeSchema.safeParse(raw);
  if (!envelope.success) return invalid();
  const { t, id, p } = envelope.data;
  if (!isClientType(t)) return invalid(id);

  if (!conn.bucket.take()) {
    hub.error(conn, id, 'RATE_LIMITED');
    if (++conn.throttled >= MAX_THROTTLED) conn.close(1008, 'rate limited');
    return;
  }
  conn.throttled = 0;

  const parsed = clientSchemas[t].safeParse(p);
  if (!parsed.success) return invalid(id);

  // Real activity (not heartbeats) keeps a room alive.
  if (t !== 'ping' && conn.bound) {
    const room = hub.rooms.get(conn.bound.code);
    if (room) hub.touch(room);
  }

  const ctx: Ctx = { hub, conn, id };
  try {
    (handlers[t] as (ctx: Ctx, payload: unknown) => void)(ctx, parsed.data);
  } catch (err) {
    // Never log payloads: they can contain names and game content.
    hub.log.error('handler_failed', {
      type: t,
      codeHash: conn.bound ? codeHash(conn.bound.code) : null,
      name: err instanceof Error ? err.name : 'Error',
    });
    hub.error(conn, id, 'SERVER_ERROR');
  }
}
