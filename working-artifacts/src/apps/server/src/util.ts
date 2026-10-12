import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { createSeededRng, type Rng } from '@wb/engine';

// --------------------------------------------------------------------- clock

export interface Clock {
  now(): number;
}

export const systemClock: Clock = { now: () => Date.now() };

/** Real time plus an adjustable offset; backs `/test/clock/advance` in TEST_MODE. */
export class TestClock implements Clock {
  private offset = 0;
  now(): number {
    return Date.now() + this.offset;
  }
  advance(ms: number): void {
    this.offset += ms;
  }
}

// ---------------------------------------------------------------------- rng

/** Platform CSPRNG; `randomInt` uses rejection sampling, so there is no modulo bias. */
export const secureRng: Rng = { nextInt: (max) => randomInt(max) };

export function seededRngFor(key: string): Rng {
  const seed = createHash('sha256').update(key).digest().readUInt32BE(0);
  return createSeededRng(seed);
}

// ------------------------------------------------------------------- hashing

export function sha256(text: string): Buffer {
  return createHash('sha256').update(text).digest();
}

export function newToken(): string {
  return randomBytes(24).toString('base64url');
}

export function newPlayerId(): string {
  return randomBytes(9).toString('base64url');
}

export function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Short stable hash used so logs never contain a room code. */
export function codeHash(code: string): string {
  return createHash('sha256').update(code).digest('hex').slice(0, 8);
}

// -------------------------------------------------------------------- logger

export interface Logger {
  info(event: string, fields?: Record<string, unknown>): void;
  warn(event: string, fields?: Record<string, unknown>): void;
  error(event: string, fields?: Record<string, unknown>): void;
}

/** Structured logs. Callers must never pass names, tokens, or game content. */
export function createLogger(silent = false): Logger {
  const write = (level: string, event: string, fields?: Record<string, unknown>): void => {
    if (silent) return;
    process.stdout.write(`${JSON.stringify({ t: new Date().toISOString(), level, event, ...fields })}\n`);
  };
  return {
    info: (e, f) => write('info', e, f),
    warn: (e, f) => write('warn', e, f),
    error: (e, f) => write('error', e, f),
  };
}
