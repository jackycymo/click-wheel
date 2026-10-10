"use client";

import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";
import "./demo.css";

/** Site chrome: a compact player body with a mono LCD. Not part of the skin. */
export function Demo({ mode }: { mode: Mode }) {
  const p = usePlayer({ mode });
  const seek = mode === "seek";
  const pct = seek ? (p.position / p.track.duration) * 100 : p.volume;

  return (
    <div className="classic-player-body">
      <div className="classic-player-screen">
        <div className="classic-player-bar">
          <span className="classic-player-play" aria-hidden="true">
            {p.playing ? "▶" : "▮▮"}
          </span>
          <span>{seek ? "Now Playing" : "Volume"}</span>
          <span className="classic-player-batt" aria-hidden="true">
            <i />
          </span>
        </div>
        <div className="classic-player-meta">
          <p className="classic-player-title">{p.track.title}</p>
          <p>{p.track.artist}</p>
          <p>{p.track.album}</p>
        </div>
        <div className="classic-player-progress">
          <i style={{ width: `${pct}%` }} />
        </div>
        <div className="classic-player-times">
          <span>{seek ? fmt(p.position) : p.volume}</span>
          <span>{seek ? `-${fmt(p.track.duration - p.position)}` : "100"}</span>
        </div>
      </div>
      <Wheel
        {...p.wheel}
        className="classic-player-slot"
        label={seek ? "Playback position" : "Volume"}
        getAriaValueText={seek ? speakTime : undefined}
        icon={p.playing ? <IconPause /> : <IconPlay />}
        onCenterClick={p.togglePlay}
        centerLabel={p.playing ? "Pause" : "Play"}
      />
    </div>
  );
}
