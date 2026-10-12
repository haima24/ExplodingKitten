import type { ReactNode } from 'react';
import type { CardKind } from '@wb/engine/types';

// Original flat-colour SVG icons, one per card, drawn for this project (no
// third-party artwork). Palette matches the design tokens. Decorative: every
// card also shows its name and effect as text.
const INK = '#1F1A3D';
const BOOM = '#C93217';
const ACCENT = '#FFC83D';
const PRIMARY = '#5B3FD9';
const SUCCESS = '#17784A';
const INFO = '#0F6E8C';
const ORANGE = '#F28C28';
const TEAL = '#1B9C93';

const stroke = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

/** Points of a star polygon (used for explosions and sparkles). */
function star(cx: number, cy: number, spikes: number, outer: number, inner: number, rotate = 0): string {
  const points: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = rotate + (Math.PI * i) / spikes;
    points.push(`${(cx + r * Math.sin(a)).toFixed(1)},${(cy - r * Math.cos(a)).toFixed(1)}`);
  }
  return points.join(' ');
}

/** Cat head with ears, drawn in a 64 x 64 box. */
export const CAT_HEAD = 'M14 26 18 10l12 9h4l12-9 4 16c3 4 4 8 4 12 0 10-9 16-22 16S10 48 10 38c0-4 1-8 4-12z';

function Paw({ x, y, scale = 1, fill }: { x: number; y: number; scale?: number; fill: string }): JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill} {...stroke} strokeWidth={2.5 / scale}>
      <ellipse cx="0" cy="5" rx="8" ry="6.5" />
      <circle cx="-9" cy="-5" r="3.6" />
      <circle cx="-3.2" cy="-10" r="3.6" />
      <circle cx="3.2" cy="-10" r="3.6" />
      <circle cx="9" cy="-5" r="3.6" />
    </g>
  );
}

/** A small symbol for each of the 5 Cat designs, so they never rely on colour alone (US-065). */
function DesignSymbol({ variant }: { variant: number | undefined }): JSX.Element | null {
  switch (variant) {
    case 1: // Tacocat: a taco shell with lettuce
      return (
        <g {...stroke} strokeWidth={2}>
          <path d="M2 17a12 12 0 0 1 24 0Z" fill={ORANGE} />
          <path d="M5 15q3-4 5 0t5 0 5 0" fill="none" stroke={SUCCESS} strokeWidth={2.2} />
        </g>
      );
    case 2: // Potato Cat: a lumpy potato
      return (
        <g {...stroke} strokeWidth={2}>
          <ellipse cx="14" cy="14" rx="12" ry="8.5" fill="#B9794A" />
          <circle cx="9" cy="12" r="1.2" fill={INK} />
          <circle cx="16" cy="16" r="1.2" fill={INK} />
          <circle cx="19" cy="11" r="1.2" fill={INK} />
        </g>
      );
    case 3: // Beard Cat: a bushy beard
      return (
        <g {...stroke} strokeWidth={2}>
          <path d="M2 6a12 12 0 0 0 24 0Z" fill="#6b4a32" />
          <path d="M8 6v6M14 6v9M20 6v6" fill="none" stroke="#fff" strokeWidth={1.4} />
        </g>
      );
    case 4: // Rainbow Cat: a rainbow
      return (
        <g fill="none" strokeLinecap="round" strokeWidth={3}>
          <path d="M3 22a11 11 0 0 1 22 0" stroke={BOOM} />
          <path d="M7 22a7 7 0 0 1 14 0" stroke={ACCENT} />
          <path d="M11 22a3 3 0 0 1 6 0" stroke={INFO} />
        </g>
      );
    case 5: // Cattermelon: a melon slice
      return (
        <g {...stroke} strokeWidth={2}>
          <path d="M2 6a12 12 0 0 0 24 0Z" fill="#E4577A" />
          <path d="M2 6h24" stroke={SUCCESS} strokeWidth={3} />
          <circle cx="9" cy="12" r="1.1" fill={INK} />
          <circle cx="14" cy="15" r="1.1" fill={INK} />
          <circle cx="19" cy="12" r="1.1" fill={INK} />
        </g>
      );
    default:
      return null;
  }
}

