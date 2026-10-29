import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { backend } from "@/services";
import { Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import type { BloodRequest } from "@/types";

const STATUS_TONE: Record<string, "neutral" | "success" | "danger" | "warning"> = {
  open: "success",
  fulfilled: "neutral",
  cancelled: "danger",
  expired: "warning",
};

export default function MyRequests() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.listMyBloodRequests().then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">{t("requests.myTitle")}</h1>
        <Link to="/requests/new">
          <Button size="sm">+ {t("requests.create")}</Button>
        </Link>
      </div>

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
                  <Badge tone="brand">{req.bloodGroup}</Badge>
                  <Badge tone={STATUS_TONE[req.status]}>{t(`requests.status.${req.status}` as any)}</Badge>
                </div>
                <p className="font-semibold text-stone-800">{req.hospitalName}</p>
                <p className="text-xs text-stone-500">
                  📍 {lang === "bn" ? AREA_LABELS[req.area].bn : AREA_LABELS[req.area].en}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
