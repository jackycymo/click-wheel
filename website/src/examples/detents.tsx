"use client";

import * as React from "react";
import { Wheel } from "@/themes/shadcn/wheel";

let ctx: AudioContext | null = null;

/** A short blip, like the iPod clicker. */
function click() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 1800;
  gain.gain.setValueAtTime(0.03, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.014);
}

export function Detents() {
  const [value, setValue] = React.useState(40);
  const [ticks, setTicks] = React.useState(0);
  const [sound, setSound] = React.useState(true);

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel
        value={value}
        onValueChange={setValue}
        unitsPerTurn={120}
        detent={5} // haptics pulse and onTick fires every 5 units
        onTick={() => {
          setTicks((n) => n + 1);
          if (sound) click();
        }}
        label="Volume"
        className="w-48"
      />
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} />
          Clicker
        </label>
        <span className="font-mono tabular-nums text-muted-foreground">
          {value} · {ticks} ticks
        </span>
      </div>
    </div>
  );
}
