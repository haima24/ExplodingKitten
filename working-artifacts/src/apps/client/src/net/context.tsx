import {
  createContext,
  useLayoutEffect,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import { setLocale } from '../copy';
import { applySettings, saveSettings } from '../lib/settings';
import { GameClient } from './client';
import { initialState, reducer, type Action, type State } from './state';

interface Store {
  state: State;
  dispatch: Dispatch<Action>;
  client: GameClient;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }): JSX.Element {
  const [state, reactDispatch] = useReducer(reducer, undefined, initialState);
  // The client reads state synchronously between renders, so a mirror is kept in
  // step by running the same pure reducer on every dispatch.
  const mirror = useRef<State>(state);

  const dispatch = useCallback<Dispatch<Action>>((action) => {
    mirror.current = reducer(mirror.current, action);
    reactDispatch(action);
  }, []);

  const client = useMemo(() => new GameClient(dispatch, () => mirror.current), [dispatch]);

  // The language switches before paint, so no frame shows mixed languages.
  useLayoutEffect(() => {
    setLocale(state.settings.language);
  }, [state.settings.language]);

  // Persist and apply settings whenever they change (device-only storage).
  useEffect(() => {
    saveSettings(state.settings);
    applySettings(state.settings);
  }, [state.settings]);

  // Follow OS changes while the motion setting is "system".
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (): void => applySettings(mirror.current.settings);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const value = useMemo<Store>(() => ({ state, dispatch, client }), [state, dispatch, client]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
