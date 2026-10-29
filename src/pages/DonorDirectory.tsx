import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Link } from "react-router-dom";
import { Alert, Badge, Button, Card, EmptyState, Select, Spinner, Textarea } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import { BLOOD_GROUPS, type AreaId, type BloodGroup, type UserProfile } from "@/types";

export default function DonorDirectory() {
  const { t, lang } = useI18n();
  const { user } = useAuth();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "all">("all");
  const [area, setArea] = useState<AreaId | "all">("all");
  const [items, setItems] = useState<UserProfile[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeDonor, setActiveDonor] = useState<UserProfile | null>(null);

  const runSearch = async (reset: boolean) => {
    if (reset) {
      setLoading(true);
      setItems([]);
      setCursor(null);
    } else {
      setLoadingMore(true);
    }
    try {
      const page = await backend.searchDonors({ bloodGroup, area }, reset ? null : cursor);
      setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
      setCursor(page.cursor);
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
      <h1 className="text-xl font-bold text-stone-800">{t("donors.title")}</h1>

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

      <Alert tone="info">{t("donors.disclaimer")}</Alert>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon="🩸" title={t("donors.empty")} />
      ) : (
        <div className="space-y-3">
          {items.map((donor) => (
            <Card key={donor.uid} className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="brand">{donor.bloodGroup}</Badge>
                  <span className="font-semibold text-stone-800">{donor.displayName.split(/\s+/)[0]}</span>
                </div>
                <p className="mt-1 text-xs text-stone-500">
                  📍 {donor.area ? (lang === "bn" ? AREA_LABELS[donor.area].bn : AREA_LABELS[donor.area].en) : "-"}
                </p>
                <Link to={`/donors/${donor.uid}`} className="mt-1 inline-block text-xs font-semibold text-brand-700">
                  {t("common.viewDetails")}
                </Link>
              </div>
              <Button size="sm" onClick={() => setActiveDonor(donor)}>
                {t("donors.sendRequest")}
              </Button>
            </Card>
          ))}
          {cursor && (
            <Button variant="outline" className="w-full" onClick={() => runSearch(false)} disabled={loadingMore}>
              {loadingMore ? t("common.loading") : t("donors.loadMore")}
            </Button>
          )}
        </div>
      )}

      {activeDonor && (
        <ContactModal
          donor={activeDonor}
          isSignedIn={Boolean(user)}
          onClose={() => setActiveDonor(null)}
        />
      )}
    </div>
  );
}

export function ContactModal({
  donor,
  isSignedIn,
  onClose,
}: {
  donor: UserProfile;
  isSignedIn: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSend = async () => {
    setSending(true);
    setError(null);
    try {
      await backend.sendContactRequest(donor.uid, message.trim());
      setDone(true);
    } catch {
      setError(t("error.generic"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-stone-800">
            {donor.displayName.split(/\s+/)[0]} · {donor.bloodGroup}
          </h2>
          <button onClick={onClose} className="text-stone-400">
            ✕
          </button>
        </div>

        {!isSignedIn ? (
          <Alert tone="warning">{t("donors.loginToContact")}</Alert>
        ) : done ? (
          <Alert tone="success">{t("donors.requestSent")} {t("donors.contactHidden")}</Alert>
        ) : (
          <>
            {error && <Alert tone="danger" className="mb-3">{error}</Alert>}
            <Textarea
              rows={3}
              placeholder={t("donors.messagePlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="my-2 text-xs text-stone-400">{t("donors.contactHidden")}</p>
            <Button className="w-full" onClick={onSend} disabled={sending}>
              {sending ? t("common.loading") : t("donors.sendRequest")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
