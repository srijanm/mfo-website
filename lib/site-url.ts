/**
 * The canonical origin.
 *
 * Preference order: an explicit override, then the project's production domain
 * as Vercel reports it, then localhost. Deployment-specific URLs are
 * deliberately not used — a preview must canonicalise to production rather than
 * to its own throwaway hostname.
 */
const FALLBACK = "http://localhost:3000";

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return `https://${production}`;

  return FALLBACK;
}

/** True only on a production deployment; previews and local are not. */
export function isProductionDeployment(): boolean {
  return process.env.VERCEL_ENV === "production";
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteUrl()}/`).toString();
}
