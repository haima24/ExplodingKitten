import { en, type CopyKey } from './en';
import { getLocale } from './locale';
import { vi } from './vi';

export type { CopyKey };
export type CopyParams = Record<string, string | number>;
export { getLocale, setLocale, subscribeLocale, detectLanguage, type Language } from './locale';

/**
 * Looks up a catalog string in the current language and fills `{param}`
 * placeholders. A string missing from the Vietnamese catalog falls back to
 * English, so nothing is ever blank or shown as a raw key (US-064).
 */
export function t(key: CopyKey, params?: CopyParams): string {
  const template: string = (getLocale() === 'vi' ? vi[key] : undefined) ?? en[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}
