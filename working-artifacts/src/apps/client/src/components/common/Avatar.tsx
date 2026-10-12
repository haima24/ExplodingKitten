import { AvatarArt } from '../../features/game/art/AvatarArt';
import s from './common.module.css';

// Soft background colour behind each avatar's SVG art.
const HUES: Record<string, number> = {
  biscuit: 38,
  pip: 150,
  marmalade: 24,
  mochi: 270,
  juniper: 200,
  waffles: 330,
  'bot-1': 210,
  'bot-2': 120,
  'bot-3': 0,
  'bot-4': 48,
};

interface AvatarProps {
  avatarId: string;
  size?: number;
  sleeping?: boolean;
}

export function Avatar({ avatarId, size = 40, sleeping }: AvatarProps): JSX.Element {
  const hue = HUES[avatarId] ?? 38;
  return (
    <span
      className={`${s['avatar']} ${sleeping ? s['avatarSleep'] : ''}`}
      style={{
        width: `${size / 16}rem`,
        height: `${size / 16}rem`,
        background: `hsl(${hue} 90% 85%)`,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      <AvatarArt avatarId={avatarId} />
    </span>
  );
}
