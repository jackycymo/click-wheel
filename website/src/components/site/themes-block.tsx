import fs from "node:fs/promises";
import path from "node:path";
import { InstallCommand } from "./install-command";
import { CodeBlock } from "./code-block";
import { ThemeGallery } from "./theme-gallery";

// Statically scoped to src/themes so the build traces only that folder.
const read = async (file: string) =>
  fs.readFile(path.join(process.cwd(), "src", "themes", file), "utf8");

export const DUOTONE_CSS = `.theme-navy-orange {
  --duo-primary: #12354e;
  --duo-secondary: #f99d1b;
}

.theme-indigo-coral {
  --duo-primary: #051230;
  --duo-secondary: #f48067;
}

.theme-russet-sea {
  --duo-primary: #793327;
  --duo-secondary: #00b49b;
}

.theme-plum-cinnamon {
  --duo-primary: #4e1d4c;
  --duo-secondary: #c27544;
}

.theme-navy-orange,
.theme-indigo-coral,
.theme-russet-sea,
.theme-plum-cinnamon,
.dark .theme-navy-orange,
.dark .theme-indigo-coral,
.dark .theme-russet-sea,
.dark .theme-plum-cinnamon {
  --primary: var(--duo-secondary);
  --primary-foreground: #fff;
  --muted: var(--duo-primary);
  --border: color-mix(in oklab, var(--duo-primary) 62%, var(--duo-secondary));
  --ring: var(--duo-secondary);
  --hub: var(--duo-secondary);
  --hub-foreground: #fff;
  --ticks: var(--duo-secondary);
}

<div className="theme-navy-orange">
  <Wheel … />
</div>`;

/** The theme picker with live previews and the source of each skin. */
export async function ThemesBlock({ plainTabs = false }: { plainTabs?: boolean }) {
  const [shadcnSrc, ipodSrc, ipodCss, retroSrc, retroCss, galleySrc, galleyCss] = await Promise.all([
    read("shadcn/wheel.tsx"),
    read("ipod/wheel.tsx"),
    read("ipod/ipod.css"),
    read("retro/wheel.tsx"),
    read("retro/retro.css"),
    read("galley/wheel.tsx"),
    read("galley/galley.css"),
  ]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Add a theme with the shadcn CLI, or copy its source. Each theme uses the click-wheel package.</p>
      <ThemeGallery
        plainTabs={plainTabs}
        sources={{
          duotone: (
            <>
              <InstallCommand item="click-wheel-shadcn" label="Install with shadcn/ui" />
              <CodeBlock code={shadcnSrc} title="themes/shadcn/wheel.tsx" />
              <CodeBlock code={DUOTONE_CSS} lang="css" title="globals.css" />
            </>
          ),
          ipod: (
            <>
              <InstallCommand item="click-wheel-ipod" label="Install with shadcn/ui" />
              <CodeBlock code={ipodSrc} title="themes/ipod/wheel.tsx" />
              <CodeBlock code={ipodCss} lang="css" title="themes/ipod/ipod.css" />
            </>
          ),
          retro: (
            <>
              <InstallCommand item="click-wheel-retro" label="Install with shadcn/ui" />
              <CodeBlock code={retroSrc} title="themes/retro/wheel.tsx" />
              <CodeBlock code={retroCss} lang="css" title="themes/retro/retro.css" />
            </>
          ),
          galley: (
            <>
              <InstallCommand item="click-wheel-galley" label="Install with shadcn/ui" />
              <CodeBlock code={galleySrc} title="themes/galley/wheel.tsx" />
              <CodeBlock code={galleyCss} lang="css" title="themes/galley/galley.css" />
            </>
          ),
        }}
      />
    </div>
  );
}
