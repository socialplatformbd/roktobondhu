import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Spinner } from "./ui";
import { useI18n } from "@/i18n/I18nContext";

export function FullPageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) {
      setChecking(false);
      return;
    }
    backend
      .isCurrentUserAdmin()
      .then((v) => {
        if (active) {
          setIsAdmin(v);
          setChecking(false);
        }
      })
      .catch(() => {
        if (active) {
          setIsAdmin(false);
          setChecking(false);
        }
      });
    return () => {
      active = false;
    };
  }, [user]);

  if (loading || checking) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-4xl">🔒</p>
        <p className="mt-3 font-semibold text-stone-700">{t("admin.noAccess")}</p>
      </div>
    );
  }
  return <>{children}</>;
}
