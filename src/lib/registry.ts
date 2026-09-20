import fs from "node:fs/promises";
import path from "node:path";
import { SITE_NAME, siteUrl, THEME_IDS, type ThemeId } from "./site";

export interface SourceFile {
  /** Path relative to the consumer's project. */
  path: string;
  content: string;
}

const COMPONENT_FILES = [
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

const THEME_FILES: Record<ThemeId, string[]> = {
  shadcn: ["wheel.tsx"],
  ipod: ["wheel.tsx", "ipod.css"],
  te: ["wheel.tsx", "te.css"],
};

const THEME_META: Record<ThemeId, { title: string; description: string }> = {
  shadcn: { title: "Click Wheel — shadcn skin", description: "The stock skin: shadcn/ui tokens and Tailwind classes." },
  ipod: { title: "Click Wheel — iPod skin", description: "iPod classic: plain CSS, printed glyphs, a domed hub." },
  te: { title: "Click Wheel — TE skin", description: "Teenage engineering inspired: flat disc, one orange index, a scale that fills." },
};

// Paths are statically scoped so the build traces only these folders.
export async function readComponentFiles(): Promise<SourceFile[]> {
  return Promise.all(
    COMPONENT_FILES.map(async (file) => ({
      path: `components/click-wheel/${file}`,
      content: await fs.readFile(path.join(process.cwd(), "src", "components", "click-wheel", file), "utf8"),
    })),
  );
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

/** A shadcn registry item: `npx shadcn@latest add <site>/r/<name>.json`. */
export async function registryItem(name: string) {
  const site = siteUrl();
  if (name === "click-wheel") {
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: "registry:component",
      title: SITE_NAME,
      description:
        "Unstyled, iPod-style rotary input for React. Parts: Root, Ring, Rotor, Center. Zero dependencies.",
      dependencies: [],
      files: toRegistryFiles(await readComponentFiles()),
      docs: `Import { ClickWheel } from "@/components/click-wheel". Docs: ${site}/docs.md`,
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
    dependencies: [],
    registryDependencies: [`${site}/r/click-wheel.json`],
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
      { name: "click-wheel", type: "registry:component", title: SITE_NAME, description: "The component. Zero dependencies." },
      ...THEME_IDS.map((t) => ({
        name: `click-wheel-${t}`,
        type: "registry:component",
        title: THEME_META[t].title,
        description: THEME_META[t].description,
      })),
    ],
  };
}
