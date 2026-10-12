import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatName } from '@wb/protocol/shared';
import { t } from '../../copy';
import { useShell } from '../../components/common/AppShell';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { ConfirmDialog, Modal } from '../../components/common/Modal';
import { useStore } from '../../net/context';
import { ActionLog } from './ActionLog';
import { nameOf, selectIsHost } from './selectors';
import g from './game.module.css';

type Confirm = { kind: 'leave' } | { kind: 'end' } | { kind: 'remove'; id: string };

/**
 * Opens over this player's screen only; the game keeps running for everyone and
 * the hand is not rendered while it is open (US-008, US-028).
 */
export function GameMenu({ showLog }: { showLog: boolean }): JSX.Element {
  const { state, dispatch, client } = useStore();
  const navigate = useNavigate();
  const shell = useShell();
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [picking, setPicking] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const view = state.game.view;
  const isHost = selectIsHost(state);
  const myTurn = view !== null && view.phase === 'turn' && view.currentPlayerId === view.you.id;

  const close = (): void => dispatch({ type: 'ui/menu', open: false });
  const others = (state.room.view?.members ?? []).filter(
    (m) => m.playerId !== view?.you.id && m.status === 'ACTIVE' && !m.isBot,
  );

  const leave = async (): Promise<void> => {
    close();
    await client.leaveRoom();
    navigate('/');
  };

  return (
    <>
      <Modal title={t('menu.title')} onClose={close}>
        {myTurn ? (
          <p className={g['yourTurn']} role="status">
            {t('menu.yourTurn')}
          </p>
        ) : null}
        <div className={g['menuList']}>
          <Button variant="primary" block data-autofocus onClick={close}>
            {t('menu.back')}
          </Button>
          {!showLog ? (
            <Button block onClick={() => setLogOpen(true)}>
              {t('menu.log')}
            </Button>
          ) : null}
          <Button
            block
            onClick={() => {
              shell.openRules();
            }}
          >
            {t('menu.rules')}
          </Button>
          <Button block onClick={() => shell.openSettings()}>
            {t('menu.settings')}
          </Button>
          <Button variant="danger" block onClick={() => setConfirm({ kind: 'leave' })}>
            {t('menu.leave')}
          </Button>
          {isHost ? (
            <>
              <Button variant="danger" block onClick={() => setConfirm({ kind: 'end' })}>
                {t('menu.endGame')}
              </Button>
              <Button variant="danger" block onClick={() => setPicking(true)}>
                {t('menu.removePlayer')}
              </Button>
            </>
          ) : null}
        </div>
      </Modal>

      {logOpen ? (
        <Modal title={t('log.title')} onClose={() => setLogOpen(false)}>
          <ActionLog />
          <div className={c['dialogActions']}>
            <Button data-autofocus onClick={() => setLogOpen(false)}>
              {t('rules.close')}
            </Button>
          </div>
        </Modal>
      ) : null}

      {picking ? (
        <Modal title={t('menu.removeWho')} onClose={() => setPicking(false)} narrow>
          <div className={g['menuList']}>
            {others.map((m, index) => (
              <Button
                key={m.playerId}
                block
                {...(index === 0 ? { 'data-autofocus': '' } : {})}
                onClick={() => {
                  setPicking(false);
                  setConfirm({ kind: 'remove', id: m.playerId });
                }}
              >
                {formatName(m.name)}
              </Button>
            ))}
            <Button block onClick={() => setPicking(false)}>
              {t('confirm.remove.cancel')}
            </Button>
          </div>
        </Modal>
      ) : null}

      {confirm?.kind === 'leave' ? (
        <ConfirmDialog
          title={t('confirm.leave.title')}
          body={t('confirm.leave.body')}
          safeLabel={t('confirm.leave.stay')}
          dangerLabel={t('confirm.leave.confirm')}
          onSafe={() => setConfirm(null)}
          onDanger={() => {
            setConfirm(null);
            void leave();
          }}
        />
      ) : null}
      {confirm?.kind === 'end' ? (
        <ConfirmDialog
          title={t('confirm.end.title')}
          body={t('confirm.end.body')}
          safeLabel={t('confirm.end.stay')}
          dangerLabel={t('confirm.end.confirm')}
          onSafe={() => setConfirm(null)}
          onDanger={() => {
            setConfirm(null);
            close();
            void client.command('game.end').catch(() => undefined);
          }}
        />
      ) : null}
      {confirm?.kind === 'remove' ? (
        <ConfirmDialog
          title={t('confirm.remove.title', { name: nameOf(state.room.view, confirm.id) })}
          body={t('confirm.remove.body')}
          safeLabel={t('confirm.remove.cancel')}
          dangerLabel={t('confirm.remove.confirm')}
          onSafe={() => setConfirm(null)}
          onDanger={() => {
            const id = confirm.id;
            setConfirm(null);
            close();
            void client.kick(id).catch(() => undefined);
          }}
        />
      ) : null}
    </>
  );
}
