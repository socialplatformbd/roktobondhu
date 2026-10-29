import { useI18n } from "@/i18n/I18nContext";
import { Card } from "@/components/ui";

export default function Privacy() {
  const { t, lang } = useI18n();
  const bn = lang === "bn";
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-stone-800">{t("privacy.title")}</h1>
      <Card className="space-y-3 text-sm leading-relaxed text-stone-700">
        {bn ? (
          <>
            <p>রক্তবন্ধু শুধুমাত্র রক্তদাতা ও রক্তপ্রার্থীদের সংযুক্ত করার জন্য প্রয়োজনীয় ন্যূনতম তথ্য সংগ্রহ করে: নাম, ইমেইল, ঐচ্ছিক মোবাইল নম্বর, রক্তের গ্রুপ, এলাকা এবং সম্মতি সংক্রান্ত তথ্য।</p>
            <p>আমরা সম্পূর্ণ বাসার ঠিকানা, জাতীয় পরিচয়পত্র নম্বর, বা অপ্রয়োজনীয় স্পর্শকাতর তথ্য সংগ্রহ করি না।</p>
            <p>আপনার ফোন নম্বর ও ইমেইল শুধুমাত্র তখনই অন্য ব্যবহারকারীকে দেখানো হয় যখন আপনি কোনো যোগাযোগের অনুরোধ সরাসরি গ্রহণ করেন। সাধারণ অনুসন্ধানে এই তথ্য কখনো প্রকাশ করা হয় না।</p>
            <p>আপনি যেকোনো সময় সেটিংস থেকে রক্তদাতা সম্মতি প্রত্যাহার করতে পারেন বা আপনার অ্যাকাউন্ট সম্পূর্ণ মুছে ফেলতে পারেন।</p>
            <p>অ্যাপ অ্যাডমিন শুধুমাত্র মডারেশন ও সহায়তার প্রয়োজনে নিবন্ধিত ব্যবহারকারীর তথ্য (নাম, ইমেইল, ফোন, রক্তের গ্রুপ, এলাকা) দেখতে পারেন।</p>
            <p>অপব্যবহার রোধে আমরা রিপোর্ট ব্যবস্থা রেখেছি এবং অ্যাডমিন মডারেটররা সেগুলো পর্যালোচনা করেন।</p>
            <p className="font-semibold">গুরুত্বপূর্ণ: পাবলিক লঞ্চের আগে অ্যাপ মালিকের উচিত বাংলাদেশের প্রযোজ্য গোপনীয়তা ও তথ্য সুরক্ষা আইন পর্যালোচনা করা।</p>
          </>
        ) : (
          <>
            <p>RoktoBondhu collects only the minimum information needed to connect donors and requesters: name, email, optional mobile number, blood group, area, and consent-related data.</p>
            <p>We do not collect full home addresses, national ID numbers, or unnecessary sensitive data.</p>
            <p>Your phone number and email are shown to another user only after you explicitly accept a contact request. This information is never exposed in general search.</p>
            <p>You can withdraw donor consent at any time from Settings, or permanently delete your account.</p>
            <p>The app admin can view registered users&apos; details (name, email, phone, blood group, area) only for moderation and support.</p>
            <p>We maintain a reporting system to prevent abuse, reviewed by admin moderators.</p>
            <p className="font-semibold">Important: before a public launch, the app owner should review applicable Bangladesh privacy and data protection requirements.</p>
          </>
        )}
      </Card>
    </div>
  );
}
