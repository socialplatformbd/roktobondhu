# রক্তবন্ধু: প্রকাশের আগে টেস্টিং চেকলিস্ট

## Authentication
- [ ] Email/password registration বাস্তব Firebase-এ কাজ করে
- [ ] Email verification ও password reset কাজ করে
- [ ] Google sign-in provider চালু ও অনুমোদিত domain configured
- [ ] Sign-out এবং account deletion flow পরীক্ষা করা হয়েছে

## Donor directory
- [ ] আটটি blood group filter সঠিক
- [ ] Anwara এবং Halishahar ছাড়া অন্য area নেই
- [ ] সম্মতি না দেওয়া donor তালিকায় নেই
- [ ] availability paused হলে donor listing থেকে বাদ পড়ে
- [ ] public donor document-এ phone/email নেই

## Blood requests and privacy
- [ ] Contact details public করার checkbox ডিফল্টে unchecked
- [ ] unchecked থাকলে public blood request document-এ `contactMethod` নেই
- [ ] checked হলে user স্পষ্ট সম্মতি দিয়েছেন এবং contact method প্রকাশিত হয়
- [ ] `blood_request_contacts` অন্য ব্যবহারকারী পড়তে পারে না
- [ ] Request owner কেবল নিজের request edit/close করতে পারে
- [ ] Expired/closed requests active list-এ দেখা যায় না

## Security Rules
- [ ] User A User B-এর private profile পড়তে পারে না
- [ ] User A User B-এর profile update/delete করতে পারে না
- [ ] User A admin claim নিজে সেট করতে পারে না
- [ ] Contact request-এর donor ছাড়া অন্য কেউ accept/decline করতে পারে না
- [ ] Donor contact তথ্য শুধুমাত্র accept করার পরই requester পড়তে পারে
- [ ] Unauthenticated user private collections পড়তে পারে না
- [ ] Firestore Emulator বা পৃথক test project-এ rules পরীক্ষা করা হয়েছে

## PWA
- [ ] Manifest-এর তিনটি icon file আছে এবং valid PNG
- [ ] HTTPS-এ install prompt বা browser install option দেখা যায়
- [ ] Service worker offline fallback কাজ করে
- [ ] Service worker private/API responses cache করে না
- [ ] Mobile, Bangla, English এবং small-screen layout পরীক্ষা হয়েছে

## Release note
এই চেকলিস্টে টিক না দেওয়া পর্যন্ত অ্যাপটিকে production-ready বলা যাবে না। এই repository-র code নিজে থেকেই কোনো Firebase project বা deployment তৈরি করে না।
