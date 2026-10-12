import { CARD_CATALOG } from '@wb/engine/cards';
import type { CardKind } from '@wb/engine/types';
import { t, type CopyKey } from './index';
import { getLocale } from './locale';
import { viCards } from './vi';

// The English card text lives in the engine catalog. Other languages override it
// here, so the engine stays language-free and every screen asks this module.

/** Cat cards are told apart by design (US-065), so a card with a design is named by it. */
export function cardName(kind: CardKind, variant?: number): string {
  if (kind === 'COZY_CAT' && variant !== undefined) return t(`cat.${variant}` as CopyKey);
  return (getLocale() === 'vi' ? viCards[kind]?.name : undefined) ?? CARD_CATALOG[kind].name;
}

export function cardEffect(kind: CardKind): string {
  return (getLocale() === 'vi' ? viCards[kind]?.effect : undefined) ?? CARD_CATALOG[kind].effect;
}

export function cardNotPlayableReason(kind: CardKind): string | undefined {
  return (getLocale() === 'vi' ? viCards[kind]?.reason : undefined) ?? CARD_CATALOG[kind].notPlayableReason;
}
