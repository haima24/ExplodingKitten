// Device-only settings. All storage access goes through this module, wrapped in
// try/catch, with an in-memory fallback so the app works when storage is blocked.

export type MotionPref = 'system' | 'on' | 'off';
export type TextScale = 100 | 125 | 150;

export interface Settings {
  motion: MotionPref;
  sound: boolean;
  textScale: TextScale;
  tipsSeen: boolean;
}

export const defaultSettings: Settings = {
  motion: 'system',
  sound: false,
  textScale: 100,
  tipsSeen: false,
};

const KEY = 'wb.settings';
let memory: Settings = { ...defaultSettings };

function validate(raw: unknown): Settings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  return {
    motion: r['motion'] === 'on' || r['motion'] === 'off' ? r['motion'] : 'system',
    sound: r['sound'] === true,
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
}
