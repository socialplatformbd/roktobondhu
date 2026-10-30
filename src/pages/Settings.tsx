import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { getDemoAdminFlag, setDemoAdminFlag } from "@/services/mockBackend";
import { Alert, Button, Card } from "@/components/ui";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { LogoMark } from "@/components/Logo";
import { APP_NAME_BN, APP_NAME_EN, CREATOR_CREDIT, TELEGRAM_TEXT, TELEGRAM_URL } from "@/utils/constants";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export default function Settings() {
  const { t, lang } = useI18n();
  const { user, backendMode } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [demoAdmin, setDemoAdmin] = useState(getDemoAdminFlag());
  const { canInstall, installed, promptInstall } = useInstallPrompt();

  useEffect(() => {
    backend.isCurrentUserAdmin().then(setIsAdmin);
  }, [user]);

  const onSignOut = async () => {
    await backend.signOutUser();
    navigate("/");
  };

  const onDelete = async () => {
    if (!confirm(t("auth.deleteAccountWarning"))) return;
    try {
      await backend.deleteAccount();
      navigate("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      alert(
        msg.includes("recent-login")
          ? lang === "bn"
            ? "নিরাপত্তার জন্য অ্যাকাউন্ট মুছতে আবার লগইন দরকার। সাইন আউট করে আবার সাইন ইন করুন, তারপর সঙ্গে সঙ্গে মুছুন।"
            : "For security, please sign out, sign in again, then delete your account right away."
          : t("error.generic")
      );
    }
  };

  const toggleDemoAdmin = () => {
    const next = !demoAdmin;
    setDemoAdminFlag(next);
    setDemoAdmin(next);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-stone-800">{t("settings.title")}</h1>

      <Card className="flex items-center justify-between">
        <span className="font-medium text-stone-700">{t("settings.language")}</span>
        <LanguageSwitch />
      </Card>

      <Card className="space-y-2">
        <p className="font-medium text-stone-700">
          📲 {lang === "bn" ? "অ্যাপ ইনস্টল করুন" : "Install the app"}
        </p>
        {installed ? (
          <p className="text-sm text-emerald-700">✅ {lang === "bn" ? "অ্যাপটি ইতিমধ্যে ইনস্টল করা আছে।" : "App is already installed."}</p>
        ) : canInstall ? (
          <Button size="sm" onClick={promptInstall}>
            {lang === "bn" ? "হোম স্ক্রিনে যোগ করুন" : "Add to home screen"}
          </Button>
        ) : (
          <p className="text-xs text-stone-500">
            {lang === "bn"
              ? "Chrome মেনু (⋮) খুলে \"Install app\" বা \"Add to Home screen\" চাপুন। iPhone-এ Safari-র Share বাটন চেপে \"Add to Home Screen\" বেছে নিন।"
              : 'Open the Chrome menu (⋮) and tap "Install app" or "Add to Home screen". On iPhone, use Safari\'s Share button, then "Add to Home Screen".'}
          </p>
        )}
      </Card>

      {user && (
        <Card className="space-y-2">
          <Link to="/profile" className="flex items-center justify-between py-1 text-stone-700">
            <span>{t("settings.editProfile")} / {t("settings.availability")}</span>
            <span>›</span>
          </Link>
        </Card>
      )}

      <Card className="divide-y divide-stone-100">
        <Link to="/privacy" className="flex items-center justify-between py-2.5 text-stone-700">
          <span>{t("settings.privacy")}</span> <span>›</span>
        </Link>
        <Link to="/terms" className="flex items-center justify-between py-2.5 text-stone-700">
          <span>{t("settings.terms")}</span> <span>›</span>
        </Link>
        <Link to="/help" className="flex items-center justify-between py-2.5 text-stone-700">
          <span>{t("settings.help")}</span> <span>›</span>
        </Link>
        {isAdmin && (
          <Link to="/admin" className="flex items-center justify-between py-2.5 font-semibold text-brand-700">
            <span>{t("settings.admin")}</span> <span>›</span>
          </Link>
        )}
      </Card>

      {user && (
        <Card className="space-y-2">
          <Button variant="outline" className="w-full" onClick={onSignOut}>
            {t("auth.signOut")}
          </Button>
          <Button variant="danger" className="w-full" onClick={onDelete}>
            {t("auth.deleteAccount")}
          </Button>
        </Card>
      )}

      {backendMode === "demo" && (
        <Card className="space-y-2">
          <p className="text-xs font-semibold text-amber-700">
            🧪 {lang === "bn" ? "ডেমো অ্যাডমিন টগল (শুধু লোকাল টেস্টিং এর জন্য, নিরাপদ নয়)" : "Demo admin toggle (local testing only, not secure)"}
          </p>
          <Button variant="outline" size="sm" onClick={toggleDemoAdmin}>
            {demoAdmin ? "✅ Admin ON" : "⬜ Admin OFF"}
          </Button>
        </Card>
      )}

      <Card className="space-y-2 text-center">
        <div className="flex justify-center">
          <LogoMark className="h-10 w-10" />
        </div>
        <h2 className="font-bold text-stone-800">
          {APP_NAME_BN} <span className="text-stone-400">({APP_NAME_EN})</span>
        </h2>
        <p className="text-sm text-stone-500">{t("settings.aboutText")}</p>
        <p className="text-sm font-medium text-stone-600">{CREATOR_CREDIT}</p>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-brand-700 underline"
        >
          {TELEGRAM_TEXT}
        </a>
      </Card>

      {backendMode === "demo" && <Alert tone="warning">{t("common.demoMode")}</Alert>}
    </div>
  );
}
