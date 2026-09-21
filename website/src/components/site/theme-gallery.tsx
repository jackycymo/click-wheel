"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { Demo as ShadcnDemo, DuotoneDemo } from "@/themes/shadcn/demo";
import { Demo as IpodDemo } from "@/themes/ipod/demo";
import { Demo as RetroDemo } from "@/themes/retro/demo";
import { Demo as GalleyDemo } from "@/themes/galley/demo";
import type { Mode } from "./use-player";

export type ThemeId = "default" | "duotone" | "ipod" | "retro" | "galley";

const THEMES: Array<{ id: ThemeId; name: string }> = [
  { id: "default", name: "Default" },
  { id: "duotone", name: "Duotone" },
  { id: "ipod", name: "iPod" },
  { id: "retro", name: "Retro" },
  { id: "galley", name: "Galley" },
];

const DEMOS: Record<ThemeId, React.ComponentType<{ mode: Mode }>> = {
  default: ShadcnDemo,
  duotone: DuotoneDemo,
  ipod: IpodDemo,
  retro: RetroDemo,
  galley: GalleyDemo,
};

/** Pick a skin on the left, read its source on the right. */
export function ThemeGallery({ sources }: { sources: Record<ThemeId, React.ReactNode> }) {
  const [theme, setTheme] = React.useState<ThemeId>("default");
  const Demo = DEMOS[theme];

  return (
    <Tabs.Root
      value={theme}
      onValueChange={(value) => setTheme(value as ThemeId)}
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      <div className="min-w-0 lg:sticky lg:top-20">
        <Tabs.List
          aria-label="Theme"
          className="inline-flex h-9 max-w-full items-center overflow-x-auto rounded-lg border bg-muted p-1 text-sm font-medium"
        >
          {THEMES.map((t) => (
            <Tabs.Tab
              key={t.id}
              value={t.id}
              className="h-full shrink-0 rounded-md px-3 text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-xs"
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
