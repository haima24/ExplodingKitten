import { useEffect, useState } from 'react';
import { useStore } from '../net/context';
import { isReducedMotion } from './settings';

/** Effective reduced-motion: the in-app setting, or the OS preference when set to "system". */
export function useReducedMotion(): boolean {
  const { state } = useStore();
  const [, force] = useState(0);
  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const list = matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (): void => force((n) => n + 1);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, []);
  return isReducedMotion(state.settings);
}