function art(kind: CardKind, variant?: number): ReactNode {
  switch (kind) {
    case 'BOOM_CAT': // Exploding Kitten: a startled cat in front of a burst
      return (
        <>
          <polygon points={star(32, 33, 11, 30, 19)} fill={BOOM} {...stroke} />
          <g transform="translate(13 15) scale(.62)">
            <path d={CAT_HEAD} fill={ACCENT} {...stroke} strokeWidth={4.5} />
            <circle cx="24" cy="36" r="7" fill="#fff" {...stroke} strokeWidth={3.5} />
            <circle cx="40" cy="36" r="7" fill="#fff" {...stroke} strokeWidth={3.5} />
            <circle cx="24" cy="36" r="2.6" fill={INK} />
            <circle cx="40" cy="36" r="2.6" fill={INK} />
            <ellipse cx="32" cy="50" rx="5" ry="6" fill={INK} />
          </g>
        </>
      );
    case 'TREAT': // Defuse: a bomb whose fuse has been cut, marked safe
      return (
        <>
          <circle cx="29" cy="39" r="17" fill={INK} />
          <path d="M20 33a10 10 0 0 1 8-7" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
          <path d="M37 26 41 20" fill="none" stroke="#8a5a2b" strokeWidth={4} strokeLinecap="round" />
          <path d="M47 14 50 9" fill="none" stroke="#8a5a2b" strokeWidth={4} strokeLinecap="round" />
          <circle cx="50" cy="48" r="10" fill={SUCCESS} {...stroke} />
          <path d="M45 48l4 4 7-8" fill="none" stroke="#fff" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'HOP_OVER': // Skip: a paw hopping over with a forward arrow
      return (
        <>
          <Paw x={22} y={44} scale={1.2} fill={ACCENT} />
          <path d="M8 30C18 6 46 6 54 26" fill="none" stroke={INFO} strokeWidth={5} strokeLinecap="round" />
          <polygon points="60,30 46,32 54,18" fill={INFO} {...stroke} strokeWidth={2.5} />
        </>
      );
    case 'PEEK': // See the Future: an eye with sparkles
      return (
        <>
          <path d="M5 34C16 16 48 16 59 34 48 52 16 52 5 34Z" fill="#fff" {...stroke} />
          <circle cx="32" cy="34" r="11" fill={PRIMARY} {...stroke} />
          <circle cx="32" cy="34" r="4.5" fill={INK} />
          <circle cx="28.5" cy="30.5" r="2" fill="#fff" />
          <polygon points={star(52, 13, 4, 8, 3)} fill={ACCENT} {...stroke} strokeWidth={2} />
          <polygon points={star(12, 12, 4, 6, 2.2)} fill={ACCENT} {...stroke} strokeWidth={2} />
        </>
      );
    case 'SHAKE_UP': // Shuffle: two circular arrows
      return (
        <>
          <path d="M13 28A19 19 0 0 1 46 20" fill="none" stroke={SUCCESS} strokeWidth={6} strokeLinecap="round" />
          <polygon points="52,12 54,30 38,24" fill={SUCCESS} {...stroke} strokeWidth={2.5} />
          <path d="M51 38A19 19 0 0 1 18 46" fill="none" stroke={ORANGE} strokeWidth={6} strokeLinecap="round" />
          <polygon points="12,54 10,36 26,42" fill={ORANGE} {...stroke} strokeWidth={2.5} />
        </>
      );
    case 'COZY_CAT': // Cat card: a cat asleep on a cushion, with a symbol for its design
      return (
        <>
          <DesignSymbol variant={variant} />
          <ellipse cx="32" cy="52" rx="26" ry="7" fill="#d9d0fa" {...stroke} />
          <ellipse cx="34" cy="40" rx="22" ry="12" fill="#F6C890" {...stroke} />
          <path d="M54 34c6-4 6-14 0-14" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <circle cx="20" cy="36" r="11" fill="#F6C890" {...stroke} />
          <path d="M11 30 12 21l7 4M29 25l5-5 1 10" fill="#F6C890" {...stroke} />
          <path d="M14 36q3 3 6 0M22 36q3 3 6 0" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <text x="40" y="22" fontFamily="Baloo 2, sans-serif" fontSize="12" fontWeight="800" fill={PRIMARY}>
            z z
          </text>
        </>
      );
    case 'PASS_IT_ON': // Attack: an arrow handing the next player a double turn
      return (
        <>
          <path d="M5 26H34V12L59 32 34 52V38H5Z" fill={ORANGE} {...stroke} />
          <Paw x={20} y={32} scale={0.55} fill="#fff" />
          <circle cx="50" cy="12" r="9" fill={ACCENT} {...stroke} />
          <text x="46" y="17" fontFamily="Baloo 2, sans-serif" fontSize="14" fontWeight="800" fill={INK}>
            2
          </text>
        </>
      );
    case 'ASK_A_FRIEND': // Favor: a speech bubble with a paw
      return (
        <>
          <path
            d="M8 10H56a4 4 0 0 1 4 4V38a4 4 0 0 1-4 4H36L22 54V42H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z"
            fill="#fff"
            {...stroke}
          />
          <Paw x={32} y={26} scale={0.9} fill={TEAL} />
        </>
      );
    case 'NOPE': // Nope: a stop sign with a paw crossed out
      return (
        <>
          <polygon
            points={Array.from({ length: 8 }, (_, i) => {
              const a = (Math.PI / 4) * i + Math.PI / 8;
              return `${(32 + 29 * Math.cos(a)).toFixed(1)},${(32 + 29 * Math.sin(a)).toFixed(1)}`;
            }).join(' ')}
            fill={BOOM}
            {...stroke}
          />
          <Paw x={32} y={34} scale={1.35} fill="#fff" />
          <path d="M16 16 48 48" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d="M16 16 48 48" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
        </>
      );
    default:
      return null;
  }
}

export function CardIcon({ kind, size = 48, variant }: { kind: CardKind; size?: number; variant?: number | undefined }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}
    >
      {art(kind, variant)}
    </svg>
  );
}
