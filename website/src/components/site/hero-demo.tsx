"use client";

import * as React from "react";
import { Switch } from "@base-ui/react/switch";
import { Wheel } from "@/themes/shadcn/wheel";
import { IconPause, IconPlay } from "./icons";
import { Segmented } from "./segmented";
import { fmt, GEARINGS, speakTime, usePlayer, type Mode } from "./use-player";

const MODES: Array<{ value: Mode; label: string }> = [
  { value: "seek", label: "Seek" },
  { value: "volume", label: "Volume" },
];

export function HeroDemo() {
  const p = usePlayer({ defaultClicker: true });
  const [dragging, setDragging] = React.useState(false);
  const [grooves, setGrooves] = React.useState(false);
  const seek = p.mode === "seek";
  const pct = seek ? (p.position / p.track.duration) * 100 : p.volume;

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid items-center gap-8 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] p-6 sm:grid-cols-[auto_1fr] sm:gap-12 sm:p-10">
        <Wheel
          {...p.wheel}
          onDraggingChange={(next) => {
            p.wheel.onDraggingChange?.(next);
            setDragging(next);
          }}
          className="mx-auto w-[min(64vw,240px)]"
          grooves={grooves}
          label={seek ? "Playback position" : "Volume"}
          getAriaValueText={seek ? speakTime : undefined}
          icon={p.playing ? <IconPause /> : <IconPlay />}
          onCenterClick={p.togglePlay}
          centerLabel={p.playing ? "Pause" : "Play"}
        />

        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {seek ? "Playback position" : "Volume"}
          </p>
          <p className="mt-1 font-mono text-5xl tabular-nums tracking-tight">
            {seek ? fmt(p.position) : p.volume}
            <span className="text-2xl text-muted-foreground">
              {seek ? ` / ${fmt(p.track.duration)}` : " / 100"}
            </span>
          </p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {p.track.title} — {p.track.artist}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Segmented value={p.mode} onValueChange={p.setMode} options={MODES} label="Wheel mode" />
            {seek ? (
              <Segmented
                value={String(p.unitsPerTurn)}
                onValueChange={(id) => p.setUnitsPerTurn(Number(id))}
                options={GEARINGS.map((g) => ({ value: g.id, label: `${g.label} / turn` }))}
                label="Units per turn"
              />
            ) : null}
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Switch.Root
                checked={p.inertia}
                onCheckedChange={p.setInertia}
                className="relative h-5 w-8 rounded-full bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[checked]:bg-primary"
              >
                <Switch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-background shadow-xs transition-transform data-[checked]:translate-x-3.5" />
              </Switch.Root>
              Inertia
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Switch.Root
                checked={grooves}
                onCheckedChange={setGrooves}
                className="relative h-5 w-8 rounded-full bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[checked]:bg-primary"
              >
                <Switch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-background shadow-xs transition-transform data-[checked]:translate-x-3.5" />
              </Switch.Root>
              Grooves
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Switch.Root
                checked={p.clicker}
                onCheckedChange={p.setClicker}
                className="relative h-5 w-8 rounded-full bg-muted outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring data-[checked]:bg-primary"
              >
                <Switch.Thumb className="block size-4 translate-x-0.5 rounded-full bg-background shadow-xs transition-transform data-[checked]:translate-x-3.5" />
              </Switch.Root>
              Clicker
            </label>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 border-t pt-4 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">value</dt>
              <dd className="mt-0.5 tabular-nums">{p.wheel.value}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">unitsPerTurn</dt>
              <dd className="mt-0.5 tabular-nums">{p.wheel.unitsPerTurn}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">data-dragging</dt>
              <dd className="mt-0.5">{dragging ? "true" : "false"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
