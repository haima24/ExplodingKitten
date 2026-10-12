import { LinkButton } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { t } from '../../copy';
import type { State } from '../../net/state';

/** Shown after `room.ended` or when the seat can no longer be found (US-056, US-043). */
export function EndedScreen({ reason }: { reason: NonNullable<State['room']['ended']> }): JSX.Element {
  const text = reason === 'NO_SEAT' ? t('ended.noSeat') : t(`ended.${reason}` as const);
  return (
    <div className={c['center']}>
      <span className={c['bigGlyph']} aria-hidden="true">
        🐾
      </span>
      <h1>{text}</h1>
      <div className={c['centerActions']}>
        <LinkButton to="/" variant="primary">
          {t('ended.home')}
        </LinkButton>
      </div>
    </div>
  );
}
