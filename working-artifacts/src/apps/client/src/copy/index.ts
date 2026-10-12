import { en, type CopyKey } from './en';

export type { CopyKey };
export type CopyParams = Record<string, string | number>;

/** Looks up a catalog string and fills `{param}` placeholders. */
export function t(key: CopyKey, params?: CopyParams): string {
  const template: string = en[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}
