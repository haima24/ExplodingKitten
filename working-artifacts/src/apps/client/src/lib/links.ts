/** The share link carries only the room code: never a name, id, or token. */
export function buildShareLink(origin: string, code: string): string {
  return `${origin}/join/${code}`;
}

/** "K7M4QX" -> "K, 7, M, 4, Q, X" so screen readers spell it out. */
export function spellCode(code: string): string {
  return code.split('').join(', ');
}
