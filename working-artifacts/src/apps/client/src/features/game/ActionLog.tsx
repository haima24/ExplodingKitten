import { t } from '../../copy';
import { useStore } from '../../net/context';
import g from './game.module.css';

/**
 * Recent public moves, newest first. `aria-live="off"` because the Announcer
 * already speaks each event; this list is for looking back.
 */
export function ActionLog(): JSX.Element {
  const { state } = useStore();
  const log = state.game.log;
  return (
    <ol className={g['log']} role="log" aria-live="off" aria-label={t('log.title')}>
      {log.length === 0 ? <li className={g['logItem']}>{t('log.empty')}</li> : null}
      {log.map((entry) => (
        <li key={entry.seq} className={g['logItem']}>
          {entry.text}
        </li>
      ))}
    </ol>
  );
}

/** Desktop side panel. Smaller screens reach the log from the game menu. */
export function LogPanel(): JSX.Element {
  return (
    <section className={g['logPanel']} aria-labelledby="log-title">
      <h2 id="log-title">{t('log.title')}</h2>
      <ActionLog />
    </section>
  );
}
