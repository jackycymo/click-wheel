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
  const [turning, setTurning] = React.useState(false);
  const [log, setLog] = React.useState<string[]>([]);

  // Playback advances only while the wheel is not being turned.
  React.useEffect(() => {
    if (!playing || turning) return;
    const id = setInterval(() => setSeconds((s) => (s + 1) % DURATION), 1000);
    return () => clearInterval(id);
  }, [playing, turning]);

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel
        value={seconds}
        onValueChange={setSeconds}
        onTurningChange={setTurning}
        onValueCommitted={(v) => setLog((l) => [`committed ${fmt(v)}`, ...l].slice(0, 3))}
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
        {fmt(seconds)} · {playing ? (turning ? "scrubbing" : "playing") : "paused"}
      </p>
      <ul className="min-h-[3.75rem] font-mono text-xs text-muted-foreground">
        {log.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
