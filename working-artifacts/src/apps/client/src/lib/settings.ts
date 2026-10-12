// Device-only settings. All storage access goes through this module, wrapped in
// try/catch, with an in-memory fallback so the app works when storage is blocked.

import { detectLanguage, isLanguage, setLocale, speechTag, type Language } from '../copy/locale';

export type MotionPref = 'system' | 'on' | 'off';
export type TextScale = 100 | 125 | 150;

export interface Settings {
  motion: MotionPref;
  sound: boolean;
  /** Effects volume, 0 to 100. */
  volume: number;
  /** Spoken lines (US-064). Off by default, separate from sound effects. */
  voice: boolean;
  voiceVolume: number;
  language: Language;
  textScale: TextScale;
  tipsSeen: boolean;
}

export const defaultSettings: Settings = {
  motion: 'system',
  sound: false,
  volume: 40,
  voice: false,
  voiceVolume: 100,
  language: 'en',
  textScale: 100,
  tipsSeen: false,
};

const KEY = 'wb.settings';
let memory: Settings = { ...defaultSettings, language: detectLanguage() };

const percent = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : fallback;

function validate(raw: unknown): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    motion: r['motion'] === 'on' || r['motion'] === 'off' ? r['motion'] : 'system',
    sound: r['sound'] === true,
    volume: percent(r['volume'], defaultSettings.volume),
    voice: r['voice'] === true,
    voiceVolume: percent(r['voiceVolume'], defaultSettings.voiceVolume),
    // Saved choice first, then the browser language.
    language: isLanguage(r['language']) ? r['language'] : detectLanguage(),
    textScale: r['textScale'] === 125 || r['textScale'] === 150 ? r['textScale'] : 100,
    tipsSeen: r['tipsSeen'] === true,
  };
}

export function loadSettings(): Settings {
  try {
    const text = localStorage.getItem(KEY);
    if (text) memory = validate(JSON.parse(text));
  } catch {
    /* storage unavailable: keep the in-memory copy */
  }
  setLocale(memory.language);
  return { ...memory };
}

export function saveSettings(next: Settings): void {
  memory = { ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable or full: settings apply for this session only */
  }
}

export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isReducedMotion(settings: Settings): boolean {
  return settings.motion === 'on' || (settings.motion === 'system' && prefersReducedMotion());
}

/** Applies motion and text size to the document root. */
export function applySettings(settings: Settings): void {
  const root = document.documentElement;
  if (isReducedMotion(settings)) root.setAttribute('data-motion', 'reduced');
  else root.removeAttribute('data-motion');
  root.style.setProperty('--text-scale', String(settings.textScale / 100));
  root.setAttribute('lang', speechTag(settings.language).slice(0, 2));
}
