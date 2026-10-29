# ধাপ ১: Firebase প্রজেক্ট সেটআপ (Phase 2 ও 3)

এই গাইডটি Android ফোনের Chrome ব্রাউজার থেকেই করা সম্ভব। প্রতিটি ধাপ অনুসরণ করুন।

---

## ১.১ Firebase প্রজেক্ট তৈরি করুন

1. Chrome-এ যান: **https://console.firebase.google.com**
2. আপনার Google অ্যাকাউন্ট দিয়ে সাইন ইন করুন।
3. **"Add project" / "প্রজেক্ট যোগ করুন"** বাটনে চাপুন।
4. প্রজেক্টের নাম দিন, যেমন: `roktobondhu` (বা যেকোনো নাম)।
5. Google Analytics চাইলে "disable" করে দিতে পারেন (ঐচ্ছিক, এই অ্যাপের জন্য প্রয়োজন নেই)।
6. **"Create project"** চাপুন এবং তৈরি হওয়া পর্যন্ত অপেক্ষা করুন।

---

## ১.২ ওয়েব অ্যাপ যোগ করুন ও কনফিগ সংগ্রহ করুন

1. প্রজেক্ট ড্যাশবোর্ডে, **`</>`** (ওয়েব) আইকনে চাপুন "Add app" এর নিচে।
2. অ্যাপের নিকনেম দিন: `RoktoBondhu Web`।
3. "Also set up Firebase Hosting" — **টিক না দিলেও চলবে** (পরে আলাদাভাবে ডিপ্লয় গাইড অনুসরণ করব)।
4. **"Register app"** চাপুন।
5. এখন একটি কোড ব্লক দেখাবে যেমন:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "roktobondhu-xxxx.firebaseapp.com",
     projectId: "roktobondhu-xxxx",
     storageBucket: "roktobondhu-xxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```
6. এই মানগুলো কপি করে রাখুন (স্ক্রিনশট নিতে পারেন)।

### এই মানগুলো প্রজেক্টে বসান

প্রজেক্টের রুটে `.env.example` ফাইলটি কপি করে নতুন ফাইল **`.env`** বানান এবং মান বসান:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=roktobondhu-xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=roktobondhu-xxxx
VITE_FIREBASE_STORAGE_BUCKET=roktobondhu-xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

> ℹ️ এই মানগুলো "public client config" — গোপন পাসওয়ার্ড নয়, তাই ফ্রন্টএন্ড কোডে
> থাকা নিরাপদ। প্রকৃত নিরাপত্তা আসে Firestore Security Rules থেকে (পরের ধাপ দেখুন),
> client config থেকে নয়। তারপরও `.env` ফাইলটি GitHub-এ পাবলিক রিপোতে commit করবেন না
> (`.gitignore`-এ ইতিমধ্যে যোগ করা আছে)।

`.env` বসানোর পর অ্যাপ rebuild/restart করলে এটি স্বয়ংক্রিয়ভাবে **demo mode থেকে
Firebase mode-এ** চলে যাবে (হোমপেজের হলুদ ডেমো ব্যানার আর দেখাবে না)।

---

## ১.৩ Authentication চালু করুন

1. বাম পাশের মেনু থেকে **Build → Authentication** এ যান।
2. **"Get started"** চাপুন।
3. **Sign-in method** ট্যাবে যান।
4. **Email/Password** এ চাপুন → Enable করুন → Save করুন।
5. **Google** এ চাপুন → Enable করুন → একটি support email বাছাই করুন → Save করুন।
6. (ঐচ্ছিক) **Settings → Authorized domains**-এ চেক করুন আপনার হোস্টিং ডোমেইন
   (যেমন `yourapp.web.app` বা `yourapp.netlify.app`) তালিকায় আছে কিনা — না থাকলে
   "Add domain" দিয়ে যোগ করুন। ডিপ্লয়ের পর এটি করতে হবে।

---

## ১.৪ Cloud Firestore চালু করুন

1. বাম মেনু থেকে **Build → Firestore Database** এ যান।
2. **"Create database"** চাপুন।
3. Location হিসেবে কাছের অঞ্চল বাছাই করুন (যেমন `asia-south1` বা `asia-southeast1`) —
   একবার সেট করলে এটি পরিবর্তন করা যায় না, তাই সাবধানে বাছাই করুন।
4. **Production mode** বাছাই করুন (Rules নিজে থেকে বসাবো পরের ধাপে)।
5. **"Enable"** চাপুন।

---

## ১.৫ Firestore Security Rules বসান

1. Firestore Database পেজে **"Rules"** ট্যাবে যান।
2. এই প্রজেক্টের রুটে থাকা **`firestore.rules`** ফাইলটি খুলুন, পুরো কনটেন্ট কপি করুন।
3. Firebase Console-এর Rules এডিটরে বর্তমান কনটেন্ট মুছে সেটা পেস্ট করুন।
4. **"Publish"** চাপুন।

> এই rules ফাইলটি নিশ্চিত করে:
> - প্রতিটি ব্যবহারকারী শুধু নিজের প্রাইভেট প্রোফাইল পড়তে/লিখতে পারবে।
> - পাবলিক ডোনার তালিকায় ফোন/ইমেইল কখনো থাকবে না।
> - কন্টাক্ট রিকোয়েস্ট শুধু সংশ্লিষ্ট দুই পক্ষ পড়তে পারবে।
> - ব্লাড রিকোয়েস্ট শুধু মালিক এডিট/বন্ধ করতে পারবে।
> - অ্যাডমিন অ্যাক্সেস শুধুমাত্র trusted custom claim দিয়ে নিয়ন্ত্রিত (`docs/04_ADMIN_BN.md` দেখুন)।

---

## ১.৬ Composite Indexes বসান (ঐচ্ছিক কিন্তু সুপারিশকৃত)

ডোনার সার্চ ও ব্লাড রিকোয়েস্ট ফিল্টারের জন্য কিছু কম্পোজিট ইনডেক্স দরকার হতে পারে।

**সহজ উপায়:** অ্যাপ ব্যবহার করার সময় যদি Firestore কোনো ইনডেক্স মিসিং এরর দেয়
(ব্রাউজার Console-এ একটি লিংকসহ error আসবে), সেই লিংকে চাপলেই Firebase
স্বয়ংক্রিয়ভাবে সঠিক ইনডেক্স তৈরি করার পেজ খুলে দেবে — শুধু "Create index" চাপলেই হবে।

**বিকল্প (Firebase CLI থাকলে):** এই প্রজেক্টের `firestore.indexes.json` ফাইলটি
`firebase deploy --only firestore:indexes` দিয়ে ডিপ্লয় করা যায় (দেখুন
`docs/02_DEPLOY_BN.md`)।

---

## ১.৭ টেস্ট করুন

1. `.env` ফাইল বসানোর পর লোকালি রান করুন: `npm run dev` অথবা ডিপ্লয় করা ভার্সন খুলুন।
2. নতুন ইমেইল/পাসওয়ার্ড দিয়ে রেজিস্ট্রেশন করুন।
3. Firebase Console → Authentication → Users ট্যাবে নতুন ব্যবহারকারী দেখা যাচ্ছে কিনা
   যাচাই করুন।
4. Firestore Database → Data ট্যাবে `users_private` কালেকশনে নতুন ডকুমেন্ট তৈরি
   হয়েছে কিনা যাচাই করুন।
5. ইমেইল ভেরিফিকেশন লিংক আপনার ইনবক্সে (স্প্যাম ফোল্ডারও চেক করুন) এসেছে কিনা দেখুন।
