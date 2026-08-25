import * as Localization from "expo-localization";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./languages";

/**
 * Best-match supported language for the device locale.
 * Maps regional codes (e.g. `pt`) onto the closest supported entry
 * (`pt-BR`). Falls back to English.
 */
export function getDeviceLanguage(): string {
  try {
    const locales = Localization.getLocales();
    if (!locales || locales.length === 0) return DEFAULT_LANGUAGE;

    for (const locale of locales) {
      const tag = locale.languageTag; // e.g. "pt-BR", "de-DE", "ar"
      const exact = SUPPORTED_LANGUAGES.find(
        (l) => l.code.toLowerCase() === tag.toLowerCase(),
      );
      if (exact) return exact.code;

      const base = locale.languageCode?.toLowerCase();
      if (!base) continue;
      const partial = SUPPORTED_LANGUAGES.find((l) =>
        l.code.toLowerCase().startsWith(base),
      );
      if (partial) return partial.code;
    }
  } catch {
    // Localization unavailable — fall through to default.
  }
  return DEFAULT_LANGUAGE;
}
