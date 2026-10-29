import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useI18n } from "@/i18n/I18nContext";

export function OfflineBanner() {
  const online = useOnlineStatus();
  const { t } = useI18n();
  if (online) return null;
  return (
    <div className="sticky top-[57px] z-20 bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-white">
      ⚠ {t("offline.title")} — {t("offline.message")}
    </div>
  );
}
