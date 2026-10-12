import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { t } from '../../copy';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { useStore } from '../../net/context';
import { Card } from './Card';
import g from './game.module.css';

/** The player's own cards only: a list of buttons with a roving tabindex. */
export function Hand(): JSX.Element | null {
  const { state, dispatch, client } = useStore();
  const view = state.game.view;
  const reduced = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  /** How many cards are cut off at each edge (shown as an indicator instead of a scrollbar). */
  const [hidden, setHidden] = useState({ left: 0, right: 0 });
  const edgeSpeed = useRef(0);
  const frame = useRef<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const hand = view?.you.hand ?? [];
  const selectedId = state.ui.selectedCardId;
  const pairId = state.ui.pairCardId;

  const focusCard = (index: number): void => {
    const next = Math.min(Math.max(index, 0), hand.length - 1);
    setFocusIndex(next);
    const el = refs.current[next];
    el?.focus();
    el?.scrollIntoView({
      inline: 'nearest',
      block: 'nearest',
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  // After a card leaves the hand, focus moves to the nearest remaining card.
  const previousLength = useRef(hand.length);
  useEffect(() => {
    if (hand.length < previousLength.current && hand.length > 0) {
      const active = document.activeElement;
      if (
        !active ||
        active === document.body ||
        !refs.current.includes(active as HTMLButtonElement)
      ) {
        if (active === document.body) focusCard(Math.min(focusIndex, hand.length - 1));
      }
    }
    previousLength.current = hand.length;
    if (focusIndex > hand.length - 1) setFocusIndex(Math.max(0, hand.length - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hand.length]);

  const measure = useCallback((): void => {
    const list = listRef.current;
    if (!list) return;
    // A card counts as hidden on a side when any part of it is cut off there, and only
    // while the hand can still move that way, so the indicator never outlives the scroll.
    const max = list.scrollWidth - list.clientWidth;
    let left = 0;
    let right = 0;
    for (const item of Array.from(list.children) as HTMLElement[]) {
      const start = item.offsetLeft - list.scrollLeft;
      const end = start + item.offsetWidth;
      if (list.scrollLeft > 1 && start < -1) left += 1;
      if (list.scrollLeft < max - 1 && end > list.clientWidth + 1) right += 1;
    }
    setHidden((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  // Recount whenever the hand, its size or its scroll position changes.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    measure();
    list.addEventListener('scroll', measure, { passive: true });
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
    observer?.observe(list);
    return () => {
      list.removeEventListener('scroll', measure);
      observer?.disconnect();
    };
  }, [measure, hand.length]);

  // A mouse near the left or right edge slides the hand that way: the deeper into the edge, the faster.
  const stopEdge = useCallback((): void => {
    edgeSpeed.current = 0;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);
  useEffect(() => stopEdge, [stopEdge]);

  const onEdgeMove = (event: PointerEvent<HTMLDivElement>): void => {
    const list = listRef.current;
    if (!list || event.pointerType !== 'mouse') return;
    const rect = list.getBoundingClientRect();
    const zone = Math.min(140, rect.width * 0.22);
    const x = event.clientX - rect.left;
    const max = list.scrollWidth - list.clientWidth;
    // Speed in pixels per second: from a gentle start at the edge of the zone up to 700 at the very edge.
    let speed = 0;
    if (x < zone && list.scrollLeft > 0) speed = -(150 + ((zone - x) / zone) * 550);
    else if (x > rect.width - zone && list.scrollLeft < max)
      speed = 150 + ((x - (rect.width - zone)) / zone) * 550;
    edgeSpeed.current = speed;
    if (speed !== 0 && frame.current === null) {
      // The position is accumulated here instead of read back each frame: on screens scaled to
      // 125 % or 150 % the browser rounds small scroll steps, which could freeze the slide.
      let position = list.scrollLeft;
      let last = performance.now();
      const step = (now: number): void => {
        if (edgeSpeed.current === 0) {
          frame.current = null;
          return;
        }
        const limit = list.scrollWidth - list.clientWidth;
        if (Math.abs(list.scrollLeft - position) > 3) position = list.scrollLeft; // moved by something else
        position = Math.min(
          limit,
          Math.max(0, position + (edgeSpeed.current * Math.min(50, now - last)) / 1000),
        );
        last = now;
        list.scrollLeft = position;
        frame.current = requestAnimationFrame(step);
      };
      frame.current = requestAnimationFrame(step);
    }
  };

  // The mouse wheel slides the hand sideways while there is more to see that way.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const onWheel = (event: WheelEvent): void => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const max = list.scrollWidth - list.clientWidth;
      const canMove =
        (event.deltaY < 0 && list.scrollLeft > 0) || (event.deltaY > 0 && list.scrollLeft < max);
      if (!canMove) return;
      list.scrollLeft += event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      event.preventDefault();
    };
    list.addEventListener('wheel', onWheel, { passive: false });
    return () => list.removeEventListener('wheel', onWheel);
  }, [hand.length]);

  const scrollBy = (direction: -1 | 1): void => {
    const list = listRef.current;
    if (!list) return;
    list.scrollBy({
      left: direction * list.clientWidth * 0.6,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  if (!view) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusCard(index + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusCard(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusCard(0);
        break;
      case 'End':
        event.preventDefault();
        focusCard(hand.length - 1);
        break;
      default:
        break;
    }
  };

  const select = (id: string, index: number): void => {
    setFocusIndex(index);
    // Two Cat cards of the same design make a pair (US-065).
    const first = hand.find((c) => c.id === selectedId);
    const tapped = hand[index];
    if (
      first &&
      tapped &&
      first.kind === 'COZY_CAT' &&
      tapped.kind === 'COZY_CAT' &&
      tapped.id !== first.id
    ) {
      if (tapped.variant !== first.variant) client.inline(t('pair.sameDesign'));
      else if (pairId === tapped.id) dispatch({ type: 'ui/pair', cardId: null });
      else if (pairId !== null) client.inline(t('pair.max'));
      else dispatch({ type: 'ui/pair', cardId: tapped.id });
      return;
    }
    const deselect = selectedId === id;
    dispatch({ type: 'ui/select', cardId: deselect ? null : id });
    if (!deselect) {
      dispatch({ type: 'tips/trigger', tip: 2 });
      refs.current[index]?.scrollIntoView({
        inline: 'nearest',
        block: 'nearest',
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <div data-hand="">
      <div className={g['handHeader']}>
        <span className="sr-only">{t('hand.label')}</span>
        <span aria-hidden="true">{t('hand.label')}</span>
        <span aria-live="off">
          {hand.length === 1 ? t('hand.count1') : t('hand.count', { n: hand.length })}
        </span>
      </div>
      {hand.length === 0 ? (
        <p className={g['handHidden']}>{t('hand.empty')}</p>
      ) : (
        <div className={g['handViewport']} onPointerMove={onEdgeMove} onPointerLeave={stopEdge}>
          <ul
            ref={listRef}
            className={`${g['hand']} ${hand.length > 8 ? g['handCrowded'] : ''}`}
            aria-label={t('hand.label')}
          >
            {hand.map((card, index) => (
              <li key={card.id} className={g['handItem']}>
                <Card
                  kind={card.kind}
                  variant={card.variant}
                  selected={selectedId === card.id || pairId === card.id}
                  tabIndex={index === Math.min(focusIndex, hand.length - 1) ? 0 : -1}
                  buttonRef={(el) => {
                    refs.current[index] = el;
                  }}
                  onSelect={() => select(card.id, index)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  onFocus={() => setFocusIndex(index)}
                />
              </li>
            ))}
          </ul>
          {hidden.left > 0 ? (
            <button
              type="button"
              tabIndex={-1}
              className={`${g['handMore']} ${g['handMoreLeft']}`}
              aria-label={t('hand.moreLeft', { n: hidden.left })}
              onClick={() => scrollBy(-1)}
            >
              <span className={g['handMoreLabel']} aria-hidden="true">
                ‹ {hidden.left}
              </span>
            </button>
          ) : null}
          {hidden.right > 0 ? (
            <button
              type="button"
              tabIndex={-1}
              className={`${g['handMore']} ${g['handMoreRight']}`}
              aria-label={t('hand.moreRight', { n: hidden.right })}
              onClick={() => scrollBy(1)}
            >
              <span className={g['handMoreLabel']} aria-hidden="true">
                {hidden.right} ›
              </span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
