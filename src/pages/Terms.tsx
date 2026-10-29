import { useI18n } from "@/i18n/I18nContext";
import { Card } from "@/components/ui";

export default function Terms() {
  const { t, lang } = useI18n();
  const bn = lang === "bn";
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-stone-800">{t("terms.title")}</h1>
      <Card className="space-y-3 text-sm leading-relaxed text-stone-700">
        {bn ? (
          <>
            <p>রক্তবন্ধু একটি স্বেচ্ছাসেবী প্ল্যাটফর্ম — এটি হাসপাতাল, ব্লাড ব্যাংক বা চিকিৎসা সেবা প্রদানকারী প্রতিষ্ঠান নয়।</p>
            <p>এখানে প্রদর্শিত রক্তদাতার তালিকা বা রক্তের অনুরোধ কোনো গ্যারান্টি নয় যে রক্ত পাওয়া যাবে বা দাতা চিকিৎসাগতভাবে উপযুক্ত।</p>
            <p>প্রকৃত রক্তদানের আগে ক্রস-ম্যাচিং, স্ক্রিনিং ও যোগ্যতা যাচাই অবশ্যই একজন নিবন্ধিত চিকিৎসক/হাসপাতালের মাধ্যমে সম্পন্ন করতে হবে।</p>
            <p>ব্যবহারকারীদের অবশ্যই সত্য তথ্য দিতে হবে এবং অন্যদের হয়রানি বা প্রতারণা করা থেকে বিরত থাকতে হবে। লঙ্ঘনকারী অ্যাকাউন্ট স্থগিত বা মুছে ফেলা হতে পারে।</p>
            <p>স্প্যাম বা ভুয়া অনুরোধ রিপোর্ট করা যাবে এবং অ্যাডমিন তা মডারেট করবে।</p>
          </>
        ) : (
          <>
            <p>RoktoBondhu is a voluntary platform — it is not a hospital, blood bank, or medical service provider.</p>
            <p>Donor listings or blood requests shown here are not a guarantee that blood will be available or that a donor is medically eligible.</p>
            <p>Actual donation must always involve cross-matching, screening, and eligibility checks performed by a registered doctor/hospital.</p>
            <p>Users must provide truthful information and must not harass or defraud others. Violating accounts may be suspended or removed.</p>
            <p>Spam or fake requests can be reported and will be moderated by admins.</p>
          </>
        )}
      </Card>
    </div>
  );
}
