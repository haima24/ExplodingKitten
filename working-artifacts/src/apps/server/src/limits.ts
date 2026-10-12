import type { Clock } from './util';

/** Sustained rate with a burst allowance. */
export class TokenBucket {
  private tokens: number;
  private last: number;
  constructor(
    private readonly ratePerSec: number,
    private readonly burst: number,
    private readonly clock: Clock,
  ) {
    this.tokens = burst;
    this.last = clock.now();
  }
  take(): boolean {
    const now = this.clock.now();
    this.tokens = Math.min(this.burst, this.tokens + ((now - this.last) / 1000) * this.ratePerSec);
    this.last = now;
    if (this.tokens < 1) return false;
    this.tokens -= 1;
    return true;
  }
}

/** Sliding-window counter with a temporary block once the limit is hit. */
export class WindowLimiter {
  private hits = new Map<string, number[]>();
  private blockedUntil = new Map<string, number>();
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly blockMs: number,
    private readonly clock: Clock,
  ) {}

  isBlocked(key: string): boolean {
    const until = this.blockedUntil.get(key);
    if (until === undefined) return false;
    if (this.clock.now() >= until) {
      this.blockedUntil.delete(key);
      return false;
    }
    return true;
  }

  /** Records one event. Returns true when this event triggered a block. */
  hit(key: string): boolean {
    const now = this.clock.now();
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    recent.push(now);
    this.hits.set(key, recent);
    if (recent.length >= this.limit) {
      this.blockedUntil.set(key, now + this.blockMs);
      this.hits.delete(key);
      return true;
    }
    return false;
  }

  prune(): void {
    const now = this.clock.now();
    for (const [key, list] of this.hits) {
      const recent = list.filter((t) => now - t < this.windowMs);
      if (recent.length === 0) this.hits.delete(key);
      else this.hits.set(key, recent);
    }
    for (const [key, until] of this.blockedUntil) if (now >= until) this.blockedUntil.delete(key);
  }
}
