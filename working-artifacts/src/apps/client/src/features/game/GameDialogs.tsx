import { useState } from 'react';
import { CARD_CATALOG } from '@wb/engine/cards';
import type { Card as CardData, InsertPosition } from '@wb/engine/types';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import { Choice } from '../../components/common/Choice';
import c from '../../components/common/common.module.css';
import f from '../../components/common/forms.module.css';
import { Modal } from '../../components/common/Modal';
import { useStore } from '../../net/context';
import { Card } from './Card';
import { nameOf } from './selectors';
import { useGameActions } from './useGameActions';
import g from './game.module.css';

/** Forced choice: "Uh-oh, a Boom Cat!" Escape and backdrop do nothing. */
export function BoomDialog(): JSX.Element {
  const { state } = useStore();
  const { spendTreat } = useGameActions();
  const pending = state.ui.pendingActionId !== null;
  return (
    <Modal
      title={t('boom.title')}
      dismissible={false}
      role="alertdialog"
      narrow
      announce={`${t('boom.title')} ${t('boom.body')}`}
    >
      <div className={g['dialogArt']} aria-hidden="true">
        🙀
      </div>
      <p>{t('boom.body')}</p>
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus loading={pending} onClick={() => void spendTreat()}>
          🐟 {t('boom.useTreat')}
        </Button>
      </div>
    </Modal>
  );
}

const POSITIONS: InsertPosition[] = ['TOP', 'MIDDLE', 'BOTTOM', 'RANDOM'];

/** Where to tuck the Boom Cat. Random is preselected, so a choice is always made. */
export function ReinsertPicker(): JSX.Element {
  const { state } = useStore();
  const { reinsert } = useGameActions();
  const [position, setPosition] = useState<InsertPosition>('RANDOM');
  const pending = state.ui.pendingActionId !== null;
  return (
    <Modal title={t('reinsert.title')} dismissible={false} narrow announce={t('reinsert.prompt')}>
      <fieldset className={f['fieldset']}>
        <legend className={f['label']}>{t('reinsert.prompt')}</legend>
        <div className={f['stackChoices']}>
          {POSITIONS.map((p) => (
            <Choice
              key={p}
              name="position"
              value={p}
              checked={position === p}
              onChange={() => setPosition(p)}
              hint={t(`reinsert.${p}.desc` as const)}
            >
              {t(`reinsert.${p}` as const)}
            </Choice>
          ))}
        </div>
      </fieldset>
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus loading={pending} onClick={() => void reinsert(position)}>
          {t('reinsert.confirm')}
        </Button>
      </div>
    </Modal>
  );
}

/** Ask a Friend, target side: pick one of your own cards to give. */
export function FavorPickDialog(): JSX.Element | null {
  const { state } = useStore();
  const { pickFavor } = useGameActions();
  const view = state.game.view;
  if (!view || view.decision?.kind !== 'FAVOR_PICK') return null;
  const requester = nameOf(state.room.view, view.decision.requesterId);
  return (
    <Modal
      title={t('favorPick.title', { name: requester })}
      dismissible={false}
      announce={`${t('favorPick.title', { name: requester })}. ${t('favorPick.prompt')}`}
    >
      <p>{t('favorPick.prompt')}</p>
      <ul className={g['favorHand']}>
        {view.you.hand.map((card) => (
          <li key={card.id}>
            <Card kind={card.kind} onSelect={() => void pickFavor(card.id)} />
          </li>
        ))}
      </ul>
    </Modal>
  );
}

/** Not a forced choice: "Oh no, a Boom Cat popped!" Kind wording, never "you lost". */
export function NapDialog(): JSX.Element {
  const { state, dispatch } = useStore();
  const name = nameOf(state.room.view, state.game.view?.you.id);
  const close = (): void => dispatch({ type: 'ui/nap', on: false });
  return (
    <Modal
      title={t('nap.title')}
      onClose={close}
      narrow
      announce={`${t('nap.title')} ${t('nap.body', { name })}`}
    >
      <div className={g['dialogArt']} aria-hidden="true">
        😴
      </div>
      <p>{t('nap.body', { name })}</p>
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus onClick={close}>
          {t('nap.ok')}
        </Button>
      </div>
    </Modal>
  );
}

/** Private Peek result: held in memory only and cleared on close. */
export function PeekOverlay({ cards }: { cards: CardData[] }): JSX.Element {
  const { dispatch } = useStore();
  const close = (): void => dispatch({ type: 'ui/peek', cards: null });
  const labels = [t('peek.top'), t('peek.second'), t('peek.third')];
  const reading = cards.map((card, i) => `${labels[i] ?? ''}: ${CARD_CATALOG[card.kind].name}`).join('. ');
  return (
    <Modal title={t('peek.title')} onClose={close} announce={`${t('peek.title')} ${reading}`}>
      {cards.length === 0 ? (
        <p>{t('peek.empty')}</p>
      ) : (
        <ol className={g['peekRow']}>
          {cards.map((card, index) => (
            <li key={card.id} className={g['peekItem']}>
              <span>{labels[index]}</span>
              <Card kind={card.kind} />
            </li>
          ))}
        </ol>
      )}
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus onClick={close}>
          {t('peek.hide')}
        </Button>
      </div>
    </Modal>
  );
}
