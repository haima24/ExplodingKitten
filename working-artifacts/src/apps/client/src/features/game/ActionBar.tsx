import { useEffect, useState } from 'react';
import { CARD_CATALOG } from '@wb/engine/cards';
import { displayName } from '../../copy/names';
import { t } from '../../copy';
import { cardEffect, cardName, cardNotPlayableReason } from '../../copy/cards';
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
function CardDetailPanel({ kind, variant }: { kind: keyof typeof CARD_CATALOG; variant?: number | undefined }): JSX.Element {
  const info = CARD_CATALOG[kind];
  return (
    <div className={g['detail']} role="region" aria-label={cardName(kind, variant)}>
      <span className={g['detailArt']}>
        <CardArt kind={kind} variant={variant} />
      </span>
      <span className={g['detailText']}>
        <span className={g['detailHead']}>
          <span className={g['detailName']}>{cardName(kind, variant)}</span>
          <span className={g['detailStatus']}>
            {info.playable
              ? `✔ ${t('detail.playable')}`
              : info.reaction
                ? `⚡ ${t('detail.reaction')}`
                : info.pair
                  ? `🐾 ${t('detail.pair')}`
                  : `zzz ${t('detail.notPlayableShort')}`}
          </span>
        </span>
        <span className={g['detailEffect']}>
          {info.playable || info.reaction || info.pair ? cardEffect(kind) : (cardNotPlayableReason(kind) ?? cardEffect(kind))}
        </span>
      </span>
    </div>
  );
}

/** Favor: large avatar buttons for valid targets only. */
function TargetPicker({
  onPick,
  onCancel,
  title = t('target.title'),
  prompt = t('target.prompt'),
}: {
  onPick: (playerId: string) => void;
  onCancel: () => void;
  title?: string;
  prompt?: string;
}): JSX.Element {
  const { state } = useStore();
  const view = state.game.view;
  const members = state.room.view?.members ?? [];
  const targets = (view?.others ?? []).filter((o) => o.status === 'active' && o.handCount >= 1);
  return (
    <Modal title={title} onClose={onCancel} narrow>
      <p>{prompt}</p>
      <div className={g['targets']}>
        {targets.map((o, index) => {
          const m = members.find((x) => x.playerId === o.id);
          const name = m ? displayName(m.name) : t('common.someone');
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
  const { draw, play, playPair } = useGameActions();
  const [picking, setPicking] = useState<'favor' | 'pair' | null>(null);
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
  const pairCard = view.you.hand.find((card) => card.id === state.ui.pairCardId);
  const isPair = selected?.kind === 'COZY_CAT' && pairCard !== undefined;
  const currentName = nameOf(state.room.view, view.currentPlayerId);

  // Why the controls are inert, as visible text.
  let reason: string | null = null;
  if (out) reason = t('action.out');
  else if (state.connection.status !== 'online') reason = t('action.reconnecting');
  else if (pending) reason = t('action.sending');
  else if (view.nopeWindow) reason = t('action.nopeWait');
  else if (view.currentPlayerId !== view.you.id || view.phase !== 'turn') {
    reason = t('action.wait', { name: view.waitingFor ? nameOf(state.room.view, view.waitingFor) : currentName });
  }

  const playLabel = isPair
    ? t('pair.play')
    : selected
      ? t('action.play', { card: cardName(selected.kind, selected.variant) })
      : t('action.pick');
  const playBlocked = !canAct || !selected || (!isPair && !info?.playable);

  const onPlay = (): void => {
    if (!selected || !info) return;
    if (isPair || selected.kind === 'ASK_A_FRIEND') {
      const anyone = view.others.some((o) => o.status === 'active' && o.handCount >= 1);
      if (!anyone) {
        client.inline(t('target.none'));
        return;
      }
      setPicking(isPair ? 'pair' : 'favor');
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
      {selected ? <CardDetailPanel kind={selected.kind} variant={selected.variant} /> : null}
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
          {...(picking === 'pair' ? { title: t('pair.target.title'), prompt: t('pair.target.prompt') } : {})}
          onCancel={() => setPicking(null)}
          onPick={(targetId) => {
            const mode = picking;
            setPicking(null);
            dispatch({ type: 'ui/select', cardId: null });
            if (mode === 'pair' && pairCard) void playPair([selected.id, pairCard.id], targetId);
            else void play(selected.id, selected.kind, targetId);
          }}
        />
      ) : null}
    </div>
  );
}
