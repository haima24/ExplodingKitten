// Release check (US-064): every English catalog key must have a Vietnamese value,
// and the Vietnamese catalog must not contain keys that English does not have.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/copy/', import.meta.url));
const keys = (file) => [...readFileSync(dir + file, 'utf8').matchAll(/^ {2}'([^']+)':/gm)].map((m) => m[1]);

const en = keys('en.ts');
const vi = new Set(keys('vi.ts'));
const missing = en.filter((key) => !vi.has(key));
const known = new Set(en);
const extra = [...vi].filter((key) => !known.has(key));

// Every spoken line needs a pre-rendered file in both languages (scripts/generate-voice.py).
const publicDir = fileURLToPath(new URL('../public/voice/', import.meta.url));
const noAudio = [];
for (const key of en.filter((k) => /^voice\.(V\d+[a-z]?|sample)$/.test(k))) {
  for (const lang of ['en', 'vi']) {
    if (!existsSync(`${publicDir}${lang}/${key.slice(6)}.mp3`)) noAudio.push(`${lang}/${key.slice(6)}.mp3`);
  }
}
if (noAudio.length > 0) {
  console.error(`Missing voice files (run scripts/generate-voice.py):\n  ${noAudio.join('\n  ')}`);
  process.exit(1);
}

if (missing.length > 0 || extra.length > 0) {
  if (missing.length > 0) console.error(`Missing in vi.ts (${missing.length}):\n  ${missing.join('\n  ')}`);
  if (extra.length > 0) console.error(`Not in en.ts (${extra.length}):\n  ${extra.join('\n  ')}`);
  process.exit(1);
}
console.log(`copy check: ${en.length} keys, English and Vietnamese match`);
