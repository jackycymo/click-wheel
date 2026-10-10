"use client";

import * as React from "react";
import { Tabs } from "@base-ui/react/tabs";
import { DuotoneDemo } from "@/themes/shadcn/demo";
import { Demo as ClassicPlayerDemo } from "@/themes/classic-player/demo";
import { Demo as RetroDemo } from "@/themes/retro/demo";
import { Demo as GalleyDemo } from "@/themes/galley/demo";
import type { Mode } from "./use-player";

export type ThemeId = "duotone" | "classic-player" | "retro" | "galley";

const THEMES: Array<{ id: ThemeId; name: string }> = [
  { id: "duotone", name: "Duotone" },
  { id: "classic-player", name: "Classic Player" },
  { id: "retro", name: "Retro" },
  { id: "galley", name: "Galley" },
];

const DEMOS: Record<ThemeId, React.ComponentType<{ mode: Mode }>> = {
  duotone: DuotoneDemo,
  "classic-player": ClassicPlayerDemo,
  retro: RetroDemo,
  galley: GalleyDemo,
};

/** Pick a skin on the left, read its source on the right. */
export function ThemeGallery({ sources, plainTabs = false }: { sources: Record<ThemeId, React.ReactNode>; plainTabs?: boolean }) {
  const [theme, setTheme] = React.useState<ThemeId>("duotone");
  const Demo = DEMOS[theme];

  return (
    <Tabs.Root
      value={theme}
      onValueChange={(value) => setTheme(value as ThemeId)}
      className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(300px,2fr)_minmax(0,3fr)]"
    >
      <div className="min-w-0 md:sticky md:top-20">
        <Tabs.List
          aria-label="Theme"
          className={`inline-flex max-w-full items-center overflow-x-auto overflow-y-hidden text-sm font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${plainTabs ? "h-11 gap-4" : "h-9 rounded-lg border bg-muted p-1"}`}
        >
          {THEMES.map((t) => (
            <Tabs.Tab
              key={t.id}
              value={t.id}
              className={`h-full shrink-0 text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[active]:text-foreground ${plainTabs ? "data-[active]:underline data-[active]:decoration-(--site-signal) data-[active]:decoration-1 data-[active]:underline-offset-[6px]" : "rounded-md px-2.5 data-[active]:bg-background data-[active]:shadow-xs sm:px-3"}`}
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
          <Tabs.Panel
            key={t.id}
            value={t.id}
            className="space-y-3 outline-none [&_pre]:max-h-80 [&_pre]:overflow-auto sm:[&_pre]:max-h-[440px]"
          >
            {sources[t.id]}
          </Tabs.Panel>
        ))}
      </div>
    </Tabs.Root>
  );
}
