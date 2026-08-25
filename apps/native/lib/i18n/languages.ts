export interface AppLanguage {
  code: string;
  /** Native name displayed in the selector grid */
  nativeName: string;
  englishName: string;
  isRTL?: boolean;
}

export const SUPPORTED_LANGUAGES: AppLanguage[] = [
  { code: "en", nativeName: "English", englishName: "English" },
  { code: "es", nativeName: "Español", englishName: "Spanish" },
  { code: "de", nativeName: "Deutsch", englishName: "German" },
  { code: "fr", nativeName: "Français", englishName: "French" },
  { code: "pt-BR", nativeName: "Português", englishName: "Portuguese" },
  { code: "ja", nativeName: "日本語", englishName: "Japanese" },
  { code: "it", nativeName: "Italiano", englishName: "Italian" },
  { code: "nl", nativeName: "Nederlands", englishName: "Dutch" },
  { code: "pl", nativeName: "Polski", englishName: "Polish" },
  { code: "ar", nativeName: "العربية", englishName: "Arabic", isRTL: true },
];

export const DEFAULT_LANGUAGE = "en";

export function getLanguage(code: string): AppLanguage {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) ?? SUPPORTED_LANGUAGES[0];
}

export function isRTL(code: string): boolean {
  return Boolean(getLanguage(code).isRTL);
}
