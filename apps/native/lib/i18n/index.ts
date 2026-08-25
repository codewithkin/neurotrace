import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE } from "./languages";

import ar from "./locales/ar.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import nl from "./locales/nl.json";
import pl from "./locales/pl.json";
import ptBR from "./locales/pt-BR.json";

export const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  "pt-BR": { translation: ptBR },
  ja: { translation: ja },
  it: { translation: it },
  nl: { translation: nl },
  pl: { translation: pl },
  ar: { translation: ar },
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
