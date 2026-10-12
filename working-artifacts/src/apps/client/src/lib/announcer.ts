// Single owner of the polite and assertive live regions (US-036).

export type Priority = 'polite' | 'assertive';

/** Gap between two polite messages so a screen reader can finish each one (US-070: nothing is overwritten). */
const POLITE_GAP_MS = 900;
/** A long backlog is trimmed from the oldest end so speech never lags far behind the game. */
const MAX_QUEUE = 6;

class Announcer {
  private regions: Record<Priority, HTMLElement | null> = { polite: null, assertive: null };
  private recent = new Map<string, number>();
  private queue: string[] = [];
  private timer: number | null = null;

  register(polite: HTMLElement | null, assertive: HTMLElement | null): void {
    this.regions = { polite, assertive };
  }

  /**
   * Ignores the same key (or text) within one second. Assertive messages are set
   * at once; polite ones are queued and spoken one after another. The text is
   * cleared then set on the next frame so repeated messages are read again.
   */
  announce(text: string, options: { priority?: Priority; key?: string } = {}): void {
    const priority = options.priority ?? 'polite';
    const region = this.regions[priority];
    if (!region || !text) return;
    const key = options.key ?? text;
    const now = Date.now();
    const last = this.recent.get(key);
    if (last !== undefined && now - last < 1000) return;
    this.recent.set(key, now);
    if (this.recent.size > 50) {
      for (const [k, at] of this.recent) if (now - at > 5000) this.recent.delete(k);
    }
    if (priority === 'assertive') {
      this.say(region, text);
      return;
    }
    this.queue.push(text);
    if (this.queue.length > MAX_QUEUE) this.queue.splice(0, this.queue.length - MAX_QUEUE);
    if (this.timer === null) this.next();
  }

  private next(): void {
    const region = this.regions.polite;
    const text = this.queue.shift();
    if (!region || text === undefined) {
      this.timer = null;
      return;
    }
    this.say(region, text);
    this.timer = window.setTimeout(() => this.next(), POLITE_GAP_MS);
  }

  private say(region: HTMLElement, text: string): void {
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = text;
    });
  }
}

export const announcer = new Announcer();
