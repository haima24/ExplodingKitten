// Card catalog: data only, safe for the client to import (`@wb/engine/cards`).
import type { CardKind, DeckProfileName } from './types';

export type CardType = 'action' | 'special' | 'cat';

export interface CardInfo {
  kind: CardKind;
  name: string;
  /** Effect text, at most 12 words. */
  effect: string;
  playable: boolean;
  /** Friendly reason shown when the card cannot be played. */
  notPlayableReason?: string;
  type: CardType;
  /** Lowest deck profile that contains this card. */
  profile: DeckProfileName;
}

export const CARD_KINDS: readonly CardKind[] = [
  'BOOM_CAT',
  'TREAT',
  'HOP_OVER',
  'PEEK',
  'SHAKE_UP',
  'COZY_CAT',
  'PASS_IT_ON',
  'ASK_A_FRIEND',
];

export const CARD_CATALOG: Record<CardKind, CardInfo> = {
  BOOM_CAT: {
    kind: 'BOOM_CAT',
    name: 'Boom Cat',
    effect: "Draw one and you're out, unless you have a Treat.",
    playable: false,
    notPlayableReason: 'Boom Cats pop up when you draw. You cannot play them.',
    type: 'special',
    profile: 'mvp',
  },
  TREAT: {
    kind: 'TREAT',
    name: 'Treat',
    effect: 'Calms a Boom Cat so you can stay in.',
    playable: false,
    notPlayableReason: 'Treats save you automatically when a Boom Cat shows up.',
    type: 'special',
    profile: 'mvp',
  },
  HOP_OVER: {
    kind: 'HOP_OVER',
    name: 'Hop Over',
    effect: 'Skip your draw and end your turn.',
    playable: true,
    type: 'action',
    profile: 'mvp',
  },
  PEEK: {
    kind: 'PEEK',
    name: 'Peek',
    effect: 'Secretly look at the top 3 cards.',
    playable: true,
    type: 'action',
    profile: 'mvp',
  },
  SHAKE_UP: {
    kind: 'SHAKE_UP',
    name: 'Shake Up',
    effect: 'Shuffle the draw pile.',
    playable: true,
    type: 'action',
    profile: 'mvp',
  },
  COZY_CAT: {
    kind: 'COZY_CAT',
    name: 'Cozy Cat',
    effect: 'Just likes to cuddle. No effect.',
    // Open question OQ-06: flip this one flag to make Cozy Cats playable.
    playable: false,
    notPlayableReason: 'Cozy Cats just like to cuddle. Pick another card!',
    type: 'cat',
    profile: 'mvp',
  },
  PASS_IT_ON: {
    kind: 'PASS_IT_ON',
    name: 'Pass It On',
    effect: 'Skip your draw. Next player takes 2 turns.',
    playable: true,
    type: 'action',
    profile: 'mvp+should',
  },
  ASK_A_FRIEND: {
    kind: 'ASK_A_FRIEND',
    name: 'Ask a Friend',
    effect: 'Pick a player. They give you a card.',
    playable: true,
    type: 'action',
    profile: 'mvp+should',
  },
};

/** Kinds listed in the guide for a deck profile. */
export function kindsForProfile(profile: DeckProfileName): CardKind[] {
  return CARD_KINDS.filter((k) => profile === 'mvp+should' || CARD_CATALOG[k].profile === 'mvp');
}
