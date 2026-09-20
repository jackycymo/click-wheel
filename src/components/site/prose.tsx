import * as React from "react";

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{children}</p>;
}

/** Renders `backtick` spans as inline code; everything else is text. */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") ? <Code key={i}>{part.slice(1, -1)}</Code> : part,
      )}
    </>
  );
}
