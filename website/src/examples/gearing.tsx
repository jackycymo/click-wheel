"use client";

import * as React from "react";
import { Wheel } from "@/themes/shadcn/wheel"; // the Default skin from Examples → Themes

const DURATION = 227;
const GEARINGS = [30, 60, 300]; // seconds per revolution

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function Gearing() {
  const [seconds, setSeconds] = React.useState(72);
  const [unitsPerTurn, setUnitsPerTurn] = React.useState(60);

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel
        value={seconds}
        onValueChange={setSeconds}
        max={DURATION}
        unitsPerTurn={unitsPerTurn}
        detent={5}
        label="Playback position"
        className="w-48"
      />
      <div className="inline-flex rounded-md border bg-muted p-0.5 text-xs font-medium">
        {GEARINGS.map((units) => (
          <button
            key={units}
            type="button"
            onClick={() => setUnitsPerTurn(units)}
            data-active={units === unitsPerTurn || undefined}
            className="rounded-sm px-3 py-1.5 text-muted-foreground data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-xs"
          >
            {units >= 60 ? `${units / 60} min` : `${units} s`} / turn
          </button>
        ))}
      </div>
      <p className="font-mono text-sm tabular-nums">{fmt(seconds)}</p>
    </div>
  );
}
