// Original SVG art for the two big moments (US-069): a bomb with a burning fuse,
// the blast, and a trophy. Decorative: names and messages are always text.
const INK = '#1F1A3D';
const BOOM = '#C93217';
const ORANGE = '#F28C28';
const ACCENT = '#FFC83D';
const stroke = {
  stroke: INK,
  strokeWidth: 3,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const;

function star(cx: number, cy: number, spikes: number, outer: number, inner: number): string {
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / spikes;
    points.push(`${(cx + r * Math.sin(a)).toFixed(1)},${(cy - r * Math.cos(a)).toFixed(1)}`);
  }
  return points.join(' ');
}

/** A round bomb with a fuse that burns down while `burning` is true. */
export function BombArt({
  size = 120,
  burning = true,
}: {
  size?: number;
  burning?: boolean;
}): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="30" cy="40" r="19" fill={INK} />
      <path
        d="M19 34a12 12 0 0 1 9-8"
        fill="none"
        stroke="#fff"
        strokeWidth={3.2}
        strokeLinecap="round"
      />
      <rect
        x="25"
        y="17"
        width="10"
        height="7"
        rx="2"
        fill="#5b5670"
        {...stroke}
        strokeWidth={2.5}
      />
      <path
        className="bombFuse"
        d="M31 17Q33 9 41 8"
        fill="none"
        stroke="#8a5a2b"
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      {burning ? (
        <g className="bombSpark">
          <polygon points={star(42, 7, 5, 8, 3.2)} fill={ACCENT} {...stroke} strokeWidth={2} />
          <circle cx="42" cy="7" r="2.4" fill="#fff" />
        </g>
      ) : null}
    </svg>
  );
}

/** The blast: a big starburst with a smaller bright core. */
export function BlastArt({ size = 160 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <polygon points={star(32, 32, 14, 31, 20)} fill={ORANGE} {...stroke} />
      <polygon points={star(32, 32, 11, 25, 15)} fill={BOOM} {...stroke} />
      <polygon points={star(32, 32, 9, 15, 9)} fill={ACCENT} {...stroke} strokeWidth={2.2} />
    </svg>
  );
}

/** A golden cup with handles and a plate for the winner's name. */
export function TrophyArt({ size = 150 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M15 12H8c-2 12 3 19 12 20"
        fill="none"
        stroke={INK}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path
        d="M49 12h7c2 12-3 19-12 20"
        fill="none"
        stroke={INK}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path d="M15 8h34v14c0 10-7 17-17 17S15 32 15 22Z" fill={ACCENT} {...stroke} />
      <path
        d="M21 13v9c0 6 3 10 7 12"
        fill="none"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <rect x="29" y="38" width="6" height="8" fill={ORANGE} {...stroke} strokeWidth={2.5} />
      <rect x="20" y="46" width="24" height="8" rx="2.5" fill={ORANGE} {...stroke} />
      <polygon points={star(32, 21, 5, 7, 3)} fill="#fff" {...stroke} strokeWidth={2} />
    </svg>
  );
}
