"use client";

import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";
import "./demo.css";

const CELLS = 20;

/** Site chrome: a grey panel with a small OLED. Not part of the skin. */
export function Demo({ mode }: { mode: Mode }) {
  const p = usePlayer({ mode });
  const seek = mode === "seek";
  const pct = seek ? (p.position / p.track.duration) * 100 : p.volume;
  const on = Math.round((pct / 100) * CELLS);

  return (
    <div className="te-body">
      <div className="te-head">
        <span className="te-label">CW-1</span>
        <span className="te-label te-dim">{seek ? "seek" : "vol"}</span>
        <span className="te-keys" aria-hidden="true">
          <i data-k="a" />
          <i data-k="b" />
          <i data-k="c" />
          <i data-k="d" />
        </span>
      </div>
      <div className="te-screen">
        <div className="te-screen-top">
          <span>{p.track.title}</span>
          <span className="te-accent">{p.playing ? "play" : "stop"}</span>
        </div>
        <div className="te-readout">
          {seek ? fmt(p.position) : p.volume}
          <small>{seek ? ` / ${fmt(p.track.duration)}` : " / 100"}</small>
        </div>
        <div className="te-meter" aria-hidden="true">
          {Array.from({ length: CELLS }, (_, i) => (
            <i key={i} data-on={i < on || undefined} />
          ))}
        </div>
      </div>
      <Wheel
        {...p.wheel}
        className="te-slot"
        label={seek ? "Playback position" : "Volume"}
        getAriaValueText={seek ? speakTime : undefined}
        icon={p.playing ? <IconPause width={14} height={14} /> : <IconPlay width={14} height={14} />}
        onCenterClick={p.togglePlay}
        centerLabel={p.playing ? "Pause" : "Play"}
      />
    </div>
  );
}
