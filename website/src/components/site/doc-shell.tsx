import Link from "next/link";
import { PAGES, type DocPageDef } from "@/content/docs";
import { CopyMarkdown } from "./copy-markdown";
import { IconChevron } from "./icons";
import { Inline } from "./prose";

/** Content column with the title, an "On this page" rail, and prev/next links. */
export function DocPage({ page, children }: { page: DocPageDef; children: React.ReactNode }) {
  const index = PAGES.indexOf(page);
  const prev = PAGES[index - 1];
  const next = PAGES[index + 1];

  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-[var(--site-content-width)] flex-1">
        <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
        {page.description ? (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            <Inline text={page.description} />
          </p>
        ) : null}
        <div className="mt-10 space-y-14">{children}</div>
        <nav aria-label="Pages" className="mt-16 flex justify-between gap-4 border-t pt-6 text-sm">
          {prev ? (
            <Link href={prev.href} className="group inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <IconChevron width={14} height={14} className="rotate-180" />
              <span>
                <span className="block text-xs">Previous</span>
                <span className="font-medium text-foreground">{prev.title}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={next.href} className="group inline-flex items-center gap-1 text-right text-muted-foreground hover:text-foreground">
              <span>
                <span className="block text-xs">Next</span>
                <span className="font-medium text-foreground">{next.title}</span>
              </span>
              <IconChevron width={14} height={14} />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>

      <aside className="hidden w-44 shrink-0 xl:block">
        <div className="sticky top-24 space-y-6 text-sm">
          <div>
            <p className="text-xs font-medium">On this page</p>
            <ul className="mt-2 space-y-1.5 border-l">
              {page.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l border-transparent pl-3 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-1.5 text-xs">
            <CopyMarkdown href="/docs.md" />
            <a href="/docs.md" className="block text-muted-foreground hover:text-foreground">
              View as Markdown
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
