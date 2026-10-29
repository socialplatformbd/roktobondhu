import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { Alert, Button, Card } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import { LogoMark } from "@/components/Logo";

export default function Home() {
  const { t, lang } = useI18n();
  const { user, backendMode } = useAuth();

  return (
    <div className="space-y-5">
      {backendMode === "demo" && (
        <Alert tone="warning">
          🧪 {t("common.demoMode")} — {lang === "bn" ? "Firebase এখনো কনফিগার করা হয়নি, তাই সব তথ্য শুধু আপনার এই ফোনে/ব্রাউজারে সংরক্ষিত থাকছে।" : "Firebase is not configured yet, so all data stays only on this phone/browser."}
        </Alert>
      )}

      <Card className="overflow-hidden border-brand-100 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="flex items-center gap-3">
          <LogoMark className="h-14 w-14 drop-shadow" />
          <div>
            <h1 className="text-2xl font-extrabold">{t("appName")}</h1>
            <p className="text-sm text-brand-50/90">{t("tagline")}</p>
          </div>
        </div>
        <p className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-xs">
          📍 {t("home.scopeNotice")}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link to="/donors">
          <Button className="w-full" size="lg">
            🩸 {t("home.cta.findDonor")}
          </Button>
        </Link>
        <Link to={user ? "/requests/new" : "/login"}>
          <Button className="w-full" variant="secondary" size="lg">
            📋 {t("home.cta.requestBlood")}
          </Button>
        </Link>
        <Link to={user ? "/profile" : "/register"}>
          <Button className="w-full" variant="outline" size="lg">
            ❤️ {t("home.cta.becomeDonor")}
          </Button>
        </Link>
      </div>

      <Card>
        <h2 className="mb-2 font-bold text-stone-800">
          {lang === "bn" ? "যে এলাকায় সেবা পাওয়া যাচ্ছে" : "Areas currently supported"}
        </h2>
        <ul className="space-y-1.5 text-sm text-stone-600">
          {Object.entries(AREA_LABELS).map(([id, label]) => (
            <li key={id} className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-500" /> {lang === "bn" ? label.bn : label.en}
            </li>
          ))}
        </ul>
      </Card>

      <Alert tone="info">ℹ️ {t("home.disclaimer")}</Alert>
      <Alert tone="danger">🚨 {t("help.emergencyNotice")}</Alert>
    </div>
  );
}
