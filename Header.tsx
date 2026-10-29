import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { LogoWithText } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { APP_NAME_BN, APP_NAME_EN } from "@/utils/constants";

export function Header() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-brand-100 bg-white/95 backdrop-blur safe-top">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2.5">
        <Link to="/" aria-label="RoktoBondhu home">
          <LogoWithText bnName={APP_NAME_BN} enName={APP_NAME_EN} />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"
            >
              {t("nav.login")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
