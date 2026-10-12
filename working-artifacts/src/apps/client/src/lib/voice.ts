// Optional spoken lines (US-064). Imported lazily and only after the player turns
// Voice-over on, so nothing is fetched while it is off.
//
// Each line is a small pre-rendered MP3 (`public/voice/<lang>/<id>.mp3`, made by
// `scripts/generate-voice.py`), so it sounds the same in every browser. The
// browser's own speech engine is only a fallback if a file cannot be played.
// Lines never name a card in a hand or a player. Everything spoken is also text.

export type VoicePriority = 0 | 1 | 2;

export interface VoiceLine {
  id: string;
  text: string;
  priority: VoicePriority;
}

interface Queued extends VoiceLine {
  at: number;
  lang: string;
}

/** Lines older than this are dropped instead of spoken late (US-064 AC38). */
export const STALE_MS = 3_000;

/** Who reads each language, for display in Settings. */
const VOICE_LABEL: Record<string, string> = {
  vi: 'HoaiMy (Microsoft Neural)',
  en: 'Jenny (Microsoft Neural)',
};

const queue: Queued[] = [];
let speaking: { priority: VoicePriority } | null = null;
let last: Queued | null = null;
let settings = { lang: 'en-US', volume: 1 };
let startAfter = 0;
/** Identifies the line in flight, so the end event of a cancelled one is ignored. */
let token = 0;
let currentAudio: HTMLAudioElement | null = null;
let waitedForVoices = false;

const engine = (): SpeechSynthesis | null =>
  typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined' ? null : speechSynthesis;

const shortLang = (lang: string): string => lang.slice(0, 2).toLowerCase();

/** True when lines can be played at all (audio files, or the speech engine as a fallback). */
export function voiceSupported(): boolean {
  return typeof Audio !== 'undefined' || engine() !== null;
}

/** Name of the voice used for a language, for Settings. */
export function voiceLabelFor(lang: string): string | null {
  return VOICE_LABEL[shortLang(lang)] ?? null;
}

/** Every line that has a file, so they can be fetched ahead of time. */
const LINE_IDS = [
  'sample', 'V01', 'V03', 'V04', 'V05', 'V05b', 'V06', 'V06a', 'V07', 'V08',
  'V09', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18',
];

export function configureVoice(next: { lang: string; volume: number }): void {
  settings = { lang: next.lang, volume: Math.min(1, Math.max(0, next.volume / 100)) };
  preloadVoice(next.lang, LINE_IDS);
}

// ------------------------------------------------------------ audio files

const clips = new Map<string, Promise<string | null>>();

const clipUrl = (lang: string, id: string): string => `${import.meta.env.BASE_URL}voice/${shortLang(lang)}/${id}.mp3`;

/**
 * Fetches a clip once and keeps it as a local blob. Plain fetch (not a streaming
 * media URL) so it works the same in every browser. Null when it cannot be had.
 */
function loadClip(lang: string, id: string): Promise<string | null> {
  const url = clipUrl(lang, id);
  let clip = clips.get(url);
  if (!clip) {
    clip = fetch(url)
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error('missing'))))
      .then((blob) => URL.createObjectURL(blob))
      .catch(() => null);
    clips.set(url, clip);
  }
  return clip;
}

/** Starts fetching every line for a language so the first one plays without delay. */
export function preloadVoice(lang: string, ids: readonly string[]): void {
  for (const id of ids) void loadClip(lang, id);
}

// -------------------------------------------------------------- fallback

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const wanted = lang.toLowerCase().replace('_', '-');
  const prefix = wanted.slice(0, 2);
  const norm = (v: SpeechSynthesisVoice): string => v.lang.toLowerCase().replace('_', '-');
  const score = (v: SpeechSynthesisVoice): number => (norm(v) === wanted ? 2 : 0) + (v.localService ? 1 : 0);
  return voices.filter((v) => norm(v).startsWith(prefix)).sort((a, b) => score(b) - score(a))[0];
}

/** Last resort: the browser's own voice. Quality depends on what the device has installed. */
function speakWithEngine(line: Queued, done: () => void): void {
  const s = engine();
  if (!s) return done();
  if (s.getVoices().length === 0 && !waitedForVoices) {
    // The voice list loads a moment after the page; look again shortly.
    waitedForVoices = true;
    window.setTimeout(() => speakWithEngine(line, done), 400);
    return;
  }
  const utterance = new SpeechSynthesisUtterance(line.text);
  utterance.lang = line.lang;
  utterance.volume = settings.volume;
  try {
    const voice = pickVoice(s.getVoices(), line.lang);
    if (voice) utterance.voice = voice;
  } catch {
    /* the browser's default voice is used */
  }
  utterance.onend = done;
  utterance.onerror = done;
  try {
    // Chrome can leave the engine paused after a cancel or a hidden tab.
    if (s.paused) s.resume();
    s.speak(utterance);
  } catch {
    done();
  }
}

// ----------------------------------------------------------------- queue

/** Stops whatever is playing and ignores its end event. */
function halt(): void {
  token++;
  speaking = null;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  engine()?.cancel();
}

function speakNext(): void {
  if (speaking || document.hidden) return;
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

  const mine = ++token;
  const done = (): void => {
    if (token !== mine) return;
    speaking = null;
    currentAudio = null;
    speakNext();
  };
  speaking = { priority: line.priority };
  last = line;

  void loadClip(line.lang, line.id).then((src) => {
    if (token !== mine) return;
    if (!src) return speakWithEngine(line, done);
    const audio = new Audio(src);
    audio.volume = settings.volume;
    currentAudio = audio;
    audio.onended = done;
    audio.onerror = () => {
      if (token === mine) speakWithEngine(line, done);
    };
    // Playing can be refused (no tap yet); fall back, and the text is shown either way.
    audio.play().catch(() => (token === mine ? speakWithEngine(line, done) : undefined));
  });
}

/**
 * Queues lines. Several arrive together after one server update, so they are
 * spoken one after another, most important first. A top-priority line (time out,
 * you are out, game over) cuts off a low-priority line that is still speaking.
 * `delayMs` lets a sound effect play first.
 */
export function enqueueVoice(lines: readonly VoiceLine[], delayMs = 0): void {
  if (document.hidden || !voiceSupported()) return;
  const now = Date.now();
  if (delayMs > 0) startAfter = Math.max(startAfter, now + delayMs);
  for (const line of lines) queue.push({ ...line, at: now, lang: settings.lang });
  if (speaking && speaking.priority === 0 && lines.some((l) => l.priority === 2)) halt();
  speakNext();
}

/** Says the last line again. Returns false if there is nothing to repeat. */
export function replayLastVoice(): boolean {
  if (!last || !voiceSupported()) return false;
  halt();
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
  halt();
  queue.length = 0;
}
