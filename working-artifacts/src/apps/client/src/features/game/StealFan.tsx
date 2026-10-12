import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { t } from '../../copy';
import { cardName } from '../../copy/cards';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { Modal } from '../../components/common/Modal';
import { announcer } from '../../lib/announcer';
import { useStore } from '../../net/context';
import { Card } from './Card';
import { nameOf } from './selectors';
import { CountdownText } from './TurnClock';
import { useGameActions } from './useGameActions';
import g from './game.module.css';

/** The face-down cards, fanned out in an arc (US-066). Shows backs only: it is given a count, never a card. */
function Fan({
  count,
  active,
  interactive,
  label,
  onActive,
  onChoose,
}: {
  count: number;
  active: number | null;
  interactive: boolean;
  label: string;
  onActive?: (index: number | null) => void;
  onChoose?: (index: number) => void;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const spread = Math.min(84, 12 * (count - 1));

  const indexAt = (clientX: number): number => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return 0;
    const fraction = (clientX - rect.left) / rect.width;
    return Math.min(count - 1, Math.max(0, Math.floor(fraction * count)));
  };

  // Sweeping with a finger or a mouse moves the highlight; lifting the finger only leaves it there.
  const onMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (!interactive) return;
    if (event.pointerType === 'mouse' || event.buttons > 0 || event.pressure > 0)
      onActive?.(indexAt(event.clientX));
  };
  const onDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (!interactive) return;
    ref.current?.focus();
    onActive?.(indexAt(event.clientX));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (!interactive) return;
    const at = active ?? -1;
    if (event.key === 'ArrowRight') onActive?.(at + 1 >= count ? 0 : at + 1);
    else if (event.key === 'ArrowLeft') onActive?.(at <= 0 ? count - 1 : at - 1);
    else if (event.key === 'Home') onActive?.(0);
    else if (event.key === 'End') onActive?.(count - 1);
    else if ((event.key === 'Enter' || event.key === ' ') && active !== null) onChoose?.(active);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={ref}
      className={g['fan']}
      data-live={interactive || undefined}
      role={interactive ? 'listbox' : 'img'}
      aria-label={label}
      aria-activedescendant={interactive && active !== null ? `fan-card-${active}` : undefined}
      tabIndex={interactive ? 0 : undefined}
      data-autofocus={interactive ? '' : undefined}
      data-testid={interactive ? 'steal-fan' : 'steal-watch-fan'}
      onPointerMove={onMove}
      onPointerDown={onDown}
      onKeyDown={onKeyDown}
    >
      <span className={g['fanInner']}>
        {Array.from({ length: count }, (_, i) => {
          const t01 = count === 1 ? 0.5 : i / (count - 1);
          const isActive = active === i;
          return (
            <span
              key={i}
              id={`fan-card-${i}`}
              className={g['fanCard']}
              data-active={isActive || undefined}
              role={interactive ? 'option' : undefined}
              aria-selected={interactive ? isActive : undefined}
              aria-label={interactive ? t('steal.position', { n: i + 1, total: count }) : undefined}
              style={{
                left: `${12 + t01 * 76}%`,
                transform: `translateX(-50%) rotate(${(t01 - 0.5) * spread}deg) translateY(${isActive ? -18 : 0}px)`,
                zIndex: isActive ? count + 1 : i,
                animationDelay: `${i * 25}ms`,
              }}
            >
              <span aria-hidden="true">🐾</span>
              {isActive ? (
                <span className={g['fanNumber']} aria-hidden="true">
                  {i + 1}
                </span>
              ) : null}
            </span>
          );
        })}
      </span>
    </div>
  );
}

