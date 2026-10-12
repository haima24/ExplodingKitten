import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatName, type MemberView } from '@wb/protocol/shared';
import { t } from '../../copy';
import { Avatar } from '../../components/common/Avatar';
import { Button } from '../../components/common/Button';
import { ConfirmDialog } from '../../components/common/Modal';
import { announcer } from '../../lib/announcer';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { useStore } from '../../net/context';
import { selectIsHost } from './selectors';
import g from './game.module.css';

const CONFETTI = ['🎉', '⭐', '🐟', '🐾', '✨', '🎊'];

/** Confetti for at most 1.2 s; a static starburst under reduced motion. */
function Celebration(): JSX.Element {
  const reduced = useReducedMotion();
  const pieces = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        glyph: CONFETTI[i % CONFETTI.length],
        left: `${(i * 37) % 100}%`,
        delay: `${(i % 6) * 40}ms`,
      })),
    [],
  );
  if (reduced) {
    return (
      <span className={g['starburst']} aria-hidden="true">
        🌟
      </span>
    );
  }
  return (
    <div className={g['celebration']} aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} className={g['confetti']} style={{ left: p.left, animationDelay: p.delay }}>
          {p.glyph}
        </span>
      ))}
    </div>
  );
}

function names(members: MemberView[]): string {
  return members.map((m) => formatName(m.name)).join(', ');
}

export function VictoryScreen(): JSX.Element | null {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const view = state.game.view;
  const room = state.room.view;
  const heading = useRef<HTMLHeadingElement>(null);
  const [closing, setClosing] = useState(false);
  const [busy, setBusy] = useState(false);
  const isHost = selectIsHost(state);

  // Focus moves to the headline on arrival; it is announced politely.
  const winnerId = view?.winnerId;
  useEffect(() => {
    heading.current?.focus();
    if (winnerId && room) {
      const winner = room.members.find((m) => m.playerId === winnerId);
      if (winner) announcer.announce(t('victory.title', { name: formatName(winner.name) }), { key: 'victory' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!view || !room) return null;
  const winner = room.members.find((m) => m.playerId === view.winnerId);
  const host = room.members.find((m) => m.isHost);

  // Everyone who is not the winner, grouped by how they left the round.
  const groups: Record<'BOOM' | 'SKIPPED' | 'REMOVED' | 'LEFT', MemberView[]> = {
    BOOM: [],
    SKIPPED: [],
    REMOVED: [],
    LEFT: [],
  };
  const outs = [view.you, ...view.others].filter((p) => p.status === 'out' && p.outReason);
  for (const p of outs) {
    const m = room.members.find((x) => x.playerId === p.id);
    if (m && p.outReason) groups[p.outReason].push(m);
  }

  const playAgain = async (): Promise<void> => {
    setBusy(true);
    try {
      await client.command('room.rematch');
    } catch {
      /* the next update shows the real state */
    } finally {
      setBusy(false);
    }
  };
  const leave = async (): Promise<void> => {
    await client.leaveRoom();
    navigate('/');
  };

  return (
    <div className={g['victory']}>
      <Celebration />
      {winner ? <Avatar avatarId={winner.avatarId} size={112} /> : null}
      <h1 ref={heading} tabIndex={-1}>
        {t('victory.title', { name: winner ? formatName(winner.name) : '…' })}
      </h1>
      <ul className={g['recap']}>
        {groups.BOOM.length ? <li>{t('victory.naps', { names: names(groups.BOOM) })}</li> : null}
        {groups.SKIPPED.length ? <li>{t('victory.skipped', { names: names(groups.SKIPPED) })}</li> : null}
        {groups.REMOVED.length ? <li>{t('victory.removed', { names: names(groups.REMOVED) })}</li> : null}
        {groups.LEFT.length ? <li>{t('victory.left', { names: names(groups.LEFT) })}</li> : null}
        <li>
          {t('victory.stats', {
            turns: view.stats?.turnsPlayed ?? 0,
            treats: view.stats?.treatsUsed ?? 0,
          })}
        </li>
      </ul>

      <div className={g['victoryActions']}>
        {isHost ? (
          <>
            <Button variant="primary" block loading={busy} onClick={() => void playAgain()}>
              {t('victory.playAgain')}
            </Button>
            <Button block onClick={() => setClosing(true)}>
              {t('lobby.close')}
            </Button>
          </>
        ) : (
          <>
            <p role="status">{t('victory.waitingHost', { name: host ? formatName(host.name) : '…' })}</p>
            <Button block onClick={() => void leave()}>
              {t('lobby.leave')}
            </Button>
          </>
        )}
      </div>

      {closing ? (
        <ConfirmDialog
          title={t('confirm.close.title')}
          body={t('confirm.close.body')}
          safeLabel={t('confirm.close.cancel')}
          dangerLabel={t('confirm.close.confirm')}
          onSafe={() => setClosing(false)}
          onDanger={() => {
            setClosing(false);
            void client.command('room.close').catch(() => undefined);
          }}
        />
      ) : null}
    </div>
  );
}
