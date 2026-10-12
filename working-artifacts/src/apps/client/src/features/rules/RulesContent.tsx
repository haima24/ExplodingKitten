import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CARD_CATALOG, kindsForProfile } from '@wb/engine/cards';
import { t } from '../../copy';
import { cardEffect, cardName, cardNotPlayableReason } from '../../copy/cards';
import { Button } from '../../components/common/Button';
import { CardArt } from '../game/Card';
import { useStore } from '../../net/context';
import c from '../../components/common/common.module.css';
import s from './rules.module.css';

const STEP_GLYPH = ['🏆', '🃏', '🙀', '✨', '🎉'] as const;
const STEPS = ['rules.step1', 'rules.step2', 'rules.step3', 'rules.step4', 'rules.step5'] as const;

/** Tap- or Enter-triggered help bubble. Never hover. Escape, outside tap, or Close dismiss it. */
export function InfoPopover({ label, children }: { label: string; children: ReactNode }): JSX.Element {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent): void => {
      const target = event.target as Node;
      if (!bubble.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <span className={s['popoverWrap']}>
      <button
        type="button"
        ref={trigger}
        className={c['button'] + ' ' + c['compact']}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      {open ? (
        <div id={id} ref={bubble} className={s['popover']} role="group" aria-label={label}>
          {children}
          <Button
            compact
            onClick={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
          >
            {t('help.infoClose')}
          </Button>
        </div>
      ) : null}
    </span>
  );
}

export function CardGuide(): JSX.Element {
  const { state } = useStore();
  const profile = state.room.view?.deckProfile ?? 'mvp+should';
  const kinds = kindsForProfile(profile);
  return (
    <section aria-labelledby="card-guide-title" className={s['miniList']}>
      <h2 id="card-guide-title">{t('rules.cards.title')}</h2>
      <ul className={s['cardList']}>
        {kinds.map((kind) => {
          const info = CARD_CATALOG[kind];
          return (
            <li key={kind} className={s['cardRow']}>
              <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                <CardArt kind={kind} />
              </span>
              <span className={s['cardRowText']}>
                <h3>{cardName(kind)}</h3>
                <span>{cardEffect(kind)}</span>
                <span className="sr-only">
                  {info.playable || info.pair
                    ? t('detail.playable')
                    : t('detail.notPlayable', { reason: cardNotPlayableReason(kind) ?? '' })}
                </span>
                {!info.playable && !info.pair ? (
                  <InfoPopover label={t('help.infoOpen', { name: cardName(kind) })}>
                    <span>{cardNotPlayableReason(kind)}</span>
                  </InfoPopover>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Tour({ onExit }: { onExit: () => void }): JSX.Element {
  const { state } = useStore();
  const [index, setIndex] = useState(0);
  const swipe = useRef<number | null>(null);
  const last = index === STEPS.length - 1;
  const key = STEPS[index] ?? STEPS[0];
  const profile = state.room.view?.deckProfile ?? 'mvp+should';

  const go = (delta: number): void => setIndex((i) => Math.min(STEPS.length - 1, Math.max(0, i + delta)));

  return (
    <section
      aria-labelledby="tour-title"
      className={s['step']}
      onPointerDown={(e) => {
        swipe.current = e.clientX;
      }}
      onPointerUp={(e) => {
        // Swipe is an optional extra; the buttons below always work.
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
      }}
    >
      <p className={s['progress']}>{t('rules.step', { n: index + 1, total: STEPS.length })}</p>
      <div className={s['dots']} aria-hidden="true">
        {STEPS.map((_, i) => (
          <span key={i} className={`${s['dot']} ${i === index ? s['dotOn'] : ''}`} />
        ))}
      </div>
      <span className={s['stepGlyph']} aria-hidden="true">
        {STEP_GLYPH[index]}
      </span>
      <h2 id="tour-title">{t(`${key}.title` as const)}</h2>
      <p className={s['stepText']}>{t(`${key}.body` as const)}</p>
      {index === 3 ? (
        <ul className={s['miniList']}>
          {kindsForProfile(profile)
            .filter((k) => CARD_CATALOG[k].playable || CARD_CATALOG[k].reaction || CARD_CATALOG[k].pair)
            .map((k) => (
              <li key={k} className={s['miniItem']}>
                <span style={{ fontSize: '1.75rem' }}>
                  <CardArt kind={k} />
                </span>
                <span>
                  <strong>{cardName(k)}</strong>: {cardEffect(k)}
                </span>
              </li>
            ))}
        </ul>
      ) : null}
      <div className={s['nav']}>
        <Button onClick={() => go(-1)} softDisabled={index === 0}>
          {t('rules.prev')}
        </Button>
        {last ? (
          <Button variant="primary" onClick={onExit}>
            {t('rules.done')}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => go(1)}>
            {t('rules.next')}
          </Button>
        )}
        {!last ? <Button onClick={onExit}>{t('rules.skip')}</Button> : null}
      </div>
    </section>
  );
}

/** Tour and card guide. Hosted by the /rules page and by the help dialog. */
export function RulesContent({ onExit }: { onExit: () => void }): JSX.Element {
  const [tab, setTab] = useState<'tour' | 'cards'>('tour');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div className={s['tabs']} role="group" aria-label={t('rules.title')}>
        <Button compact variant={tab === 'tour' ? 'primary' : 'secondary'} aria-pressed={tab === 'tour'} onClick={() => setTab('tour')}>
          {t('rules.tabTour')}
        </Button>
        <Button compact variant={tab === 'cards' ? 'primary' : 'secondary'} aria-pressed={tab === 'cards'} onClick={() => setTab('cards')}>
          {t('rules.tabCards')}
        </Button>
      </div>
      {tab === 'tour' ? <Tour onExit={onExit} /> : <CardGuide />}
    </div>
  );
}
