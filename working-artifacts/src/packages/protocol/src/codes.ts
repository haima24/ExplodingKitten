/** 30 symbols: no 0 O 1 I L U. */
export const ROOM_CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
export const ROOM_CODE_LENGTH = 6;

const CODE_RE = new RegExp(`^[${ROOM_CODE_ALPHABET}]{${ROOM_CODE_LENGTH}}$`);

/** Uppercase and strip spaces and hyphens. Characters are not auto-corrected. */
export function normaliseCode(raw: string): string {
  return raw.toUpperCase().replace(/[\s-]+/g, '');
}

export function isValidCode(code: string): boolean {
  return CODE_RE.test(code);
}

/** Returns the normalised code, or null when it has the wrong shape. */
export function parseCode(raw: string): string | null {
  const code = normaliseCode(raw);
  return isValidCode(code) ? code : null;
}
