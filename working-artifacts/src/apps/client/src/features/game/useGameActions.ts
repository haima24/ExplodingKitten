import { useCallback } from 'react';
import type { CardKind, InsertPosition } from '@wb/engine/types';
import { messageForError } from '../../copy/errors';
import { useStore } from '../../net/context';
import { nameOf } from './selectors';

/**
 * Sends game actions through the one-in-flight pattern: controls are inert until
 * the server answers, and failures become friendly inline messages (US-040).
 * The client never edits game data itself.
 */
export function useGameActions(): {
  draw: () => Promise<boolean>;
  play: (cardId: string, kind: CardKind, targetId?: string) => Promise<boolean>;
  spendTreat: () => Promise<boolean>;
  reinsert: (position: InsertPosition) => Promise<boolean>;
  pickFavor: (cardId: string) => Promise<boolean>;
  playPair: (cardIds: [string, string], targetId: string) => Promise<boolean>;
  nope: () => Promise<boolean>;
  passNope: () => Promise<boolean>;
} {
  const { state, client } = useStore();
  const view = state.game.view;
  const room = state.room.view;

  const run = useCallback(
    async (
      action: Parameters<typeof client.sendAction>[0],
      cardKind?: CardKind,
    ): Promise<boolean> => {
      const result = await client.sendAction(action);
      if (result.ok) return true;
      if (result.code !== 'BUSY') {
        client.inline(
          messageForError(result.code, {
            currentName: nameOf(room, view?.currentPlayerId),
            ...(cardKind ? { cardKind } : {}),
          }),
        );
      }
      return false;
    },
    [client, room, view?.currentPlayerId],
  );

  return {
    draw: () => run({ type: 'DRAW' }),
    play: (cardId, kind, targetId) =>
      run({ type: 'PLAY_CARD', cardId, ...(targetId ? { targetId } : {}) }, kind),
    spendTreat: () => run({ type: 'USE_TREAT' }),
    reinsert: (position) => run({ type: 'REINSERT_BOOM', position }),
    pickFavor: (cardId) => run({ type: 'PICK_FAVOR_CARD', cardId }),
    playPair: (cardIds, targetId) => run({ type: 'PLAY_PAIR', cardIds, targetId }, 'COZY_CAT'),
    nope: () => run({ type: 'NOPE' }),
    passNope: () => run({ type: 'PASS_NOPE' }),
  };
}
