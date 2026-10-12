import type { ReactNode } from 'react';
import { CAT_HEAD } from './CardIcon';

// Original cat and robot avatars (flat shapes). Decorative: names are always text.
const INK = '#1F1A3D';
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

interface CatLook {
  fur: string;
  inner?: string;
  markings?: 'stripes' | 'muzzle' | 'spots' | 'blush' | 'none';
  muzzle?: string;
  bigEyes?: boolean;
}

const CATS: Record<string, CatLook> = {
  biscuit: { fur: '#F2A03D', markings: 'stripes' }, // tabby
  pip: { fur: '#B9B6C9', markings: 'none', bigEyes: true }, // kitten
  marmalade: { fur: '#E8742C', markings: 'muzzle', muzzle: '#FFF3DD' }, // ginger
  mochi: { fur: '#FFFFFF', inner: '#F7B7C8', markings: 'blush' }, // white
  juniper: { fur: '#6C7A99', markings: 'muzzle', muzzle: '#C9D2E6' }, // grey
  waffles: { fur: '#F6E3B4', markings: 'spots' }, // spotted
};

function Cat({ look }: { look: CatLook }): JSX.Element {
  const eye = look.bigEyes ? 4.6 : 3;
  return (
    <>
      <path d={CAT_HEAD} fill={look.fur} {...line} />
      <path d="M19 15 21 22 27 19ZM45 15 43 22 37 19Z" fill={look.inner ?? '#F7B7C8'} />
      {look.markings === 'stripes' ? (
        <path d="M32 14v7M26 16l2 6M38 16l-2 6" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      ) : null}
      {look.markings === 'muzzle' ? <ellipse cx="32" cy="45" rx="10" ry="7" fill={look.muzzle} /> : null}
      {look.markings === 'spots' ? (
        <>
          <circle cx="19" cy="34" r="3" fill="#B9794A" />
          <circle cx="45" cy="30" r="3.4" fill="#B9794A" />
          <circle cx="40" cy="52" r="2.6" fill="#B9794A" />
        </>
      ) : null}
      {look.markings === 'blush' ? (
        <>
          <circle cx="19" cy="43" r="3.5" fill="#F7B7C8" />
          <circle cx="45" cy="43" r="3.5" fill="#F7B7C8" />
        </>
      ) : null}
      <circle cx="24" cy="37" r={eye} fill={INK} />
      <circle cx="40" cy="37" r={eye} fill={INK} />
      {look.bigEyes ? (
        <>
          <circle cx="25.6" cy="35.4" r="1.6" fill="#fff" />
          <circle cx="41.6" cy="35.4" r="1.6" fill="#fff" />
        </>
      ) : null}
      <path d="M29.5 43h5L32 46Z" fill="#E56B8A" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
      <path d="M32 46v2M27 49q5 3 10 0" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <path d="M8 40l10 2M8 46l10-1M56 40l-10 2M56 46l-10-1" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
    </>
  );
}

function Robot({ color }: { color: string }): JSX.Element {
  return (
    <>
      <path d="M32 6v8" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <circle cx="32" cy="6" r="3.5" fill="#E56B8A" {...line} strokeWidth={2.5} />
      <rect x="10" y="14" width="44" height="40" rx="12" fill={color} {...line} />
      <rect x="16" y="24" width="32" height="14" rx="6" fill={INK} />
      <circle cx="25" cy="31" r="3.5" fill="#FFC83D" />
      <circle cx="39" cy="31" r="3.5" fill="#FFC83D" />
      <path d="M22 46h20M27 43v6M32 43v6M37 43v6" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </>
  );
}

const ROBOTS: Record<string, string> = { 'bot-1': '#8AB4F8', 'bot-2': '#9AE6B4', 'bot-3': '#F6A5A5', 'bot-4': '#F6D67A' };

export function AvatarArt({ avatarId }: { avatarId: string }): JSX.Element {
  let body: ReactNode;
  const robot = ROBOTS[avatarId];
  if (robot) body = <Robot color={robot} />;
  else body = <Cat look={CATS[avatarId] ?? (CATS['biscuit'] as CatLook)} />;
  return (
    <svg
      viewBox="0 0 64 64"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block' }}
    >
      {body}
    </svg>
  );
}
