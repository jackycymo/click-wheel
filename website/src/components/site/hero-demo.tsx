"use client";

import { Wheel } from "@/themes/shadcn/wheel";
import { IconPause, IconPlay } from "./icons";
import { fmt, speakTime, usePlayer } from "./use-player";

export function HeroDemo() {
  const p = usePlayer({ mode: "seek", defaultClicker: true });
  const pct = (p.position / p.track.duration) * 100;

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid items-center gap-8 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] p-6 sm:grid-cols-[auto_1fr] sm:gap-12 sm:p-10">
        <Wheel
          {...p.wheel}
          className="mx-auto w-[min(64vw,240px)]"
          label="Playback position"
          getAriaValueText={speakTime}
          icon={p.playing ? <IconPause /> : <IconPlay />}
          onCenterClick={p.togglePlay}
          centerLabel={p.playing ? "Pause" : "Play"}
        />

        <div className="min-w-0">
          <p className="font-mono text-5xl tabular-nums tracking-tight">
            {fmt(p.position)}
            <span className="text-2xl text-muted-foreground">
              {` / ${fmt(p.track.duration)}`}
            </span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {p.track.title} — {p.track.artist}
          </p>
        </div>
      </div>
    </div>
  );
}
