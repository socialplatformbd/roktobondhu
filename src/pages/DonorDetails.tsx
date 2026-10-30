import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Alert, Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import type { DonorExtra, UserProfile } from "@/types";
import { ContactModal } from "./DonorDirectory";

export default function DonorDetails() {
  const { uid } = useParams<{ uid: string }>();
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [donor, setDonor] = useState<UserProfile | null | undefined>(undefined);
  const [showContact, setShowContact] = useState(false);
  const [extra, setExtra] = useState<DonorExtra | null>(null);

  useEffect(() => {
    if (!uid) return;
    backend.getDonorPublic(uid).then(setDonor).catch(() => setDonor(null));
  }, [uid]);

  useEffect(() => {
    if (!uid || !user) {
      setExtra(null);
      return;
    }
    backend.getDonorExtra(uid).then(setExtra);
  }, [uid, user?.uid]);

  if (donor === undefined) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (!donor) {
    return <EmptyState icon="🙈" title={t("donors.empty")} />;
  }

  return (
    <div className="space-y-4">
      <Link to="/donors" className="text-sm font-semibold text-brand-700">
        ← {t("common.back")}
      </Link>

      <Card className="space-y-3">
        <div className="flex items-center gap-3">
          {extra?.photo ? (
            <img src={extra.photo} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-xl font-bold text-brand-700">
              {donor.bloodGroup}
            </div>
          )}
          <div>
            <h1 className="text-lg font-bold text-stone-800">{donor.displayName.split(/\s+/)[0]}</h1>
            <Badge tone="success">{t("profile.available")}</Badge>
          </div>
        </div>
        <p className="text-sm text-stone-600">
          📍 {donor.area ? (lang === "bn" ? AREA_LABELS[donor.area].bn : AREA_LABELS[donor.area].en) : "-"}
        </p>
        {extra?.bio && <p className="rounded-xl bg-stone-50 p-3 text-sm text-stone-700">“{extra.bio}”</p>}
        {!user && (
          <p className="text-xs text-stone-400">
            {lang === "bn" ? "ছবি ও বায়ো দেখতে লগইন করুন।" : "Sign in to see the photo and bio."}
          </p>
        )}
        <Alert tone="info">{t("donors.disclaimer")}</Alert>
        <Alert tone="warning">{t("donors.contactHidden")}</Alert>
        <Button className="w-full" onClick={() => setShowContact(true)}>
          {t("donors.sendRequest")}
        </Button>
      </Card>

      {showContact && (
        <ContactModal donor={donor} isSignedIn={Boolean(user)} onClose={() => setShowContact(false)} />
      )}
    </div>
  );
}
