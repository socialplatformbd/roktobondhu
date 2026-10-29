// Centralized translation dictionary. Keep `bn` and `en` keys perfectly in sync.
const translations = {
  bn: {
    appName: "রক্তবন্ধু",
    appNameEn: "RoktoBondhu",
    tagline: "আনোয়ারা ও হালিশহরের জন্য স্বেচ্ছাসেবী রক্তদাতা খুঁজুন",

    // Navigation
    "nav.home": "হোম",
    "nav.donors": "রক্তদাতা",
    "nav.requests": "রক্তের অনুরোধ",
    "nav.inbox": "ইনবক্স",
    "nav.myRequests": "আমার অনুরোধ",
    "nav.settings": "সেটিংস",
    "nav.login": "লগইন",
    "nav.register": "নিবন্ধন",
    "nav.admin": "অ্যাডমিন",
    "nav.profile": "প্রোফাইল",

    // Common
    "common.save": "সংরক্ষণ করুন",
    "common.cancel": "বাতিল",
    "common.edit": "সম্পাদনা",
    "common.delete": "মুছে ফেলুন",
    "common.back": "পেছনে",
    "common.next": "পরবর্তী",
    "common.loading": "লোড হচ্ছে...",
    "common.submit": "জমা দিন",
    "common.close": "বন্ধ করুন",
    "common.confirm": "নিশ্চিত করুন",
    "common.yes": "হ্যাঁ",
    "common.no": "না",
    "common.search": "খুঁজুন",
    "common.filter": "ফিল্টার",
    "common.all": "সব",
    "common.optional": "ঐচ্ছিক",
    "common.required": "আবশ্যক",
    "common.success": "সফল হয়েছে",
    "common.error": "একটি সমস্যা হয়েছে",
    "common.viewDetails": "বিস্তারিত দেখুন",
    "common.notAvailable": "প্রযোজ্য নয়",
    "common.comingSoon": "শীঘ্রই আসছে",
    "common.demoMode": "ডেমো মোড (লোকাল)",

    // Auth
    "auth.loginTitle": "লগইন করুন",
    "auth.registerTitle": "নতুন অ্যাকাউন্ট তৈরি করুন",
    "auth.email": "ইমেইল",
    "auth.password": "পাসওয়ার্ড",
    "auth.confirmPassword": "পাসওয়ার্ড নিশ্চিত করুন",
    "auth.displayName": "আপনার নাম",
    "auth.loginButton": "লগইন",
    "auth.registerButton": "নিবন্ধন করুন",
    "auth.googleButton": "Google দিয়ে চালিয়ে যান",
    "auth.noAccount": "অ্যাকাউন্ট নেই?",
    "auth.haveAccount": "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    "auth.forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
    "auth.resetPassword": "পাসওয়ার্ড রিসেট করুন",
    "auth.resetSent": "পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।",
    "auth.verifyEmailTitle": "ইমেইল ভেরিফাই করুন",
    "auth.verifyEmailMsg":
      "আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স/স্প্যাম চেক করুন এবং লিংকে ক্লিক করুন।",
    "auth.resendVerification": "আবার ভেরিফিকেশন ইমেইল পাঠান",
    "auth.signOut": "সাইন আউট",
    "auth.deleteAccount": "অ্যাকাউন্ট মুছে ফেলুন",
    "auth.deleteAccountWarning":
      "এই কাজটি স্থায়ী। আপনার প্রোফাইল, ডোনার তথ্য ও অনুরোধ মুছে যাবে। আপনি কি নিশ্চিত?",
    "auth.passwordMismatch": "পাসওয়ার্ড দুটি মিলছে না।",
    "auth.weakPassword": "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    "auth.invalidEmail": "সঠিক ইমেইল ঠিকানা দিন।",
    "auth.genericAuthError": "লগইন/নিবন্ধনে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    "auth.emailNotVerifiedWarning":
      "আপনার ইমেইল এখনো ভেরিফাই করা হয়নি। কিছু ফিচার সীমিত থাকতে পারে।",
    "auth.demoNotice":
      "Firebase কনফিগার করা হয়নি — এই মুহূর্তে শুধু আপনার ফোনে (লোকালি) ডেমো অ্যাকাউন্ট তৈরি হচ্ছে। প্রকৃত সার্ভারে কিছু সংরক্ষণ হচ্ছে না।",

    // Profile
    "profile.title": "প্রোফাইল সেটআপ",
    "profile.subtitle": "রক্তদাতা হিসেবে তালিকাভুক্ত হতে নিচের তথ্য দিন",
    "profile.bloodGroup": "রক্তের গ্রুপ",
    "profile.area": "এলাকা",
    "profile.phone": "যোগাযোগের নম্বর (ঐচ্ছিক)",
    "profile.phoneHelp":
      "শুধুমাত্র বাংলাদেশি মোবাইল নম্বর গ্রহণযোগ্য। এটি যাচাইকৃত নয়, শুধু আপনার দেওয়া তথ্য।",
    "profile.phoneInvalid": "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমনঃ 017XXXXXXXX)।",
    "profile.consentLabel":
      "আমি স্বেচ্ছায় সম্মত যে আমাকে রক্তদাতা হিসেবে তালিকাভুক্ত করা হোক এবং অন্যরা আমাকে যোগাযোগের অনুরোধ পাঠাতে পারবে।",
    "profile.consentRequired": "রক্তদাতা হতে হলে সম্মতি প্রয়োজন।",
    "profile.availability": "উপলব্ধতা",
    "profile.available": "উপলব্ধ আছি",
    "profile.paused": "সাময়িক বিরতিতে",
    "profile.saveSuccess": "প্রোফাইল সংরক্ষণ হয়েছে।",
    "profile.withdrawConsent": "সম্মতি প্রত্যাহার করুন",
    "profile.withdrawConsentConfirm":
      "আপনি সম্মতি প্রত্যাহার করলে আপনাকে আর ডোনার তালিকায় দেখানো হবে না। চালিয়ে যাবেন?",
    "profile.noSensitiveData":
      "আমরা শুধুমাত্র প্রয়োজনীয় তথ্য সংগ্রহ করি — সম্পূর্ণ ঠিকানা বা জাতীয় পরিচয়পত্র নম্বর নেওয়া হয় না।",

    // Donor directory
    "donors.title": "রক্তদাতা তালিকা",
    "donors.filterBloodGroup": "রক্তের গ্রুপ দিয়ে ফিল্টার করুন",
    "donors.filterArea": "এলাকা দিয়ে ফিল্টার করুন",
    "donors.empty": "আপনার নির্বাচিত শর্তে কোনো রক্তদাতা পাওয়া যায়নি।",
    "donors.disclaimer":
      "তালিকাভুক্ত হওয়া মানে উপলব্ধতা বা চিকিৎসাগত উপযুক্ততার নিশ্চয়তা নয়। রক্ত দেওয়ার আগে অবশ্যই যোগ্য চিকিৎসা প্রতিষ্ঠানে স্ক্রিনিং করাতে হবে।",
    "donors.loadMore": "আরও দেখুন",
    "donors.sendRequest": "যোগাযোগের অনুরোধ পাঠান",
    "donors.requestSent": "অনুরোধ পাঠানো হয়েছে।",
    "donors.messagePlaceholder": "সংক্ষিপ্ত বার্তা লিখুন (ঐচ্ছিক)",
    "donors.contactHidden":
      "ডোনার গ্রহণ করলে তবেই যোগাযোগের তথ্য দেখা যাবে।",
    "donors.loginToContact": "যোগাযোগ করতে লগইন করুন।",

    // Contact requests / inbox
    "inbox.title": "যোগাযোগের অনুরোধ",
    "inbox.received": "প্রাপ্ত অনুরোধ",
    "inbox.sent": "পাঠানো অনুরোধ",
    "inbox.empty": "কোনো অনুরোধ নেই।",
    "inbox.accept": "গ্রহণ করুন",
    "inbox.decline": "প্রত্যাখ্যান করুন",
    "inbox.cancel": "বাতিল করুন",
    "inbox.status.pending": "অপেক্ষমাণ",
    "inbox.status.accepted": "গৃহীত",
    "inbox.status.declined": "প্রত্যাখ্যাত",
    "inbox.status.cancelled": "বাতিল",
    "inbox.contactRevealed": "যোগাযোগের তথ্য",
    "inbox.from": "প্রেরক",
    "inbox.to": "প্রাপক",

    // Blood requests
    "requests.title": "রক্তের অনুরোধসমূহ",
    "requests.create": "নতুন অনুরোধ তৈরি করুন",
    "requests.hospital": "হাসপাতাল/চিকিৎসা প্রতিষ্ঠানের নাম",
    "requests.neededAt": "প্রয়োজনের তারিখ ও সময়",
    "requests.units": "প্রয়োজনীয় ব্যাগ/ইউনিট সংখ্যা",
    "requests.urgency": "জরুরি মাত্রা",
    "requests.urgency.normal": "স্বাভাবিক",
    "requests.urgency.urgent": "জরুরি",
    "requests.urgency.critical": "অতি জরুরি",
    "requests.notes": "অতিরিক্ত নোট (ঐচ্ছিক)",
    "requests.contactMethod": "নিরাপদ যোগাযোগ মাধ্যম",
    "requests.contactMethodHelp":
      "আপনি যেভাবে যোগাযোগ করতে চান তা লিখুন, যেমনঃ একটি নম্বর বা ইমেইল। এটি প্রকাশ করবেন কিনা তা আপনার সিদ্ধান্ত।",
    "requests.status.open": "খোলা",
    "requests.status.fulfilled": "পূরণ হয়েছে",
    "requests.status.cancelled": "বাতিল",
    "requests.status.expired": "মেয়াদোত্তীর্ণ",
    "requests.empty": "কোনো রক্তের অনুরোধ পাওয়া যায়নি।",
    "requests.disclaimer":
      "এই তালিকা রক্তের প্রাপ্যতা নিশ্চিত করে না। হাসপাতালের ঠিকানা ব্যবহারকারীর দেওয়া তথ্য, আমরা যাচাই করি না।",
    "requests.createSuccess": "আপনার অনুরোধ তৈরি হয়েছে।",
    "requests.markFulfilled": "পূরণ হয়েছে বলে চিহ্নিত করুন",
    "requests.cancelRequest": "অনুরোধ বাতিল করুন",
    "requests.report": "রিপোর্ট করুন",
    "requests.reportReason": "রিপোর্টের কারণ লিখুন",
    "requests.reportSuccess": "ধন্যবাদ, আপনার রিপোর্ট পাঠানো হয়েছে।",
    "requests.myTitle": "আমার তৈরি করা অনুরোধ",
    "requests.duplicateWarning":
      "আপনি সম্প্রতি একটি একই রকম অনুরোধ তৈরি করেছেন। দয়া করে কিছুক্ষণ অপেক্ষা করুন।",

    // Settings
    "settings.title": "সেটিংস",
    "settings.language": "ভাষা",
    "settings.editProfile": "প্রোফাইল সম্পাদনা",
    "settings.availability": "রক্তদাতা উপলব্ধতা",
    "settings.privacy": "গোপনীয়তা নীতি",
    "settings.terms": "ব্যবহারের শর্তাবলী",
    "settings.help": "সাহায্য",
    "settings.about": "অ্যাপ সম্পর্কে",
    "settings.admin": "অ্যাডমিন প্যানেল",
    "settings.aboutText":
      "রক্তবন্ধু একটি স্বেচ্ছাসেবী রক্তদাতা খুঁজে পাওয়ার অ্যাপ। এটি কোনো হাসপাতাল বা চিকিৎসা সেবা নয়।",

    // Privacy / Terms / Help
    "privacy.title": "গোপনীয়তা নীতি",
    "terms.title": "ব্যবহারের শর্তাবলী",
    "help.title": "সাহায্য ও জরুরি দাবিত্যাগ",
    "help.emergencyNotice":
      "এটি কোনো জরুরি চিকিৎসা সেবা নয়। জরুরি প্রয়োজনে নিকটস্থ হাসপাতাল বা জরুরি সেবায় যোগাযোগ করুন। রক্তের গ্রুপ মিল থাকলেই রক্ত সঞ্চালনের উপযুক্ততা নিশ্চিত হয় না — ক্রস-ম্যাচিং ও স্ক্রিনিং অবশ্যই একজন যোগ্য চিকিৎসা পেশাজীবীর মাধ্যমে করাতে হবে।",

    // Admin
    "admin.title": "অ্যাডমিন মডারেশন",
    "admin.reports": "রিপোর্টসমূহ",
    "admin.noAccess": "আপনার এই পাতায় প্রবেশের অনুমতি নেই।",
    "admin.notConfigured":
      "অ্যাডমিন অনুমোদন Firebase Custom Claims দ্বারা নিয়ন্ত্রিত। এখনো কনফিগার করা হয়নি।",

    // Offline / errors
    "offline.title": "ইন্টারনেট সংযোগ নেই",
    "offline.message":
      "আপনি অফলাইনে আছেন। নতুন তথ্য পাঠানো বা পরিবর্তন সংরক্ষণ করা যাবে না যতক্ষণ না সংযোগ ফিরে আসে।",
    "error.generic": "দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।",
    "error.notFoundTitle": "পাতা পাওয়া যায়নি",
    "error.notFoundMsg": "আপনি যে পাতাটি খুঁজছেন তা পাওয়া যায়নি।",

    "home.cta.findDonor": "রক্তদাতা খুঁজুন",
    "home.cta.requestBlood": "রক্তের জন্য অনুরোধ করুন",
    "home.cta.becomeDonor": "রক্তদাতা হোন",
    "home.scopeNotice":
      "বর্তমানে শুধুমাত্র আনোয়ারা ও হালিশহর এলাকায় সেবা প্রদান করা হচ্ছে।",
    "home.disclaimer":
      "রক্তবন্ধু কোনো হাসপাতাল বা চিকিৎসা প্রতিষ্ঠান নয়। এটি স্বেচ্ছাসেবী রক্তদাতা ও আবেদনকারীদের সংযুক্ত করার একটি প্ল্যাটফর্ম মাত্র।",
  },
  en: {
    appName: "RoktoBondhu",
    appNameEn: "RoktoBondhu",
    tagline: "Find voluntary blood donors in Anwara & Halishahar",

    "nav.home": "Home",
    "nav.donors": "Donors",
    "nav.requests": "Blood Requests",
    "nav.inbox": "Inbox",
    "nav.myRequests": "My Requests",
    "nav.settings": "Settings",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.admin": "Admin",
    "nav.profile": "Profile",

    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.back": "Back",
    "common.next": "Next",
    "common.loading": "Loading...",
    "common.submit": "Submit",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.yes": "Yes",
    "common.no": "No",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.optional": "Optional",
    "common.required": "Required",
    "common.success": "Success",
    "common.error": "Something went wrong",
    "common.viewDetails": "View details",
    "common.notAvailable": "Not available",
    "common.comingSoon": "Coming soon",
    "common.demoMode": "Demo mode (local)",

    "auth.loginTitle": "Login",
    "auth.registerTitle": "Create a new account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm password",
    "auth.displayName": "Your name",
    "auth.loginButton": "Login",
    "auth.registerButton": "Register",
    "auth.googleButton": "Continue with Google",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset password",
    "auth.resetSent": "A password reset link has been sent to your email.",
    "auth.verifyEmailTitle": "Verify your email",
    "auth.verifyEmailMsg":
      "A verification link was sent to your email. Please check your inbox/spam and click the link.",
    "auth.resendVerification": "Resend verification email",
    "auth.signOut": "Sign out",
    "auth.deleteAccount": "Delete account",
    "auth.deleteAccountWarning":
      "This is permanent. Your profile, donor info and requests will be removed. Are you sure?",
    "auth.passwordMismatch": "Passwords do not match.",
    "auth.weakPassword": "Password must be at least 6 characters.",
    "auth.invalidEmail": "Please enter a valid email address.",
    "auth.genericAuthError": "Login/registration failed. Please try again.",
    "auth.emailNotVerifiedWarning":
      "Your email is not verified yet. Some features may be limited.",
    "auth.demoNotice":
      "Firebase is not configured — a demo account is being created locally on your device only. Nothing is saved to a real server.",

    "profile.title": "Profile setup",
    "profile.subtitle": "Fill in the details below to be listed as a donor",
    "profile.bloodGroup": "Blood group",
    "profile.area": "Area",
    "profile.phone": "Contact number (optional)",
    "profile.phoneHelp":
      "Only Bangladeshi mobile numbers are accepted. This is unverified — just the info you provided.",
    "profile.phoneInvalid": "Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX).",
    "profile.consentLabel":
      "I voluntarily consent to be listed as a blood donor, and others may send me contact requests.",
    "profile.consentRequired": "Consent is required to become a donor.",
    "profile.availability": "Availability",
    "profile.available": "Available",
    "profile.paused": "Paused",
    "profile.saveSuccess": "Profile saved.",
    "profile.withdrawConsent": "Withdraw consent",
    "profile.withdrawConsentConfirm":
      "If you withdraw consent you will no longer be shown in the donor list. Continue?",
    "profile.noSensitiveData":
      "We only collect what's necessary — no full address or national ID numbers are collected.",

    "donors.title": "Donor directory",
    "donors.filterBloodGroup": "Filter by blood group",
    "donors.filterArea": "Filter by area",
    "donors.empty": "No donors matched your selected filters.",
    "donors.disclaimer":
      "Being listed does not guarantee availability or medical eligibility. Screening must always be done at a qualified medical facility before donation.",
    "donors.loadMore": "Load more",
    "donors.sendRequest": "Send contact request",
    "donors.requestSent": "Request sent.",
    "donors.messagePlaceholder": "Write a short message (optional)",
    "donors.contactHidden": "Contact info is revealed only after the donor accepts.",
    "donors.loginToContact": "Please log in to contact donors.",

    "inbox.title": "Contact requests",
    "inbox.received": "Received",
    "inbox.sent": "Sent",
    "inbox.empty": "No requests yet.",
    "inbox.accept": "Accept",
    "inbox.decline": "Decline",
    "inbox.cancel": "Cancel",
    "inbox.status.pending": "Pending",
    "inbox.status.accepted": "Accepted",
    "inbox.status.declined": "Declined",
    "inbox.status.cancelled": "Cancelled",
    "inbox.contactRevealed": "Contact info",
    "inbox.from": "From",
    "inbox.to": "To",

    "requests.title": "Blood requests",
    "requests.create": "Create new request",
    "requests.hospital": "Hospital / facility name",
    "requests.neededAt": "Needed date & time",
    "requests.units": "Units/bags required",
    "requests.urgency": "Urgency",
    "requests.urgency.normal": "Normal",
    "requests.urgency.urgent": "Urgent",
    "requests.urgency.critical": "Critical",
    "requests.notes": "Additional notes (optional)",
    "requests.contactMethod": "Safe contact method",
    "requests.contactMethodHelp":
      "Enter how people should reach you, e.g. a number or email. It's your choice to disclose it.",
    "requests.status.open": "Open",
    "requests.status.fulfilled": "Fulfilled",
    "requests.status.cancelled": "Cancelled",
    "requests.status.expired": "Expired",
    "requests.empty": "No blood requests found.",
    "requests.disclaimer":
      "This list does not guarantee blood availability. Hospital info is user-provided and unverified.",
    "requests.createSuccess": "Your request has been created.",
    "requests.markFulfilled": "Mark as fulfilled",
    "requests.cancelRequest": "Cancel request",
    "requests.report": "Report",
    "requests.reportReason": "Reason for report",
    "requests.reportSuccess": "Thanks, your report has been submitted.",
    "requests.myTitle": "My created requests",
    "requests.duplicateWarning":
      "You recently created a similar request. Please wait a while.",

    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.editProfile": "Edit profile",
    "settings.availability": "Donor availability",
    "settings.privacy": "Privacy policy",
    "settings.terms": "Terms of use",
    "settings.help": "Help",
    "settings.about": "About",
    "settings.admin": "Admin panel",
    "settings.aboutText":
      "RoktoBondhu is a voluntary blood donor finder app. It is not a hospital or medical service.",

    "privacy.title": "Privacy policy",
    "terms.title": "Terms of use",
    "help.title": "Help & emergency disclaimer",
    "help.emergencyNotice":
      "This is not an emergency medical service. For emergencies, contact your nearest hospital or emergency services. A matching blood group alone does not guarantee transfusion compatibility — cross-matching and screening must be done by a qualified healthcare professional.",

    "admin.title": "Admin moderation",
    "admin.reports": "Reports",
    "admin.noAccess": "You do not have permission to access this page.",
    "admin.notConfigured":
      "Admin authorization is controlled by Firebase Custom Claims. It has not been configured yet.",

    "offline.title": "No internet connection",
    "offline.message":
      "You are offline. New data or changes cannot be saved until your connection returns.",
    "error.generic": "Sorry, something went wrong. Please try again.",
    "error.notFoundTitle": "Page not found",
    "error.notFoundMsg": "The page you're looking for could not be found.",

    "home.cta.findDonor": "Find a donor",
    "home.cta.requestBlood": "Request blood",
    "home.cta.becomeDonor": "Become a donor",
    "home.scopeNotice": "Currently serving only Anwara and Halishahar areas.",
    "home.disclaimer":
      "RoktoBondhu is not a hospital or medical facility. It is only a platform connecting voluntary donors and requesters.",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["bn"];
export default translations;
