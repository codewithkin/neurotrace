import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE } from "./languages";

import en from "./locales/en.json";

export const resources = {
  en: { translation: en },
} as const;

let initialized = false;

/**
 * Initialize i18next. Safe to call multiple times; subsequent calls only
 * change the active language. `initialLanguage` comes from local storage.
 */
export async function initI18n(initialLanguage: string = DEFAULT_LANGUAGE): Promise<I18nInstance> {
  if (!initialized) {
    await i18next.use(initReactI18next).init({
      resources,
      lng: initialLanguage,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: {
        escapeValue: false,
      },
      returnNull: false,
    });
    initialized = true;
  } else {
    await i18next.changeLanguage(initialLanguage);
  }
  return i18next;
}

/** Add a locale bundle at runtime (used when loading additional languages). */
export function registerLocaleBundle(code: string, bundle: Record<string, unknown>) {
  i18next.addResourceBundle(code, "translation", bundle, true, true);
}

export default i18next;
