"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";

const DURATION = 240;
const LAPS = 4;

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function Vinyl() {
  const [seconds, setSeconds] = React.useState(100);

  return (
    <div className="flex flex-col items-center gap-6">
      <ClickWheel.Root
        value={seconds}
        onValueChange={setSeconds}
        max={DURATION}
        unitsPerTurn={60}
        detent={5}
        className="relative aspect-square w-48"
      >
        {Array.from({ length: LAPS }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="absolute rounded-full [background:conic-gradient(var(--primary)_calc(var(--fill)*360deg),var(--border)_0)] [mask:radial-gradient(circle_closest-side,transparent_calc(100%_-_3px),black_calc(100%_-_2px))]"
            style={{ inset: i * 5, "--fill": `clamp(0, calc(var(--click-wheel-turns) - ${i}), 1)` } as React.CSSProperties}
          />
        ))}
        <ClickWheel.Ring
          aria-label="Playback position"
          className="absolute inset-6 cursor-grab rounded-full border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring data-[dragging]:cursor-grabbing"
        />
        <ClickWheel.Center
          render={<div />}
          className="absolute left-1/2 top-1/2 flex size-[36%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background font-mono text-sm tabular-nums shadow-xs"
        >
          {fmt(seconds)}
        </ClickWheel.Center>
      </ClickWheel.Root>
      <p className="font-mono text-xs text-muted-foreground">
        lap {Math.min(LAPS, Math.floor(seconds / 60) + 1)} of {LAPS}
      </p>
    </div>
  );
}
