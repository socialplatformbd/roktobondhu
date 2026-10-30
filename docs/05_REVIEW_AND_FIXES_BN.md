# ZIP Review ও সংশোধনের নোট

এই সংস্করণে নিচের সংশোধনগুলো করা হয়েছে:

1. `public/icons/icon-192.png`, `icon-512.png`, `maskable-512.png` তৈরি করা হয়েছে `icon-master.png` থেকে।
2. `public/manifest.json`-এ আইকন পথগুলো নিশ্চিত করা হয়েছে।
3. Service worker cache scope সীমিত করা হয়েছে। Authentication/API traffic এবং arbitrary same-origin GET response cache করা হয় না।
4. Blood request form-এ contact details public করার জন্য আলাদা checkbox যোগ করা হয়েছে, ডিফল্টে unchecked।
5. Public consent না থাকলে Firebase-এর public `blood_requests` document-এ `contactMethod` রাখা হয় না; তথ্য `blood_request_contacts`-এ রাখা হয়।
6. `firestore.rules`-এ profile field updates, donor directory, contact requests, public/private blood request contact, এবং reports-এর নিয়ম শক্ত করা হয়েছে।
7. Profile save/consent withdrawal-এ private ও public donor records একই batch-এ আপডেট করা হয়।
8. Account deletion-এ সংশ্লিষ্ট request/contact documents পরিষ্কার করার চেষ্টা যুক্ত করা হয়েছে। Firebase recent-login requirement-এর কারণে Auth deletion ব্যর্থ হতে পারে; UI/ব্যবহারকারীর কাছে সেই error handle করা উচিত।
9. `docs/02_DEPLOY_BN.md` ও `docs/03_TESTING_CHECKLIST_BN.md` যোগ করা হয়েছে।

## যাচাইয়ের সীমাবদ্ধতা

- `npm ci` এই পরিবেশে সময়সীমার মধ্যে সম্পূর্ণ হয়নি।
- এই পরিবেশে Node.js 22.16.0 আছে; lockfile-এর Firebase 13 dependency-র কয়েকটি package Node.js `>=24.12.0` চায়।
- তাই `npm run build` সফল হয়েছে বলে দাবি করা যাচ্ছে না।
- Firestore Security Rules Firebase Emulator-এ execute করে পরীক্ষা করা হয়নি।
- Firebase credentials, Google Sign-In provider, Firestore database, hosting, HTTPS deployment বা live app configure/verify করা হয়নি।

## প্রকাশের আগে আবশ্যক

- Node.js `>=24.12.0`-এ `npm ci` এবং `npm run build` চালান।
- Firebase Emulator বা আলাদা test project-এ Security Rules পরীক্ষা করুন।
- দুটি test account দিয়ে donor consent, contact acceptance, public/private request contact এবং account deletion পরীক্ষা করুন।
- বাস্তব ব্যবহারকারীর ব্যক্তিগত তথ্য যোগ করার আগে privacy policy, abuse response এবং data deletion workflow যাচাই করুন।

## দ্বিতীয় রিভিউয়ের সংশোধন

1. `firebaseApp.ts`: `ignoreUndefinedProperties` চালু (ফোন/ব্লাড গ্রুপ ফাঁকা থাকলে প্রোফাইল সেভ ব্যর্থ হতো)।
2. `firestore.rules`: `users_private` update থেকে `emailVerified` সমান-থাকার শর্ত সরানো হয়েছে (ইমেইল ভেরিফাইয়ের পর সেভ আটকে যেত)।
3. `firestore.rules`: `blood_requests` list limit ২০ → ১০০; `deleteAccount` query ১০০-তে নামানো।
4. `firestore.indexes.json`: `ownerId + bloodGroup + createdAt` index যোগ।
5. `donor_public` read rule সহজ করা হয়েছে (list query-তে per-document get() কাজ করে না)। Consent লেখার সময় যাচাই হয়।
6. Google Sign-In: popup ব্যর্থ হলে redirect fallback।
7. Account delete: ডেটা মোছার আগেই recent-login যাচাই; Settings-এ error বার্তা।
8. Admin, Inbox, Request details-এ try/catch।

এখনো বাকি: প্রাইভেট contact-এর ফ্লো (সিদ্ধান্ত দরকার), Firebase Emulator-এ rules test, Node 24-এ `npm ci && npm run build`, সাবপাথে হোস্টিং হলে `base` কনফিগ।

## তৃতীয় সংশোধন: ডোনারের সাড়া ও অ্যাডমিনের ব্যবহারকারী তালিকা

