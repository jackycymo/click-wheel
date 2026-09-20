"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { Demo as ShadcnDemo } from "@/themes/shadcn/demo";
import { Demo as IpodDemo } from "@/themes/ipod/demo";
import { Demo as TeDemo } from "@/themes/te/demo";
import type { Mode } from "./use-player";

export type ThemeId = "default" | "blue" | "ipod" | "te";

const THEMES: Array<{ id: ThemeId; name: string }> = [
  { id: "default", name: "Default" },
  { id: "blue", name: "Blue" },
  { id: "ipod", name: "iPod" },
  { id: "te", name: "TE" },
];

function BlueDemo({ mode }: { mode: Mode }) {
  return <ShadcnDemo mode={mode} className="theme-blue" />;
}

const DEMOS: Record<ThemeId, React.ComponentType<{ mode: Mode }>> = {
  default: ShadcnDemo,
  blue: BlueDemo,
  ipod: IpodDemo,
  te: TeDemo,
};

/** Pick a skin on the left, read its source on the right. */
export function ThemeGallery({ sources }: { sources: Record<ThemeId, React.ReactNode> }) {
  const [theme, setTheme] = React.useState<ThemeId>("default");
  const Demo = DEMOS[theme];

  return (
    <Tabs.Root
      value={theme}
      onValueChange={(value) => setTheme(value as ThemeId)}
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div className="lg:sticky lg:top-20">
        <Tabs.List
          aria-label="Theme"
          className="inline-flex h-9 items-center rounded-lg border bg-muted p-1 text-sm font-medium"
        >
          {THEMES.map((t) => (
            <Tabs.Tab
              key={t.id}
              value={t.id}
              className="h-full rounded-md px-3 text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-xs"
            >
              {t.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <div className="mt-4 flex min-h-[440px] items-center justify-center rounded-xl border bg-card px-6 py-10">
          <div className="w-full">
            <Demo mode="seek" />
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {THEMES.map((t) => (
          <Tabs.Panel key={t.id} value={t.id} className="space-y-3 outline-none">
            {sources[t.id]}
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  );
}
