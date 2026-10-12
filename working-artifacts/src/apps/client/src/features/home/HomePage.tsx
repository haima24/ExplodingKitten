import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { t } from '../../copy';
import { Button, LinkButton } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { CardIcon } from '../game/art/CardIcon';
import { useStore } from '../../net/context';
import s from './home.module.css';

/** Shown when this device still holds a seat (US-043). */
function RejoinBanner(): JSX.Element | null {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const session = state.session;
  if (!session) return null;

  const rejoin = async (): Promise<void> => {
    setBusy(true);
    setFailed(false);
    const result = await client.rejoin();
    setBusy(false);
    if (result === 'ok') navigate(`/room/${session.code}`);
    else if (result === 'lost') setFailed(true);
  };

  return (
    <section className={s['rejoin']} aria-label={t('home.rejoin.text', { code: session.code })}>
      <p>{t('home.rejoin.text', { code: session.code })}</p>
      {failed ? (
        <p role="alert" className={s['problem']}>
          <span aria-hidden="true">⚠️</span> {t('home.cannotConnect')}
        </p>
      ) : null}
      <div className={s['rejoinActions']}>
        <Button variant="primary" compact loading={busy} onClick={() => void rejoin()}>
          {t('home.rejoin.rejoin')}
        </Button>
        <Button compact onClick={() => client.forgetSession()}>
          {t('home.rejoin.forget')}
        </Button>
      </div>
    </section>
  );
}

/** One tap to switch between English and Tiếng Việt, named in the other language. */
function LanguageSwitch(): JSX.Element {
  const { state, dispatch } = useStore();
  const next = state.settings.language === 'vi' ? 'en' : 'vi';
  const nextName = next === 'vi' ? 'Tiếng Việt' : 'English';
  return (
    <Button
      compact
      lang={next}
      aria-label={t('lang.switchAria', { name: nextName })}
      onClick={() => dispatch({ type: 'settings/patch', patch: { language: next } })}
    >
      <span aria-hidden="true">🌐 </span>
      {nextName}
    </Button>
  );
}

export function HomePage(): JSX.Element {
  const { client } = useStore();
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState<'create' | 'join' | null>(null);
  const [problem, setProblem] = useState(false);
  const inFlight = useRef(false);

  // Create and Join need a connection first; the two static buttons never do.
  const go = async (target: 'create' | 'join'): Promise<void> => {
    if (inFlight.current) return;
    inFlight.current = true;
    setConnecting(target);
    setProblem(false);
    try {
      await client.ensureConnected(5000);
      navigate(target === 'create' ? '/create' : '/join');
    } catch {
      setProblem(true);
    } finally {
      inFlight.current = false;
      setConnecting(null);
    }
  };

  return (
    <div className={s['home']}>
      <div className={s['hero']}>
        <Logo size={96} />
        <h1>{t('app.name')}</h1>
        <p className={s['tagline']}>{t('home.tagline')}</p>
        <span className={s['cats']} aria-hidden="true">
          <CardIcon kind="COZY_CAT" size={48} />
          <CardIcon kind="BOOM_CAT" size={48} />
          <CardIcon kind="TREAT" size={48} />
          <CardIcon kind="NOPE" size={48} />
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <RejoinBanner />
        <nav className={s['actions']} aria-label={t('app.name')}>
          <Button variant="primary" block loading={connecting === 'create'} onClick={() => void go('create')}>
            {t('home.create')}
          </Button>
          <Button block loading={connecting === 'join'} onClick={() => void go('join')}>
            {t('home.join')}
          </Button>
          <LinkButton to="/rules" block>
            {t('home.rules')}
          </LinkButton>
          <LinkButton to="/settings" block>
            {t('home.settings')}
          </LinkButton>
          {problem ? (
            <p role="alert" className={s['problem']}>
              <span aria-hidden="true">⚠️</span> {t('home.cannotConnect')}
            </p>
          ) : null}
        </nav>
      </div>

      <footer className={s['footer']}>
        <p>{t('home.footer')}</p>
        <LanguageSwitch />
        <Link to="/privacy">{t('home.privacy')}</Link>
      </footer>
    </div>
  );
}
