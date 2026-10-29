import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { backend } from "@/services";
import { Alert, Button, Input, Label } from "@/components/ui";
import { mapAuthError } from "./Register";

export default function Login() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await backend.signInWithEmail(email, password);
      navigate(redirectTo);
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
      navigate(redirectTo);
    } catch (err) {
      setError(mapAuthError(err, t));
    } finally {
      setLoading(false);
    }
  };

  const onForgot = async () => {
    setError(null);
    setInfo(null);
    if (!email) {
      setError(t("auth.invalidEmail"));
      return;
    }
    try {
      await backend.sendPasswordReset(email);
      setInfo(t("auth.resetSent"));
    } catch (err) {
      setError(mapAuthError(err, t));
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-5">
      <h1 className="text-xl font-bold text-stone-800">{t("auth.loginTitle")}</h1>

      {backend.mode === "demo" && <Alert tone="warning">{t("auth.demoNotice")}</Alert>}
      {error && <Alert tone="danger">{error}</Alert>}
      {info && <Alert tone="success">{info}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>{t("auth.email")}</Label>
          <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <div>
          <Label>{t("auth.password")}</Label>
          <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" onClick={onForgot} className="text-xs font-semibold text-brand-700">
          {t("auth.forgotPassword")}
        </button>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("common.loading") : t("auth.loginButton")}
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
        {t("auth.noAccount")}{" "}
        <Link to="/register" className="font-semibold text-brand-700">
          {t("auth.registerButton")}
        </Link>
      </p>
    </div>
  );
}
