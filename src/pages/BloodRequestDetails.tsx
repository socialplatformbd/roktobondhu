import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useI18n } from "@/i18n/I18nContext";
import { useAuth } from "@/context/AuthContext";
import { backend } from "@/services";
import { Alert, Badge, Button, Card, EmptyState, Input, Spinner, Textarea } from "@/components/ui";
import { AREA_LABELS } from "@/utils/constants";
import type { BloodRequest, BloodRequestResponse } from "@/types";

const STATUS_TONE: Record<string, "neutral" | "success" | "danger" | "warning"> = {
  open: "success",
  fulfilled: "neutral",
  cancelled: "danger",
  expired: "warning",
};

export default function BloodRequestDetails() {
  const { id } = useParams<{ id: string }>();
  const { t, lang } = useI18n();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [req, setReq] = useState<BloodRequest | null | undefined>(undefined);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const [responses, setResponses] = useState<BloodRequestResponse[]>([]);
  const [myResponse, setMyResponse] = useState<BloodRequestResponse | null>(null);
  const [offerMessage, setOfferMessage] = useState("");
  const [offerContact, setOfferContact] = useState("");
  const [offering, setOffering] = useState(false);

  const load = async () => {
    if (!id) return;
    let r: BloodRequest | null = null;
    try {
      r = await backend.getBloodRequest(id);
    } catch {
      r = null;
    }
    setReq(r);
    if (r && user) {
      if (r.ownerId === user.uid) {
        setResponses(await backend.listResponsesForRequest(r.id).catch(() => []));
      } else {
        setMyResponse(await backend.getMyResponseForRequest(r.id));
      }
    }
  };

  useEffect(() => {
    if (profile?.phone) setOfferContact((c) => c || profile.phone || "");
  }, [profile?.phone]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.uid]);

  if (req === undefined) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }
  if (!req) return <EmptyState icon="📋" title={t("requests.empty")} />;

  const isOwner = user?.uid === req.ownerId;

  const setStatus = async (status: "fulfilled" | "cancelled") => {
    try {
      await backend.updateBloodRequestStatus(req.id, status);
      load();
    } catch {
      alert(t("error.generic"));
    }
  };

  const submitOffer = async () => {
    const contact = (offerContact || profile?.phone || "").trim();
    if (!contact) {
      alert(lang === "bn" ? "যোগাযোগের নম্বর দিন।" : "Please enter a contact number.");
      return;
    }
    setOffering(true);
    try {
      await backend.respondToBloodRequest(req.id, offerMessage.trim(), contact);
      await load();
    } catch {
      alert(t("error.generic"));
    } finally {
      setOffering(false);
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await backend.reportItem("blood_request", req.id, reportReason.trim());
      setReportDone(true);
    } catch {
      alert(t("error.generic"));
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="text-sm font-semibold text-brand-700">
        ← {t("common.back")}
      </button>

      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge tone="brand" className="text-base">{req.bloodGroup}</Badge>
          <Badge tone={STATUS_TONE[req.status]}>{t(`requests.status.${req.status}` as any)}</Badge>
        </div>
        <h1 className="text-lg font-bold text-stone-800">{req.hospitalName}</h1>
        <div className="space-y-1 text-sm text-stone-600">
          <p>📍 {lang === "bn" ? AREA_LABELS[req.area].bn : AREA_LABELS[req.area].en}</p>
          <p>🗓️ {new Date(req.neededAt).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}</p>
          <p>🩸 {req.units} {lang === "bn" ? "ব্যাগ/ইউনিট" : "unit(s)"}</p>
          <p>⚡ {t(`requests.urgency.${req.urgency}` as any)}</p>
          {req.notes && <p>📝 {req.notes}</p>}
          <p>👤 {req.ownerName}</p>
          {req.contactPublicly && req.contactMethod ? (
            <p>☎️ {req.contactMethod}</p>
          ) : (
            <p className="text-sm text-stone-500">
              {lang === "bn"
                ? "অনুরোধকারী যোগাযোগের তথ্য প্রকাশ করেননি। সাহায্য করতে চাইলে নিচে \"আমি সাহায্য করতে পারি\" চাপুন — আপনার নম্বর শুধু অনুরোধকারী দেখতে পাবেন।"
                : "The requester has not made contact details public. To help, tap \"I can help\" below — your number is shown only to the requester."}
            </p>
          )}
        </div>

        <Alert tone="info">{t("requests.disclaimer")}</Alert>

        {isOwner && req.status === "open" && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setStatus("fulfilled")}>
              {t("requests.markFulfilled")}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setStatus("cancelled")}>
              {t("requests.cancelRequest")}
            </Button>
          </div>
        )}

        {!isOwner && (
          <Button size="sm" variant="ghost" onClick={() => setShowReport(true)}>
            🚩 {t("requests.report")}
          </Button>
        )}
      </Card>

      {isOwner && (
        <Card className="space-y-3">
          <h2 className="font-bold text-stone-800">
            {lang === "bn" ? `সাড়া (${responses.length})` : `Responses (${responses.length})`}
          </h2>
          {responses.length === 0 ? (
            <p className="text-sm text-stone-500">
              {lang === "bn" ? "এখনো কেউ সাড়া দেননি।" : "No one has responded yet."}
            </p>
          ) : (
            responses.map((r) => (
              <div key={r.id} className="space-y-1 rounded-lg bg-stone-50 p-3 text-sm text-stone-700">
                <p className="font-semibold">👤 {r.donorName}</p>
                <p>
                  ☎️{" "}
                  <a className="font-semibold text-brand-700 underline" href={`tel:${r.contact}`}>
                    {r.contact}
                  </a>
                </p>
                {r.message && <p className="text-stone-600">“{r.message}”</p>}
                <p className="text-xs text-stone-400">{new Date(r.createdAt).toLocaleString(lang === "bn" ? "bn-BD" : "en-US")}</p>
              </div>
            ))
          )}
        </Card>
      )}

      {user && !isOwner && req.status === "open" && (
        <Card className="space-y-3">
          {myResponse ? (
            <Alert tone="success">
              {lang === "bn"
                ? "✅ আপনি সাড়া দিয়েছেন। অনুরোধকারী আপনার নম্বর দেখতে পাবেন।"
                : "✅ You have responded. The requester can see your contact number."}
            </Alert>
          ) : (
            <>
              <h2 className="font-bold text-stone-800">🩸 {lang === "bn" ? "আমি সাহায্য করতে পারি" : "I can help"}</h2>
              <Input
                value={offerContact}
                onChange={(e) => setOfferContact(e.target.value)}
                placeholder="017XXXXXXXX"
                inputMode="tel"
              />
              <Textarea
                rows={2}
                maxLength={300}
                placeholder={lang === "bn" ? "বার্তা (ঐচ্ছিক)" : "Message (optional)"}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
              <p className="text-xs text-stone-500">
                {lang === "bn"
                  ? "এই নম্বর ও বার্তা শুধু অনুরোধকারী দেখতে পাবেন।"
                  : "This number and message are visible only to the requester."}
              </p>
              <Button className="w-full" onClick={submitOffer} disabled={offering}>
                {offering ? t("common.loading") : t("common.submit")}
              </Button>
            </>
          )}
        </Card>
      )}

      {!user && (
        <Alert tone="warning">
          {t("donors.loginToContact")} <Link to="/login" className="font-semibold underline">{t("nav.login")}</Link>
        </Alert>
      )}

      {showReport && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={() => setShowReport(false)}>
          <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
            {reportDone ? (
              <Alert tone="success">{t("requests.reportSuccess")}</Alert>
            ) : (
              <>
                <h2 className="mb-2 font-bold text-stone-800">{t("requests.report")}</h2>
                <Textarea rows={3} placeholder={t("requests.reportReason")} value={reportReason} onChange={(e) => setReportReason(e.target.value)} />
                <Button className="mt-3 w-full" onClick={submitReport}>
                  {t("common.submit")}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