/** The taker's step: sweep across the fan, then take one card. Others see where the finger is. */
export function StealPickDialog(): JSX.Element | null {
  const { state, client } = useStore();
  const { pickSteal } = useGameActions();
  const view = state.game.view;
  const decision = view?.decision;
  const [active, setActive] = useState<number | null>(null);
  const lastSent = useRef<{ at: number; position: number | null }>({ at: 0, position: null });
  const timer = useRef<number | null>(null);
  const pending = state.ui.pendingActionId !== null;
  const count = decision?.kind === 'STEAL_PICK' ? decision.count : 0;

  // The others see the finger move: at most about five updates a second, and the last position is always sent.
  const share = useCallback(
    (position: number | null): void => {
      const send = (): void => {
        lastSent.current = { at: Date.now(), position };
        client.fire('game.hover', { position });
      };
      if (timer.current !== null) window.clearTimeout(timer.current);
      const wait = lastSent.current.at + 200 - Date.now();
      if (wait <= 0) send();
      else timer.current = window.setTimeout(send, wait);
    },
    [client],
  );

  const move = (index: number | null): void => {
    if (index === active) return;
    setActive(index);
    share(index);
    if (index !== null) {
      announcer.announce(t('steal.position', { n: index + 1, total: count }), {
        key: `fan:${index}`,
      });
      client.feedback(['tick'], []);
    }
  };

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      client.fire('game.hover', { position: null });
    },
    [client],
  );

  const choose = (index: number): void => void pickSteal(index);

  // One card left: nothing to choose, so it is taken after a moment.
  useEffect(() => {
    if (count !== 1) return undefined;
    setActive(0);
    const wait = window.setTimeout(() => void pickSteal(0), 1000);
    return () => window.clearTimeout(wait);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  if (!view || decision?.kind !== 'STEAL_PICK') return null;
  const target = nameOf(state.room.view, decision.targetId);

  return (
    <Modal
      title={t('steal.title', { name: target })}
      dismissible={false}
      announce={`${t('steal.title', { name: target })}. ${t('steal.hint')}`}
    >
      <p>{t('steal.hint')}</p>
      <Fan
        count={count}
        active={active}
        interactive
        label={t('steal.fanLabel', { name: target })}
        onActive={move}
        onChoose={choose}
      />
      <CountdownText />
      <div className={c['dialogActions']}>
        <Button
          variant="primary"
          loading={pending}
          softDisabled={active === null}
          onClick={() => active !== null && choose(active)}
        >
          {t('steal.take')}
        </Button>
      </div>
    </Modal>
  );
}

/** Everyone else sees the fan and the highlight moving (US-066). A Bot Buddy's sweep is drawn on the device. */
export function StealWatch(): JSX.Element | null {
  const { state } = useStore();
  const steal = state.game.view?.steal;
  const me = state.game.view?.you.id;
  const thiefIsBot =
    state.room.view?.members.find((m) => m.playerId === steal?.thiefId)?.isBot ?? false;
  const [wander, setWander] = useState<number | null>(null);
  const count = steal?.count ?? 0;

  useEffect(() => {
    if (!thiefIsBot || count === 0) return undefined;
    const timer = window.setInterval(() => setWander(Math.floor(Math.random() * count)), 350);
    return () => window.clearInterval(timer);
  }, [thiefIsBot, count]);

  const thief = steal ? nameOf(state.room.view, steal.thiefId) : '';
  const target = steal ? nameOf(state.room.view, steal.targetId) : '';
  const text = steal ? t('steal.watching', { thief, target }) : '';
  useEffect(() => {
    if (text) announcer.announce(text, { key: `steal:${text}` });
  }, [text]);

  if (!steal || steal.thiefId === me) return null;
  const live = state.hover?.playerId === steal.thiefId ? state.hover.position : null;
  return (
    <div className={g['stealWatch']} role="status" data-testid="steal-watch">
      <p>{text}</p>
      <Fan
        count={count}
        active={thiefIsBot ? wander : live}
        interactive={false}
        label={t('steal.fanLabel', { name: target })}
      />
    </div>
  );
}

/** The taken card flips face up for a moment, on the taker's device only. */
export function StealReveal(): JSX.Element | null {
  const { state, dispatch } = useStore();
  const card = state.ui.reveal;
  useEffect(() => {
    if (!card) return undefined;
    const timer = window.setTimeout(() => dispatch({ type: 'ui/reveal', card: null }), 1800);
    return () => window.clearTimeout(timer);
  }, [card, dispatch]);
  if (!card) return null;
  return (
    <div
      className={g['reveal']}
      role="status"
      aria-label={t('steal.got', { card: cardName(card.kind, card.variant) })}
    >
      <div className={g['revealCard']}>
        <Card kind={card.kind} variant={card.variant} large />
      </div>
    </div>
  );
}
