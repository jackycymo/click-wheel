"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Wheel } from "@/themes/shadcn/wheel";
import { IconChevron, IconNext, IconPause, IconPlay } from "./icons";
import { usePlayerContext } from "./player-provider";
import { fmt, speakTime, usePlayer } from "./use-player";

/*
  The floating player. It keeps the same track within reach on every page and
  shows that the wheel is a real seek control, not a toy. It appears only once
  the listener has pressed play in this tab. The home page has its own big
  wheel, so there the dock also waits until that wheel scrolls out of view.
  It folds to a pill and remembers that choice in localStorage.
*/

const DOCK_KEY = "click-wheel:dock";
type DockState = "open" | "closed";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readDock(): DockState {
  try {
    return localStorage.getItem(DOCK_KEY) === "closed" ? "closed" : "open";
  } catch {
    return "open";
  }
}

// Unknown on the server; the dock renders only after hydration, so the stored
// choice never flashes.
function serverDock(): DockState | null {
  return null;
}

function writeDock(state: DockState) {
  try {
    localStorage.setItem(DOCK_KEY, state);
  } catch {
    // Storage can be blocked; the dock still folds for this page view.
  }
  for (const listener of listeners) listener();
}

/**
 * Whether a `data-player-anchor` element (the hero player) is on screen. Only
 * watched on the home page; elsewhere there is none and the dock always shows.
 */
function useAnchorInView(watch: boolean) {
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    if (!watch) return;
    const anchors = document.querySelectorAll("[data-player-anchor]");
    if (anchors.length === 0) return;
    const seen = new Map<Element, boolean>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
      setInView(Array.from(seen.values()).some(Boolean));
    });
    anchors.forEach((anchor) => observer.observe(anchor));
    return () => observer.disconnect();
  }, [watch]);

  return watch && inView;
}

export function PlayerDock() {
  const pathname = usePathname();
  const dock = React.useSyncExternalStore(subscribe, readDock, serverDock);
  const anchorInView = useAnchorInView(pathname === "/");
  const { started } = usePlayerContext();
  if (!started || dock === null || anchorInView) return null;
  return dock === "open" ? <OpenDock /> : <ClosedDock />;
}

const ICON_BUTTON =
  "rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

function OpenDock() {
  const p = usePlayer({ mode: "seek" });
  const player = usePlayerContext();

  return (
    <aside
      aria-label="Now playing"
      className="fixed bottom-4 right-4 z-40 w-[min(20rem,calc(100vw-2rem))] animate-dock-in rounded-2xl border bg-background/90 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75 motion-reduce:animate-none"
    >
      <div className="flex items-center gap-3 p-3">
        <Wheel
          {...p.wheel}
          className="w-24 shrink-0"
          label="Playback position"
          getAriaValueText={speakTime}
          icon={p.playing ? <IconPause /> : <IconPlay />}
          onCenterClick={p.togglePlay}
          centerLabel={p.playing ? "Pause" : "Play"}
        />
        <div className="min-w-0 flex-1 self-start">
          <div className="flex items-start justify-between gap-2">
            <p className="pt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {p.playing ? "Now playing" : "Paused"}
            </p>
            <button
              type="button"
              aria-label="Hide the player"
              onClick={() => writeDock("closed")}
              className={`-mr-1 ${ICON_BUTTON}`}
            >
              <IconChevron width={14} height={14} className="rotate-90" />
            </button>
          </div>
          <p className="mt-1 truncate text-sm font-medium">{p.track.title}</p>
          <p className="truncate text-xs text-muted-foreground">{p.track.artist}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="font-mono text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground">{fmt(p.position)}</span> / {fmt(p.track.duration)}
            </p>
            <button type="button" aria-label="Next track" onClick={player.next} className={`-mr-1 ${ICON_BUTTON}`}>
              <IconNext width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {player.error ? (
        <p role="alert" className="border-t px-3 py-2 text-xs text-muted-foreground">
          {player.error}
        </p>
      ) : null}
    </aside>
  );
}

function ClosedDock() {
  const player = usePlayerContext();
  const fraction = player.duration > 0 ? Math.min(1, player.position / player.duration) : 0;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex h-11 animate-dock-in items-center gap-0.5 rounded-full border bg-background/90 p-1 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/75 motion-reduce:animate-none">
      <button
        type="button"
        aria-label={player.playing ? "Pause" : "Play"}
        onClick={player.toggle}
        className="relative grid size-9 shrink-0 place-items-center rounded-full outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full [background:conic-gradient(var(--primary)_calc(var(--fraction)*360deg),var(--border)_0)] [mask:radial-gradient(circle_closest-side,transparent_calc(100%_-_3px),black_calc(100%_-_2px))]"
          style={{ "--fraction": fraction } as React.CSSProperties}
        />
        {player.playing ? <IconPause width={12} height={12} /> : <IconPlay width={12} height={12} />}
      </button>
      <button
        type="button"
        aria-expanded={false}
        aria-label="Show the player"
        onClick={() => writeDock("open")}
        className="flex h-9 items-center gap-1.5 rounded-full pl-1.5 pr-2 text-xs font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="max-w-36 truncate">{player.track.title}</span>
        <IconChevron width={12} height={12} className="-rotate-90 text-muted-foreground" />
      </button>
    </div>
  );
}
