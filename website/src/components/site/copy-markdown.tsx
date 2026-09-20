"use client";

import * as React from "react";
import { IconCheck, IconCopy } from "./icons";

/** Copies the Markdown twin of the current page, for pasting into an agent. */
export function CopyMarkdown({ href }: { href: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    try {
      const text = await fetch(href).then((r) => r.text());
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1500);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground"
    >
      {state === "copied" ? <IconCheck width={13} height={13} /> : <IconCopy width={13} height={13} />}
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy as Markdown"}
    </button>
  );
}
