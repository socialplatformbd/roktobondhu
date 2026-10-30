import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser, UserProfile } from "@/types";
import { backend } from "@/services";

interface AuthContextValue {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  backendMode: "firebase" | "demo";
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (!backend.getCurrentUser()) {
      setProfile(null);
      return;
    }
    const p = await backend.getMyProfile();
    setProfile(p);
  }, []);

  useEffect(() => {
    const unsubscribe = backend.onAuthChange(async (u) => {
      setUser(u);
      try {
        setProfile(u ? await backend.getMyProfile() : null);
      } catch {
        // e.g. Firestore rules not deployed yet: never leave the app stuck loading.
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, backendMode: backend.mode, refreshProfile }),
    [user, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
