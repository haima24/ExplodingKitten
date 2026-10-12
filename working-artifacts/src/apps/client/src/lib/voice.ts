// Optional spoken lines (US-064). Imported lazily and only after the player turns
// Voice-over on, so no speech engine is touched while it is off.
//
// Lines are short, generic, and never name a card in a hand or a player, so they
// can later be replaced by recorded files without changing callers. Today the
// browser's speech engine reads them. Everything spoken is also shown as text.

export type VoicePriority = 0 | 1 | 2;

export interface VoiceLine {
  id: string;
  text: string;
  priority: VoicePriority;
}

interface Queued extends VoiceLine {
  at: number;
}

/** Lines older than this are dropped instead of spoken late (US-064 AC38). */
export const STALE_MS = 3_000;

const queue: Queued[] = [];
let speaking: { priority: VoicePriority } | null = null;
let last: VoiceLine | null = null;
let settings = { lang: 'en-US', volume: 1 };
let startAfter = 0;
/** Identifies the utterance in flight, so the end event of a cancelled one is ignored. */
let token = 0;

const synth = (): SpeechSynthesis | null =>
  typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined' ? null : speechSynthesis;

export function voiceSupported(): boolean {
  return synth() !== null;
}

/** True when the browser has a voice for the language (it may load a moment after start). */
export function hasVoiceFor(lang: string): boolean {
  const s = synth();
  if (!s) return false;
  const prefix = lang.slice(0, 2).toLowerCase();
  return s.getVoices().some((v) => v.lang.toLowerCase().startsWith(prefix));
}

/** Calls back when the list of installed voices becomes known or changes. */
export function onVoicesChanged(callback: () => void): () => void {
  const s = synth();
  if (!s) return () => undefined;
  s.addEventListener('voiceschanged', callback);
  return () => s.removeEventListener('voiceschanged', callback);
}

export function configureVoice(next: { lang: string; volume: number }): void {
  settings = { lang: next.lang, volume: Math.min(1, Math.max(0, next.volume / 100)) };
}

function speakNext(): void {
  const s = synth();
  if (!s || speaking || document.hidden) return;
  const wait = startAfter - Date.now();
  if (wait > 0) {
    window.setTimeout(speakNext, wait);
    return;
  }
  const now = Date.now();
  // Drop stale lines, then take the most important (oldest first among equals).
  for (let i = queue.length - 1; i >= 0; i--) if (now - (queue[i] as Queued).at > STALE_MS) queue.splice(i, 1);
  if (queue.length === 0) return;
  let best = 0;
  queue.forEach((q, i) => {
    if (q.priority > (queue[best] as Queued).priority) best = i;
  });
  const line = queue.splice(best, 1)[0] as Queued;

  const utterance = new SpeechSynthesisUtterance(line.text);
  utterance.lang = settings.lang;
  utterance.volume = settings.volume;
  const prefix = settings.lang.slice(0, 2).toLowerCase();
  const voice = s.getVoices().find((v) => v.lang.toLowerCase().startsWith(prefix));
  try {
    if (voice) utterance.voice = voice;
  } catch {
    /* the browser's default voice is used */
  }
  const mine = ++token;
  const done = (): void => {
    if (token !== mine) return;
    speaking = null;
    speakNext();
  };
  utterance.onend = done;
  utterance.onerror = done;
  speaking = { priority: line.priority };
  last = line;
  try {
    s.speak(utterance);
  } catch {
    done();
  }
}

/**
 * Queues lines. Several arrive together after one server update, so they are
 * spoken one after another, most important first. A top-priority line (time out,
 * you are out, game over) cuts off a low-priority line that is still speaking.
 * `delayMs` lets a sound effect play first.
 */
export function enqueueVoice(lines: readonly VoiceLine[], delayMs = 0): void {
  const s = synth();
  if (!s || document.hidden) return;
  const now = Date.now();
  if (delayMs > 0) startAfter = Math.max(startAfter, now + delayMs);
  for (const line of lines) queue.push({ ...line, at: now });
  if (speaking && speaking.priority === 0 && lines.some((l) => l.priority === 2)) {
    token++;
    speaking = null;
    s.cancel();
  }
  speakNext();
}

/** Says the last line again. Returns false if there is nothing to repeat. */
export function replayLastVoice(): boolean {
  const s = synth();
  if (!s || !last) return false;
  token++;
  s.cancel();
  speaking = null;
  queue.length = 0;
  startAfter = 0;
  queue.push({ ...last, at: Date.now() });
  speakNext();
  return true;
}

export function hasLastVoice(): boolean {
  return last !== null;
}

export function stopVoice(): void {
  token++;
  queue.length = 0;
  speaking = null;
  synth()?.cancel();
}
