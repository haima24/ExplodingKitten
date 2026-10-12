import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { t } from '../../copy';
import { announcer } from '../../lib/announcer';
import { useStore } from '../../net/context';
import { IconButton } from './Button';
import s from './common.module.css';
import { ConnectionBanner, ConnectionIndicator, Toast } from './Feedback';
import { ErrorBoundary, LoadingScreen } from './Screens';

const RulesDialog = lazy(() =>
  import('../../features/rules/RulesViews').then((m) => ({ default: m.RulesDialog })),
);
const SettingsDialog = lazy(() =>
  import('../../features/settings/SettingsPanel').then((m) => ({ default: m.SettingsDialog })),
);

interface ShellApi {
  openRules: () => void;
  openSettings: () => void;
}
const ShellContext = createContext<ShellApi>({ openRules: () => undefined, openSettings: () => undefined });
export const useShell = (): ShellApi => useContext(ShellContext);

const TITLES: [RegExp, string][] = [
  [/^\/create/, 'Create a room'],
  [/^\/join/, 'Join a room'],
  [/^\/room\//, 'Room'],
  [/^\/rules/, 'How to Play'],
  [/^\/settings/, 'Settings'],
  [/^\/privacy/, 'Privacy'],
];

/** Header, live regions, banners, toast, and the page outlet. */
export function AppShell(): JSX.Element {
  const { state, dispatch } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const firstRoute = useRef(true);

  useEffect(() => {
    announcer.register(politeRef.current, assertiveRef.current);
    return () => announcer.register(null, null);
  }, []);

  // Page title, noindex for join and room pages, and focus to the new page on navigation.
  useEffect(() => {
    const match = TITLES.find(([re]) => re.test(location.pathname));
    document.title = match ? `${match[1]} · ${t('app.name')}` : t('app.name');

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const hidden = /^\/(join|room)\//.test(location.pathname);
    if (hidden && !robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    if (robots) {
      if (hidden) robots.content = 'noindex';
      else robots.remove();
    }

    if (firstRoute.current) firstRoute.current = false;
    else mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  const phase = state.room.view?.phase;
  const inGame = /^\/room\//.test(location.pathname) && phase === 'PLAYING';
  const forcedChoice = Boolean(state.game.view?.decision);

  const goBack = useCallback((): void => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  }, [navigate]);

  const api = useMemo<ShellApi>(
    () => ({ openRules: () => setRulesOpen(true), openSettings: () => setSettingsOpen(true) }),
    [],
  );

  const onHelp = (): void => {
    if (inGame) setRulesOpen(true);
    else if (location.pathname !== '/rules') navigate('/rules');
  };

  return (
    <ShellContext.Provider value={api}>
      <div className={s['shell']}>
        <a href="#main" className={s['skip']}>
          {t('app.skipToMain')}
        </a>
        <header className={s['header']}>
          <div className={s['headerLeft']}>
            {inGame ? (
              <IconButton
                glyph="☰"
                label={t('nav.menu')}
                aria-disabled={forcedChoice || undefined}
                onClick={() => {
                  if (!forcedChoice) dispatch({ type: 'ui/menu', open: true });
                }}
              />
            ) : location.pathname !== '/' ? (
              <IconButton glyph="←" label={t('nav.back')} onClick={goBack} />
            ) : null}
          </div>
          <span className={s['brand']}>{t('app.name')}</span>
          <div className={s['headerRight']}>
            <ConnectionIndicator />
            <IconButton glyph="?" label={t('nav.help')} onClick={onHelp} />
          </div>
        </header>

        <ConnectionBanner />
        <main id="main" ref={mainRef} tabIndex={-1} className={s['main']} style={{ outline: 'none' }}>
          <ErrorBoundary key={location.pathname}>
            <Suspense fallback={<LoadingScreen />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>

        <Toast />
        <div className="sr-only" aria-live="polite" aria-atomic="true" ref={politeRef} />
        <div className="sr-only" aria-live="assertive" aria-atomic="true" ref={assertiveRef} />

        <Suspense fallback={null}>
          {rulesOpen ? <RulesDialog onClose={() => setRulesOpen(false)} /> : null}
          {settingsOpen ? <SettingsDialog onClose={() => setSettingsOpen(false)} /> : null}
        </Suspense>
      </div>
    </ShellContext.Provider>
  );
}
