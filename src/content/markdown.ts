import { SITE_NAME, siteUrl, THEME_IDS } from "@/lib/site";
import type { SourceFile } from "@/lib/registry";
import { ANATOMY, PAGES, SUMMARY, type Block } from "./docs";

type ReadExample = (file: string) => Promise<string>;

const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

async function blockToMarkdown(block: Block, readExample: ReadExample): Promise<string> {
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
      return `\`\`\`bash\nnpx shadcn@latest add ${siteUrl()}/r/click-wheel.json\n\`\`\``;
    case "example":
      return `**examples/${block.file}**\n\n\`\`\`tsx\n${(await readExample(block.file)).trim()}\n\`\`\``;
    case "themes":
      return `> Four skins of the same parts: ${THEME_IDS.map((t) => `\`click-wheel-${t}\``).join(", ")} plus a blue token swap. Sources are in ${siteUrl()}/llms-full.txt and installable from ${siteUrl()}/r/registry.json.`;
    case "demo":
      return `> ${block.fallback}`;
  }
}

/** Every docs page as one Markdown document. Same source as the HTML pages. */
export async function docsToMarkdown(readExample: ReadExample): Promise<string> {
  const site = siteUrl();
  const out: string[] = [
    `# ${SITE_NAME} docs`,
    "",
    `> Markdown twin of ${site}/docs. Component source: ${site}/llms-full.txt`,
    "",
  ];
  for (const page of PAGES) {
    out.push(`## ${page.title}`, "");
    if (page.description) out.push(page.description, "");
    out.push(`Page: ${site}${page.href}`, "");
    for (const section of page.sections) {
      out.push(`### ${section.title}`, "");
      for (const block of section.blocks) out.push(await blockToMarkdown(block, readExample), "");
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

- \`npx shadcn@latest add ${site}/r/click-wheel.json\` — the component: nine files under components/click-wheel, React 19, no dependencies
${THEME_IDS.map((t) => `- \`npx shadcn@latest add ${site}/r/click-wheel-${t}.json\` — the ${t} skin (depends on click-wheel)`).join("\n")}
- Or copy the files from ${site}/llms-full.txt

## Docs

- [All docs as one Markdown file](${site}/docs.md)
${PAGES.map((p) => `- [${p.title}](${site}${p.href})${p.description ? `: ${p.description.split(". ")[0]}.` : ""}`).join("\n")}
- [Everything in one file](${site}/llms-full.txt): the docs plus the full component source
- [Registry index](${site}/r/registry.json)

## Quick reference

\`\`\`tsx
${ANATOMY}
\`\`\`

- Style with anything: parts have no classes. State: \`data-turning\`, \`data-disabled\`, \`--click-wheel-fraction\` (0–1), \`--click-wheel-rotation\` (deg). \`className\` and \`style\` may be functions of \`{ value, turning, disabled }\`. Every part takes a \`render\` prop.
- Gearing: \`unitsPerTurn\` sets how far one revolution moves the value. \`detent\` sets the units between haptic ticks.
- Callbacks: \`onValueChange\` on every change, \`onValueCommitted\` once per gesture, \`onTurningChange\` when a drag starts or ends, \`onTick\` per detent.
- Haptics: Vibration API on Android; the switch trick on iOS 17.4–26.4; on iOS 26.5+ only real taps vibrate, so put \`<HapticTap />\` inside the center button.
`;
}

/** llms-full.txt: llms.txt + docs + every source file. */
export async function llmsFullTxt(files: SourceFile[], readExample: ReadExample): Promise<string> {
  const sources = files
    .map((f) => {
      const lang = f.path.endsWith(".css") ? "css" : f.path.endsWith(".tsx") ? "tsx" : "ts";
      return `### ${f.path}\n\n\`\`\`${lang}\n${f.content.trimEnd()}\n\`\`\``;
    })
    .join("\n\n");
  return `${llmsTxt()}\n---\n\n${await docsToMarkdown(readExample)}\n## Source\n\n${sources}\n`;
}
