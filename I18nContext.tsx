import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Lang } from "@/types";
import translations, { type TranslationKey } from "./translations";

const LANG_STORAGE_KEY = "roktobondhu_lang";

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "bn" || saved === "en") return saved;
  } catch {
    // ignore storage errors (private browsing etc.)
  }
  // Default to Bangla on first visit, per product requirement.
  return "bn";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      const dict = translations[lang];
      return (dict as Record<string, string>)[key] ?? (translations.bn as Record<string, string>)[key] ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
