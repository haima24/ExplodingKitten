import { CARD_CATALOG } from '@wb/engine/cards';
import type { CardKind } from '@wb/engine/types';
import { t } from './index';

/** Maps a server or local failure code to friendly, non-blaming wording (US-040). */
export function messageForError(
  code: string,
  context: { currentName?: string; cardKind?: CardKind } = {},
): string {
  switch (code) {
    case 'NOT_PLAYABLE': {
      const reason = context.cardKind ? CARD_CATALOG[context.cardKind].notPlayableReason : undefined;
      return reason ?? t('error.generic');
    }
    case 'NOT_YOUR_TURN':
      return context.currentName
        ? t('error.notYourTurnLate', { name: context.currentName })
        : t('error.generic');
    case 'OFFLINE':
      return t('error.offline');
    case 'TIMEOUT':
      return t('error.timeout');
    case 'NOT_ENOUGH_PLAYERS':
      return t('error.notEnoughPlayers');
    case 'NOT_HOST':
      return t('error.notHost');
    default:
      return t('error.generic');
  }
}

/** Join and create failures have their own wording (US-003, US-006). */
export function joinErrorMessage(code: string): string {
  switch (code) {
    case 'INVALID_CODE':
      return t('join.invalidCode');
    case 'ROOM_NOT_FOUND':
      return t('join.notFound');
    case 'ROOM_FULL':
      return t('join.full');
    case 'GAME_STARTED':
      return t('join.started');
    case 'ROOM_CLOSED':
      return t('join.ended');
    case 'RATE_LIMITED':
      return t('join.rateLimited');
    case 'AVATAR_TAKEN':
      return t('join.avatarTaken');
    case 'TOO_MANY_ROOMS':
      return t('create.tooMany');
    default:
      return t('join.failed');
  }
}
