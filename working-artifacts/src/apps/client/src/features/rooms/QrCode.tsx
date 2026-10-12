import { useEffect, useState } from 'react';
import { t } from '../../copy';
import r from './rooms.module.css';

interface Grid {
  size: number;
  dark: boolean[][];
}

/**
 * Lazily generated QR code (the library is a dynamic import, so it is not part
 * of the initial bundle). It encodes exactly the share link and is built
 * locally: no network call. Dark modules on white, with a 4-module quiet zone.
 */
export function QrCode({ link, code }: { link: string; code: string }): JSX.Element {
  const [grid, setGrid] = useState<Grid | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import('qrcode-generator')
      .then(({ default: qrcode }) => {
        const qr = qrcode(0, 'M');
        qr.addData(link);
        qr.make();
        const size = qr.getModuleCount();
        const dark = Array.from({ length: size }, (_, row) =>
          Array.from({ length: size }, (_, col) => qr.isDark(row, col)),
        );
        if (!cancelled) setGrid({ size, dark });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [link]);

  if (failed) return <p role="status">{t('share.qrFailed')}</p>;
  if (!grid) return <p role="status">{t('loading.text')}</p>;

  const quiet = 4;
  const total = grid.size + quiet * 2;
  const rects: JSX.Element[] = [];
  grid.dark.forEach((row, y) =>
    row.forEach((isDark, x) => {
      if (isDark) rects.push(<rect key={`${x}-${y}`} x={x + quiet} y={y + quiet} width="1" height="1" />);
    }),
  );

  return (
    <figure className={r['qr']} style={{ margin: 0 }}>
      <svg
        viewBox={`0 0 ${total} ${total}`}
        role="img"
        aria-label={t('share.qrLabel', { code })}
        shapeRendering="crispEdges"
      >
        <rect width={total} height={total} fill="#fff" />
        <g fill="#000">{rects}</g>
      </svg>
      <figcaption aria-hidden="true">{code}</figcaption>
    </figure>
  );
}
