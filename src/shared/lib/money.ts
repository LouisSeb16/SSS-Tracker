// Money is always an integer in minor units (kobo, cents). Never a float.
// Assumes 2 minor digits, which fits NGN, USD and EUR.

const MINOR_DIGITS = 2;
const FACTOR = 10 ** MINOR_DIGITS;

/** Format minor units for display only, e.g. 125050 with NGN -> "₦1,250.50". */
export function formatMoney(minor: number, currency = 'NGN'): string {
  if (!Number.isSafeInteger(minor)) {
    throw new RangeError(`Money must be an integer in minor units, got ${minor}`);
  }
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(minor / FACTOR);
}

/**
 * Parse what a user typed ("12", "12.5", "1,250.50") into minor units.
 * Works on the string, not on parseFloat, because 19.99 * 100 is 1998.9999999999998.
 * Returns null for anything that is not a non-negative amount with up to 2 decimals.
 */
export function parseMoneyInput(input: string): number | null {
  const cleaned = input.trim().replace(/,/g, '');
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(cleaned);
  if (!match) return null;

  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? '').padEnd(MINOR_DIGITS, '0'));
  const minor = whole * FACTOR + fraction;
  return Number.isSafeInteger(minor) ? minor : null;
}
