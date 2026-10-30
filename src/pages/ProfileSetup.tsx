import { useEffect, useState } from "react";
import { describeError } from "@/utils/errors";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Alert, Button, Input, Label, Select, Card } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import { BLOOD_GROUPS, type AreaId, type BloodGroup, type DonorAvailability } from "@/types";
import { isValidBdPhone, normalizeBdPhone } from "@/utils/phone";

export default function ProfileSetup() {
  const { t, lang } = useI18n();
  const { user, profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [area, setArea] = useState<AreaId | "">("");
  const [consent, setConsent] = useState(false);
  const [availability, setAvailability] = useState<DonorAvailability>("paused");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName ?? "");
      setPhone(profile.phone ?? "");
      setBloodGroup(profile.bloodGroup ?? "");
      setArea(profile.area ?? "");
      setConsent(profile.donorConsent);
      setAvailability(profile.donorAvailability);
    }
  }, [profile]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (phone && !isValidBdPhone(phone)) {
      setError(t("profile.phoneInvalid"));
      return;
    }
    if (consent && (!bloodGroup || !area)) {
      setError(lang === "bn" ? "রক্তদাতা হতে রক্তের গ্রুপ ও এলাকা আবশ্যক।" : "Blood group and area are required to become a donor.");
      return;
    }

    setSaving(true);
    try {
      await backend.saveMyProfile({
        displayName: displayName.trim() || "User",
        phone: phone ? normalizeBdPhone(phone) ?? undefined : undefined,
        bloodGroup: bloodGroup || undefined,
        area: area || undefined,
        donorConsent: consent,
        donorAvailability: availability,
        preferredLanguage: lang,
      });
      await refreshProfile();
      setSuccess(t("profile.saveSuccess"));
    } catch (err) {
      setError(describeError(err, lang));
    } finally {
      setSaving(false);
    }
  };

  const onWithdraw = async () => {
    if (!confirm(t("profile.withdrawConsentConfirm"))) return;
    await backend.withdrawConsent();
    await refreshProfile();
    setConsent(false);
    setAvailability("paused");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-md space-y-5">
      <div>
        <h1 className="text-xl font-bold text-stone-800">{t("profile.title")}</h1>
        <p className="text-sm text-stone-500">{t("profile.subtitle")}</p>
      </div>

      {!user.emailVerified && <Alert tone="warning">{t("auth.emailNotVerifiedWarning")}</Alert>}
      {error && <Alert tone="danger">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4">
        <Card className="space-y-4">
          <div>
            <Label>{t("auth.displayName")}</Label>
            <Input required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <Label>{t("auth.email")}</Label>
            <Input disabled value={user.email ?? ""} />
          </div>
          <div>
            <Label>
              {t("profile.phone")} <span className="text-stone-400">({t("common.optional")})</span>
            </Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="017XXXXXXXX" inputMode="numeric" />
            <p className="mt-1 text-xs text-stone-400">{t("profile.phoneHelp")}</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <Label>{t("profile.bloodGroup")}</Label>
            <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}>
              <option value="">{t("common.required")}</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("profile.area")}</Label>
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              <option value="">{t("common.required")}</option>
              {Object.entries(AREA_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {lang === "bn" ? label.bn : label.en}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        <Card className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-stone-700">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-brand-600"
              checked={consent}
              onChange={(e) => { setConsent(e.target.checked); if (!e.target.checked) setAvailability("paused"); }}
            />
            <span>{t("profile.consentLabel")}</span>
          </label>

          {consent && (
            <div>
              <Label>{t("profile.availability")}</Label>
              <Select value={availability} onChange={(e) => setAvailability(e.target.value as DonorAvailability)}>
                <option value="available">{t("profile.available")}</option>
                <option value="paused">{t("profile.paused")}</option>
              </Select>
            </div>
          )}
          <p className="text-xs text-stone-400">{t("profile.noSensitiveData")}</p>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? t("common.loading") : t("common.save")}
        </Button>

        {profile?.donorConsent && (
          <Button type="button" variant="danger" className="w-full" onClick={onWithdraw}>
            {t("profile.withdrawConsent")}
          </Button>
        )}
      </form>
    </div>
  );
}
