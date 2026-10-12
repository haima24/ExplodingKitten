// Curated, child-safety-reviewed word lists (placeholders until the OQ-14 content review).

export const ADJECTIVES = [
  'Sleepy',
  'Happy',
  'Sparkly',
  'Fluffy',
  'Brave',
  'Silly',
  'Cozy',
  'Jolly',
  'Bouncy',
  'Cuddly',
  'Sunny',
  'Giggly',
  'Zippy',
  'Snuggly',
  'Clever',
  'Cheery',
  'Gentle',
  'Mighty',
  'Speedy',
  'Wiggly',
  'Dizzy',
  'Perky',
  'Lucky',
  'Merry',
  'Breezy',
  'Fuzzy',
] as const;

export const NOUNS = [
  'Biscuit',
  'Pickle',
  'Muffin',
  'Noodle',
  'Pancake',
  'Waffle',
  'Cupcake',
  'Pudding',
  'Cookie',
  'Bubble',
  'Button',
  'Pebble',
  'Sprout',
  'Pumpkin',
  'Acorn',
  'Marshmallow',
  'Peanut',
  'Dumpling',
  'Toast',
  'Sprinkle',
  'Jellybean',
  'Cricket',
  'Whisker',
  'Mittens',
  'Comet',
  'Pretzel',
] as const;

export const AVATARS = ['biscuit', 'pip', 'marmalade', 'mochi', 'juniper', 'waffles'] as const;
export type AvatarId = (typeof AVATARS)[number];

/** Reserved for bot members (US-023); players can never pick these. */
export const BOT_AVATARS = ['bot-1', 'bot-2', 'bot-3', 'bot-4'] as const;
export const BOT_NAMES: readonly DisplayName[] = [
  { adjective: 'Beepy', noun: 'Buddy' },
  { adjective: 'Boopy', noun: 'Buddy' },
  { adjective: 'Zappy', noun: 'Buddy' },
];

export interface DisplayName {
  adjective: string;
  noun: string;
  suffix?: number;
}

export type IdentityError = 'INVALID_NAME' | 'INVALID_AVATAR';

const isIn = (list: readonly string[], value: unknown): boolean =>
  typeof value === 'string' && list.includes(value);

/** Exact match against the curated lists; no trimming or case tricks. */
export function validateIdentity(input: {
  name: { adjective: unknown; noun: unknown };
  avatarId: unknown;
}): IdentityError | null {
  if (!isIn(ADJECTIVES, input.name.adjective) || !isIn(NOUNS, input.name.noun)) {
    return 'INVALID_NAME';
  }
  if (!isIn(AVATARS, input.avatarId)) return 'INVALID_AVATAR';
  return null;
}

export function formatName(name: DisplayName): string {
  const base = `${name.adjective} ${name.noun}`;
  return name.suffix && name.suffix > 1 ? `${base} ${name.suffix}` : base;
}

export function sameName(a: DisplayName, b: DisplayName): boolean {
  return formatName(a) === formatName(b);
}
