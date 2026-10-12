import type { DisplayName } from '@wb/protocol/shared';
import { getLocale } from './locale';

// Display forms of the curated name words (US-067). The English word is the
// stored identity of a name and never changes; only how a device shows it does.
// DRAFT Vietnamese: a native speaker must review every word before release.

export const VI_ADJECTIVES: Record<string, string> = {
  Sleepy: 'Buồn Ngủ',
  Happy: 'Vui Vẻ',
  Sparkly: 'Lấp Lánh',
  Fluffy: 'Bông Xù',
  Brave: 'Dũng Cảm',
  Silly: 'Tinh Nghịch',
  Cozy: 'Ấm Áp',
  Jolly: 'Hớn Hở',
  Bouncy: 'Nhún Nhảy',
  Cuddly: 'Dễ Ôm',
  Sunny: 'Nắng Vàng',
  Giggly: 'Khúc Khích',
  Zippy: 'Nhanh Nhẹn',
  Snuggly: 'Rúc Rích',
  Clever: 'Thông Minh',
  Cheery: 'Tươi Tắn',
  Gentle: 'Dịu Dàng',
  Mighty: 'Mạnh Mẽ',
  Speedy: 'Tốc Độ',
  Wiggly: 'Ngoe Nguẩy',
  Dizzy: 'Chóng Mặt',
  Perky: 'Lanh Lợi',
  Lucky: 'May Mắn',
  Merry: 'Hân Hoan',
  Breezy: 'Gió Mát',
  Fuzzy: 'Lông Tơ',
  // Bot Buddies
  Beepy: 'Bíp',
  Boopy: 'Bốp',
  Zappy: 'Tách',
};

export const VI_NOUNS: Record<string, string> = {
  Biscuit: 'Bánh Quy',
  Pickle: 'Dưa Chuột',
  Muffin: 'Bánh Muffin',
  Noodle: 'Sợi Mì',
  Pancake: 'Bánh Kếp',
  Waffle: 'Bánh Tổ Ong',
  Cupcake: 'Bánh Cupcake',
  Pudding: 'Bánh Pudding',
  Cookie: 'Bánh Cookie',
  Bubble: 'Bong Bóng',
  Button: 'Nút Áo',
  Pebble: 'Sỏi Nhỏ',
  Sprout: 'Mầm Non',
  Pumpkin: 'Bí Ngô',
  Acorn: 'Quả Sồi',
  Marshmallow: 'Kẹo Dẻo',
  Peanut: 'Đậu Phộng',
  Dumpling: 'Bánh Bao',
  Toast: 'Bánh Mì Nướng',
  Sprinkle: 'Cốm Rắc',
  Jellybean: 'Kẹo Đậu',
  Cricket: 'Dế Mèn',
  Whisker: 'Râu Mèo',
  Mittens: 'Găng Tay',
  Comet: 'Sao Chổi',
  Pretzel: 'Bánh Xoắn',
  // Bot Buddies
  Buddy: 'Bạn Robot',
};

export type NameKind = 'adjective' | 'noun';

/** One word in the current language; English (the stored word) when there is no translation. */
export function wordLabel(kind: NameKind, word: string): string {
  if (getLocale() !== 'vi') return word;
  return (kind === 'adjective' ? VI_ADJECTIVES : VI_NOUNS)[word] ?? word;
}

/**
 * A name in the viewer's language. English reads "adjective noun" (Sleepy
 * Biscuit); Vietnamese reads "noun adjective" (Bánh Quy Buồn Ngủ). A number is
 * added after the name when two players picked the same words.
 */
export function displayName(name: DisplayName): string {
  const adjective = wordLabel('adjective', name.adjective);
  const noun = wordLabel('noun', name.noun);
  const base = getLocale() === 'vi' ? `${noun} ${adjective}` : `${adjective} ${noun}`;
  return name.suffix && name.suffix > 1 ? `${base} ${name.suffix}` : base;
}

// Log lines are stored as keys so they can be re-worded; a name inside one is kept
// as a token and turned into the viewer's language only when it is shown.
const OPEN = '\u0001';
const CLOSE = '\u0002';

export const nameToken = (name: DisplayName): string =>
  `${OPEN}${name.adjective}|${name.noun}|${name.suffix ?? 1}${CLOSE}`;

export function resolveNameTokens(text: string): string {
  return text.replace(new RegExp(`${OPEN}([^|${CLOSE}]*)\\|([^|${CLOSE}]*)\\|(\\d+)${CLOSE}`, 'g'), (_m, adjective, noun, suffix) =>
    displayName({ adjective, noun, suffix: Number(suffix) }),
  );
}
