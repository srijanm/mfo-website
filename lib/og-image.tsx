import { ImageResponse } from "next/og";

import { site } from "@/lib/content/navigation";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/* The locked palette. Repeated here rather than read from CSS because the image
   is rendered outside the browser, where custom properties do not exist. */
const PAPER = "#F6F7F2";
const INK = "#11130F";
const INK_2 = "#343731";
const ACID = "#D7FF00";
const RULE = "rgba(17,19,15,0.16)";

/**
 * Geist, fetched as TTF.
 *
 * Requesting the CSS without a modern user-agent makes Google Fonts answer with
 * a TTF rather than WOFF2, which is what the image renderer can read. Cached
 * for the life of the process so a build fetches it once.
 */
let fontCache: Promise<ArrayBuffer> | undefined;

function geist(weight: number): Promise<ArrayBuffer> {
  if (fontCache === undefined) {
    fontCache = (async (): Promise<ArrayBuffer> => {
      const css = await fetch(
        `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}`,
      ).then((response) => response.text());

      const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
      if (!url) throw new Error("Could not resolve a Geist font file");

      return fetch(url).then((response) => response.arrayBuffer());
    })();
  }

  return fontCache;
}

/**
 * The share image, in the site's own language: paper, ink, 1px rules, and a
 * single acid node on a line meaning "something changes here". No imagery, no
 * gradient, no second typeface.
 */
export async function ogImage(headline: string) {
  const font = await geist(400);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          fontFamily: "Geist",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, letterSpacing: "-0.02em" }}>{site.name}</div>
          <div style={{ height: 1, background: RULE, marginTop: 28 }} />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 1.04,
            letterSpacing: "-0.04em",
            maxWidth: 900,
          }}
        >
          {headline}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* line + node: the site's graphic primitive, and the only acid here. */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
            <div style={{ width: 220, height: 1, background: RULE }} />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                background: ACID,
                border: `1px solid ${INK}`,
                marginLeft: -1,
              }}
            />
            <div style={{ width: 120, height: 1, background: RULE }} />
          </div>

          <div style={{ fontSize: 26, color: INK_2, letterSpacing: "-0.018em" }}>
            {site.descriptor}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Geist", data: font, style: "normal", weight: 400 }],
    },
  );
}
