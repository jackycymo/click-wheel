"use client";

import * as React from "react";
import { Wheel } from "@/themes/shadcn/wheel";

const RATES = [
  { label: "normal", rate: 0.998 },
  { label: "fast stop", rate: 0.99 },
];

export function Inertia() {
  const [value, setValue] = React.useState(40);
  const [inertia, setInertia] = React.useState(true);
  const [rate, setRate] = React.useState(0.998);

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel
        value={value}
        onValueChange={setValue}
        max={1000}
        unitsPerTurn={100}
        detent={10}
        inertia={inertia}
        decelerationRate={rate}
        label="Level"
        className="w-48"
      />
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={inertia} onChange={(e) => setInertia(e.target.checked)} />
          Inertia
        </label>
        <div className="inline-flex rounded-md border bg-muted p-0.5 text-xs font-medium">
          {RATES.map((r) => (
            <button
              key={r.rate}
              type="button"
              onClick={() => setRate(r.rate)}
              data-active={r.rate === rate || undefined}
              className="rounded-sm px-3 py-1.5 text-muted-foreground data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-xs"
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
