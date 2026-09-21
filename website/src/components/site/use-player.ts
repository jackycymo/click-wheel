"use client";

import * as React from "react";
import type { ClickWheel } from "click-wheel";
import { playClick } from "./audio";
import { usePlayerContext } from "./player-provider";

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

/**
 * Demo state shared by every skin. Playback itself is the site's single
 * audio element; each demo only keeps its own mode, gearing and switches.
 */
export function usePlayer(options: { mode?: Mode } = {}) {
  const player = usePlayerContext();
  const [internalMode, setMode] = React.useState<Mode>("seek");
  const mode = options.mode ?? internalMode;
  const [unitsPerTurn, setUnitsPerTurn] = React.useState(60);
  const [clicker, setClicker] = React.useState(false);
  const [inertia, setInertia] = React.useState(true);

  const tick = () => {
    if (clicker) playClick();
  };

  const wheel: ClickWheel.RootProps =
    mode === "seek"
      ? {
          value: player.position, // fractional while playing, so arcs move like a needle
          min: 0,
          max: Math.floor(player.duration),
          step: 1,
          unitsPerTurn,
          detent: 5,
          inertia,
          onValueChange: player.setPosition, // the readout follows the wheel
          onValueCommitted: player.seek, // the audio lands where the wheel settles
          onTurningChange: player.setScrubbing,
          onTick: tick,
        }
      : {
          value: player.volume,
          min: 0,
          max: 100,
          step: 1,
          unitsPerTurn: 120,
          detent: 5,
          inertia,
          onValueChange: player.setVolume,
          onTick: tick,
        };

  return {
    mode,
    setMode,
    position: player.position,
    playing: player.playing,
    togglePlay: player.toggle,
    scrubbing: player.scrubbing,
    volume: player.volume,
    unitsPerTurn,
    setUnitsPerTurn,
    clicker,
    setClicker,
    inertia,
    setInertia,
    track: { ...player.track, duration: player.duration },
    wheel,
  };
}
