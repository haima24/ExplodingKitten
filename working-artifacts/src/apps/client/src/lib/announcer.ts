// Single owner of the polite and assertive live regions (US-036).

export type Priority = 'polite' | 'assertive';

class Announcer {
  private regions: Record<Priority, HTMLElement | null> = { polite: null, assertive: null };
  private recent = new Map<string, number>();

  register(polite: HTMLElement | null, assertive: HTMLElement | null): void {
    this.regions = { polite, assertive };
  }

  /**
   * Ignores the same key (or text) within one second. Clears then sets the text
   * on the next frame so repeated messages are read again.
   */
  announce(text: string, options: { priority?: Priority; key?: string } = {}): void {
    const region = this.regions[options.priority ?? 'polite'];
    if (!region || !text) return;
    const key = options.key ?? text;
    const now = Date.now();
    const last = this.recent.get(key);
    if (last !== undefined && now - last < 1000) return;
    this.recent.set(key, now);
    if (this.recent.size > 50) {
      for (const [k, at] of this.recent) if (now - at > 5000) this.recent.delete(k);
    }
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = text;
    });
  }
}

export const announcer = new Announcer();
