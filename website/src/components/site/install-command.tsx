import { installCommand } from "@/lib/site";
import { CopyButton } from "./copy-button";

/** The one-line install, for people and for agents. */
export function InstallCommand({ item, label, spacious = false }: { item?: string; label?: string; spacious?: boolean }) {
  const command = installCommand(item);
  return (
    <div className="min-w-0 space-y-2">
      {label ? <p className="text-sm font-medium text-muted-foreground">{label}</p> : null}
      <div className={`flex w-full min-w-0 items-center gap-2 border pl-3 pr-1 font-mono text-[13px] ${spacious ? "h-[52px] rounded-[4px] bg-transparent" : "h-10 rounded-md bg-card"}`}>
        <span className="shrink-0 text-muted-foreground" aria-hidden="true">
          $
        </span>
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{command}</code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
