"use client";

import * as React from "react";
import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";

const TINTS = [
  { className: "theme-blue-seashell", label: "Blue and Seashell Pink", colors: ["#006eb8", "#fdd4bd"] },
  { className: "theme-benzol-coral", label: "Benzol Green and Coral Red", colors: ["#00978d", "#f58e84"] },
  { className: "theme-pompeian-cameo", label: "Pompeian Red and Cameo Pink", colors: ["#ab2439", "#e0b3b6"] },
];

/** The stock skin under each pair. Swatches switch the class; nothing else changes. */
export function TintedDemo({ mode }: { mode: Mode }) {
  const [tint, setTint] = React.useState(TINTS[0]);
  return (
    <div className="flex flex-col items-center gap-5">
      <Demo mode={mode} className={tint.className} />
      <div className="flex items-center gap-2" role="group" aria-label="Tint">
        {TINTS.map((t) => (
          <button
            key={t.className}
            type="button"
            aria-label={t.label}
            aria-pressed={t === tint}
            onClick={() => setTint(t)}
            className="size-5 rounded-full border border-black/20 outline-none ring-offset-2 ring-offset-background transition-transform focus-visible:ring-2 focus-visible:ring-ring aria-[pressed=true]:scale-110 aria-[pressed=true]:ring-2 aria-[pressed=true]:ring-foreground"
            style={{ background: `linear-gradient(90deg, ${t.colors[0]} 50%, ${t.colors[1]} 50%)` }}
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
