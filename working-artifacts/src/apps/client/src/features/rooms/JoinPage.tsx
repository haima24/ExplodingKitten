import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { parseCode, type DisplayName } from '@wb/protocol/shared';
import { t } from '../../copy';
import { joinErrorMessage } from '../../copy/errors';
import { Button } from '../../components/common/Button';
import c from '../../components/common/common.module.css';
import f from '../../components/common/forms.module.css';
import { AckTimeout, ConnectionLost, ServerError } from '../../net/client';
import { useStore } from '../../net/context';
import { ExistingSeatDialog } from './ExistingSeatDialog';
import { IdentityStep } from './IdentityStep';

function CodeEntry({ initialError }: { initialError: string | null }): JSX.Element {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(initialError);

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    const code = parseCode(text);
    if (!code) {
      setError(t('join.invalidCode'));
      return;
    }
    navigate(`/join/${code}`);
  };

  return (
    <form onSubmit={submit} className={f['fieldset']} style={{ gap: 'var(--space-4)' }}>
      <label htmlFor="room-code" className={f['label']}>
        {t('join.code')}
      </label>
      <input
        id="room-code"
        className={f['textInput']}
        value={text}
        onChange={(e) => {
          setText(e.target.value.toUpperCase());
          setError(null);
        }}
        autoComplete="off"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        inputMode="text"
        maxLength={14}
        aria-describedby="room-code-help"
        aria-invalid={error ? true : undefined}
      />
      <p id="room-code-help" className={f['help']}>
        {t('join.codeHelp')}
      </p>
      {error ? (
        <p role="alert" className={f['error']}>
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" block>
        {t('join.continue')}
      </Button>
    </form>
  );
}

function JoinIdentity({ code }: { code: string }): JSX.Element {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fatal, setFatal] = useState(false);
  const [taken, setTaken] = useState<string[]>([]);
  const [seatHandled, setSeatHandled] = useState(false);

  const submit = async (name: DisplayName, avatarId: string): Promise<void> => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const joined = await client.joinRoom(code, name, avatarId);
      navigate(`/room/${joined}`);
    } catch (e) {
      if (e instanceof ServerError) {
        setError(joinErrorMessage(e.code));
        if (e.code === 'AVATAR_TAKEN') setTaken(e.data?.taken ?? []);
        else if (e.code !== 'RATE_LIMITED') setFatal(e.code !== 'INVALID_NAME' && e.code !== 'INVALID_AVATAR');
      } else if (e instanceof AckTimeout || e instanceof ConnectionLost) {
        setError(t('join.failed'));
      } else {
        setError(t('home.cannotConnect'));
      }
      setBusy(false);
    }
  };

  return (
    <>
      <h1>{t('join.joining', { code })}</h1>
      {fatal && error ? (
        <div className={c['stack']}>
          <p role="alert" className={f['error']}>
            <span aria-hidden="true">⚠️</span> {error}
          </p>
          <Button onClick={() => navigate('/join')}>{t('join.tryAgain')}</Button>
          <Button onClick={() => navigate('/')}>{t('nav.home')}</Button>
        </div>
      ) : (
        <IdentityStep
          submitLabel={t('join.submit')}
          busy={busy}
          error={error}
          taken={taken}
          onSubmit={(n, a) => void submit(n, a)}
        />
      )}
      {state.session && !seatHandled ? (
        <ExistingSeatDialog onLeft={() => setSeatHandled(true)} onDismiss={() => navigate('/')} />
      ) : null}
    </>
  );
}

/** `/join` asks for a code; `/join/:code` (from a share link) goes straight to the identity step. */
export function JoinPage(): JSX.Element {
  const { code: param } = useParams();
  const code = param ? parseCode(param) : null;
  return (
    <div className={c['page']}>
      {code ? (
        <JoinIdentity key={code} code={code} />
      ) : (
        <>
          <h1>{t('join.title')}</h1>
          <CodeEntry initialError={param ? t('join.invalidCode') : null} />
        </>
      )}
    </div>
  );
}
