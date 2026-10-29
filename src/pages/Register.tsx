import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import type { TranslationKey } from "@/i18n/translations";
import { backend } from "@/services";
import { Alert, Button, Input, Label } from "@/components/ui";

export default function Register() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("auth.weakPassword"));
      return;
    }
    setLoading(true);
    try {
      await backend.signUpWithEmail(email, password, displayName.trim() || "User");
      navigate("/profile");
    } catch (err) {
      setError(mapAuthError(err, t));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await backend.signInWithGoogle();
      navigate("/profile");
    } catch (err) {
      setError(mapAuthError(err, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <h1 className="text-xl font-bold text-stone-800">{t("auth.registerTitle")}</h1>

      {backend.mode === "demo" && <Alert tone="warning">{t("auth.demoNotice")}</Alert>}
      {error && <Alert tone="danger">{error}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>{t("auth.displayName")}</Label>
          <Input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={lang === "bn" ? "আপনার নাম" : "Your name"} />
        </div>
        <div>
          <Label>{t("auth.email")}</Label>
          <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div>
          <Label>{t("auth.password")}</Label>
          <Input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label>{t("auth.confirmPassword")}</Label>
          <Input required type="password" minLength={6} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("common.loading") : t("auth.registerButton")}
        </Button>
      </form>

      <div className="flex items-center gap-2 text-xs text-stone-400">
        <div className="h-px flex-1 bg-stone-200" />
        {lang === "bn" ? "অথবা" : "or"}
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onGoogle} disabled={loading}>
        🔵 {t("auth.googleButton")}
      </Button>

      <p className="text-center text-sm text-stone-600">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" className="font-semibold text-brand-700">
          {t("auth.loginButton")}
        </Link>
      </p>
    </div>
  );
}

export function mapAuthError(err: unknown, t: (k: TranslationKey) => string): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("email-already-in-use")) return t("auth.invalidEmail") + " (already in use)";
  if (msg.includes("invalid-email")) return t("auth.invalidEmail");
  if (msg.includes("weak-password")) return t("auth.weakPassword");
  if (msg.includes("wrong-password") || msg.includes("user-not-found") || msg.includes("invalid-credential")) {
    return t("auth.genericAuthError");
  }
  if (msg.includes("google-not-available")) {
    return t("common.comingSoon") + " (demo mode)";
  }
  return t("auth.genericAuthError");
}
