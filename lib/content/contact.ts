/**
 * Public contact configuration.
 *
 * Everything here is owner-supplied and starts null. Nothing in this file may
 * be inferred from server configuration: `LEAD_TO_EMAIL` is where enquiries are
 * delivered and may well be a private internal inbox, so publishing it as a
 * public address would be a guess with consequences.
 *
 * The site reads `publicContact` through the helpers below and renders a real
 * independent contact route only when one genuinely exists. While these are
 * null the contact page says so plainly rather than sending the reader back to
 * the form it is supposed to be an alternative to.
 */

export type PublicContact = {
  /** A monitored public address. Not the delivery inbox. */
  email: string | null;
  /** Display form, e.g. "+91 ..." — rendered as a tel: link. */
  phone: string | null;
  /** Optional scheduling link, if the firm publishes one. */
  bookingUrl: string | null;
  /**
   * Approved response-time wording, e.g. "within two working days". Null means
   * the site promises no turnaround at all, which is the correct default: an
   * unconfirmed promise is worse than none.
   */
  responseTime: string | null;
};

export const publicContact: PublicContact = {
  email: null,
  phone: null,
  bookingUrl: null,
  responseTime: null,
};

/** True once at least one genuinely public contact route exists. */
export function hasPublicContact(): boolean {
  return Boolean(publicContact.email || publicContact.phone || publicContact.bookingUrl);
}

/** The contact methods that are actually populated, in display order. */
export function contactMethods(): readonly { id: string; label: string; value: string; href: string }[] {
  const methods: { id: string; label: string; value: string; href: string }[] = [];

  if (publicContact.email) {
    methods.push({
      id: "email",
      label: "Email",
      value: publicContact.email,
      href: `mailto:${publicContact.email}`,
    });
  }

  if (publicContact.phone) {
    methods.push({
      id: "phone",
      label: "Phone",
      value: publicContact.phone,
      /* Strip spacing and punctuation for the dial target only; the visible
         value stays exactly as the owner supplied it. */
      href: `tel:${publicContact.phone.replace(/[^\d+]/g, "")}`,
    });
  }

  if (publicContact.bookingUrl) {
    methods.push({
      id: "booking",
      label: "Book a call",
      value: publicContact.bookingUrl,
      href: publicContact.bookingUrl,
    });
  }

  return methods;
}
