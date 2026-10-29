import { useI18n } from "@/i18n/I18nContext";
import { Alert, Card } from "@/components/ui";

export default function Help() {
  const { t, lang } = useI18n();
  const bn = lang === "bn";
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-stone-800">{t("help.title")}</h1>
      <Alert tone="danger">🚨 {t("help.emergencyNotice")}</Alert>
      <Card className="space-y-3 text-sm leading-relaxed text-stone-700">
        <h2 className="font-bold text-stone-800">{bn ? "কীভাবে ব্যবহার করবেন" : "How to use the app"}</h2>
        {bn ? (
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>নিবন্ধন করুন এবং আপনার প্রোফাইলে রক্তের গ্রুপ ও এলাকা দিন।</li>
            <li>রক্তদাতা হতে চাইলে সম্মতি দিয়ে "উপলব্ধ" অবস্থায় রাখুন।</li>
            <li>প্রয়োজনে "রক্তদাতা" মেনু থেকে খুঁজুন ও যোগাযোগের অনুরোধ পাঠান।</li>
            <li>রক্তের জরুরি প্রয়োজনে "রক্তের অনুরোধ" তৈরি করুন।</li>
            <li>সন্দেহজনক বা ভুয়া কিছু দেখলে রিপোর্ট বাটনে চাপুন।</li>
          </ol>
        ) : (
          <ol className="list-decimal space-y-1.5 pl-5">
            <li>Register and fill your blood group and area in your profile.</li>
            <li>If you want to donate, give consent and set status to "Available".</li>
            <li>Search donors and send a contact request when needed.</li>
            <li>Create a blood request when there's an urgent need.</li>
            <li>Use the report button if you see anything suspicious or fake.</li>
          </ol>
        )}
      </Card>
    </div>
  );
}
