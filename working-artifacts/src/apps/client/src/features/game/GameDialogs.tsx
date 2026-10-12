import { useEffect, useState } from 'react';
import type { Card as CardData, InsertPosition } from '@wb/engine/types';
import { t } from '../../copy';
import { cardName } from '../../copy/cards';
import { Button } from '../../components/common/Button';
import { Choice } from '../../components/common/Choice';
import c from '../../components/common/common.module.css';
import f from '../../components/common/forms.module.css';
import { Modal } from '../../components/common/Modal';
import { useStore } from '../../net/context';
import { CardIcon } from './art/CardIcon';
import { Card } from './Card';
import { CountdownText } from './TurnClock';
import { nameOf } from './selectors';
import { useGameActions } from './useGameActions';
import g from './game.module.css';

/** Forced choice: "Uh-oh, an Exploding Kitten!" Escape and backdrop do nothing. */
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
        <CardIcon kind="BOOM_CAT" size={96} />
      </div>
      <p>{t('boom.body')}</p>
      <CountdownText />
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus loading={pending} onClick={() => void spendTreat()}>
          {t('boom.useTreat')}
        </Button>
      </div>
    </Modal>
  );
}

const POSITIONS: InsertPosition[] = ['TOP', 'MIDDLE', 'BOTTOM', 'RANDOM'];

/** Where to tuck the Exploding Kitten. Random is preselected, so a choice is always made. */
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
      <CountdownText />
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus loading={pending} onClick={() => void reinsert(position)}>
          {t('reinsert.confirm')}
        </Button>
      </div>
    </Modal>
  );
}

/** Favor, target side: pick one of your own cards to give. */
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
      <CountdownText />
      <ul className={g['favorHand']}>
        {view.you.hand.map((card) => (
          <li key={card.id}>
            <Card kind={card.kind} variant={card.variant} onSelect={() => void pickFavor(card.id)} />
          </li>
        ))}
      </ul>
    </Modal>
  );
}

/**
 * Someone played an action card and you hold a Nope. Play it to stop the card
 * (or flip a Nope back), or let it go. Escape means "let it go"; the server also
 * lets the window time out.
 */
export function NopeDialog(): JSX.Element | null {
  const { state } = useStore();
  const { nope, passNope } = useGameActions();
  const [now, setNow] = useState(() => Date.now());
  const view = state.game.view;
  const decision = view?.decision;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  if (!view || decision?.kind !== 'NOPE_WINDOW') return null;
  const pending = state.ui.pendingActionId !== null;
  const actor = nameOf(state.room.view, decision.actorId);
  const card = cardName(decision.cardKind);
  const seconds =
    view.nopeDeadlineAt === undefined
      ? null
      : Math.max(0, Math.ceil((view.nopeDeadlineAt - (now + state.connection.offset)) / 1000));
  const body = t('nope.body', { name: actor, card });
  const ask = decision.nopes > 0 ? t('nope.chain') : t('nope.ask');

  return (
    <Modal
      title={t('nope.title')}
      narrow
      announce={`${t('nope.title')} ${body} ${ask}`}
      onClose={() => void passNope()}
    >
      <div className={g['dialogArt']} aria-hidden="true">
        <CardIcon kind="NOPE" size={96} />
      </div>
      <p>{body}</p>
      <p>{ask}</p>
      {seconds !== null ? <p role="timer">{t('nope.seconds', { n: seconds })}</p> : null}
      <div className={c['dialogActions']}>
        <Button variant="primary" data-autofocus loading={pending} onClick={() => void nope()}>
          ✋ {t('nope.play')}
        </Button>
        <Button onClick={() => void passNope()}>{t('nope.pass')}</Button>
      </div>
    </Modal>
  );
}

/** Not a forced choice: "Oh no, an Exploding Kitten popped!" Kind wording, never "you lost". */
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
        <CardIcon kind="COZY_CAT" size={96} />
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

/** Private See the Future result: held in memory only and cleared on close. */
export function PeekOverlay({ cards }: { cards: CardData[] }): JSX.Element {
  const { dispatch } = useStore();
  const close = (): void => dispatch({ type: 'ui/peek', cards: null });
  const labels = [t('peek.top'), t('peek.second'), t('peek.third')];
  const reading = cards.map((card, i) => `${labels[i] ?? ''}: ${cardName(card.kind, card.variant)}`).join('. ');
  return (
    <Modal title={t('peek.title')} onClose={close} announce={`${t('peek.title')} ${reading}`}>
      {cards.length === 0 ? (
        <p>{t('peek.empty')}</p>
      ) : (
        <ol className={g['peekRow']}>
          {cards.map((card, index) => (
            <li key={card.id} className={g['peekItem']}>
              <span>{labels[index]}</span>
              <Card kind={card.kind} variant={card.variant} />
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
