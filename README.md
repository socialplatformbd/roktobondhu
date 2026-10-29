# রক্তবন্ধু | RoktoBondhu

স্বেচ্ছাসেবী রক্তদাতা খুঁজে বের করার একটি Progressive Web App (PWA)।
বর্তমানে শুধুমাত্র **আনোয়ারা** ও **হালিশহর, চট্টগ্রাম**-এ সেবা দেওয়া হচ্ছে।

> ⚠️ এটি কোনো হাসপাতাল, ব্লাড ব্যাংক বা জরুরি চিকিৎসা সেবা নয়। রক্তের গ্রুপ মিল থাকা মানেই
> ট্রান্সফিউশনের জন্য উপযুক্ত তা নিশ্চিত নয় — ক্রস-ম্যাচিং ও স্ক্রিনিং সবসময় যোগ্য
> চিকিৎসা প্রতিষ্ঠানে করাতে হবে।

---

## ১. এই রিপোতে কী আছে (Phase 1–5 সম্পন্ন)

| এলাকা | অবস্থা |
|---|---|
| React + TypeScript + Vite + Tailwind ফ্রন্টএন্ড, সব স্ক্রিন | ✅ সম্পন্ন |
| বাংলা/ইংরেজি সম্পূর্ণ অনুবাদ সিস্টেম, বাংলা ডিফল্ট | ✅ সম্পন্ন |
| Firebase Auth কোড (Email/Password + Google) | ⚙️ কোড আছে, আপনার Firebase project-এ configure ও test করতে হবে |
| Firestore ডেটা মডেল + Security Rules | ⚠️ rules ফাইল আছে, deploy ও Emulator-এ test করা বাধ্যতামূলক |
| Donor directory, contact requests, blood requests | ⚙️ UI ও backend code আছে; real Firebase integration পরীক্ষা করতে হবে |
| PWA (manifest, service worker, icons) | ⚙️ assets তৈরি আছে; HTTPS deployment-এ installability পরীক্ষা করতে হবে |
| Admin প্যানেল + custom claims স্ক্রিপ্ট | ✅ কোড রেডি, আপনাকে claim সেট করতে হবে |
| প্রকৃত Firebase প্রজেক্টে ডিপ্লয়/টেস্ট | ❌ এখনো করা হয়নি — এটি আপনাকে করতে হবে |

**গুরুত্বপূর্ণ সততা নোট:** আমি (ডেভেলপার টুল) আপনার পক্ষে কোনো Firebase প্রজেক্ট তৈরি করিনি,
কোনো real credentials সেট করিনি, এবং কোনো live deployment টেস্ট করিনি। যতক্ষণ না আপনি
`.env` ফাইলে নিজের Firebase config না বসাচ্ছেন, অ্যাপটি স্বয়ংক্রিয়ভাবে **ডেমো মোডে**
(শুধু আপনার ফোনের ব্রাউজারে localStorage ব্যবহার করে) চলবে — যাতে আপনি Firebase ছাড়াই
পুরো UI টেস্ট করতে পারেন।

---

## নিরাপত্তা সংশোধন নোট

- রক্তের অনুরোধ তৈরির ফর্মে যোগাযোগের তথ্য প্রকাশের জন্য আলাদা, ডিফল্টে বন্ধ সম্মতি আছে।
- সম্মতি না দিলে public blood request document-এ `contactMethod` রাখা হয় না; private তথ্য `blood_request_contacts` collection-এ রাখা হয়।
- Firestore rules-এ private request contact-এর access owner/admin-এ সীমিত।
- Donor profile update ও public directory document একসঙ্গে commit করা হয় যাতে consent/availability sync থাকে।
- PWA icon files তৈরি করা হয়েছে এবং service worker-কে arbitrary same-origin GET response cache না করতে সীমিত করা হয়েছে।
- Firestore rules Emulator-এ চালিয়ে যাচাই করা হয়নি। Production data দেওয়ার আগে rules test করতে হবে।
- Firebase SDK dependencies-এর বর্তমান lockfile Node.js `>=24.12.0` চায়। Node.js 22 দিয়ে build পরীক্ষা এই পরিবেশে করা যায়নি।

