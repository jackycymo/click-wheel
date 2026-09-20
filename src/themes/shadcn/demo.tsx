"use client";

import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";

/** Site chrome around the stock skin. Add `theme-blue` to swap the palette. */
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
