import * as React from "react";
import type { Block, DocPageDef } from "@/content/docs";
import { readExample } from "@/lib/examples";
import { CodeBlock } from "./code-block";
import { DocPage } from "./doc-shell";
import { EXAMPLES, type ExampleId } from "./examples-registry";
import { InstallCommand } from "./install-command";
import { Inline, P } from "./prose";
import { ThemesBlock } from "./themes-block";

function DataTable({ block }: { block: Extract<Block, { type: "table" }> }) {
  const mono = new Set(block.mono ?? []);
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">{block.caption}</caption>
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            {block.columns.map((column) => (
              <th key={column} className="px-4 py-2.5 font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.rows.map((row) => (
            <tr key={row[0]} className="border-t align-top">
              {row.map((value, i) => (
                <td
                  key={i}
                  className={
                    mono.has(i)
                      ? `px-4 py-3 font-mono text-[12.5px] ${i === 0 ? "whitespace-nowrap text-foreground" : "text-muted-foreground"}`
                      : "px-4 py-3 leading-relaxed text-muted-foreground"
                  }
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A live preview beside its source, read from src/examples so the two never drift. */
async function Example({ id, file }: { id: ExampleId; file: string }) {
  const Preview = EXAMPLES[id];
  const source = await readExample(file);
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(300px,2fr)_minmax(0,3fr)]">
      <div className="flex min-h-[320px] min-w-0 items-center justify-center rounded-xl border bg-card bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] px-4 py-8">
        <Preview />
      </div>
      <CodeBlock code={source} title={`examples/${file}`} className="min-w-0 [&_pre]:max-h-[440px]" />
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return (
        <P>
          <Inline text={block.text} />
        </P>
      );
    case "code":
      return <CodeBlock code={block.code} lang={block.lang} title={block.title} />;
    case "table":
      return <DataTable block={block} />;
    case "install":
      return <InstallCommand item={block.item} />;
    case "example":
      return <Example id={block.id} file={block.file} />;
    case "themes":
      return <ThemesBlock />;
  }
}

/** A whole docs page from its definition: title, sections, rail, prev/next. */
export function DocPageView({ page }: { page: DocPageDef }) {
  return (
    <DocPage page={page}>
      {page.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
          <div className="mt-4 space-y-4">
            {section.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </DocPage>
  );
}
