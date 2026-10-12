import { t } from '../../copy';
import { cardName } from '../../copy/cards';
import { useStore } from '../../net/context';
import type { LogEntry } from '../../net/state';
import g from './game.module.css';

/** Words a log entry in the current language. */
export function logText(entry: LogEntry): string {
  const params: Record<string, string | number> = { ...entry.params };
  for (const [name, kind] of Object.entries(entry.cards ?? {})) params[name] = cardName(kind);
  return t(entry.key, params);
}

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
          {logText(entry)}
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
