import s from './common.module.css';

// Placeholder art: system emoji on a coloured disc. Decorative only; the name
// and status are always given as text next to it.
const AVATAR_ART: Record<string, { glyph: string; hue: number }> = {
  biscuit: { glyph: '🐱', hue: 38 },
  pip: { glyph: '😺', hue: 150 },
  marmalade: { glyph: '😸', hue: 24 },
  mochi: { glyph: '🐈', hue: 270 },
  juniper: { glyph: '🐈‍⬛', hue: 200 },
  waffles: { glyph: '🐯', hue: 330 },
  'bot-1': { glyph: '🤖', hue: 210 },
  'bot-2': { glyph: '🤖', hue: 120 },
  'bot-3': { glyph: '🤖', hue: 0 },
};

interface AvatarProps {
  avatarId: string;
  size?: number;
  sleeping?: boolean;
}

export function Avatar({ avatarId, size = 40, sleeping }: AvatarProps): JSX.Element {
  const art = AVATAR_ART[avatarId] ?? AVATAR_ART['biscuit']!;
  return (
    <span
      className={`${s['avatar']} ${sleeping ? s['avatarSleep'] : ''}`}
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
        fontSize: `${(size * 0.55) / 16}rem`,
        background: `hsl(${art.hue} 90% 85%)`,
      }}
      aria-hidden="true"
    >
      {art.glyph}
    </span>
  );
}
