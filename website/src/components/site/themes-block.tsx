import fs from "node:fs/promises";
import path from "node:path";
import { forReaders } from "@/lib/examples";
import { CodeBlock } from "./code-block";
import { ThemeGallery } from "./theme-gallery";

// Statically scoped to src/themes so the build traces only that folder.
const read = async (file: string) =>
  forReaders(await fs.readFile(path.join(process.cwd(), "src", "themes", file), "utf8"));

export const DUOTONE_CSS = `/* Duotone: the same Tailwind skin under two colors with fixed roles. The primary
   is the body: the face of the ring and the track. The secondary is everything
   that moves or can be pressed: the arc, the ticks, the hub and the fill. */
.theme-navy-orange {
  --duo-primary: #12354e;
  --duo-secondary: #f99d1b;
}

.theme-indigo-coral {
  --duo-primary: #051230;
  --duo-secondary: #f48067;
}

.theme-forest-ivory {
  --duo-primary: #004f46;
  --duo-secondary: #ebd3a2;
}

.theme-plum-lime {
  --duo-primary: #501345;
  --duo-secondary: #c7d14f;
}

.theme-navy-orange,
.theme-indigo-coral,
.theme-forest-ivory,
.theme-plum-lime,
.dark .theme-navy-orange,
.dark .theme-indigo-coral,
.dark .theme-forest-ivory,
.dark .theme-plum-lime {
  --primary: var(--duo-secondary);
  --primary-foreground: var(--duo-primary);
  --muted: var(--duo-primary);
  --border: color-mix(in oklab, var(--duo-primary) 62%, var(--duo-secondary));
  --ring: var(--duo-secondary);
  --hub: var(--duo-secondary);
  --hub-foreground: var(--duo-primary);
  --ticks: var(--duo-secondary);
}

<div className="theme-navy-orange">
  <Wheel … />
</div>`;

/** The theme picker with live previews and the source of each skin. */
export async function ThemesBlock() {
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
    <ThemeGallery
      sources={{
        default: <CodeBlock code={shadcnSrc} title="themes/shadcn/wheel.tsx" />,
        duotone: <CodeBlock code={DUOTONE_CSS} lang="css" title="globals.css" />,
        ipod: (
          <>
            <CodeBlock code={ipodSrc} title="themes/ipod/wheel.tsx" />
            <CodeBlock code={ipodCss} lang="css" title="themes/ipod/ipod.css" />
          </>
        ),
        retro: (
          <>
            <CodeBlock code={retroSrc} title="themes/retro/wheel.tsx" />
            <CodeBlock code={retroCss} lang="css" title="themes/retro/retro.css" />
          </>
        ),
        galley: (
          <>
            <CodeBlock code={galleySrc} title="themes/galley/wheel.tsx" />
            <CodeBlock code={galleyCss} lang="css" title="themes/galley/galley.css" />
          </>
        ),
      }}
    />
  );
}
