import { randomBytes } from 'node:crypto';
import type { WebSocket } from 'ws';
import type { ServerMessage } from '@wb/protocol';
import type { TokenBucket } from './limits';

/** One object per socket. Identity comes only from `bound`, never from the client. */
export class Connection {
  readonly id = randomBytes(6).toString('hex');
  bound: { code: string; playerId: string } | null = null;
  lastSeen: number;
  violations = 0;
  throttled = 0;

  constructor(
    readonly ws: WebSocket,
    readonly ip: string,
    readonly bucket: TokenBucket,
    now: number,
  ) {
    this.lastSeen = now;
  }

  send(message: ServerMessage): void {
    if (this.ws.readyState === 1) this.ws.send(JSON.stringify(message));
  }

  close(code = 1000, reason = ''): void {
    try {
      this.ws.close(code, reason);
    } catch {
      this.ws.terminate();
    }
  }
}
