export const SITE_NAME = "Click Wheel";

/** Absolute site URL for links agents will follow (registry, llms.txt). */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return "https://click-wheel.jackymo.me";
}

export const THEME_IDS = ["shadcn", "ipod", "retro", "galley"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const REGISTRY_ITEMS = ["click-wheel", ...THEME_IDS.map((t) => `click-wheel-${t}`)];

export function installCommand(item?: string): string {
  return item
    ? `pnpm dlx shadcn@latest add ${siteUrl()}/r/${item}.json`
    : "pnpm add click-wheel";
}
