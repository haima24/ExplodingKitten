// Optional sound effects, synthesised with the Web Audio API (no audio files, so
// nothing is downloaded). This module is imported lazily and only when the sound
// setting is on, so nothing is created while sound is off. Every sound has a
// visible or textual equivalent already (US-052, US-063).

export type SoundName =
  | 'draw'
  | 'play'
  | 'boom'
  | 'nap'
  | 'win'
  | 'defuse'
  | 'skip'
  | 'future'
  | 'shuffle'
  | 'cat'
  | 'attack'
  | 'favor'
  | 'nope'
  | 'fizzle'
  | 'warn'
  | 'timeout'
  | 'tick'
  | 'flip'
  | 'fuse';

/** A pitched tone. `endFreq` glides the pitch; `gain` is relative (default 1). */
interface Tone {
  freq: number;
  endFreq?: number;
  start: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
}

/** Filtered noise: clicks, whooshes and smacks. The filter sweeps from `from` to `to`. */
interface Noise {
  noise: true;
  start: number;
  dur: number;
  filter: BiquadFilterType;
  from: number;
  to?: number;
  q?: number;
  gain?: number;
}

type Part = Tone | Noise;

const tone = (freq: number, start: number, dur: number, extra: Partial<Tone> = {}): Tone => ({
  freq,
  start,
  dur,
  ...extra,
});
const noise = (
  start: number,
  dur: number,
  filter: BiquadFilterType,
  from: number,
  extra: Partial<Noise> = {},
): Noise => ({ noise: true, start, dur, filter, from, ...extra });

// One distinct sound per card (US-063 §6.2), plus the existing generic ones.
const SOUNDS: Record<SoundName, Part[]> = {
  draw: [tone(660, 0, 0.08)],
  play: [tone(440, 0, 0.07), tone(587, 0.07, 0.09)],
  // Mèo nổ (Exploding Kitten): a rising yowl, then a big blast with a rumble (US-068).
  boom: [
    tone(300, 0, 0.28, { endFreq: 850, type: 'sawtooth', gain: 0.8 }),
    tone(850, 0.28, 0.25, { endFreq: 250, type: 'sawtooth', gain: 0.8 }),
    noise(0.5, 0.65, 'lowpass', 2200, { to: 120, gain: 3 }),
    noise(0.5, 0.2, 'highpass', 1800, { gain: 1.6 }),
    tone(75, 0.5, 0.55, { endFreq: 38, type: 'square', gain: 1.2 }),
  ],
  nap: [tone(392, 0, 0.15), tone(330, 0.15, 0.15), tone(262, 0.3, 0.25)],
  win: [tone(523, 0, 0.12), tone(659, 0.12, 0.12), tone(784, 0.24, 0.12), tone(1047, 0.36, 0.3)],
  // Defuse: two snips and a relieved chime.
  defuse: [
    noise(0, 0.05, 'highpass', 3500, { gain: 1.5 }),
    noise(0.12, 0.05, 'highpass', 3500, { gain: 1.5 }),
    tone(784, 0.26, 0.14),
    tone(1175, 0.4, 0.3),
  ],
  // Qua lượt (Skip): a fast "pass-on" swish that ends in a soft "next" tick (US-068).
  skip: [
    noise(0, 0.22, 'bandpass', 350, { to: 3200, q: 2, gain: 1.6 }),
    tone(1250, 0.2, 0.04, { gain: 0.6 }),
    tone(940, 0.27, 0.06, { gain: 0.45 }),
  ],
  // See the Future: mysterious. Slow rising shimmer with a pair of detuned tones and echoing pings.
  future: [
    tone(220, 0, 1.0, { endFreq: 523, gain: 0.55 }),
    tone(227, 0, 1.0, { endFreq: 531, gain: 0.55 }),
    tone(1320, 0.35, 0.22, { gain: 0.5 }),
    tone(1760, 0.55, 0.22, { gain: 0.35 }),
    tone(1320, 0.8, 0.3, { gain: 0.22 }),
  ],
  // Shuffle: a rapid riffle of tiny clicks.
  shuffle: Array.from({ length: 9 }, (_, i) => noise(i * 0.045, 0.03, 'highpass', 2200 + (i % 3) * 600, { gain: 1.2 })),
  // Cat card: a soft purr (reserved until Cat cards are playable).
  cat: Array.from({ length: 10 }, (_, i) => tone(85, i * 0.05, 0.05, { type: 'sawtooth', gain: 0.5 })),
  // Tấn công (Attack): a sharp whoosh, a heavy strike and a short echo (US-068).
  attack: [
    noise(0, 0.16, 'bandpass', 500, { to: 2800, q: 1.5, gain: 1.4 }),
    noise(0.15, 0.09, 'highpass', 1200, { gain: 2.6 }),
    tone(130, 0.15, 0.2, { endFreq: 45, gain: 1.9 }),
    noise(0.15, 0.26, 'lowpass', 1000, { to: 120, gain: 2 }),
    tone(100, 0.34, 0.22, { endFreq: 60, gain: 0.5 }),
  ],
  // Thiện ý (Favor): a warm, kind chime of two rising notes (US-068).
  favor: [
    tone(587, 0, 0.3, { gain: 0.85 }),
    tone(1175, 0, 0.3, { gain: 0.2 }),
    tone(880, 0.16, 0.45, { gain: 0.75 }),
    tone(1760, 0.16, 0.45, { gain: 0.18 }),
  ],
  // Nope: a firm "uh-uh" buzzer.
  nope: [tone(150, 0, 0.16, { type: 'square' }), tone(115, 0.21, 0.24, { type: 'square' })],
  // A card that was stopped fizzles out.
  fizzle: [noise(0, 0.3, 'lowpass', 2400, { to: 150, gain: 1.4 })],
  // Turn timer: a double beep (5 s left) and a falling "time's up".
  warn: [tone(880, 0, 0.08), tone(880, 0.15, 0.08)],
  // Bomb fuse sizzle before the blast (US-069): a hiss with a few crackles, about one second.
  fuse: [
    noise(0, 1.0, 'bandpass', 3500, { to: 5500, q: 1.2, gain: 0.8 }),
    noise(0.12, 0.04, 'highpass', 4000, { gain: 1.8 }),
    noise(0.38, 0.04, 'highpass', 4500, { gain: 1.8 }),
    noise(0.6, 0.05, 'highpass', 4000, { gain: 2 }),
    noise(0.82, 0.05, 'highpass', 5000, { gain: 2.2 }),
  ],
  // Fan: a soft tick as the highlight moves, and a flip when the card is taken (US-066).
  tick: [tone(1250, 0, 0.03, { gain: 0.5 })],
  flip: [noise(0, 0.07, 'highpass', 2600, { gain: 1.4 }), tone(700, 0, 0.12, { endFreq: 1150, type: 'triangle' })],
  timeout: [tone(440, 0, 0.1, { type: 'triangle' }), tone(330, 0.12, 0.1, { type: 'triangle' }), tone(196, 0.24, 0.25, { type: 'triangle' })],
};

