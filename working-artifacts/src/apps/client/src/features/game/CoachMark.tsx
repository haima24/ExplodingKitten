import { t, type CopyKey } from '../../copy';
import { Button } from '../../components/common/Button';
import { useStore } from '../../net/context';
import g from './game.module.css';

const TIPS: CopyKey[] = ['tips.hand', 'tips.deck', 'tips.select', 'tips.boom'];

/**
 * One short dismissible tip at a time, shown as a strip above the actions so it
 * never covers the control it points at. Each tip shows once per device.
 */
export function CoachMark(): JSX.Element | null {
  const { state, dispatch } = useStore();
  const { tips } = state.ui;
  // Tips wait while a dialog is open.
  if (tips.hidden || tips.visible === null || state.ui.overlays > 0 || state.ui.menuOpen) return null;
  const key = TIPS[tips.visible];
  if (!key) return null;
  return (
    <div className={g['tip']} role="status">
      <span>💡 {t(key)}</span>
      <Button compact onClick={() => dispatch({ type: 'tips/dismiss' })}>
        {t('tips.gotIt')}
      </Button>
      <Button compact onClick={() => dispatch({ type: 'tips/skip' })}>
        {t('tips.skip')}
      </Button>
    </div>
  );
}
