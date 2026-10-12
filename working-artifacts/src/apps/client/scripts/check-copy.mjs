// Release check (US-064): every English catalog key must have a Vietnamese value,
// and the Vietnamese catalog must not contain keys that English does not have.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../src/copy/', import.meta.url));
const keys = (file) => [...readFileSync(dir + file, 'utf8').matchAll(/^ {2}'([^']+)':/gm)].map((m) => m[1]);

const en = keys('en.ts');
const vi = new Set(keys('vi.ts'));
const missing = en.filter((key) => !vi.has(key));
const known = new Set(en);
const extra = [...vi].filter((key) => !known.has(key));

if (missing.length > 0 || extra.length > 0) {
  if (missing.length > 0) console.error(`Missing in vi.ts (${missing.length}):\n  ${missing.join('\n  ')}`);
  if (extra.length > 0) console.error(`Not in en.ts (${extra.length}):\n  ${extra.join('\n  ')}`);
  process.exit(1);
}
console.log(`copy check: ${en.length} keys, English and Vietnamese match`);
