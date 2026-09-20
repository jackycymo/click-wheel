import { siteUrl } from "@/lib/site";
import { CopyButton } from "./copy-button";

/** The one-line install, for people and for agents. */
export function InstallCommand({ item = "click-wheel", label }: { item?: string; label?: string }) {
  const command = `npx shadcn@latest add ${siteUrl()}/r/${item}.json`;
  return (
    <div className="flex h-10 max-w-2xl items-center gap-2 rounded-md border bg-card pl-3 pr-1 font-mono text-[13px]">
      {label ? (
        <span className="rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      ) : null}
      <span className="text-muted-foreground" aria-hidden="true">
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">{command}</code>
      <CopyButton text={command} />
    </div>
  );
}
