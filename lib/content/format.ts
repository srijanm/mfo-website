/**
 * The one place a price is turned into text.
 *
 * Every amount on the site is in Indian rupees and renders through this
 * formatter, so grouping and the symbol are decided once. The only currency
 * that is ever not INR is the illustrative figure inside the incoming payment
 * object, which is a foreign amount by definition — it is a literal in
 * lib/content/ rather than a formatted number, because it is an example of what
 * lands in someone's account, not a price the business charges.
 */
const annualPriceFormat = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** An annual price point, e.g. 19999 -> "₹19,999". */
export function formatAnnualPrice(amount: number): string {
  return annualPriceFormat.format(amount);
}

/**
 * The incoming payment object's own figure. It is foreign currency by
 * definition — money arriving from abroad — and is the one amount on the site
 * that is not INR. Used only to format the intermediate frames while the figure
 * counts up; the resting value is the string in lib/content/.
 */
const incomingPaymentFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatIncomingPayment(value: number): string {
  return incomingPaymentFormat.format(value);
}

/**
 * Formatters addressable by name.
 *
 * A function cannot cross the server/client boundary, and the records that use
 * a counting figure are rendered on the server, so callers name the formatter
 * rather than passing it. The definition still lives here and nowhere else.
 */
export const amountFormatters = {
  incomingPayment: formatIncomingPayment,
} as const;

export type AmountFormatterName = keyof typeof amountFormatters;

/**
 * The date the hero's example payment landed on, which is today.
 *
 * The object is an illustration of a payment arriving now, so a fixed string
 * ages into a date in the past — and eventually into one that predates the
 * reader. It is formatted in Asia/Kolkata because that is the timezone every
 * India-side obligation is reckoned in, and it is computed per render rather
 * than at module load so a long-lived server process does not freeze it.
 *
 * This is not a tax date and nothing on the site is calculated from it — it is
 * the "Received" line on an example record.
 */
const recordDateFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatRecordDate(date: Date = new Date()): string {
  return recordDateFormat.format(date);
}
