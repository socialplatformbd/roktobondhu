import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { Button } from "@/components/ui";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-5xl">🔎</p>
      <h1 className="text-xl font-bold text-stone-800">{t("error.notFoundTitle")}</h1>
      <p className="text-sm text-stone-500">{t("error.notFoundMsg")}</p>
      <Link to="/">
        <Button className="mt-2">{t("nav.home")}</Button>
      </Link>
    </div>
  );
}
