import { installCommand, SITE_NAME, siteUrl, THEME_IDS } from "@/lib/site";
import type { SourceFile } from "@/lib/registry";
import { ANATOMY, PAGES, SUMMARY, type Block } from "./docs";

export interface Readers {
  example: (file: string) => Promise<string>;
}

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

async function blockToMarkdown(block: Block, read: Readers): Promise<string> {
  switch (block.type) {
    case "p":
      return block.text;
    case "code":
      return `**${block.title}**\n\n\`\`\`${block.lang}\n${block.code.trim()}\n\`\`\``;
    case "table": {
      const head = `| ${block.columns.map(cell).join(" | ")} |`;
      const rule = `| ${block.columns.map(() => "---").join(" | ")} |`;
      const rows = block.rows.map((row) => `| ${row.map(cell).join(" | ")} |`);
      return [head, rule, ...rows].join("\n");
    }
    case "install":
      return `\`\`\`bash\n${installCommand(block.item)}\n\`\`\``;
    case "example":
      return `**examples/${block.file}**\n\n\`\`\`tsx\n${(await read.example(block.file)).trim()}\n\`\`\``;
    case "themes":
      return `Add a theme with the shadcn CLI, or copy its source. Each theme uses the click-wheel package. Duotone uses the shadcn theme with the color pairs shown on the site.\n\n${THEME_IDS.map((t) => `- \`${installCommand(`click-wheel-${t}`)}\``).join("\n")}`;
  }
}

/** Every docs page as one Markdown document. Same source as the HTML pages. */
export async function docsToMarkdown(read: Readers): Promise<string> {
  const site = siteUrl();
  const out: string[] = [
    `# ${SITE_NAME} docs`,
    "",
    `> Documentation for ${site}/docs. Component source: ${site}/llms-full.txt`,
    "",
  ];
  for (const page of PAGES) {
    out.push(`## ${page.title}`, "");
    if (page.description) out.push(page.description, "");
    out.push(`Page: ${site}${page.href}`, "");
    for (const section of page.sections) {
      out.push(`### ${section.title}`, "");
      for (const block of section.blocks) out.push(await blockToMarkdown(block, read), "");
    }
  }
  return out.join("\n");
}

/** llms.txt: the index an agent reads first. */
export function llmsTxt(): string {
  const site = siteUrl();
  return `# ${SITE_NAME}

> ${SUMMARY}

## Install

\`\`\`bash
${installCommand()}
\`\`\`

Requires React 19.2 or newer. Import \`{ ClickWheel }\` from \`"click-wheel"\`.

## Optional themes

Add a theme to a project configured for shadcn. Each theme depends on the npm package.

${THEME_IDS.map((t) => `- \`${installCommand(`click-wheel-${t}`)}\``).join("\n")}

## Docs

- [All docs as one Markdown file](${site}/docs.md)
${PAGES.map((p) => `- [${p.title}](${site}${p.href})${p.description ? `: ${p.description.split(". ")[0]}.` : ""}`).join("\n")}
- [Everything in one file](${site}/llms-full.txt): the docs plus the full component source
- [Registry index](${site}/r/registry.json)

## Quick reference

\`\`\`tsx
${ANATOMY}
\`\`\`

- Parts have no default visual styles. State: \`data-dragging\` (a pointer holds the ring), \`data-coasting\` (coasting after release), \`data-disabled\`, \`--click-wheel-fraction\` (0–1), \`--click-wheel-turns\` (laps from min), \`--click-wheel-rotation\` (deg). \`className\` and \`style\` may be functions of \`{ value, dragging, coasting, disabled }\`. Every part takes a \`render\` prop.
- Gearing: \`unitsPerTurn\` sets how far one revolution moves the value. \`detent\` sets the units between haptic ticks. \`inertia\` (off by default) keeps the wheel spinning after a flick; \`decelerationRate\` (0.998) is the velocity kept per millisecond.
- Callbacks: \`onValueChange\` on every change, \`onValueCommitted\` once per completed interaction, \`onInteractionChange\` across pointer, scroll, keyboard and coasting (including cancellation), \`onDraggingChange\` when a pointer starts or stops dragging, \`onTick\` per detent.
- Haptics: Vibration API on Android; the switch trick on iOS 17.4–26.4; on iOS 26.5+ only real taps vibrate, so put \`<HapticTap />\` inside the center button.
`;
}

/** llms-full.txt: llms.txt + docs + every source file. */
export async function llmsFullTxt(files: SourceFile[], read: Readers): Promise<string> {
  const sources = files
    .map((f) => {
      const lang = f.path.endsWith(".css") ? "css" : f.path.endsWith(".tsx") ? "tsx" : "ts";
      return `### ${f.path}\n\n\`\`\`${lang}\n${f.content.trimEnd()}\n\`\`\``;
    })
    .join("\n\n");
  return `${llmsTxt()}\n---\n\n${await docsToMarkdown(read)}\n## Source\n\n${sources}\n`;
}
