# রক্তবন্ধু PWA প্রকাশ করার গাইড

এই গাইডটি সাধারণ নির্দেশনা। Firebase project, billing status, hosting account এবং build output নিজে যাচাই করতে হবে।

## ১. আগে যা লাগবে
- একটি Firebase project
- Authentication-এ Email/Password এবং Google provider চালু
- Firestore database তৈরি
- `.env` ফাইলে `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` সেট করা
- কোনো Firebase Admin service-account private key কখনো frontend `.env`-এ রাখবেন না।

## ২. লোকাল বিল্ড
টার্মিনাল/ক্লাউড ডেভেলপমেন্ট পরিবেশে:
```bash
npm ci
npm run build
```
বিল্ড ব্যর্থ হলে প্রথম error থেকে ঠিক করুন। শুধু `npm run dev` চলা মানেই production build সফল নয়।

## ৩. Firestore Rules
প্রজেক্ট রুটের `firestore.rules` ফাইল Firebase Console-এর Firestore Rules-এ বসান অথবা Firebase CLI দিয়ে deploy করুন। Production data যোগ করার আগে Emulator বা আলাদা test project-এ rules পরীক্ষা করুন। Security Rules পরীক্ষা না করে বাস্তব ব্যবহারকারীর তথ্য যোগ করবেন না।

## ৪. Hosting
Vite build সাধারণত `dist/` ফোল্ডার তৈরি করে। Firebase Hosting ব্যবহার করলে Firebase CLI দিয়ে `dist`-কে public directory হিসেবে configure করুন এবং SPA rewrites-এর জন্য `index.html` fallback যোগ করুন। Deploy শেষে HTTPS URL খুলে সব screen পরীক্ষা করুন।

## ৫. PWA পরীক্ষা
- HTTPS URL Android Chrome-এ খুলুন।
- Chrome menu থেকে Install app / Add to Home screen বেছে নিন।
- Offline অবস্থায় app shell দেখা যায় কি না পরীক্ষা করুন।
- Offline অবস্থায় database operation সফল হয়েছে এমন ভুল বার্তা দেখায় কি না যাচাই করুন।
- ফোন নম্বর বা ব্যক্তিগত profile service worker cache-এ আছে কি না পরীক্ষা করুন।

## ৬. খরচ
Firebase-এর free quota ও hosting limits পরিবর্তিত হতে পারে। Firebase Console-এ বর্তমান quota ও billing status দেখে নিন। SMS OTP চালু করা হয়নি। অপ্রত্যাশিত খরচ এড়াতে billing alerts এবং usage limits বিবেচনা করুন।
