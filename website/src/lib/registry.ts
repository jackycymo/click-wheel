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
const flatten = (source: string) => source.replace(/from "\.\.\/core"/g, 'from "./core"');

async function readCore(target: string): Promise<SourceFile> {
  return { path: target, content: await fs.readFile(path.join(PACKAGE_SRC, "core.ts"), "utf8") };
}

const NATIVE_FILES = [
  "index.ts",
  "parts.ts",
  "types.ts",
  "context.ts",
  "haptics.ts",
  "root.tsx",
  "ring.tsx",
  "rotor.tsx",
  "center.tsx",
];

const NATIVE_DEPENDENCIES = ["react-native-gesture-handler", "react-native-reanimated", "expo-haptics"];

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

/** The React Native parts plus the shared core, read from the workspace package. */
export async function readNativeFiles(): Promise<SourceFile[]> {
  const parts = await Promise.all(
    NATIVE_FILES.map(async (file) => ({
      path: `components/click-wheel-native/${file}`,
      content: flatten(await fs.readFile(path.join(PACKAGE_SRC, "native", file), "utf8")),
    })),
  );
  return [...parts, await readCore("components/click-wheel-native/core.ts")];
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
        "The web component: an unstyled, iPod-style rotary input for React. Parts: Root, Ring, Rotor, Center. Zero dependencies.",
      dependencies: [],
      files: toRegistryFiles(await readComponentFiles()),
      docs: `Import { ClickWheel } from "@/components/click-wheel". Docs: ${site}/docs.md`,
    };
  }
  if (name === "click-wheel-native") {
    return {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name,
      type: "registry:component",
      title: `${SITE_NAME} — React Native`,
      description:
        "The React Native version: same parts and math, gestures and the coast on the UI thread, haptics through expo-haptics.",
      dependencies: NATIVE_DEPENDENCIES,
      files: toRegistryFiles(await readNativeFiles()),
      docs: `Import { ClickWheel } from "@/components/click-wheel-native". Needs react-native-gesture-handler 3+, react-native-reanimated 3.16+ and expo-haptics. Docs: ${site}/docs/react-native`,
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
      { name: "click-wheel", type: "registry:component", title: SITE_NAME, description: "The web component. Zero dependencies." },
      ...THEME_IDS.map((t) => ({
        name: `click-wheel-${t}`,
        type: "registry:component",
        title: THEME_META[t].title,
        description: THEME_META[t].description,
      })),
      {
        name: "click-wheel-native",
        type: "registry:component",
        title: `${SITE_NAME} — React Native`,
        description: "Same parts and math for React Native. Gesture Handler 3, Reanimated, expo-haptics.",
      },
    ],
  };
}
