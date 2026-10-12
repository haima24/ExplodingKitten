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
  /** Played in response to another player's card (not on your own turn). */
  reaction?: boolean;
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
  'NOPE',
];

export const CARD_CATALOG: Record<CardKind, CardInfo> = {
  BOOM_CAT: {
    kind: 'BOOM_CAT',
    name: 'Exploding Kitten',
    effect: "Draw one and you're out, unless you have a Defuse.",
    playable: false,
    notPlayableReason: 'Exploding Kittens pop up when you draw. You cannot play them.',
    type: 'special',
    profile: 'mvp',
  },
  TREAT: {
    kind: 'TREAT',
    name: 'Defuse',
    effect: 'Calms an Exploding Kitten so you can stay in.',
    playable: false,
    notPlayableReason: 'Defuse cards save you automatically when an Exploding Kitten shows up.',
    type: 'special',
    profile: 'mvp',
  },
  HOP_OVER: {
    kind: 'HOP_OVER',
    name: 'Skip',
    effect: 'Skip your draw and end your turn.',
    playable: true,
    type: 'action',
    profile: 'mvp',
  },
  PEEK: {
    kind: 'PEEK',
    name: 'See the Future',
    effect: 'Secretly look at the top 3 cards.',
    playable: true,
    type: 'action',
    profile: 'mvp',
  },
  SHAKE_UP: {
    kind: 'SHAKE_UP',
    name: 'Shuffle',
    effect: 'Shuffle the draw pile.',
    playable: true,
    type: 'action',
    profile: 'mvp',
  },
  COZY_CAT: {
    kind: 'COZY_CAT',
    name: 'Cat card',
    effect: 'Just likes to cuddle. No effect.',
    // Open question OQ-06: flip this one flag to make Cat cards playable.
    playable: false,
    notPlayableReason: 'Cat cards just like to cuddle. Pick another card!',
    type: 'cat',
    profile: 'mvp',
  },
  PASS_IT_ON: {
    kind: 'PASS_IT_ON',
    name: 'Attack',
    effect: 'Skip your draw. Next player takes 2 turns.',
    playable: true,
    type: 'action',
    profile: 'mvp+should',
  },
  ASK_A_FRIEND: {
    kind: 'ASK_A_FRIEND',
    name: 'Favor',
    effect: 'Pick a player. They give you a card.',
    playable: true,
    type: 'action',
    profile: 'mvp+should',
  },
  NOPE: {
    kind: 'NOPE',
    name: 'Nope',
    effect: "Stop another player's action card. Play it any time.",
    playable: false,
    notPlayableReason: 'Nope is played when another player plays a card. You will get a chance!',
    type: 'action',
    reaction: true,
    profile: 'mvp+should',
  },
};

/** Kinds listed in the guide for a deck profile. */
export function kindsForProfile(profile: DeckProfileName): CardKind[] {
  return CARD_KINDS.filter((k) => profile === 'mvp+should' || CARD_CATALOG[k].profile === 'mvp');
}
