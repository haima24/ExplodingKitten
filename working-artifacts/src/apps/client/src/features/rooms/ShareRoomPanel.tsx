import { lazy, Suspense, useRef, useState } from 'react';
import type { RoomView } from '@wb/protocol/shared';
import { t } from '../../copy';
import { Button } from '../../components/common/Button';
import { announcer } from '../../lib/announcer';
import { buildShareLink, spellCode } from '../../lib/links';
import r from './rooms.module.css';

const QrCode = lazy(() => import('./QrCode').then((m) => ({ default: m.QrCode })));

/** Room code and sharing controls (host only). Players see the code text only. */
export function ShareRoomPanel({ room, isHost }: { room: RoomView; isHost: boolean }): JSX.Element {
  const [manual, setManual] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const joinable = room.phase === 'LOBBY' && room.members.filter((m) => m.status !== 'LEFT').length < room.capacity;
  const link = buildShareLink(window.location.origin, room.code);
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copy = async (text: string, done: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setManual(null);
      announcer.announce(done);
    } catch {
      // Clipboard blocked or missing: show the text selected so it can be copied by hand.
      setManual(text);
      window.setTimeout(() => input.current?.select(), 0);
    }
  };

  const share = async (): Promise<void> => {
    try {
      await navigator.share({ title: t('share.title'), text: t('share.message'), url: link });
    } catch {
      /* the person closed the share sheet: stay silent */
    }
  };

  return (
    <section className={r['panel']} aria-labelledby="share-title">
      <h2 id="share-title">{t('share.code')}</h2>
      <div className={r['codeBox']}>
        <p className={r['code']}>
          <span aria-hidden="true">{room.code}</span>
          <span className="sr-only">{spellCode(room.code)}</span>
        </p>
        {!joinable ? (
          <p role="status">
            <strong>{room.phase === 'LOBBY' ? t('lobby.roomFull') : t('lobby.gameInProgress')}</strong>
          </p>
        ) : null}
      </div>

      {isHost && joinable ? (
        <>
          <div className={r['shareActions']}>
            <Button onClick={() => void copy(room.code, t('share.codeCopied'))}>{t('share.copyCode')}</Button>
            <Button onClick={() => void copy(link, t('share.linkCopied'))}>{t('share.copyLink')}</Button>
            {canShare ? <Button onClick={() => void share()}>{t('share.share')}</Button> : null}
            <Button aria-expanded={showQr} onClick={() => setShowQr((v) => !v)}>
              {showQr ? t('share.hideQr') : t('share.showQr')}
            </Button>
          </div>
          {manual ? (
            <div>
              <input
                ref={input}
                readOnly
                className={r['manual']}
                value={manual}
                aria-label={t('share.manual')}
                onFocus={(e) => e.currentTarget.select()}
              />
              <p>{t('share.manual')}</p>
            </div>
          ) : null}
          {showQr ? (
            <Suspense fallback={<p role="status">{t('loading.text')}</p>}>
              <QrCode link={link} code={room.code} />
            </Suspense>
          ) : null}
          <p>{t('share.trust')}</p>
        </>
      ) : null}
    </section>
  );
}
