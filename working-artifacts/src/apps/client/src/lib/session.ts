// The rejoin session lives in sessionStorage only: it survives reloads but not a
// closed browser session, on purpose (no long-lived identifier). The token never
// appears in URLs or share links.

export interface Session {
  code: string;
  token: string;
  playerId: string;
}

const KEY = 'wb.session';
let memory: Session | null = null;
export let storageAvailable = true;

export function loadSession(): Session | null {
  try {
    const text = sessionStorage.getItem(KEY);
    if (!text) return memory;
    const raw = JSON.parse(text) as Partial<Session>;
    if (typeof raw.code === 'string' && typeof raw.token === 'string' && typeof raw.playerId === 'string') {
      return { code: raw.code, token: raw.token, playerId: raw.playerId };
    }
  } catch {
    storageAvailable = false;
  }
  return memory;
}

export function saveSession(session: Session): void {
  memory = session;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    storageAvailable = false;
  }
}

export function clearSession(): void {
  memory = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
