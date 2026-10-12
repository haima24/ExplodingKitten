import { useNavigate } from 'react-router-dom';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { Modal } from '../../components/common/Modal';
import { RulesContent } from './RulesContent';

/** The /rules route. Skip or Done returns to where the person came from. */
export function RulesPage(): JSX.Element {
  const navigate = useNavigate();
  const exit = (): void => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate('/');
  };
  return (
    <div className={c['page']}>
      <h1>{t('rules.title')}</h1>
      <RulesContent onExit={exit} />
    </div>
  );
}

/** Help dialog. Game state keeps updating underneath; nothing here touches it. */
export function RulesDialog({ onClose }: { onClose: () => void }): JSX.Element {
  return (
    <Modal title={t('rules.title')} onClose={onClose}>
      <RulesContent onExit={onClose} />
      <div className={c['dialogActions']}>
        <Button onClick={onClose} data-autofocus>
          {t('rules.close')}
        </Button>
      </div>
    </Modal>
  );
}
