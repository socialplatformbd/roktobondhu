import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nContext";
import { backend } from "@/services";
import { Badge, Button, Card, EmptyState, Spinner } from "@/components/ui";
import type { ContactRequest, ContactRequestStatus } from "@/types";

const STATUS_TONE: Record<ContactRequestStatus, "neutral" | "success" | "danger" | "warning"> = {
  pending: "warning",
  accepted: "success",
  declined: "danger",
  cancelled: "neutral",
};

export default function ContactInbox() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [received, setReceived] = useState<ContactRequest[]>([]);
  const [sent, setSent] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [r, s] = await Promise.all([backend.listReceivedContactRequests(), backend.listSentContactRequests()]);
    setReceived(r);
    setSent(s);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const respond = async (id: string, status: "accepted" | "declined") => {
    try {
      await backend.respondToContactRequest(id, status);
      load();
    } catch {
      alert(t("error.generic"));
    }
  };

  const cancel = async (id: string) => {
    try {
      await backend.cancelContactRequest(id);
      load();
    } catch {
      alert(t("error.generic"));
    }
  };

  const list = tab === "received" ? received : sent;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-stone-800">{t("inbox.title")}</h1>

      <div className="flex gap-2">
        <Button variant={tab === "received" ? "primary" : "outline"} size="sm" onClick={() => setTab("received")}>
          {t("inbox.received")} ({received.length})
        </Button>
        <Button variant={tab === "sent" ? "primary" : "outline"} size="sm" onClick={() => setTab("sent")}>
          {t("inbox.sent")} ({sent.length})
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : list.length === 0 ? (
        <EmptyState icon="📨" title={t("inbox.empty")} />
      ) : (
        <div className="space-y-3">
          {list.map((req) => (
            <Card key={req.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge tone="brand">{req.bloodGroup}</Badge>
                <Badge tone={STATUS_TONE[req.status]}>{t(`inbox.status.${req.status}` as any)}</Badge>
              </div>
              <p className="text-sm text-stone-700">
                {tab === "received" ? `${t("inbox.from")}: ${req.requesterName}` : `${t("inbox.to")}: ${t("nav.donors")}`}
              </p>
              {req.message && <p className="rounded-lg bg-stone-50 p-2 text-sm text-stone-600">"{req.message}"</p>}

              {tab === "received" && req.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => respond(req.id, "accepted")}>
                    {t("inbox.accept")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => respond(req.id, "declined")}>
                    {t("inbox.decline")}
                  </Button>
                </div>
              )}

              {tab === "sent" && req.status === "pending" && (
                <Button size="sm" variant="outline" onClick={() => cancel(req.id)}>
                  {t("inbox.cancel")}
                </Button>
              )}

              {tab === "sent" && req.status === "accepted" && req.donorContactRevealed && (
                <div className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">
                  <p className="font-semibold">{t("inbox.contactRevealed")}</p>
                  {req.donorContactRevealed.phone && <p>📞 {req.donorContactRevealed.phone}</p>}
                  {req.donorContactRevealed.email && <p>✉️ {req.donorContactRevealed.email}</p>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
