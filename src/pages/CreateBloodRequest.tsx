import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { backend } from "@/services";
import { Alert, Button, Input, Label, Select, Textarea, Card } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import { BLOOD_GROUPS, type AreaId, type BloodGroup, type UrgencyLevel } from "@/types";

export default function CreateBloodRequest() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>("A+");
  const [area, setArea] = useState<AreaId>("anwara");
  const [hospitalName, setHospitalName] = useState("");
  const [neededAt, setNeededAt] = useState("");
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [notes, setNotes] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactPublicly, setContactPublicly] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!hospitalName.trim() || !neededAt || !contactMethod.trim()) {
      setError(lang === "bn" ? "সব আবশ্যক ঘর পূরণ করুন।" : "Please fill all required fields.");
      return;
    }
    const neededAtMs = new Date(neededAt).getTime();
    if (Number.isNaN(neededAtMs)) {
      setError(lang === "bn" ? "সঠিক তারিখ ও সময় দিন।" : "Enter a valid date and time.");
      return;
    }

    setSaving(true);
    try {
      await backend.createBloodRequest({
        bloodGroup,
        area,
        hospitalName: hospitalName.trim(),
        neededAt: neededAtMs,
        units,
        urgency,
        notes: notes.trim() || undefined,
        contactMethod: contactMethod.trim(),
        contactPublicly,
      });
      navigate("/requests/mine");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("duplicate")) {
        setError(t("requests.duplicateWarning"));
      } else {
        setError(t("error.generic"));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-5">
      <h1 className="text-xl font-bold text-stone-800">{t("requests.create")}</h1>

      {error && <Alert tone="danger">{error}</Alert>}

      <form onSubmit={onSubmit} className="space-y-4">
        <Card className="space-y-4">
          <div>
            <Label>{t("profile.bloodGroup")}</Label>
            <Select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}>
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
              {Object.entries(AREA_LABELS).map(([id, label]) => (
                <option key={id} value={id}>
                  {lang === "bn" ? label.bn : label.en}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("requests.hospital")}</Label>
            <Input required value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} />
          </div>
          <div>
            <Label>{t("requests.neededAt")}</Label>
            <Input required type="datetime-local" value={neededAt} onChange={(e) => setNeededAt(e.target.value)} />
          </div>
          <div>
            <Label>{t("requests.units")}</Label>
            <Input required type="number" min={1} max={20} value={units} onChange={(e) => setUnits(Number(e.target.value))} />
          </div>
          <div>
            <Label>{t("requests.urgency")}</Label>
            <Select value={urgency} onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}>
              <option value="normal">{t("requests.urgency.normal")}</option>
              <option value="urgent">{t("requests.urgency.urgent")}</option>
              <option value="critical">{t("requests.urgency.critical")}</option>
            </Select>
          </div>
          <div>
            <Label>
              {t("requests.notes")} <span className="text-stone-400">({t("common.optional")})</span>
            </Label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <Label>{t("requests.contactMethod")}</Label>
            <Input required value={contactMethod} onChange={(e) => setContactMethod(e.target.value)} placeholder="017XXXXXXXX" />
            <p className="mt-1 text-xs text-stone-400">{t("requests.contactMethodHelp")}</p>
            <label className="mt-3 flex items-start gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={contactPublicly}
                onChange={(e) => setContactPublicly(e.target.checked)}
                className="mt-1"
              />
              <span>
                {lang === "bn"
                  ? "আমি সম্মতি দিচ্ছি যে এই অনুরোধে দেওয়া যোগাযোগের তথ্য সবার কাছে প্রকাশ করা যাবে।"
                  : "I consent to making the contact information in this request publicly visible."}
              </span>
            </label>
            {!contactPublicly && (
              <p className="mt-1 text-xs text-amber-700">
                {lang === "bn"
                  ? "এই অপশন বন্ধ থাকলে নম্বর ব্যক্তিগত থাকবে। ডোনাররা অনুরোধের পাতায় \"সাহায্য করতে পারি\" চাপলে তাদের নম্বর আপনি দেখতে পাবেন।"
                  : "When unchecked, your number stays private. Donors can tap \"I can help\" on your request page and you will see their contact."}
              </p>
            )}
          </div>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? t("common.loading") : t("common.submit")}
        </Button>
      </form>
    </div>
  );
}
