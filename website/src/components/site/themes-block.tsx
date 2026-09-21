import fs from "node:fs/promises";
import path from "node:path";
import { forReaders } from "@/lib/examples";
import { CodeBlock } from "./code-block";
import { ThemeGallery } from "./theme-gallery";

// Statically scoped to src/themes so the build traces only that folder.
const read = async (file: string) =>
  forReaders(await fs.readFile(path.join(process.cwd(), "src", "themes", file), "utf8"));

export const TINT_CSS = `/* Tints for the same Tailwind skin: a pair of colors. The strong one drives the
   arc, the hub and the ticks; the soft one is the face of the ring. */
.theme-blue-seashell {
  --tint: #006eb8;
  --tint-2: #fdd4bd;
}

.theme-benzol-coral {
  --tint: #00978d;
  --tint-2: #f58e84;
}

.theme-pompeian-cameo {
  --tint: #ab2439;
  --tint-2: #e0b3b6;
}

.theme-blue-seashell,
.theme-benzol-coral,
.theme-pompeian-cameo,
.dark .theme-blue-seashell,
.dark .theme-benzol-coral,
.dark .theme-pompeian-cameo {
  --primary: var(--tint);
  --primary-foreground: #fafafa;
  --muted: var(--tint-2);
  --border: color-mix(in oklab, var(--tint) 30%, var(--tint-2));
  --ring: var(--tint);
  --hub: var(--tint);
  --hub-foreground: #fafafa;
  --ticks: var(--tint);
}

<div className="theme-benzol-coral">
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
        tinted: <CodeBlock code={TINT_CSS} lang="css" title="globals.css" />,
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
