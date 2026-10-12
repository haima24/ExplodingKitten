import { t } from '../../copy';
import { LinkButton } from '../../components/common/Button';
import c from '../../components/common/common.module.css';

export function NotFoundPage(): JSX.Element {
  return (
    <div className={c['center']}>
      <span className={c['bigGlyph']} aria-hidden="true">
        😿
      </span>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.body')}</p>
      <div className={c['centerActions']}>
        <LinkButton to="/" variant="primary">
          {t('nav.home')}
        </LinkButton>
      </div>
    </div>
  );
}
