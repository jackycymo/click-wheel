"use client";

import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";
import "./demo.css";

const CELLS = 20;

/** Site chrome: a grey panel with a small OLED. Not part of the skin. */
export function Demo({ mode, defaultClicker = false }: {
  mode: Mode;
  defaultClicker?: boolean;
}) {
  const p = usePlayer({ mode, defaultClicker });
  const seek = mode === "seek";
  const pct = seek ? (p.position / p.track.duration) * 100 : p.volume;
  const on = Math.round((pct / 100) * CELLS);

  return (
    <div className="retro-body">
      {seek ? null : <span className="retro-label">vol</span>}
      <div className="retro-screen">
        <div className="retro-screen-top">
          <span>{p.track.title}</span>
          <span className="retro-accent">{p.playing ? "play" : "stop"}</span>
        </div>
        <div className="retro-readout">
          {seek ? fmt(p.position) : p.volume}
          <small>{seek ? ` / ${fmt(p.track.duration)}` : " / 100"}</small>
        </div>
        <div className="retro-meter" aria-hidden="true">
          {Array.from({ length: CELLS }, (_, i) => (
            <i key={i} data-on={i < on || undefined} />
          ))}
        </div>
      </div>
      <Wheel
        {...p.wheel}
        className="retro-slot"
        label={seek ? "Playback position" : "Volume"}
        getAriaValueText={seek ? speakTime : undefined}
        icon={p.playing ? <IconPause /> : <IconPlay />}
        onCenterClick={p.togglePlay}
        centerLabel={p.playing ? "Pause" : "Play"}
      />
    </div>
  );
}
