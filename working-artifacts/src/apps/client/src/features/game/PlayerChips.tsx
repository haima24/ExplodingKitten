import { useEffect, useRef } from 'react';
import { t } from '../../copy';
import { Avatar } from '../../components/common/Avatar';
import { useReducedMotion } from '../../lib/useReducedMotion';
import { useStore } from '../../net/context';
import { selectChips, type Chip } from './selectors';
import g from './game.module.css';

function PlayerChip({ chip }: { chip: Chip }): JSX.Element {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();

  // Keep the active chip in view in the scrolling row.
  useEffect(() => {
    if (chip.status === 'active') {
      ref.current?.scrollIntoView({
        inline: 'nearest',
        block: 'nearest',
        behavior: reduced ? 'auto' : 'smooth',
      });
    }
  }, [chip.status, reduced]);

  const cards = chip.cards === 1 ? t('chip.card1') : t('chip.cards', { n: chip.cards });
  const statusText = t(`chip.${chip.status}` as const);
  const label = t('chip.aria', { name: chip.name, cards, status: statusText });

  return (
    <li
      ref={ref}
      className={[g['chip'], chip.status === 'active' && g['chipActive'], chip.status === 'out' && g['chipOut']]
        .filter(Boolean)
        .join(' ')}
      aria-label={label}
    >
      <Avatar avatarId={chip.avatarId} size={40} sleeping={chip.status === 'out'} />
      <span className={g['chipText']} aria-hidden="true">
        <span className={g['chipName']}>
          {chip.name}
          {chip.isMe ? ` (${t('chip.you')})` : ''}
        </span>
        <span className={g['chipMeta']}>
          {chip.status === 'out' ? 'zzz ' : ''}
          {chip.status === 'out' ? statusText : cards}
          {chip.twoTurns ? <span className={g['turnsBadge']}> {t('turn.badge2')}</span> : null}
        </span>
        {!chip.connected && !chip.isBot ? (
          <span className={g['chipMeta']}>◌ {t('lobby.reconnecting')}</span>
        ) : null}
        {chip.thinking ? <span className={g['chipMeta']}>…</span> : null}
      </span>
      {chip.status === 'active' ? (
        <span className={g['paw']} aria-hidden="true">
          🐾
        </span>
      ) : null}
    </li>
  );
}

export function PlayerChips(): JSX.Element {
  const { state } = useStore();
  const chips = selectChips(state);
  return (
    <ul className={g['chipRow']} aria-label={t('chip.row')}>
      {chips.map((chip) => (
        <PlayerChip key={chip.id} chip={chip} />
      ))}
    </ul>
  );
}
