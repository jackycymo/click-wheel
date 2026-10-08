import fs from "node:fs/promises";
import path from "node:path";
import { PACKAGE_DIR } from "./examples";
import { SITE_NAME, siteUrl, THEME_IDS, type ThemeId } from "./site";

export interface SourceFile {
  /** Path relative to the consumer's project. */
  path: string;
  content: string;
}

const WEB_FILES = [
  "index.ts",
  "parts.ts",
  "context.ts",
  "render.tsx",
  "haptics.tsx",
  "root.tsx",
  "ring.tsx",
  "rotor.tsx",
  "center.tsx",
];

const PACKAGE_SRC = path.join(PACKAGE_DIR, "src");

/** In the package the core sits one level up; in a registry copy it sits beside the parts. */
const flatten = (source: string) => source
  .replace(/from "(\.{1,2}\/[^\"]+)\.js"/g, 'from "$1"')
  .replace(/from "\.\.\/core"/g, 'from "./core"');

async function readCore(target: string): Promise<SourceFile> {
  return { path: target, content: await fs.readFile(path.join(PACKAGE_SRC, "core.ts"), "utf8") };
}

const THEME_FILES: Record<ThemeId, string[]> = {
  shadcn: ["wheel.tsx"],
  ipod: ["wheel.tsx", "ipod.css"],
  retro: ["wheel.tsx", "retro.css"],
  galley: ["wheel.tsx", "galley.css"],
};

const THEME_META: Record<ThemeId, { title: string; description: string }> = {
  shadcn: { title: "Click Wheel — shadcn skin", description: "The stock skin: shadcn/ui tokens and Tailwind classes." },
  ipod: { title: "Click Wheel — iPod skin", description: "iPod classic: plain CSS, printed glyphs, a domed hub." },
  retro: { title: "Click Wheel — Retro skin", description: "Retro hardware, soft: a knob raised from a pressed-in well, one accent index, a scale that fills. Four accents." },
  galley: { title: "Click Wheel — Galley skin", description: "The knob on an aircraft coffee maker: soft metal, a knurled rim, a pressed-in hub, indicator segments." },
};

/** The web parts plus the shared core, read from the workspace package. */
export async function readComponentFiles(): Promise<SourceFile[]> {
  const parts = await Promise.all(
    WEB_FILES.map(async (file) => ({
      path: `components/click-wheel/${file}`,
      content: flatten(await fs.readFile(path.join(PACKAGE_SRC, "web", file), "utf8")),
    })),
  );
  return [...parts, await readCore("components/click-wheel/core.ts")];
}

export async function readThemeFiles(theme: ThemeId): Promise<SourceFile[]> {
  return Promise.all(
    THEME_FILES[theme].map(async (file) => ({
      path: `components/click-wheel-${theme}/${file}`,
      content: await fs.readFile(path.join(process.cwd(), "src", "themes", theme, file), "utf8"),
    })),
  );
}

function toRegistryFiles(files: SourceFile[]) {
  return files.map((f) => ({ path: f.path, target: f.path, type: "registry:component", content: f.content }));
}

/** A shadcn registry item: `pnpm dlx shadcn@latest add <site>/r/<name>.json`. */
export async function registryItem(name: string) {
  const site = siteUrl();
  if (name === "click-wheel") {
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: "registry:component",
      title: SITE_NAME,
      description:
        "The web component: an unstyled, iPod-style rotary input for React. Parts: Root, Ring, Rotor, Center. Zero dependencies.",
      dependencies: [],
      files: toRegistryFiles(await readComponentFiles()),
      docs: `Requires React 19.2 or newer. Import { ClickWheel } from "@/components/click-wheel". Docs: ${site}/docs.md`,
    };
  }
  const theme = THEME_IDS.find((t) => `click-wheel-${t}` === name);
  if (!theme) return null;
  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:component",
    title: THEME_META[theme].title,
    description: THEME_META[theme].description,
    dependencies: ["click-wheel"],
    files: toRegistryFiles(await readThemeFiles(theme)),
    docs: `Import { Wheel } from "@/components/click-wheel-${theme}/wheel". Docs: ${site}/docs.md`,
  };
}

/** The registry index: `registry.json`. */
export function registryIndex() {
  const site = siteUrl();
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "click-wheel",
    homepage: site,
    items: [
      { name: "click-wheel", type: "registry:component", title: SITE_NAME, description: "The web component. Zero dependencies." },
      ...THEME_IDS.map((t) => ({
        name: `click-wheel-${t}`,
        type: "registry:component",
        title: THEME_META[t].title,
        description: THEME_META[t].description,
      })),
    ],
  };
}
