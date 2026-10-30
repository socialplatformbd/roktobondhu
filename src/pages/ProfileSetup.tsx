import { useEffect, useState } from "react";
import { describeError } from "@/utils/errors";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Alert, Button, Input, Label, Select, Card, Textarea } from "@/components/ui";
import { resizeToJpegDataUrl } from "@/utils/image";
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
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoDirty, setPhotoDirty] = useState(false);

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

  useEffect(() => {
    if (!user) return;
    backend.getDonorExtra(user.uid).then((x) => {
      if (x) {
        setBio(x.bio ?? "");
        setPhoto(x.photo ?? null);
      }
    });
  }, [user?.uid]);

  const onPickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setPhoto(await resizeToJpegDataUrl(file));
      setPhotoDirty(true);
    } catch {
      setError(lang === "bn" ? "ছবিটি পড়া যায়নি। অন্য ছবি বেছে নিন।" : "Could not read that image. Try another one.");
    }
  };

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
        bio: bio.trim(),
        photo: photoDirty ? photo : undefined,
      });
      setPhotoDirty(false);
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
          {consent && (
            <div className="space-y-3 border-t border-stone-100 pt-3">
              <Label>
                {lang === "bn" ? "ছবি ও বায়ো" : "Photo & bio"}{" "}
                <span className="text-stone-400">({t("common.optional")})</span>
              </Label>
              <div className="flex items-center gap-3">
                {photo ? (
                  <img src={photo} alt="" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-stone-100 text-2xl">👤</div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="inline-block cursor-pointer rounded-xl border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700">
                    {lang === "bn" ? "ছবি বেছে নিন" : "Choose photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
                  </label>
                  {photo && (
                    <button
                      type="button"
                      className="text-left text-xs font-semibold text-red-600"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoDirty(true);
                      }}
                    >
                      {lang === "bn" ? "ছবি সরান" : "Remove photo"}
                    </button>
                  )}
                </div>
              </div>
              <Textarea
                rows={3}
                maxLength={150}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={lang === "bn" ? "নিজের সম্পর্কে ছোট করে লিখুন (সর্বোচ্চ ১৫০ অক্ষর)" : "A short line about yourself (max 150 characters)"}
              />
              <p className="text-xs text-stone-400">
                {lang === "bn"
                  ? "ছবি ও বায়ো শুধু লগইন করা ব্যবহারকারীরা আপনার বিস্তারিত পাতায় দেখতে পাবেন। পাবলিক তালিকায় দেখানো হয় না।"
                  : "Your photo and bio are shown only to signed-in users on your details page, never in the public list."}
              </p>
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
