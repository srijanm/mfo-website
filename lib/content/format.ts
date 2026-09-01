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
