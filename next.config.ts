import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The old IA, mapped permanently onto the final one. Audience pages moved to
   * top-level URLs, independent professionals merged into /freelancers, /about
   * became /how-we-work, and the /how-it-works and /who-its-for pages were
   * retired.
   */
  async redirects() {
    return [
      { source: "/who-its-for/foreign-income", destination: "/paid-from-abroad", permanent: true },
      {
        source: "/who-its-for/freelancers-consultants",
        destination: "/freelancers",
        permanent: true,
      },
      {
        source: "/who-its-for/independent-professionals",
        destination: "/freelancers",
        permanent: true,
      },
      { source: "/who-its-for/creators", destination: "/creators", permanent: true },
      { source: "/who-its-for", destination: "/", permanent: true },
      { source: "/how-it-works", destination: "/how-we-work", permanent: true },
      { source: "/about", destination: "/how-we-work", permanent: true },
    ];
  },
};

export default nextConfig;
