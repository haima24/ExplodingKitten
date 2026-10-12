import { randomInt } from 'node:crypto';
import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from '@wb/protocol';

export function randomCode(): string {
  let out = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    out += ROOM_CODE_ALPHABET.charAt(randomInt(ROOM_CODE_ALPHABET.length));
  }
  return out;
}

/** Unique among active rooms and tombstones; bounded retries. */
export function generateCode(isTaken: (code: string) => boolean): string | null {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = randomCode();
    if (!isTaken(code)) return code;
  }
  return null;
}
