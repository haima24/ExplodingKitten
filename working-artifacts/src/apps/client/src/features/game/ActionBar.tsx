import { useEffect, useState } from 'react';
import { CARD_CATALOG } from '@wb/engine/cards';
import { formatName } from '@wb/protocol/shared';
import { t } from '../../copy';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { InlineMessage } from '../../components/common/Feedback';
import { Modal } from '../../components/common/Modal';
import { useStore } from '../../net/context';
import { CardArt } from './Card';
import { nameOf, selectCanAct } from './selectors';
import { useGameActions } from './useGameActions';
import g from './game.module.css';

/** Name, art, effect, and whether the card can be played now (US-011, US-030). */
function CardDetailPanel({ kind }: { kind: keyof typeof CARD_CATALOG }): JSX.Element {
  const info = CARD_CATALOG[kind];
  return (
    <div className={g['detail']} role="region" aria-label={info.name}>
      <span className={g['detailArt']}>
        <CardArt kind={kind} />
      </span>
      <span className={g['detailText']}>
        <span className={g['detailHead']}>
          <span className={g['detailName']}>{info.name}</span>
          <span className={g['detailStatus']}>
            {info.playable ? `✔ ${t('detail.playable')}` : `zzz ${t('detail.notPlayableShort')}`}
          </span>
        </span>
        <span className={g['detailEffect']}>
          {info.playable ? info.effect : (info.notPlayableReason ?? info.effect)}
        </span>
      </span>
    </div>
  );
}

/** Ask a Friend: large avatar buttons for valid targets only. */
function TargetPicker({
  onPick,
  onCancel,
}: {
  onPick: (playerId: string) => void;
  onCancel: () => void;
}): JSX.Element {
  const { state } = useStore();
  const view = state.game.view;
  const members = state.room.view?.members ?? [];
  const targets = (view?.others ?? []).filter((o) => o.status === 'active' && o.handCount >= 1);
  return (
    <Modal title={t('target.title')} onClose={onCancel} narrow>
      <p>{t('target.prompt')}</p>
      <div className={g['targets']}>
        {targets.map((o, index) => {
          const m = members.find((x) => x.playerId === o.id);
          const name = m ? formatName(m.name) : 'Someone';
          return (
            <button
              key={o.id}
              type="button"
              className={g['target']}
              onClick={() => onPick(o.id)}
              {...(index === 0 ? { 'data-autofocus': '' } : {})}
            >
              <Avatar avatarId={m?.avatarId ?? 'biscuit'} size={56} />
              <span>{name}</span>
            </button>
          );
        })}
      </div>
      <div className={c['dialogActions']}>
        <Button onClick={onCancel}>{t('target.cancel')}</Button>
      </div>
    </Modal>
  );
}

export function ActionBar(): JSX.Element | null {
  const { state, dispatch, client } = useStore();
  const { draw, play } = useGameActions();
  const [picking, setPicking] = useState(false);
  const [slow, setSlow] = useState(false);
  const view = state.game.view;
  const pending = state.ui.pendingActionId !== null;

  // Spinner only if the server has not answered after 1 s.
  useEffect(() => {
    if (!pending) {
      setSlow(false);
      return;
    }
    const timer = window.setTimeout(() => setSlow(true), 1000);
    return () => window.clearTimeout(timer);
  }, [pending]);

  if (!view) return null;

  const canAct = selectCanAct(state);
  const out = view.you.status === 'out';
  const selected = view.you.hand.find((card) => card.id === state.ui.selectedCardId);
  const info = selected ? CARD_CATALOG[selected.kind] : null;
  const currentName = nameOf(state.room.view, view.currentPlayerId);

  // Why the controls are inert, as visible text.
  let reason: string | null = null;
  if (out) reason = t('action.out');
  else if (state.connection.status !== 'online') reason = t('action.reconnecting');
  else if (pending) reason = t('action.sending');
  else if (view.currentPlayerId !== view.you.id || view.phase !== 'turn') {
    reason = t('action.wait', { name: view.waitingFor ? nameOf(state.room.view, view.waitingFor) : currentName });
  }

  const playLabel = selected ? t('action.play', { card: CARD_CATALOG[selected.kind].name }) : t('action.pick');
  const playBlocked = !canAct || !selected || !info?.playable;

  const onPlay = (): void => {
    if (!selected || !info) return;
    if (selected.kind === 'ASK_A_FRIEND') {
      const anyone = view.others.some((o) => o.status === 'active' && o.handCount >= 1);
      if (!anyone) {
        client.inline(t('target.none'));
        return;
      }
      setPicking(true);
      return;
    }
    void play(selected.id, selected.kind);
  };

  const explain = (): void => {
    if (reason) client.inline(reason);
    else if (!selected) client.inline(t('action.pick'));
    else if (info && !info.playable) client.inline(info.notPlayableReason ?? t('error.generic'));
  };

  return (
    <div data-action-bar="" role="group" aria-label={t('action.bar')} style={{ display: 'contents' }}>
      {selected ? <CardDetailPanel kind={selected.kind} /> : null}
      <InlineMessage />
      <div className={g['buttons']}>
        <Button
          variant="primary"
          block
          loading={slow && pending}
          softDisabled={playBlocked}
          onInactiveClick={explain}
          onClick={onPlay}
        >
          {playLabel}
        </Button>
        <Button
          block
          softDisabled={!canAct}
          onInactiveClick={explain}
          onClick={() => void draw()}
        >
          {t('action.draw')}
        </Button>
      </div>
      {reason ? (
        <p className={g['reason']} role="status">
          {reason}
        </p>
      ) : null}

      {picking && selected ? (
        <TargetPicker
          onCancel={() => setPicking(false)}
          onPick={(targetId) => {
            setPicking(false);
            dispatch({ type: 'ui/select', cardId: null });
            void play(selected.id, selected.kind, targetId);
          }}
        />
      ) : null}
    </div>
  );
}
