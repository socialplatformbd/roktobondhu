// Normalizes Bangladeshi mobile numbers to a consistent +8801XXXXXXXXX form.
// Returns null if the number does not look like a valid BD mobile number.
export function normalizeBdPhone(raw: string): string | null {
  if (!raw) return null;
  let digits = raw.trim().replace(/[\s-]/g, "");

  // Convert leading 0088 or 088 forms
  if (digits.startsWith("+88")) digits = digits.slice(3);
  else if (digits.startsWith("0088")) digits = digits.slice(4);
  else if (digits.startsWith("88") && digits.length > 11) digits = digits.slice(2);

  if (digits.startsWith("+")) digits = digits.slice(1);

  // Now digits should ideally start with 0 and be 11 digits: 01XXXXXXXXX
  if (!/^0\d{10}$/.test(digits)) {
    return null;
  }

  // Bangladeshi mobile operator prefixes start with 013,014,015,016,017,018,019
  if (!/^01[3-9]\d{8}$/.test(digits)) {
    return null;
  }

  return "+88" + digits;
}

export function isValidBdPhone(raw: string): boolean {
  return normalizeBdPhone(raw) !== null;
}
