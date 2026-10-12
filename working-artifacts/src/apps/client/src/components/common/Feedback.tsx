import { useEffect, useRef, useState } from 'react';
import { t } from '../../copy';
import { useStore } from '../../net/context';
import { Button } from './Button';
import s from './common.module.css';

/** Friendly message next to the control that caused it (US-040). Never red-only. */
export function InlineMessage(): JSX.Element | null {
  const { state, dispatch } = useStore();
  const message = state.ui.inlineMessage;

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => dispatch({ type: 'ui/inline', message: null }), 5000);
    return () => window.clearTimeout(timer);
  }, [message, dispatch]);

  if (!message) return <div role="status" />;
  return (
    <div role="status">
      <span className={s['inline']}>
        <span aria-hidden="true">💬</span>
        <span>{message.text}</span>
      </span>
    </div>
  );
}

/** Visual copy of public messages; speech is handled by the Announcer. */
export function Toast(): JSX.Element | null {
  const { state, dispatch } = useStore();
  const toast = state.ui.toast;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => dispatch({ type: 'ui/toast', message: null }), 4000);
    return () => window.clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;
  return (
    <div className={s['toastRegion']}>
      <div className={s['toast']}>
        <span>{toast.text}</span>
        <button
          type="button"
          className={s['toastClose']}
          aria-label={t('tips.gotIt')}
          onClick={() => dispatch({ type: 'ui/toast', message: null })}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}

const GLYPH = {
  online: '●',
  connecting: '◌',
  reconnecting: '◌',
  offline: '✕',
  idle: '○',
} as const;

export function ConnectionIndicator(): JSX.Element {
  const { state } = useStore();
  const status = state.connection.status;
  return (
    <span className={s['status']}>
      <span className={s['statusGlyph']} aria-hidden="true">
        {GLYPH[status]}
      </span>
      <span className={s['labelWide']}>{t(`conn.status.${status}`)}</span>
      <span className="sr-only">{t(`conn.status.${status}`)}</span>
    </span>
  );
}

/** Non-blocking status banner; appears after 1 s so short drops do not flicker. */
export function ConnectionBanner(): JSX.Element | null {
  const { state, client } = useStore();
  const { status } = state.connection;
  const inRoom = state.session !== null;
  const [visible, setVisible] = useState(false);
  const [backOnline, setBackOnline] = useState(false);
  const previous = useRef(status);

  useEffect(() => {
    const was = previous.current;
    previous.current = status;
    if (status === 'online' && (was === 'reconnecting' || was === 'offline')) {
      setBackOnline(true);
      const timer = window.setTimeout(() => setBackOnline(false), 3000);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [status]);

  const trouble = inRoom && (status === 'connecting' || status === 'reconnecting');
  useEffect(() => {
    if (!trouble) {
      setVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), 1000);
    return () => window.clearTimeout(timer);
  }, [trouble]);

  if (backOnline && status === 'online') {
    return (
      <div role="status" className={`${s['banner']} ${s['bannerOk']}`}>
        <span aria-hidden="true">✔</span> {t('conn.online')}
      </div>
    );
  }
  if (inRoom && status === 'offline') {
    return (
      <div role="status" className={`${s['banner']} ${s['bannerBad']}`}>
        <span>{t('conn.lost')}</span>
        <Button compact onClick={() => client.retryNow()}>
          {t('conn.tryAgain')}
        </Button>
      </div>
    );
  }
  if (trouble && visible) {
    return (
      <div role="status" className={`${s['banner']} ${s['bannerWarn']}`}>
        <span aria-hidden="true">◌</span>{' '}
        {status === 'connecting' ? t('conn.connecting') : t('conn.reconnecting')}
      </div>
    );
  }
  return <div role="status" />;
}
