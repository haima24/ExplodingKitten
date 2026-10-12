import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DisplayName } from '@wb/protocol/shared';
import { t } from '../../copy';
import { joinErrorMessage } from '../../copy/errors';
import c from '../../components/common/common.module.css';
import { useStore } from '../../net/context';
import { AckTimeout, ConnectionLost, ServerError } from '../../net/client';
import { ExistingSeatDialog } from './ExistingSeatDialog';
import { IdentityStep } from './IdentityStep';

export function CreatePage(): JSX.Element {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seatHandled, setSeatHandled] = useState(false);

  const submit = async (name: DisplayName, avatarId: string): Promise<void> => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const code = await client.createRoom(name, avatarId);
      navigate(`/room/${code}`);
    } catch (e) {
      if (e instanceof ServerError) setError(e.code === 'TOO_MANY_ROOMS' ? joinErrorMessage(e.code) : t('create.failed'));
      else if (e instanceof AckTimeout || e instanceof ConnectionLost) setError(t('create.failed'));
      else setError(t('home.cannotConnect'));
      setBusy(false);
    }
  };

  return (
    <div className={c['page']}>
      <h1>{t('create.title')}</h1>
      <IdentityStep
        submitLabel={t('create.submit')}
        busy={busy}
        error={error}
        hint={t('create.grownup')}
        onSubmit={(n, a) => void submit(n, a)}
      />
      {state.session && !seatHandled ? (
        <ExistingSeatDialog onLeft={() => setSeatHandled(true)} onDismiss={() => navigate('/')} />
      ) : null}
    </div>
  );
}
