import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { useStore } from '../../net/context';
import { ActionBar } from './ActionBar';
import { LogPanel } from './ActionLog';
import { CoachMark } from './CoachMark';
import { BoomDialog, FavorPickDialog, NapDialog, PeekOverlay, ReinsertPicker } from './GameDialogs';
import { GameMenu } from './GameMenu';
import { Hand } from './Hand';
import { PlayerChips } from './PlayerChips';
import { Piles } from './Piles';
import { AbsentPlayerBanner, TurnBanner } from './TurnBanner';
import g from './game.module.css';

/** The board: server state in, controls out. Nothing here edits game data. */
export function GameBoard(): JSX.Element | null {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const wide = useMediaQuery('(min-width: 1024px)');
  const view = state.game.view;
  const [shuffling, setShuffling] = useState(false);

  const decisionKind = view?.decision?.kind;
  const { menuOpen, selectedCardId, overlays, peek, nap } = state.ui;

  // Browser Back opens the game menu instead of leaving silently (US-002): keep a
  // sentinel history entry on top and re-push it whenever Back pops it.
  const mounted = useRef(false);
  useEffect(() => {
    const isSentinel = (location.state as { sentinel?: boolean } | null)?.sentinel === true;
    if (!isSentinel) {
      navigate(location.pathname, { state: { sentinel: true } });
      if (mounted.current && navigationType === 'POP' && !decisionKind) {
        dispatch({ type: 'ui/menu', open: true });
      }
    }
    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // A forced-choice dialog takes precedence over the menu.
  useEffect(() => {
    if (decisionKind && menuOpen) dispatch({ type: 'ui/menu', open: false });
  }, [decisionKind, menuOpen, dispatch]);

  // Escape clears a selection first, otherwise opens the menu.
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape' || event.defaultPrevented || overlays > 0 || decisionKind) return;
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (selectedCardId) dispatch({ type: 'ui/select', cardId: null });
      else dispatch({ type: 'ui/menu', open: true });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [overlays, decisionKind, selectedCardId, dispatch]);

  // A tap outside the hand and action bar clears the selection.
  useEffect(() => {
    if (!selectedCardId) return;
    const onPointer = (event: PointerEvent): void => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-hand], [data-action-bar], dialog')) {
        dispatch({ type: 'ui/select', cardId: null });
      }
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [selectedCardId, dispatch]);

  // Short shuffle animation on the deck when anyone plays Shake Up.
  const lastShuffle = useRef<string | null>(null);
  useEffect(() => {
    const top = state.game.log[0];
    if (top && /shuffled/i.test(top.text) && lastShuffle.current !== String(top.seq)) {
      lastShuffle.current = String(top.seq);
      setShuffling(true);
      const timer = window.setTimeout(() => setShuffling(false), 450);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [state.game.log]);

  if (!view) return null;

  return (
    <div className={g['board']}>
      <div className={g['players']}>
        <PlayerChips />
      </div>
      <div className={g['alerts']}>
        <AbsentPlayerBanner />
        <CoachMark />
      </div>
      <div className={g['bannerArea']}>
        <TurnBanner />
      </div>
      <div className={g['pilesArea']}>
        <Piles shuffling={shuffling} />
      </div>
      <div className={g['handArea']}>
        {menuOpen ? null : view.you.status === 'active' ? <Hand /> : null}
      </div>
      <div className={g['actionsArea']}>
        <ActionBar />
      </div>
      {wide ? (
        <aside className={g['logArea']}>
          <LogPanel />
        </aside>
      ) : null}

      {menuOpen ? <GameMenu showLog={wide} /> : null}
      {decisionKind === 'TREAT_DECISION' ? <BoomDialog /> : null}
      {decisionKind === 'REINSERT' ? <ReinsertPicker /> : null}
      {decisionKind === 'FAVOR_PICK' ? <FavorPickDialog /> : null}
      {nap ? <NapDialog /> : null}
      {peek ? <PeekOverlay cards={peek} /> : null}
    </div>
  );
}
