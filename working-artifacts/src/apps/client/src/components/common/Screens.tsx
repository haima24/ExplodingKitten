import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../../copy';
import { useStore } from '../../net/context';
import { Button } from './Button';
import s from './common.module.css';

/** Shows only if loading takes longer than 300 ms, so fast loads show nothing. */
export function LoadingScreen({ text = t('loading.text') }: { text?: string }): JSX.Element | null {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 300);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return <div className={s['center']} role="status" aria-busy="true" />;
  return (
    <div className={s['center']} role="status">
      <span className={s['bigGlyph']} aria-hidden="true">
        🐱
      </span>
      <p>{text}</p>
    </div>
  );
}

const FAILURE_WINDOW_MS = 60_000;
const MAX_FAILURES = 3;

interface BoundaryProps {
  children: ReactNode;
  onRecover: () => void;
  onHome: () => void;
}
interface BoundaryState {
  failed: boolean;
}

/** Catches render errors. Logs to the console only: no names or game content leave the page. */
class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };
  private failures: number[] = [];

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo): void {
    console.error('UI error:', error.name);
    const now = Date.now();
    this.failures = [...this.failures.filter((at) => now - at < FAILURE_WINDOW_MS), now];
  }

  private retry = (): void => {
    this.setState({ failed: false });
    this.props.onRecover();
  };

  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    const canRetry = this.failures.length < MAX_FAILURES;
    return (
      <div className={s['center']} role="alert">
        <span className={s['bigGlyph']} aria-hidden="true">
          😿
        </span>
        <h1>{t('errorScreen.title')}</h1>
        <div className={s['centerActions']}>
          {canRetry ? (
            <Button variant="primary" onClick={this.retry}>
              {t('errorScreen.tryAgain')}
            </Button>
          ) : null}
          <Button onClick={this.props.onHome}>{t('errorScreen.home')}</Button>
        </div>
      </div>
    );
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }): JSX.Element {
  const { state, client } = useStore();
  const navigate = useNavigate();
  const hasSession = state.session !== null;
  return (
    <Boundary
      onRecover={() => {
        // Rebuild state from a fresh server snapshot when this device still has a seat.
        if (hasSession) void client.rejoin();
        else navigate('/');
      }}
      onHome={() => {
        navigate('/');
      }}
    >
      {children}
    </Boundary>
  );
}
