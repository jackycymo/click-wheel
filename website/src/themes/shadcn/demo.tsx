"use client";

import * as React from "react";
import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";

const PAIRS = [
  { className: "theme-navy-orange", label: "Navy and orange", primary: "#12354e", secondary: "#f99d1b" },
  { className: "theme-indigo-coral", label: "Indigo and coral", primary: "#051230", secondary: "#f48067" },
  { className: "theme-russet-sea", label: "Russet and sea green", primary: "#793327", secondary: "#00b49b" },
  { className: "theme-plum-cinnamon", label: "Plum and cinnamon", primary: "#4e1d4c", secondary: "#c27544" },
];

/**
 * The stock skin under each pair. The primary is the body of the wheel; the
 * secondary is the arc, the ticks and the hub, with a white glyph on the hub.
 * Swatches switch the class only.
 */
export function DuotoneDemo({ mode }: { mode: Mode }) {
  const [pair, setPair] = React.useState(PAIRS[0]);
  return (
    <div className="flex flex-col items-center gap-5">
      <Demo mode={mode} className={pair.className} />
      <div className="flex items-center gap-2.5" role="group" aria-label="Color pair">
        {PAIRS.map((p) => (
          <button
            key={p.className}
            type="button"
            aria-label={p.label}
            aria-pressed={p === pair}
            onClick={() => setPair(p)}
            className="size-6 rounded-full outline-none ring-offset-2 ring-offset-background transition-transform focus-visible:ring-2 focus-visible:ring-ring aria-[pressed=true]:scale-110 aria-[pressed=true]:ring-2 aria-[pressed=true]:ring-foreground"
            style={{ background: `radial-gradient(circle, ${p.secondary} 36%, ${p.primary} 40%)` }}
          />
        ))}
      </div>
    </div>
  );
}

/** Site chrome around the stock skin. Add a `theme-*` class to swap the palette. */
export function Demo({ mode, className }: { mode: Mode; className?: string }) {
  const p = usePlayer({ mode });
  const seek = mode === "seek";
  const pct = seek ? (p.position / p.track.duration) * 100 : p.volume;

  return (
    <div className={`flex flex-col items-center gap-6 ${className ?? ""}`}>
      <Wheel
        {...p.wheel}
        className="w-[min(58vw,200px)]"
        label={seek ? "Playback position" : "Volume"}
        getAriaValueText={seek ? speakTime : undefined}
        icon={p.playing ? <IconPause /> : <IconPlay />}
        onCenterClick={p.togglePlay}
        centerLabel={p.playing ? "Pause" : "Play"}
      />
      <div className="w-full max-w-[260px]">
        <div className="flex items-baseline justify-between font-mono text-sm tabular-nums">
          <span>{seek ? fmt(p.position) : p.volume}</span>
          <span className="text-muted-foreground">{seek ? fmt(p.track.duration) : "100"}</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
