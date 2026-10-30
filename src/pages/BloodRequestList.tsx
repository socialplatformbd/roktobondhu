import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { describeError } from "@/utils/errors";
import { Alert, Badge, Button, Card, EmptyState, Select, Spinner } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import { BLOOD_GROUPS, type AreaId, type BloodGroup, type BloodRequest, type UrgencyLevel } from "@/types";

const URGENCY_TONE: Record<UrgencyLevel, "neutral" | "warning" | "danger"> = {
  normal: "neutral",
  urgent: "warning",
  critical: "danger",
};

export default function BloodRequestList() {
  const { t, lang } = useI18n();
  const { user } = useAuth();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "all">("all");
  const [area, setArea] = useState<AreaId | "all">("all");
  const [items, setItems] = useState<BloodRequest[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const runSearch = async (reset: boolean) => {
    if (reset) {
      setLoading(true);
      setItems([]);
      setCursor(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const page = await backend.listBloodRequests({ bloodGroup, area }, reset ? null : cursor);
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
      setCursor(page.cursor);
      setError(null);
    } catch (err) {
      setError(describeError(err, lang));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    runSearch(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloodGroup, area]);

  return (
    <div className="space-y-4">
      {error && <Alert tone="danger">{error}</Alert>}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">{t("requests.title")}</h1>
        {user && (
          <Link to="/requests/new">
            <Button size="sm">+ {t("requests.create")}</Button>
          </Link>
        )}
      </div>

      <Card className="grid grid-cols-2 gap-3">
        <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value as BloodGroup | "all")}>
          <option value="all">{t("common.all")} — {t("profile.bloodGroup")}</option>
          {BLOOD_GROUPS.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </Select>
        <Select value={area} onChange={(e) => setArea(e.target.value as AreaId | "all")}>
          <option value="all">{t("common.all")} — {t("profile.area")}</option>
          {Object.entries(AREA_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {lang === "bn" ? label.bn : label.en}
            </option>
          ))}
        </Select>
      </Card>

      <Alert tone="info">{t("requests.disclaimer")}</Alert>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon="📋" title={t("requests.empty")} />
      ) : (
        <div className="space-y-3">
          {items.map((req) => (
            <Link key={req.id} to={`/requests/${req.id}`}>
              <Card className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge tone="brand">{req.bloodGroup}</Badge>
                    <Badge tone={URGENCY_TONE[req.urgency]}>{t(`requests.urgency.${req.urgency}` as any)}</Badge>
                  </div>
                  <span className="text-xs text-stone-400">{new Date(req.neededAt).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}</span>
                </div>
                <p className="font-semibold text-stone-800">{req.hospitalName}</p>
                <p className="text-xs text-stone-500">
                  📍 {lang === "bn" ? AREA_LABELS[req.area].bn : AREA_LABELS[req.area].en} · {req.units} {lang === "bn" ? "ব্যাগ" : "unit(s)"}
                </p>
              </Card>
            </Link>
          ))}
          {cursor && (
            <Button variant="outline" className="w-full" onClick={() => runSearch(false)} disabled={loadingMore}>
              {loadingMore ? t("common.loading") : t("donors.loadMore")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
