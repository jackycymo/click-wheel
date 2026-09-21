"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";

const DURATION = 227; // seconds

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function Basic() {
  const [seconds, setSeconds] = React.useState(72);

  return (
    <div className="flex flex-col items-center gap-6">
      <ClickWheel.Root
        value={seconds}
        onValueChange={setSeconds}
        max={DURATION}
        unitsPerTurn={60} // one lap = one minute
        detent={5} // a tick every five seconds
        className="relative aspect-square w-48"
      >
        <ClickWheel.Ring
          aria-label="Playback position"
          className="absolute inset-0 cursor-grab rounded-full border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring data-[dragging]:cursor-grabbing"
        >
          {/* A tick texture. The Rotor turns it 1:1 with the finger. */}
          <ClickWheel.Rotor className="absolute inset-0 rounded-full opacity-25 [background:repeating-conic-gradient(var(--foreground)_0_1deg,transparent_1deg_15deg)] [mask:radial-gradient(circle_closest-side,transparent_56%,black_57%_82%,transparent_83%)]" />
        </ClickWheel.Ring>
        <ClickWheel.Center
          aria-label="Back to start"
          onClick={() => setSeconds(0)}
          className="absolute left-1/2 top-1/2 size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background shadow-xs active:scale-95"
        />
      </ClickWheel.Root>
      <p className="font-mono text-sm tabular-nums">
        {fmt(seconds)} <span className="text-muted-foreground">/ {fmt(DURATION)}</span>
      </p>
    </div>
  );
}
