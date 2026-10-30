// Turns a Firebase/JS error into a short, visible message so a failing page
// shows WHY it failed instead of an endless spinner.
export function describeError(err: unknown, lang: "bn" | "en"): string {
  const bn = lang === "bn";
  const code = (err as { code?: string })?.code ?? "";
  const msg = err instanceof Error ? err.message : String(err ?? "");
  let hint: string;
  if (code.includes("permission-denied")) {
    hint = bn
      ? "অনুমতি নেই: Firestore নিয়ম (rules) ডিপ্লয় হয়নি, অথবা এই অ্যাকাউন্টের অধিকার নেই।"
      : "Permission denied: Firestore rules are not deployed, or this account lacks access.";
  } else if (code.includes("failed-precondition")) {
    hint = bn
      ? "Firestore index তৈরি হয়নি। \"Deploy Firestore rules and indexes\" চালান।"
      : "A Firestore index is missing. Run \"Deploy Firestore rules and indexes\".";
  } else if (code.includes("unavailable") || /offline/i.test(msg)) {
    hint = bn ? "Firestore-এর সাথে সংযোগ হচ্ছে না। ইন্টারনেট দেখুন।" : "Cannot reach Firestore. Check your connection.";
  } else {
    hint = bn ? "ডেটা লোড করা যায়নি।" : "Could not load data.";
  }
  return `${hint} [${code || msg}]`;
}
