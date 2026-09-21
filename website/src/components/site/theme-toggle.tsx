"use client";

import * as React from "react";
import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { IconMonitor, IconMoon, IconSun } from "./icons";

/*
  Three settings. "system" is the default: it follows the browser's
  prefers-color-scheme and keeps following it while the page is open. Light
  and dark are stored; choosing system again clears the stored choice. The
  inline script in the root layout applies the same rule before first paint.
*/

type Mode = "light" | "dark" | "system";

const KEY = "theme";
const QUERY = "(prefers-color-scheme: dark)";

const OPTIONS: Array<{ value: Mode; label: string; icon: React.ReactNode }> = [
  { value: "light", label: "Light", icon: <IconSun width={14} height={14} /> },
  { value: "dark", label: "Dark", icon: <IconMoon width={14} height={14} /> },
  { value: "system", label: "System", icon: <IconMonitor width={14} height={14} /> },
];

const listeners = new Set<() => void>();

function readMode(): Mode {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function apply(mode: Mode) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia(QUERY).matches);
  document.documentElement.classList.toggle("dark", dark);
}

function writeMode(mode: Mode) {
  try {
    if (mode === "system") localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, mode);
  } catch {
    // Storage can be blocked; the page still switches for this visit.
  }
  apply(mode);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab of the site changed the setting.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== KEY) return;
    apply(readMode());
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeToggle() {
  const mode = React.useSyncExternalStore(subscribe, readMode, () => "system" as Mode);

  // While on system, follow the browser when it changes.
  React.useEffect(() => {
    if (mode !== "system") return;
    const query = window.matchMedia(QUERY);
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [mode]);

  return (
    <ToggleGroup
      value={[mode]}
      onValueChange={(next: string[]) => {
        if (next[0]) writeMode(next[0] as Mode);
      }}
      aria-label="Theme"
      className="inline-flex h-8 items-center rounded-md border bg-muted p-0.5"
    >
      {OPTIONS.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          aria-label={option.label}
          title={option.label}
          className="inline-flex h-full w-7 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-xs"
        >
          {option.icon}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
