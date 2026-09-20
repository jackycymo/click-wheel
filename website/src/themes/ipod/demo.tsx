"use client";

import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";
import "./demo.css";

/** Site chrome: a small iPod body with a mono LCD. Not part of the skin. */
export function Demo({ mode }: { mode: Mode }) {
  const p = usePlayer({ mode });
  const seek = mode === "seek";
  const pct = seek ? (p.position / p.track.duration) * 100 : p.volume;

  return (
    <div className="ipod-body">
      <div className="ipod-screen">
        <div className="ipod-bar">
          <span className="ipod-play" aria-hidden="true">
            {p.playing ? "▶" : "▮▮"}
          </span>
          <span>{seek ? "Now Playing" : "Volume"}</span>
          <span className="ipod-batt" aria-hidden="true">
            <i />
          </span>
        </div>
        <div className="ipod-meta">
          <p className="ipod-title">{p.track.title}</p>
          <p>{p.track.artist}</p>
          <p>{p.track.album}</p>
        </div>
        <div className="ipod-progress">
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="ipod-times">
          <span>{seek ? fmt(p.position) : p.volume}</span>
          <span>{seek ? `-${fmt(p.track.duration - p.position)}` : "100"}</span>
        </div>
      </div>
      <Wheel
        {...p.wheel}
        className="ipod-slot"
        label={seek ? "Playback position" : "Volume"}
        getAriaValueText={seek ? speakTime : undefined}
        icon={p.playing ? <IconPause width={14} height={14} /> : <IconPlay width={14} height={14} />}
        onCenterClick={p.togglePlay}
        centerLabel={p.playing ? "Pause" : "Play"}
      />
    </div>
  );
}
