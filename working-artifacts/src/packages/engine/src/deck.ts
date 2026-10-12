import type { Card, CardKind, DeckProfileName, EngineError } from './types';
import { engineError } from './events';
import { shuffle, type Rng } from './rng';

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

export interface DeckProfile {
  hopOver: number;
  peek: number;
  shakeUp: number;
  cozyDesigns: number;
  cozyPerDesign: number;
  passItOn: number;
  askAFriend: number;
  extraTreats: number;
  startingHandSize: number;
}

/** Tuning data: counts live here, not in the rules. */
export const DECK_PROFILES: Record<DeckProfileName, DeckProfile> = {
  mvp: {
    hopOver: 4,
    peek: 4,
    shakeUp: 4,
    cozyDesigns: 5,
    cozyPerDesign: 3,
    passItOn: 0,
    askAFriend: 0,
    extraTreats: 2,
    startingHandSize: 4,
  },
  'mvp+should': {
    hopOver: 4,
    peek: 4,
    shakeUp: 4,
    cozyDesigns: 5,
    cozyPerDesign: 3,
    passItOn: 4,
    askAFriend: 4,
    extraTreats: 2,
    startingHandSize: 4,
  },
};

export interface Deal {
  hands: Card[][];
  drawPile: Card[];
  totalCards: number;
}

/** Random 32-bit hex ids, unique within a deal. */
function idFactory(rng: Rng): () => string {
  const used = new Set<string>();
  const hex16 = (): string => rng.nextInt(65536).toString(16).padStart(4, '0');
  return () => {
    for (;;) {
      const id = hex16() + hex16();
      if (!used.has(id)) {
        used.add(id);
        return id;
      }
    }
  };
}

export function buildDeal(
  profileName: DeckProfileName,
  playerCount: number,
  rng: Rng,
): { ok: true; deal: Deal } | { ok: false; error: EngineError } {
  const profile = DECK_PROFILES[profileName] as DeckProfile | undefined;
  if (!profile) return { ok: false, error: engineError('INVALID_CONFIG', 'Unknown deck profile') };
  if (!Number.isInteger(playerCount) || playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) {
    return { ok: false, error: engineError('INVALID_CONFIG', 'Player count out of range') };
  }
  const nextId = idFactory(rng);
  const make = (kind: CardKind, variant?: Card['variant']): Card =>
    variant === undefined ? { id: nextId(), kind } : { id: nextId(), kind, variant };

  const plain: Card[] = [];
  const add = (kind: CardKind, n: number): void => {
    for (let i = 0; i < n; i++) plain.push(make(kind));
  };
  add('HOP_OVER', profile.hopOver);
  add('PEEK', profile.peek);
  add('SHAKE_UP', profile.shakeUp);
  add('PASS_IT_ON', profile.passItOn);
  add('ASK_A_FRIEND', profile.askAFriend);
  for (let d = 1; d <= profile.cozyDesigns; d++) {
    for (let i = 0; i < profile.cozyPerDesign; i++) {
      plain.push(make('COZY_CAT', d as 1 | 2 | 3 | 4 | 5));
    }
  }

  if (playerCount - 1 >= playerCount || plain.length < playerCount * profile.startingHandSize) {
    return { ok: false, error: engineError('INVALID_CONFIG', 'Deck cannot cover the deal') };
  }

  const shuffled = shuffle(plain, rng);
  const hands: Card[][] = [];
  for (let p = 0; p < playerCount; p++) {
    hands.push([make('TREAT'), ...shuffled.splice(0, profile.startingHandSize)]);
  }
  const rest: Card[] = shuffled;
  for (let i = 0; i < profile.extraTreats; i++) rest.push(make('TREAT'));
  for (let i = 0; i < playerCount - 1; i++) rest.push(make('BOOM_CAT'));
  const drawPile = shuffle(rest, rng);
  const totalCards = drawPile.length + hands.reduce((n, h) => n + h.length, 0);
  return { ok: true, deal: { hands, drawPile, totalCards } };
}
