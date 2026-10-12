import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import { Modal } from '../../components/common/Modal';
import { useStore } from '../../net/context';

/** "You're already in room X. Rejoin it, or leave it first?" (US-003, US-006) */
export function ExistingSeatDialog({
  onLeft,
  onDismiss,
}: {
  onLeft: () => void;
  onDismiss: () => void;
}): JSX.Element | null {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<'rejoin' | 'leave' | null>(null);
  const session = state.session;
  if (!session) return null;

  return (
    <Modal title={t('seat.title', { code: session.code })} onClose={onDismiss} narrow>
      <p>{t('seat.body')}</p>
      <div className={c['dialogActions']}>
        <Button
          variant="primary"
          data-autofocus
          loading={busy === 'rejoin'}
          onClick={async () => {
            setBusy('rejoin');
            const result = await client.rejoin();
            setBusy(null);
            if (result === 'ok') navigate(`/room/${session.code}`);
            else if (result !== 'lost') onLeft();
          }}
        >
          {t('seat.rejoin')}
        </Button>
        <Button
          loading={busy === 'leave'}
          onClick={async () => {
            setBusy('leave');
            await client.leaveRoom();
            setBusy(null);
            onLeft();
          }}
        >
          {t('seat.leave')}
        </Button>
      </div>
    </Modal>
  );
}
