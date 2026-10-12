// Current UI language (US-064). A tiny external store so `t()` can stay a plain
// function and the app can re-render when the language changes.

export type Language = 'en' | 'vi';
export const LANGUAGES: readonly Language[] = ['en', 'vi'];

let current: Language = 'en';
const listeners = new Set<() => void>();

export const getLocale = (): Language => current;

export function setLocale(next: Language): void {
  if (next === current) return;
  current = next;
  for (const listener of [...listeners]) listener();
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Default rule: a Vietnamese browser gets Vietnamese, everything else English. */
export function detectLanguage(): Language {
  try {
    return /^vi\b/i.test(navigator.language) ? 'vi' : 'en';
  } catch {
    return 'en';
  }
}

export const isLanguage = (value: unknown): value is Language => value === 'en' || value === 'vi';

/** BCP 47 tag used for the page language and speech. */
export const speechTag = (language: Language): string => (language === 'vi' ? 'vi-VN' : 'en-US');
