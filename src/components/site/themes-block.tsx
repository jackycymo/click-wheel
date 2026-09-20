import fs from "node:fs/promises";
import path from "node:path";
import { CodeBlock } from "./code-block";
import { ThemeGallery } from "./theme-gallery";

// Statically scoped to src/themes so the build traces only that folder.
const read = (file: string) => fs.readFile(path.join(process.cwd(), "src", "themes", file), "utf8");

export const BLUE_CSS = `/* Same Tailwind classes. Only the tokens change. */
.theme-blue {
  --primary: oklch(0.546 0.245 262.881);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0.014 254.604);
  --border: oklch(0.882 0.059 254.128);
  --ring: oklch(0.623 0.214 259.815);
}

.dark .theme-blue {
  --primary: oklch(0.623 0.214 259.815);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --muted: oklch(0.282 0.091 267.935);
  --border: oklch(0.379 0.146 265.522);
  --ring: oklch(0.546 0.245 262.881);
}

<div className="theme-blue">
  <Wheel … />
</div>`;

/** The theme picker with live previews and the source of each skin. */
export async function ThemesBlock() {
  const [shadcnSrc, ipodSrc, ipodCss, teSrc, teCss] = await Promise.all([
    read("shadcn/wheel.tsx"),
    read("ipod/wheel.tsx"),
    read("ipod/ipod.css"),
    read("te/wheel.tsx"),
    read("te/te.css"),
  ]);

  return (
    <ThemeGallery
      sources={{
        default: <CodeBlock code={shadcnSrc} title="themes/shadcn/wheel.tsx" />,
        blue: <CodeBlock code={BLUE_CSS} lang="css" title="globals.css" />,
        ipod: (
          <>
            <CodeBlock code={ipodSrc} title="themes/ipod/wheel.tsx" />
            <CodeBlock code={ipodCss} lang="css" title="themes/ipod/ipod.css" />
          </>
        ),
        te: (
          <>
            <CodeBlock code={teSrc} title="themes/te/wheel.tsx" />
            <CodeBlock code={teCss} lang="css" title="themes/te/te.css" />
          </>
        ),
      }}
    />
  );
}
