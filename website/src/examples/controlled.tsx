"use client";

import * as React from "react";
import { Wheel } from "@/themes/shadcn/wheel";

const DURATION = 227;

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function Controlled() {
  const [seconds, setSeconds] = React.useState(72);
  const [playing, setPlaying] = React.useState(false);
  const [held, setHeld] = React.useState(false); // from the first touch until the value commits
  const [log, setLog] = React.useState<string[]>([]);

  // Playback advances only while the wheel is not scrubbing.
  React.useEffect(() => {
    if (!playing || held) return;
    const id = setInterval(() => setSeconds((s) => (s + 1) % DURATION), 1000);
    return () => clearInterval(id);
  }, [playing, held]);

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel
        value={seconds}
        onValueChange={setSeconds}
        onDraggingChange={(dragging) => dragging && setHeld(true)}
        onValueCommitted={(v) => {
          setHeld(false); // the coast has settled too
          setLog((l) => [`committed ${fmt(v)}`, ...l].slice(0, 3));
        }}
        max={DURATION}
        unitsPerTurn={60}
        detent={5}
        label="Playback position"
        icon={playing ? "❚❚" : "▶"}
        centerLabel={playing ? "Pause" : "Play"}
        onCenterClick={() => setPlaying((p) => !p)}
        className="w-48"
      />
      <p className="font-mono text-sm tabular-nums">
        {fmt(seconds)} · {playing ? (held ? "scrubbing" : "playing") : "paused"}
      </p>
      <ul className="min-h-[3.75rem] font-mono text-xs text-muted-foreground">
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