1. **সাড়া ব্যবস্থা (`request_responses`):** লগইন করা ডোনার অনুরোধের পাতায় "আমি সাহায্য করতে পারি" চেপে নিজের নম্বর ও বার্তা পাঠাতে পারেন। শুধু অনুরোধকারী, ওই ডোনার ও অ্যাডমিন এটি দেখতে পান। এক ডোনার এক অনুরোধে একবারই সাড়া দিতে পারেন। অনুরোধকারী অনুরোধের পাতায় সব সাড়া ও নম্বর (ট্যাপ করে কল) দেখেন।
2. **অ্যাডমিন → "ব্যবহারকারী" ট্যাব:** নাম, ইমেইল, ফোন, রক্তের গ্রুপ, এলাকা, ডোনার সম্মতি ও UID দেখা যায়; নাম/ইমেইল/ফোন দিয়ে খোঁজা যায়। Rules-এ `users_private`-এর list শুধু admin claim-ধারীর জন্য খোলা।
3. গোপনীয়তা নীতিতে লেখা হয়েছে যে অ্যাডমিন মডারেশনের জন্য এই তথ্য দেখতে পারেন।

**নতুন rules ডিপ্লয় করতে ভুলবেন না:** `firestore.rules` ও `firestore.indexes.json` Firebase-এ আবার publish/deploy করুন, নইলে এই দুই ফিচার permission-denied দেবে।

**অ্যাডমিন হতে:** `docs/04_ADMIN_BN.md` অনুযায়ী আপনার UID-তে `setAdminClaim` চালান, তারপর সাইন আউট করে আবার সাইন ইন করুন।

## চতুর্থ সংশোধন: GitHub Pages-এ ফোন থেকে প্রকাশ
- `vite.config.ts` `base: "./"`, manifest/sw/index.html relative path, তাই `/roktobondhu/` সাবপাথেও PWA চলে।
- `.github/workflows/deploy.yml` (build + Pages), `firestore-deploy.yml` (rules+indexes), `set-admin.yml` (admin claim) এবং `firebase.json` যোগ।
- Secrets লাগে: `VITE_FIREBASE_*` ছয়টি এবং `FIREBASE_SERVICE_ACCOUNT` (পুরো JSON)।

## পঞ্চম সংশোধন: অন্তহীন লোডিং ঠিক
- ইনবক্স, অ্যাডমিন, ডোনার তালিকা, রক্তের অনুরোধ, আমার অনুরোধ পেজে ডেটা আনতে error হলে আগে স্পিনার চলতেই থাকত। এখন পেজে লাল বার্তায় কারণ দেখায় (যেমন `permission-denied` মানে Firestore rules ডিপ্লয় হয়নি, `failed-precondition` মানে index নেই)।
- `ErrorBoundary` যোগ: অ্যাপ ক্র্যাশ করলে ফাঁকা সাদা পেজের বদলে error লেখা দেখায়।
- `AdminRoute`-এর অধিকার যাচাই আটকে গেলেও আর স্পিনারে থাকে না।
- Firestore-এ `experimentalAutoDetectLongPolling` চালু (যেসব নেটওয়ার্কে সরাসরি সংযোগ আটকায় সেখানে বিকল্প পথ নেয়)।

## ষষ্ঠ সংশোধন: প্রোফাইল সেভ
- `saveMyProfile` এখন সংরক্ষিত `email` ও `emailVerified` অপরিবর্তিত রাখে (rules এ দুটো বদলানো নিষিদ্ধ; টাইপ করা ইমেইলের অক্ষরের ছাঁদ `user.email` থেকে আলাদা হলে, বা ইমেইল ভেরিফাই হওয়ার পর সেভ আটকে যেত)।
- রেজিস্ট্রেশনের সময় প্রোফাইল ডকুমেন্ট তৈরি ব্যর্থ হলেও রেজিস্ট্রেশন ভাঙে না; প্রথম "সেভ" করলে ডকুমেন্ট তৈরি হয়।
- প্রোফাইল সেভ, যোগাযোগের অনুরোধ ও রক্তের অনুরোধ ফর্মে error হলে এখন আসল কারণ-কোড দেখায়।
- Firestore rules বদলায়নি, নতুন করে rules deploy লাগবে না।

## সপ্তম সংশোধন: PWA ইনস্টল ও অ্যাডমিন বার্তা
- ব্রাউজারের `beforeinstallprompt` ইভেন্ট একবারই, পেজ খোলার একটু পরেই আসে। আগে শুধু Settings পেজ খুললে ইভেন্ট শোনা শুরু হতো, তাই ইনস্টল বাটন কখনোই আসত না। এখন `src/pwa.ts` অ্যাপ চালু হওয়ার সময়ই ইভেন্টটা ধরে রাখে; হোম পেজে ও Settings-এ ইনস্টল বাটন আসে।
- Settings-এ iPhone/অন্য ব্রাউজারের জন্য হাতে ইনস্টলের নির্দেশনা যোগ।
- অ্যাডমিন পেজের "এখনো কনফিগার করা হয়নি" নীল বার্তা এখন শুধু ডেমো মোডে দেখায়।
