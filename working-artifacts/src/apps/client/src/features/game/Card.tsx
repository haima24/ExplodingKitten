import { CARD_CATALOG } from '@wb/engine/cards';
import type { CardKind } from '@wb/engine/types';
import { t } from '../../copy';
import { cardEffect, cardName } from '../../copy/cards';
import { CardIcon } from './art/CardIcon';
import s from './card.module.css';

export function CardArt({ kind, size = 44 }: { kind: CardKind; size?: number }): JSX.Element {
  return (
    <span className={s['art']} aria-hidden="true">
      <CardIcon kind={kind} size={size} />
    </span>
  );
}

/** "See the Future, action card. Secretly look at the top 3 cards. Selected." */
export function cardAriaLabel(kind: CardKind, selected?: boolean): string {
  const info = CARD_CATALOG[kind];
  const base = t('card.aria', {
    name: cardName(kind),
    type: t(`card.type.${info.type}` as const),
    effect: cardEffect(kind).replace(/[.!]+$/, ''),
  });
  const locked = info.playable ? '' : ` ${info.reaction ? t('card.reaction') : t('card.locked')}`;
  if (selected === undefined) return `${base}${locked}`;
  return `${base}${locked} ${selected ? t('card.selected') : t('card.notSelected')}.`;
}

interface CardProps {
  kind: CardKind;
  selected?: boolean;
  /** Interactive cards are real buttons. */
  onSelect?: () => void;
  tabIndex?: number;
  large?: boolean;
  buttonRef?: (el: HTMLButtonElement | null) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  onFocus?: () => void;
}

export function Card({
  kind,
  selected,
  onSelect,
  tabIndex,
  large,
  buttonRef,
  onKeyDown,
  onFocus,
}: CardProps): JSX.Element {
  const info = CARD_CATALOG[kind];
  const className = [s['card'], selected && s['selected'], !info.playable && s['locked'], large && s['large']]
    .filter(Boolean)
    .join(' ');
  const face = (
    <>
      <span className={s['name']}>{cardName(kind)}</span>
      <CardArt kind={kind} />
      <span className={s['effect']}>{cardEffect(kind)}</span>
      {selected ? (
        <span className={s['badge']} aria-hidden="true">
          ✓
        </span>
      ) : !info.playable ? (
        <span className={s['badge']} aria-hidden="true">
          {info.reaction ? '⚡' : 'zzz'}
        </span>
      ) : null}
    </>
  );

  if (!onSelect) {
    return (
      <div className={className} data-kind={kind} role="img" aria-label={cardAriaLabel(kind)}>
        {face}
      </div>
    );
  }
  return (
    <button
      type="button"
      ref={buttonRef}
      className={className}
      data-kind={kind}
      aria-pressed={selected ?? false}
      aria-label={cardAriaLabel(kind, selected ?? false)}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
    >
      {face}
    </button>
  );
}

/** Face-down card used for the draw pile. */
export function CardBack({ count }: { count?: number }): JSX.Element {
  return (
    <span className={`${s['card']} ${s['back']}`} aria-hidden="true">
      {count !== undefined ? <span className={s['backCount']}>{count}</span> : '🐾'}
    </span>
  );
}
