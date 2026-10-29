import type { AreaId, BloodGroup } from "@/types";

export const AREA_LABELS: Record<AreaId, { bn: string; en: string }> = {
  anwara: { bn: "আনোয়ারা, চট্টগ্রাম", en: "Anwara, Chattogram" },
  halishahar: { bn: "হালিশহর, চট্টগ্রাম", en: "Halishahar, Chattogram" },
};

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  "A+": "A+",
  "A-": "A-",
  "B+": "B+",
  "B-": "B-",
  "O+": "O+",
  "O-": "O-",
  "AB+": "AB+",
  "AB-": "AB-",
};

export const PAGE_SIZE = 10;

export const APP_NAME_BN = "রক্তবন্ধু";
export const APP_NAME_EN = "RoktoBondhu";
export const CREATOR_CREDIT = "Made by Mohammad Rakib";
export const TELEGRAM_URL = "https://t.me/appdevbyrakib";
export const TELEGRAM_TEXT = `Join my telegram channel: ${TELEGRAM_URL}`;
