import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Alert, Badge, Button, Card, EmptyState, Input, Spinner } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import { describeError } from "@/utils/errors";
import type { BloodRequest, Report, UserProfile } from "@/types";

export default function Admin() {
  const { t, lang } = useI18n();
  const { backendMode } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"reports" | "requests" | "users">("reports");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, b, u] = await Promise.all([
        backend.adminListReports(),
        backend.adminListOpenBloodRequests(),
        backend.adminListUsers(),
      ]);
      setReports(r);
      setRequests(b);
      setUsers(u);
    } catch (err) {
      setError(describeError(err, lang));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id: string, status: "reviewed" | "dismissed") => {
    try {
      await backend.adminResolveReport(id, status);
      load();
    } catch {
      alert(t("error.generic"));
    }
  };

  const setReqStatus = async (id: string, status: "cancelled" | "open") => {
    try {
      await backend.adminSetBloodRequestStatus(id, status);
      load();
    } catch {
      alert(t("error.generic"));
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <h1 className="text-xl font-bold text-stone-800">{t("admin.title")}</h1>
      {backendMode === "demo" && <Alert tone="info">{t("admin.notConfigured")}</Alert>}

      <div className="flex gap-2">
        <Button size="sm" variant={tab === "reports" ? "primary" : "outline"} onClick={() => setTab("reports")}>
          {t("admin.reports")} ({reports.length})
        </Button>
        <Button size="sm" variant={tab === "requests" ? "primary" : "outline"} onClick={() => setTab("requests")}>
          {t("requests.title")} ({requests.length})
        </Button>
        <Button size="sm" variant={tab === "users" ? "primary" : "outline"} onClick={() => setTab("users")}>
          {lang === "bn" ? "ব্যবহারকারী" : "Users"} ({users.length})
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : tab === "reports" ? (
        reports.length === 0 ? (
          <EmptyState icon="🚩" title={lang === "bn" ? "কোনো রিপোর্ট নেই" : "No reports"} />
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <Card key={r.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge tone="brand">{r.targetType}</Badge>
                  <Badge tone={r.status === "open" ? "warning" : "neutral"}>{r.status}</Badge>
                </div>
                <p className="text-sm text-stone-700">{r.reason}</p>
                <p className="text-xs text-stone-400">{new Date(r.createdAt).toLocaleString()}</p>
                {r.status === "open" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => resolve(r.id, "reviewed")}>
                      {lang === "bn" ? "সমাধান হয়েছে" : "Mark reviewed"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolve(r.id, "dismissed")}>
                      {lang === "bn" ? "বাতিল করুন" : "Dismiss"}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )
      ) : tab === "users" ? (
        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "bn" ? "নাম, ইমেইল বা ফোন দিয়ে খুঁজুন" : "Search by name, email or phone"}
          />
          {users
            .filter((u) => {
              const q = search.trim().toLowerCase();
              if (!q) return true;
              return [u.displayName, u.email ?? "", u.phone ?? ""].some((v) => v.toLowerCase().includes(q));
            })
            .map((u) => (
              <Card key={u.uid} className="space-y-1 text-sm text-stone-700">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-stone-800">{u.displayName}</p>
                  {u.bloodGroup && <Badge tone="brand">{u.bloodGroup}</Badge>}
                </div>
                <p>✉️ {u.email ?? "—"} {u.emailVerified ? "✅" : ""}</p>
                <p>☎️ {u.phone ?? "—"}</p>
                <p>
                  📍 {u.area ? (lang === "bn" ? AREA_LABELS[u.area].bn : AREA_LABELS[u.area].en) : "—"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={u.donorConsent ? "success" : "neutral"}>
                    {u.donorConsent ? (lang === "bn" ? "ডোনার সম্মতি আছে" : "Donor consent") : (lang === "bn" ? "ডোনার নন" : "Not a donor")}
                  </Badge>
                  {u.donorConsent && (
                    <Badge tone={u.donorAvailability === "available" ? "success" : "warning"}>{u.donorAvailability}</Badge>
                  )}
                </div>
                <p className="text-xs text-stone-400">
                  {lang === "bn" ? "যোগ দিয়েছেন" : "Joined"}: {new Date(u.createdAt).toLocaleDateString()} · UID: {u.uid}
                </p>
              </Card>
            ))}
        </div>
      ) : requests.length === 0 ? (
        <EmptyState icon="📋" title={t("requests.empty")} />
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge tone="brand">{req.bloodGroup}</Badge>
                <Badge tone="neutral">{req.status}</Badge>
              </div>
              <p className="font-semibold text-stone-800">{req.hospitalName}</p>
              <p className="text-xs text-stone-500">{lang === "bn" ? "রিপোর্ট সংখ্যা" : "Reports"}: {req.reportCount ?? 0}</p>
              {req.status !== "cancelled" ? (
                <Button size="sm" variant="danger" onClick={() => setReqStatus(req.id, "cancelled")}>
                  {t("requests.cancelRequest")}
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setReqStatus(req.id, "open")}>
                  {lang === "bn" ? "পুনরায় খুলুন" : "Reopen"}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
