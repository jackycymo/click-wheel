"use client";

import { IconPause, IconPlay } from "@/components/site/icons";
import { fmt, speakTime, usePlayer, type Mode } from "@/components/site/use-player";
import { Wheel } from "./wheel";
import "./demo.css";

/** Site chrome: a brushed panel, two lamps, a recessed readout. Not part of the skin. */
export function Demo({ mode }: { mode: Mode }) {
  const p = usePlayer({ mode });
  const seek = mode === "seek";

  return (
    <div className="galley-body">
      <div className="galley-top">
        <span className="galley-plate">{seek ? "Seek" : "Volume"}</span>
        <span className="galley-leds" aria-hidden="true">
          <i data-on={p.playing || undefined} />
          <i data-on data-power />
        </span>
      </div>
      <div className="galley-display">
        <span className="galley-display-label">{seek ? "elapsed" : "level"}</span>
        <span className="galley-display-value">{seek ? fmt(p.position) : p.volume}</span>
        <span className="galley-display-sub">{seek ? `of ${fmt(p.track.duration)}` : "of 100"}</span>
      </div>
      <Wheel
        {...p.wheel}
        className="galley-slot"
        label={seek ? "Playback position" : "Volume"}
        getAriaValueText={seek ? speakTime : undefined}
        icon={p.playing ? <IconPause width={16} height={16} /> : <IconPlay width={16} height={16} />}
        onCenterClick={p.togglePlay}
        centerLabel={p.playing ? "Pause" : "Play"}
      />
      <p className="galley-engraved">push · turn</p>
    </div>
  );
}
