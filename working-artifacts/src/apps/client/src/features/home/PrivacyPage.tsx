import { getLocale, t } from '../../copy';
import c from '../../components/common/common.module.css';

const ITEMS = [
  'privacy.item.name',
  'privacy.item.game',
  'privacy.item.token',
  'privacy.item.settings',
  'privacy.item.ip',
  'privacy.item.none',
] as const;

/** Plain-language list of exactly what is kept and for how long (US-042). */
export function PrivacyPage(): JSX.Element {
  return (
    <div className={c['page']}>
      <h1>{t('privacy.title')}</h1>
      {getLocale() !== 'en' ? (
        <p role="note" className={c['muted']}>
          {t('privacy.draftNotice')}
        </p>
      ) : null}
      <p>{t('privacy.intro')}</p>
      <ul className={c['stack']} style={{ paddingLeft: '1.25rem' }}>
        {ITEMS.map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ul>
    </div>
  );
}
