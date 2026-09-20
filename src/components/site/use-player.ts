"use client";

import * as React from "react";
import type { ClickWheel } from "@/components/click-wheel";
import { playClick } from "./audio";

export const TRACK = {
  title: "North Coast",
  artist: "The Marginals",
  album: "Slow Signal",
  duration: 227,
};

export type Mode = "seek" | "volume";

export const GEARINGS = [
  { id: "30", label: "30 s", units: 30 },
  { id: "60", label: "1 min", units: 60 },
  { id: "300", label: "5 min", units: 300 },
];

export function fmt(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function speakTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)} minutes ${s % 60} seconds`;
}

/** Demo state shared by every skin: a fake player with a seek and a volume wheel. */
export function usePlayer(options: { mode?: Mode } = {}) {
  const [internalMode, setMode] = React.useState<Mode>("seek");
  const mode = options.mode ?? internalMode;
  const [position, setPosition] = React.useState(72);
  const [playing, setPlaying] = React.useState(false);
  const [scrubbing, setScrubbing] = React.useState(false);
  const [volume, setVolume] = React.useState(64);
  const [unitsPerTurn, setUnitsPerTurn] = React.useState(60);
  const [clicker, setClicker] = React.useState(false);
  const [inertia, setInertia] = React.useState(true);

  // Simulated playback; pauses while the wheel is being turned.
  React.useEffect(() => {
    if (!playing || scrubbing) return;
    const id = setInterval(() => {
      setPosition((p) => (p + 0.25 >= TRACK.duration ? 0 : p + 0.25));
    }, 250);
    return () => clearInterval(id);
  }, [playing, scrubbing]);

  const tick = () => {
    if (clicker) playClick();
  };

  const wheel: ClickWheel.RootProps =
    mode === "seek"
      ? {
          value: Math.floor(position),
          min: 0,
          max: TRACK.duration,
          step: 1,
          unitsPerTurn,
          detent: 5,
          inertia,
          onValueChange: setPosition,
          onTurningChange: setScrubbing,
          onTick: tick,
        }
      : {
          value: volume,
          min: 0,
          max: 100,
          step: 1,
          unitsPerTurn: 120,
          detent: 5,
          inertia,
          onValueChange: setVolume,
          onTick: tick,
        };

  return {
    mode,
    setMode,
    position,
    playing,
    togglePlay: () => setPlaying((p) => !p),
    scrubbing,
    volume,
    unitsPerTurn,
    setUnitsPerTurn,
    clicker,
    setClicker,
    inertia,
    setInertia,
    track: TRACK,
    wheel,
  };
}
