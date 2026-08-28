import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-image";
import { site } from "@/lib/content/navigation";

export const alt = `${site.name} — ${site.descriptor}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage("Half the work you do didn’t exist when your family’s CA started out.");
}
