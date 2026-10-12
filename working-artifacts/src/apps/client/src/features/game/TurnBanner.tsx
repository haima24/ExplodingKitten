import { useEffect, useState } from 'react';
import { formatName } from '@wb/protocol/shared';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import { announcer } from '../../lib/announcer';
import { useStore } from '../../net/context';
import { hintText, nameOf, selectBanner, selectHint, selectIsHost, selectMyId } from './selectors';
import g from './game.module.css';

export function TurnBanner(): JSX.Element {
  const { state } = useStore();
  const banner = selectBanner(state);
  const hint = hintText(selectHint(state));
  const twoTurns = (state.game.view?.pendingTurns ?? 1) > 1;

  let heading: string;
  switch (banner.kind) {
    case 'MY_TURN':
      heading = t('turn.mine', { name: banner.name ?? '' });
      break;
    case 'OTHER_TURN':
      heading = t('turn.other', { name: banner.name ?? '' });
      break;
    case 'WAITING':
      heading = t('turn.waiting', { name: banner.name ?? '' });
      break;
    case 'OUT':
      heading = t('turn.out');
      break;
    default:
      heading = t('turn.reconnecting');
  }

  // Hints are announced only when their content changes (US-031). Tips announce themselves.
  useEffect(() => {
    if (hint) announcer.announce(hint, { key: `hint:${hint}` });
  }, [hint]);

  return (
    <div className={g['banner']}>
      <div className={g['bannerTop']}>
        <h2>{heading}</h2>
        {twoTurns ? <span className={g['turnsBadge']}>{t('turn.badge2')}</span> : null}
      </div>
      <p className={g['hint']}>{hint}</p>
    </div>
  );
}

/** "Waiting for Pip to come back…" with a text countdown; the host decides after the window. */
export function AbsentPlayerBanner(): JSX.Element | null {
  const { state, client } = useStore();
  const absent = state.absent;
  const [now, setNow] = useState(() => Date.now());
  const isHost = selectIsHost(state);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!absent) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [absent]);

  const hostMayDecide = absent?.hostMayDecide ?? false;
  const absentId = absent?.playerId;
  const me = selectMyId(state);
  const name = nameOf(state.room.view, absentId);

  // Announce politely only when it first appears and when the host may decide.
  useEffect(() => {
    if (!absentId || absentId === me) return;
    announcer.announce(t('absent.waiting', { name }), { key: `absent:${absentId}` });
  }, [absentId, me, name]);
  useEffect(() => {
    if (!hostMayDecide || !isHost) return;
    announcer.announce(t('absent.hostDecides', { name }), { key: `absent-host:${absentId ?? ''}` });
  }, [hostMayDecide, isHost, absentId, name]);

  if (!absent) return null;
  const serverNow = now + state.connection.offset;
  const seconds = Math.max(0, Math.ceil((absent.deadlineAt - serverNow) / 1000));
  const member = state.room.view?.members.find((m) => m.playerId === absent.playerId);

  const decide = async (decision: 'WAIT' | 'SKIP'): Promise<void> => {
    setBusy(true);
    try {
      await client.skipAbsent(absent.playerId, decision);
    } catch {
      /* the next update shows the real state */
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={g['absent']}>
      <p>
        <span aria-hidden="true">◌ </span>
        {t('absent.waiting', { name: member ? formatName(member.name) : name })}
      </p>
      {!hostMayDecide ? <p>{t('absent.countdown', { n: seconds })}</p> : null}
      {hostMayDecide && isHost ? (
        <>
          <p>{t('absent.hostDecides', { name })}</p>
          <div className={g['absentActions']}>
            <Button compact loading={busy} onClick={() => void decide('WAIT')}>
              {t('absent.keepWaiting')}
            </Button>
            <Button compact variant="primary" loading={busy} onClick={() => void decide('SKIP')}>
              {t('absent.skip', { name })}
            </Button>
          </div>
        </>
      ) : null}
      {hostMayDecide && !isHost ? <p>{t('absent.waitingHost')}</p> : null}
    </div>
  );
}