---

## ২. কীভাবে বোঝা যাবে অ্যাপ কোন মোডে আছে

- `.env` ফাইলে Firebase config না থাকলে → **Demo mode** (হোমপেজে হলুদ ব্যানার দেখাবে)।
  সব ডেটা শুধু ঐ ব্রাউজারে localStorage-এ থাকে, অন্য কোনো সার্ভারে যায় না।
- `.env` ফাইলে সঠিক Firebase config থাকলে → **Firebase mode**, প্রকৃত Firebase
  Authentication ও Firestore ব্যবহার করে।

ডেমো মোডে Google Sign-In কাজ করে না (এর জন্য প্রকৃত Firebase লাগবে), বাকি সবকিছু
(ইমেইল রেজিস্ট্রেশন, প্রোফাইল, ডোনার সার্চ, কন্টাক্ট রিকোয়েস্ট, ব্লাড রিকোয়েস্ট, অ্যাডমিন
টগল) ডেমো মোডেও টেস্ট করা যায়।

---

## ৩. ফোল্ডার স্ট্রাকচার (সংক্ষেপে)

```
src/
  i18n/            -> বাংলা/ইংরেজি অনুবাদ ডিকশনারি ও কনটেক্সট
  context/         -> AuthContext (লগইন অবস্থা + প্রোফাইল)
  services/        -> backend abstraction:
                       env.ts          (Firebase কনফিগার করা আছে কিনা যাচাই)
                       mockBackend.ts  (ডেমো/লোকাল ব্যাকএন্ড)
                       firebaseBackend.ts (প্রকৃত Firebase Auth+Firestore)
                       index.ts        (কোনটা ব্যবহার হবে তা স্বয়ংক্রিয় নির্বাচন)
  components/      -> Header, BottomNav, UI উপাদান, Route guards
  pages/           -> প্রতিটি স্ক্রিনের জন্য আলাদা পেজ (Home, Login, Donors, ...)
  types/           -> TypeScript টাইপ সংজ্ঞা
  utils/           -> constants, ফোন নম্বর normalize ইত্যাদি
public/
  manifest.json, sw.js, icons/   -> PWA ফাইল
firestore.rules                 -> Firestore Security Rules
firestore.indexes.json          -> প্রয়োজনীয় কম্পোজিট ইনডেক্স
scripts/setAdminClaim.cjs       -> অ্যাডমিন বানানোর ট্রাস্টেড সার্ভার-সাইড স্ক্রিপ্ট
docs/                           -> ধাপে ধাপে বাংলা গাইড (Firebase, Deploy, Testing)
```

---

## ৪. পরবর্তী ধাপগুলো (ডক্স)

1. 📄 [`docs/01_FIREBASE_SETUP_BN.md`](docs/01_FIREBASE_SETUP_BN.md) — Firebase প্রজেক্ট তৈরি,
   Authentication চালু করা, Firestore তৈরি, Security Rules বসানো, `.env` ফাইল সেটআপ।
2. 📄 [`docs/02_DEPLOY_BN.md`](docs/02_DEPLOY_BN.md) — পাবলিক HTTPS লিংকে ডিপ্লয় করা
   (Android ফোন থেকেও করা সম্ভব এমন পদ্ধতি সহ)।
3. 📄 [`docs/03_TESTING_CHECKLIST_BN.md`](docs/03_TESTING_CHECKLIST_BN.md) — টেস্টিং চেকলিস্ট,
   পরিচিত সীমাবদ্ধতা, এবং পাবলিক লঞ্চের আগে করণীয়।
4. 📄 [`docs/04_ADMIN_BN.md`](docs/04_ADMIN_BN.md) — নিরাপদভাবে অ্যাডমিন অ্যাকাউন্ট বানানো।

---

## ৫. লোকালি রান করা (Development)

```bash
npm install
npm run dev
```

বিল্ড করতে:

```bash
npm run build
npm run preview
```

---

## ৬. খরচ ও কোটা (Firebase Spark/Blaze)

