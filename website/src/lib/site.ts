export const SITE_NAME = "Click Wheel";

/** Absolute site URL for links agents will follow (registry, llms.txt). */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const THEME_IDS = ["shadcn", "ipod", "retro", "galley"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const REGISTRY_ITEMS = ["click-wheel", ...THEME_IDS.map((t) => `click-wheel-${t}`), "click-wheel-native"];
