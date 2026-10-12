// Optional sound effects, synthesised with the Web Audio API (no audio files).
// This module is imported lazily and only when the sound setting is on, so
// nothing is fetched or created while sound is off. Every sound has a visible
// or textual equivalent already.

export type SoundName = 'draw' | 'play' | 'boom' | 'nap' | 'win';

const VOLUME = 0.4;
let context: AudioContext | null = null;

function ctx(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null;
  context ??= new AudioContext();
  return context;
}

/** Call from a user gesture (turning sound on) to satisfy autoplay rules. */
export async function unlockAudio(): Promise<void> {
  const c = ctx();
  if (c && c.state === 'suspended') await c.resume();
}

interface Note {
  freq: number;
  start: number;
  dur: number;
  type?: OscillatorType;
}

const SOUNDS: Record<SoundName, Note[]> = {
  draw: [{ freq: 660, start: 0, dur: 0.08 }],
  play: [
    { freq: 440, start: 0, dur: 0.07 },
    { freq: 587, start: 0.07, dur: 0.09 },
  ],
  boom: [
    { freq: 220, start: 0, dur: 0.12, type: 'square' },
    { freq: 165, start: 0.12, dur: 0.2, type: 'square' },
  ],
  nap: [
    { freq: 392, start: 0, dur: 0.15 },
    { freq: 330, start: 0.15, dur: 0.15 },
    { freq: 262, start: 0.3, dur: 0.25 },
  ],
  win: [
    { freq: 523, start: 0, dur: 0.12 },
    { freq: 659, start: 0.12, dur: 0.12 },
    { freq: 784, start: 0.24, dur: 0.12 },
    { freq: 1047, start: 0.36, dur: 0.3 },
  ],
};

export function playSound(name: SoundName): void {
  if (document.hidden) return;
  const c = ctx();
  if (!c || c.state !== 'running') return;
  const now = c.currentTime;
  for (const note of SOUNDS[name]) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = note.type ?? 'sine';
    osc.frequency.value = note.freq;
    const t0 = now + note.start;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(VOLUME * 0.5, t0 + 0.01);
    gain.gain.linearRampToValueAtTime(0, t0 + note.dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + note.dur + 0.02);
  }
}
