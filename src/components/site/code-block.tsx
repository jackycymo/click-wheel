import { codeToHtml, type BundledLanguage, type SpecialLanguage } from "shiki";
import { CopyButton } from "./copy-button";

export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  className,
}: {
  code: string;
  lang?: BundledLanguage | SpecialLanguage;
  title?: string;
  className?: string;
}) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <figure className={`overflow-hidden rounded-lg border bg-card ${className ?? ""}`}>
      <figcaption className="flex h-10 items-center justify-between border-b pl-4 pr-2 font-mono text-xs text-muted-foreground">
        <span>{title ?? lang}</span>
        <CopyButton text={code.trim()} />
      </figcaption>
      <div className="text-[13px]" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
