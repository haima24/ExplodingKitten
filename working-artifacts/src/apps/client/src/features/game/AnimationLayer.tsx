import { useCallback, useEffect, useMemo, useState } from 'react';
import { ANIMATION_MS } from '@wb/protocol/shared';
import { t } from '../../copy';
import { displayName } from '../../copy/names';
import { Avatar } from '../../components/common/Avatar';
import { announcer } from '../../lib/announcer';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { useStore } from '../../net/context';
import { BlastArt, BombArt, TrophyArt } from './art/AnimArt';
import g from './game.module.css';

/** The fuse burns for this long, then the bomb goes off (the rest of the explosion's time). */
const FUSE_MS = 1100;

/** Confetti for the trophy: simple coloured pieces (no motion at all under reduced motion). */
const CONFETTI = ['#FFC83D', '#F28C28', '#5B3FD9', '#17784A', '#0F6E8C', '#C93217'];

/**
 * Plays the queued animations one at a time, over the board, for every player
 * (US-069): a bomb that explodes with the player's name, and the winner with a
 * trophy. Each one can be skipped on this device (tap, click, Enter or Escape).
 * They only decorate: who is out and who wins is decided by the server.
 */
export function AnimationLayer(): JSX.Element | null {
  const { state, dispatch } = useStore();
  const reduced = useReducedMotion();
  const item = state.ui.anim[0];
  const [boom, setBoom] = useState(false);
  const [skipHint, setSkipHint] = useState(false);
  const me = state.game.view?.you.id;

  const member = useMemo(
    () => state.room.view?.members.find((m) => m.playerId === item?.playerId),
    [state.room.view, item?.playerId],
  );

  const finish = useCallback((): void => {
    dispatch({ type: 'anim/shift' });
  }, [dispatch]);

  // Each item runs its own short timeline: fuse then blast, or the trophy.
  useEffect(() => {
    if (!item) return undefined;
    setBoom(false);
    setSkipHint(false);
    const timers: number[] = [];
    if (item.kind === 'explosion') timers.push(window.setTimeout(() => setBoom(true), FUSE_MS));
    timers.push(window.setTimeout(() => setSkipHint(true), 1000));
    timers.push(
      window.setTimeout(
        finish,
        item.kind === 'explosion' ? ANIMATION_MS.explosion : ANIMATION_MS.trophy,
      ),
    );
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        event.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      for (const timer of timers) window.clearTimeout(timer);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [item?.id, item?.kind, finish]); // eslint-disable-line react-hooks/exhaustive-deps

  // Spoken once for screen readers; the pictures are hidden from them.
  const name = member ? displayName(member.name) : t('common.someone');
  const winnerLine = item?.playerId === me ? t('anim.youWon') : t('victory.title', { name });
  useEffect(() => {
    if (!item) return;
    announcer.announce(item.kind === 'explosion' ? t('anim.exploded', { name }) : winnerLine, {
      key: `anim:${item.id}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id]);

  // After my own explosion, the nap message follows (US-017).
  useEffect(() => {
    if (item || !state.ui.napPending) return;
    dispatch({ type: 'ui/nap', on: true });
    dispatch({ type: 'ui/napPending', on: false });
  }, [item, state.ui.napPending, dispatch]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        delay: `${(i % 7) * 120}ms`,
        color: CONFETTI[i % CONFETTI.length],
        turn: `${(i * 53) % 360}deg`,
      })),
    [],
  );

  if (!item) return null;
  const explosion = item.kind === 'explosion';

  return (
    <div
      className={g['animLayer']}
      data-testid={explosion ? 'anim-explosion' : 'anim-trophy'}
      data-phase={explosion ? (boom ? 'boom' : 'fuse') : 'trophy'}
      data-still={reduced || undefined}
      aria-hidden="true"
      onPointerDown={finish}
    >
      {explosion && boom ? <span className={g['animFlash']} /> : null}
      {!explosion ? (
        <div className={g['confettiField']}>
          {confetti.map((c, i) => (
            <span
              key={i}
              className={g['confettiBit']}
              style={{ left: c.left, animationDelay: c.delay, background: c.color, rotate: c.turn }}
            />
          ))}
        </div>
      ) : null}

      <div className={`${g['animCard']} ${explosion && boom ? g['animCardBoom'] : ''}`}>
        <Avatar avatarId={member?.avatarId ?? 'biscuit'} size={explosion ? 72 : 96} />
        <p className={g['animName']}>{name}</p>
        {explosion ? (
          <div className={g['animArt']}>
            {boom ? <BlastArt size={150} /> : <BombArt size={130} />}
          </div>
        ) : (
          <>
            <div className={g['trophyRise']}>
              <TrophyArt size={150} />
            </div>
            <p className={g['trophyPlate']}>{name}</p>
            <p className={g['animLine']}>{winnerLine}</p>
          </>
        )}
        {explosion && boom ? <p className={g['animLine']}>{t('anim.exploded', { name })}</p> : null}
      </div>
      {skipHint ? <p className={g['animSkip']}>{t('anim.skip')}</p> : null}
    </div>
  );
}
