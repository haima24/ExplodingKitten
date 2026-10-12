import { CARD_CATALOG } from '@wb/engine/cards';
import type { CardKind } from '@wb/engine/types';
import { t } from '../../copy';
import s from './card.module.css';

// Placeholder art (emoji). Decorative only: every card also shows its name and
// effect as text, so a missing glyph never blocks play (US-044).
const ART: Record<CardKind, string> = {
  BOOM_CAT: '🙀',
  TREAT: '🐟',
  HOP_OVER: '🐾',
  PEEK: '👀',
  SHAKE_UP: '🔀',
  COZY_CAT: '😴',
  PASS_IT_ON: '👉',
  ASK_A_FRIEND: '💬',
};

export function CardArt({ kind }: { kind: CardKind }): JSX.Element {
  return (
    <span className={s['art']} aria-hidden="true">
      {ART[kind]}
    </span>
  );
}

/** "Peek, action card. Secretly look at the top 3 cards. Selected." */
export function cardAriaLabel(kind: CardKind, selected?: boolean): string {
  const info = CARD_CATALOG[kind];
  const base = t('card.aria', {
    name: info.name,
    type: t(`card.type.${info.type}` as const),
    effect: info.effect.replace(/[.!]+$/, ''),
  });
  const locked = info.playable ? '' : ` ${t('card.locked')}.`;
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
      <span className={s['name']}>{info.name}</span>
      <CardArt kind={kind} />
      <span className={s['effect']}>{info.effect}</span>
      {selected ? (
        <span className={s['badge']} aria-hidden="true">
          ✓
        </span>
      ) : !info.playable ? (
        <span className={s['badge']} aria-hidden="true">
          zzz
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