| সার্ভিস | ফ্রি (Spark) প্ল্যানে যা পাবেন | কখন টাকা লাগতে পারে |
|---|---|---|
| Firebase Authentication | প্রতি মাসে ৫০,০০০ Monthly Active User পর্যন্ত ফ্রি (Email+Google) | অনেক বড় স্কেলে গেলে |
| Cloud Firestore | ১ GiB স্টোরেজ, প্রতিদিন ৫০K read / ২০K write / ২০K delete ফ্রি | ট্রাফিক বাড়লে Blaze (pay-as-you-go) দরকার হবে |
| Firebase Hosting | ১০ GB স্টোরেজ + ৩৬০ MB/day ট্রান্সফার ফ্রি | খুব বেশি ভিজিটর হলে |
| Netlify/Vercel Hosting (বিকল্প) | ব্যক্তিগত প্রজেক্টের জন্য উদার ফ্রি টায়ার | কমার্শিয়াল স্কেলে |
| Custom domain (ঐচ্ছিক) | — | ডোমেইন কেনার খরচ (প্রতি বছর) |
| SMS/OTP | **ব্যবহার করা হয়নি** এই ভার্সনে | ভবিষ্যতে যোগ করলে Twilio/Firebase-এর খরচ লাগবে |

এই অ্যাপ ছোট/মাঝারি স্কেলে (কয়েক হাজার ব্যবহারকারী পর্যন্ত) সাধারণত Firebase-এর ফ্রি
Spark প্ল্যানেই চলার কথা। তবে Firestore-এর composite index তৈরির জন্য Blaze প্ল্যানে
আপগ্রেড করতে বলা হতে পারে (এখনো ফ্রি কোটার মধ্যেই থাকবে, শুধু বিলিং অ্যাকাউন্ট যুক্ত
করতে হয়)।

---

## ৭. পরিচিত সীমাবদ্ধতা (সততার সাথে উল্লেখ করা)

- Phone OTP ভেরিফিকেশন নেই (ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে, SMS খরচ এড়াতে)।
- SMS/Push notification কোনো প্রকৃত প্রোভাইডার (যেমন Twilio, FCM) কনফিগার করা নেই —
  তাই "ডেলিভারি নিশ্চিত হয়েছে" এমন কোনো দাবি অ্যাপে করা হয় না।
- Contact request গ্রহণ করলে ডোনারের তথ্য requester-কে দেখানো হয় ডোনারের নিজের ক্লায়েন্ট
  থেকে লেখা ডেটা হিসেবে (কোনো Cloud Function যাচাই করে না) — এটি simplest নিরাপদ পদ্ধতি
  কিন্তু ১০০% সার্ভার-সাইড ভ্যালিডেটেড নয়। বড় স্কেলে গেলে Cloud Functions দিয়ে আরও
  শক্তিশালী করা যায়।
- Admin claim সেট করতে একটি Node.js স্ক্রিপ্ট কম্পিউটার/Cloud Shell-এ চালাতে হবে —
  শুধু অ্যাপ থেকে অ্যাডমিন বানানো যায় না (এটি সচেতনভাবে নিরাপত্তার জন্য করা হয়েছে)।
- Firestore rules এখনো Firebase Emulator Suite দিয়ে স্বয়ংক্রিয়ভাবে টেস্ট করা হয়নি —
  `docs/03_TESTING_CHECKLIST_BN.md`-এ ম্যানুয়াল টেস্ট কেসগুলো দেওয়া আছে।
- এটি কোনো আইনি পরামর্শ নয় — পাবলিক লঞ্চের আগে বাংলাদেশের প্রযোজ্য গোপনীয়তা/ডেটা
  সুরক্ষা আইন একজন আইনজীবীর সাথে পর্যালোচনা করা উচিত।

---

## ৮. ব্র্যান্ডিং ক্রেডিট

Made by Mohammad Rakib
Join my telegram channel: https://t.me/appdevbyrakib

(এই তথ্য অ্যাপের Settings → About অংশে দেখা যাবে।)
