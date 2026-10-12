import { CARD_CATALOG } from '@wb/engine/cards';
import { t } from '../../copy';
import { useStore } from '../../net/context';
import { Card, CardBack } from './Card';
import { selectCanAct } from './selectors';
import { useGameActions } from './useGameActions';
import g from './game.module.css';

export function Piles({ shuffling }: { shuffling: boolean }): JSX.Element | null {
  const { state } = useStore();
  const { draw } = useGameActions();
  const view = state.game.view;
  if (!view) return null;

  const canAct = selectCanAct(state);
  const drawLabel = t('piles.draw', { n: view.drawCount });
  const top = view.discardPile[0];

  return (
    <>
      <div className={g['pile']}>
        {canAct ? (
          <button
            type="button"
            className={`${g['pileButton']} ${shuffling ? g['shuffle'] : ''}`}
            aria-label={`${drawLabel}. ${t('action.draw')}`}
            onClick={() => void draw()}
          >
            <CardBack count={view.drawCount} />
          </button>
        ) : (
          <span
            className={`${g['pileDimmed']} ${shuffling ? g['shuffle'] : ''}`}
            role="img"
            aria-label={drawLabel}
          >
            <CardBack count={view.drawCount} />
          </span>
        )}
        <span className={g['pileLabel']} aria-hidden="true">
          {t('piles.drawTitle')} · {t('piles.count', { n: view.drawCount })}
        </span>
      </div>

      <div className={g['pile']}>
        {top ? (
          <div role="group" aria-label={t('piles.discard', { name: CARD_CATALOG[top.kind].name })}>
            <Card kind={top.kind} />
          </div>
        ) : (
          <div className={g['emptyDiscard']} role="img" aria-label={t('piles.discardEmptyLabel')}>
            {t('piles.discardEmpty')}
          </div>
        )}
        <span className={g['pileLabel']} aria-hidden="true">
          {t('piles.discardTitle')}
        </span>
      </div>
    </>
  );
}