/** Length of a sound in seconds, used to line several sounds up one after another. */
export function soundLength(name: SoundName): number {
  return Math.max(...SOUNDS[name].map((p) => p.start + p.dur));
}

let context: AudioContext | null = null;
let master: GainNode | null = null;
let level = 0.4;
const watchers = new Set<(blocked: boolean) => void>();

function ctx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = level;
    master.connect(context.destination);
    context.addEventListener('statechange', () => notify());
  }
  return context;
}

const blocked = (): boolean => context !== null && context.state !== 'running';
function notify(): void {
  for (const watcher of watchers) watcher(blocked());
}

/** Volume as a percentage, 0 to 100. */
export function setVolume(percent: number): void {
  level = Math.min(1, Math.max(0, percent / 100));
  if (master) master.gain.value = level;
}

/** Call from a user gesture (turning sound on, any tap) to satisfy autoplay rules. */
export async function unlockAudio(): Promise<void> {
  const c = ctx();
  if (c && c.state === 'suspended') await c.resume();
  notify();
}

/**
 * Reports whether the browser is blocking audio (waiting for a tap). Creates the
 * audio context so the state can be read, and returns an unsubscribe function.
 */
export function watchAudio(callback: (blocked: boolean) => void): () => void {
  ctx();
  watchers.add(callback);
  callback(blocked());
  return () => watchers.delete(callback);
}

let noiseBuffer: AudioBuffer | null = null;
function noiseSource(c: AudioContext): AudioBufferSourceNode {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;
  return source;
}

/** Plays one sound, `delay` seconds from now. Silent when the tab is hidden or audio is blocked. */
export function playSound(name: SoundName, delay = 0): void {
  if (document.hidden) return;
  const c = ctx();
  if (!c || !master || c.state !== 'running') {
    notify();
    return;
  }
  const out = master;
  const now = c.currentTime + delay;
  for (const part of SOUNDS[name]) {
    const t0 = now + part.start;
    const peak = 0.5 * (part.gain ?? 1);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(peak, t0 + Math.min(0.01, part.dur / 2));
    gain.gain.linearRampToValueAtTime(0, t0 + part.dur);
    if ('noise' in part) {
      const filter = c.createBiquadFilter();
      filter.type = part.filter;
      filter.Q.value = part.q ?? 0.7;
      filter.frequency.setValueAtTime(part.from, t0);
      if (part.to !== undefined) filter.frequency.exponentialRampToValueAtTime(Math.max(20, part.to), t0 + part.dur);
      const source = noiseSource(c);
      source.connect(filter).connect(gain).connect(out);
      source.start(t0);
      source.stop(t0 + part.dur + 0.02);
    } else {
      const osc = c.createOscillator();
      osc.type = part.type ?? 'sine';
      osc.frequency.setValueAtTime(part.freq, t0);
      if (part.endFreq !== undefined) osc.frequency.linearRampToValueAtTime(part.endFreq, t0 + part.dur);
      osc.connect(gain).connect(out);
      osc.start(t0);
      osc.stop(t0 + part.dur + 0.02);
    }
  }
}

/** Plays up to three sounds one after another (for events that arrive together). Returns the total length in seconds. */
export function playSequence(names: readonly SoundName[]): number {
  let at = 0;
  for (const name of names.slice(0, 3)) {
    playSound(name, at);
    at += soundLength(name) + 0.05;
  }
  return at;
}
