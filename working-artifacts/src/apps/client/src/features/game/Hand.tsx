import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
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
  const [focusIndex, setFocusIndex] = useState(0);
  const hand = view?.you.hand ?? [];
  const selectedId = state.ui.selectedCardId;
  const pairId = state.ui.pairCardId;

  const focusCard = (index: number): void => {
    const next = Math.min(Math.max(index, 0), hand.length - 1);
    setFocusIndex(next);
    const el = refs.current[next];
    el?.focus();
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  };

  // After a card leaves the hand, focus moves to the nearest remaining card.
  const previousLength = useRef(hand.length);
  useEffect(() => {
    if (hand.length < previousLength.current && hand.length > 0) {
      const active = document.activeElement;
      if (!active || active === document.body || !refs.current.includes(active as HTMLButtonElement)) {
        if (active === document.body) focusCard(Math.min(focusIndex, hand.length - 1));
      }
    }
    previousLength.current = hand.length;
    if (focusIndex > hand.length - 1) setFocusIndex(Math.max(0, hand.length - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hand.length]);

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
    if (first && tapped && first.kind === 'COZY_CAT' && tapped.kind === 'COZY_CAT' && tapped.id !== first.id) {
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
        <ul
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
      )}
    </div>
  );
}
