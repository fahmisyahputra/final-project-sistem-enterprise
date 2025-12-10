import { useCallback } from 'react';

import { en, id, Translations } from '@/core/i18n';
import { useAppSelector } from '@/store';

const locales = { en, id };

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeyOf<T[K]>}` | K
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = NestedKeyOf<Translations>;

export function useTranslations() {
  const language = useAppSelector((state) => state.settings.language);
  const translations = locales[language];

  const t = useCallback(
    (key: TranslationKey): string => {
      const keys = key.split('.');
      let result: unknown = translations;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = (result as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }

      return typeof result === 'string' ? result : key;
    },
    [translations]
  );

  return { t, language };
}
