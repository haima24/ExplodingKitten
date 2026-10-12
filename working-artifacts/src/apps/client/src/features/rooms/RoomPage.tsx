import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { parseCode } from '@wb/protocol/shared';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { LoadingScreen } from '../../components/common/Screens';
import { useStore } from '../../net/context';
import { GameBoard } from '../game/GameBoard';
import { AnimationLayer } from '../game/AnimationLayer';
import { VictoryScreen } from '../game/VictoryScreen';
import { EndedScreen } from './EndedScreen';
import { LobbyPage } from './LobbyPage';
import r from './rooms.module.css';

/** "This room will close soon. Tap anywhere to keep it open." */
function IdleWarning(): JSX.Element | null {
  const { state, client } = useStore();
  const warning = state.room.view?.idleWarning;
  const active = Boolean(warning && !warning.absolute);

  useEffect(() => {
    if (!active) return;
    const keep = (): void => {
      void client.command('room.keepAlive').catch(() => undefined);
    };
    window.addEventListener('pointerdown', keep, { once: true });
    window.addEventListener('keydown', keep, { once: true });
    return () => {
      window.removeEventListener('pointerdown', keep);
      window.removeEventListener('keydown', keep);
    };
  }, [active, client]);

  if (!warning) return null;
  const minutes = Math.max(1, Math.ceil((warning.expiresAt - (Date.now() + state.connection.offset)) / 60_000));
  return (
    <p role="status" className={r['warn']} style={{ margin: 'var(--space-3) var(--page-pad) 0' }}>
      <span aria-hidden="true">⏳</span>{' '}
      {warning.absolute ? t('idle.warnAbsolute', { n: minutes }) : t('idle.warn')}
    </p>
  );
}

/** `/room/:code`: lobby, board, or victory screen, driven entirely by server state. */
export function RoomPage(): JSX.Element {
  const { code: param } = useParams();
  const { state, client } = useStore();
  const navigate = useNavigate();
  const code = param ? parseCode(param) : null;
  const { session } = state;
  const hasSeat = session !== null && session.code === code;
  const needsSnapshot = hasSeat && state.room.view === null;

  // After a reload the seat is rebuilt from a fresh server snapshot.
  useEffect(() => {
    if (needsSnapshot && state.connection.status !== 'reconnecting') void client.rejoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsSnapshot]);

  if (!code) return <Navigate to="/join" replace />;
  if (state.room.ended) return <EndedScreen reason={state.room.ended} />;
  if (!hasSeat) return <Navigate to={`/join/${code}`} replace />;

  if (state.connection.status === 'offline') {
    return (
      <div className={c['center']} role="alert">
        <span className={c['bigGlyph']} aria-hidden="true">
          😿
        </span>
        <h1>{t('conn.lost')}</h1>
        <div className={c['centerActions']}>
          <Button variant="primary" onClick={() => client.retryNow()}>
            {t('conn.tryAgain')}
          </Button>
          <Button onClick={() => navigate('/')}>{t('nav.home')}</Button>
        </div>
      </div>
    );
  }

  const room = state.room.view;
  if (!room) return <LoadingScreen text={t('room.resuming')} />;

  let body: JSX.Element;
  if (room.phase === 'LOBBY') body = <LobbyPage />;
  else if (!state.game.view) body = <LoadingScreen text={t('room.resuming')} />;
  else if (state.game.view.phase === 'finished' || room.phase === 'FINISHED') {
    // The explosion and the trophy play first; the victory screen follows (US-069).
    body = state.ui.anim.length > 0 ? <GameBoard /> : <VictoryScreen />;
  }
  else body = <GameBoard />;

  return (
    <>
      <IdleWarning />
      {body}
      <AnimationLayer />
    </>
  );
}
