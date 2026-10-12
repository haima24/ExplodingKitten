import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatName, type MemberView } from '@wb/protocol/shared';
import { t } from '../../copy';
import { messageForError } from '../../copy/errors';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { ConfirmDialog } from '../../components/common/Modal';
import { ServerError } from '../../net/client';
import { useStore } from '../../net/context';
import { selectIsHost } from '../game/selectors';
import { ShareRoomPanel } from './ShareRoomPanel';
import r from './rooms.module.css';

export function LobbyPage(): JSX.Element | null {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const room = state.room.view;
  const [removing, setRemoving] = useState<MemberView | null>(null);
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  if (!room) return null;

  const isHost = selectIsHost(state);
  const members = room.members.filter((m) => m.status !== 'LEFT');
  const host = room.members.find((m) => m.isHost);
  const canStart = members.length >= 2;
  const full = members.length >= room.capacity;

  const run = async (key: string, action: () => Promise<void>): Promise<void> => {
    setBusy(key);
    setProblem(null);
    try {
      await action();
    } catch (e) {
      setProblem(messageForError(e instanceof ServerError ? e.code : 'TIMEOUT'));
    } finally {
      setBusy(null);
    }
  };

  const leave = async (): Promise<void> => {
    await client.leaveRoom();
    navigate('/');
  };

  return (
    <div className={r['lobby']}>
      <h1 className={r['lobbyFull']}>{isHost ? t('lobby.titleHost') : t('lobby.titlePlayer')}</h1>
      {isHost ? <p className={r['lobbyFull']}>{t('lobby.shareIntro')}</p> : null}

      <ShareRoomPanel room={room} isHost={isHost} />

      <section className={r['panel']} aria-labelledby="players-title">
        <h2 id="players-title">{t('lobby.players', { n: members.length, max: room.capacity })}</h2>
        <ul className={r['players']}>
          {members.map((m) => {
            const name = formatName(m.name);
            return (
              <li key={m.playerId} className={r['player']}>
                <Avatar avatarId={m.avatarId} size={48} />
                <span className={r['playerText']}>
                  <span className={r['playerName']}>{name}</span>
                  <span className={r['playerMeta']}>
                    {m.isHost ? <span className={r['tag']}>★ {t('lobby.host')}</span> : null}
                    {m.isBot ? <span className={r['tag']}>{t('lobby.bot')}</span> : null}
                    {m.playerId === state.session?.playerId ? <span>{t('lobby.you')}</span> : null}
                    {!m.isBot ? (
                      <span>
                        <span aria-hidden="true">{m.connected ? '● ' : '◌ '}</span>
                        {m.connected ? t('lobby.online') : t('lobby.reconnecting')}
                      </span>
                    ) : null}
                  </span>
                </span>
                {isHost && !m.isHost ? (
                  <Button compact aria-label={t('lobby.removeName', { name })} onClick={() => setRemoving(m)}>
                    {t('lobby.remove')}
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
        {!full ? <p className={c['muted']}>{t('lobby.waitingMore')}</p> : null}
      </section>

      <div className={`${r['footer']} ${r['lobbyFull']}`}>
        {isHost ? (
          <>
            <Button
              variant="primary"
              block
              loading={busy === 'start'}
              softDisabled={!canStart}
              aria-describedby={!canStart ? 'start-reason' : undefined}
              onClick={() => void run('start', () => client.command('room.start'))}
            >
              {t('lobby.start')}
            </Button>
            {!canStart ? (
              <p id="start-reason" role="status">
                {t('lobby.needTwo')}
              </p>
            ) : null}
          </>
        ) : (
          <p role="status">{t('lobby.waitingHost', { name: host ? formatName(host.name) : '…' })}</p>
        )}
      </div>

      <div className={`${r['actions']} ${r['lobbyFull']}`}>
        {problem ? (
          <p role="alert" className={r['warn']}>
            <span aria-hidden="true">💬</span> {problem}
          </p>
        ) : null}
        {isHost && !full ? (
          <Button block loading={busy === 'bot'} onClick={() => void run('bot', () => client.command('room.addBot'))}>
            🤖 {t('lobby.addBot')}
          </Button>
        ) : null}
        {isHost ? (
          <Button block onClick={() => setClosing(true)}>
            {t('lobby.close')}
          </Button>
        ) : (
          <Button block onClick={() => void leave()}>
            {t('lobby.leave')}
          </Button>
        )}
      </div>

      {removing ? (
        <ConfirmDialog
          title={t('confirm.remove.title', { name: formatName(removing.name) })}
          body={t('confirm.remove.body')}
          safeLabel={t('confirm.remove.cancel')}
          dangerLabel={t('confirm.remove.confirm')}
          onSafe={() => setRemoving(null)}
          onDanger={() => {
            const target = removing;
            setRemoving(null);
            void run('kick', () => client.kick(target.playerId));
          }}
        />
      ) : null}
      {closing ? (
        <ConfirmDialog
          title={t('confirm.close.title')}
          body={t('confirm.close.body')}
          safeLabel={t('confirm.close.cancel')}
          dangerLabel={t('confirm.close.confirm')}
          onSafe={() => setClosing(false)}
          onDanger={() => {
            setClosing(false);
            void run('close', () => client.command('room.close'));
          }}
        />
      ) : null}
    </div>
  );
}
