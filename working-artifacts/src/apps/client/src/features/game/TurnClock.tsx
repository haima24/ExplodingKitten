import { useEffect, useRef, useState } from 'react';
import { t } from '../../copy';
import { announcer } from '../../lib/announcer';
import { useStore } from '../../net/context';
import { nameOf, selectMyId } from './selectors';
import g from './game.module.css';

/** Seconds left on the turn clock (server time), or null when no clock is running. */
export function useTurnClock(): {
  playerId: string;
  seconds: number | null;
  fraction: number;
  deadlineAt: number | null;
} | null {
  const { state } = useStore();
  const clock = state.room.view?.turnClock;
  const totalMs = (state.room.view?.turnTimerSec ?? 0) * 1000;
  const [now, setNow] = useState(() => Date.now());
  const running = clock?.deadlineAt != null;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [running]);

  if (!clock || state.room.view?.phase !== 'PLAYING') return null;
  if (clock.deadlineAt === null) return { playerId: clock.playerId, seconds: null, fraction: 0, deadlineAt: null };
  const left = Math.max(0, clock.deadlineAt - (now + state.connection.offset));
  return {
    playerId: clock.playerId,
    seconds: Math.ceil(left / 1000),
    fraction: totalMs > 0 ? Math.min(1, left / totalMs) : 0,
    deadlineAt: clock.deadlineAt,
  };
}

/** "Pip has 24 s" with a bar. The seconds are always text; the bar is only a hint. */
export function CountdownText(): JSX.Element | null {
  const { state } = useStore();
  const clock = useTurnClock();
  if (!clock) return null;
  const me = selectMyId(state);
  const who = clock.playerId === me ? null : nameOf(state.room.view, clock.playerId);
  const hurry = clock.seconds !== null && clock.seconds <= 5;
  let text: string;
  if (clock.seconds === null) text = t('clock.paused');
  else if (hurry) text = t('clock.hurry', { n: clock.seconds });
  else text = who === null ? t('clock.mine', { n: clock.seconds }) : t('clock.other', { name: who, n: clock.seconds });

  return (
    <div className={[g['clock'], hurry && g['clockHurry']].filter(Boolean).join(' ')} data-testid="turn-clock">
      <span className={g['clockText']}>
        <span aria-hidden="true">{hurry ? '⏰ ' : '⏳ '}</span>
        {text}
      </span>
      <span className={g['clockBar']} aria-hidden="true">
        <span className={g['clockFill']} style={{ width: `${Math.round(clock.fraction * 100)}%` }} />
      </span>
    </div>
  );
}

/**
 * Warnings for the turn clock, once per clock: a polite announcement at 10 s (for
 * the player whose turn it is) and at 5 s (for everyone), and at 5 s the warning
 * beep and spoken line on that player's device only (US-063).
 */
export function TurnClockEffects(): null {
  const { state, client } = useStore();
  const clock = useTurnClock();
  const fired = useRef<string>('');
  const me = selectMyId(state);
  const key = clock?.deadlineAt != null ? `${clock.playerId}:${clock.deadlineAt}` : '';
  const seconds = clock?.seconds ?? null;
  const mine = clock?.playerId === me;
  const name = clock ? nameOf(state.room.view, clock.playerId) : '';

  useEffect(() => {
    if (!key || seconds === null) {
      fired.current = '';
      return;
    }
    const mark = (level: 10 | 5): boolean => {
      const id = `${key}:${level}`;
      if (fired.current.includes(id)) return false;
      fired.current += `|${id}`;
      return true;
    };
    if (!fired.current.startsWith(key)) fired.current = key;
    if (seconds <= 5 && seconds > 0) {
      if (mark(5)) {
        announcer.announce(
          mine ? t('clock.warnMine', { n: 5 }) : t('clock.warnOther', { name, n: 5 }),
          { priority: 'assertive', key: `clock:${key}:5` },
        );
        if (mine) client.feedback(['warn'], [{ id: 'V04', priority: 2 }]);
      }
    } else if (seconds <= 10 && seconds > 5 && mine && mark(10)) {
      announcer.announce(t('clock.warnMine', { n: 10 }), { key: `clock:${key}:10` });
    }
  }, [key, seconds, mine, name, client]);

  return null;
}
