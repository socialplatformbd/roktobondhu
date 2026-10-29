import { useI18n } from "@/i18n/I18nContext";
import { cn } from "@/utils/cn";

export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn("inline-flex rounded-full border border-brand-200 bg-white p-0.5 text-xs font-semibold", className)}>
      <button
        type="button"
        onClick={() => setLang("bn")}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          lang === "bn" ? "bg-brand-600 text-white" : "text-brand-700"
        )}
        aria-pressed={lang === "bn"}
      >
        বাংলা
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          lang === "en" ? "bg-brand-600 text-white" : "text-brand-700"
        )}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
    </div>
  );
}
