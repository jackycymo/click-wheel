"use client";

import * as React from "react";

/** The one track the site plays: CC0, see public/audio/LICENSE.txt. Duration is read from the file once it loads. */
export const TRACK = {
  src: "/audio/morning-coffee.mp3",
  title: "Morning Coffee",
  artist: "HoliznaCC0",
  album: "Lo-fi And Chill",
  duration: 192,
};

export interface PlayerApi {
  position: number;
  duration: number;
  playing: boolean;
  volume: number;
  /** A wheel is moving the position: turning, or coasting after a flick. */
  scrubbing: boolean;
  toggle: () => void;
  /** Move the audio to a position. */
  seek: (seconds: number) => void;
  /** Move only the readout, while a wheel turns; `seek` lands it. */
  setPosition: (seconds: number) => void;
  setScrubbing: (scrubbing: boolean) => void;
  setVolume: (volume: number) => void;
  track: typeof TRACK;
}

const PlayerContext = React.createContext<PlayerApi | null>(null);

/**
 * One HTML5 audio element for the whole site. Every wheel on every page
 * reads and drives the same playback, so nothing ever plays twice.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const scrubbingRef = React.useRef(false);
  const [position, setPositionState] = React.useState(0);
  const [duration, setDuration] = React.useState(TRACK.duration);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolumeState] = React.useState(64);
  const [scrubbing, setScrubbingState] = React.useState(false);

  const api = React.useMemo<PlayerApi>(
    () => ({
      position,
      duration,
      playing,
      volume,
      scrubbing,
      track: TRACK,
      toggle: () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) void audio.play().catch(() => {});
        else audio.pause();
      },
      seek: (seconds) => {
        const audio = audioRef.current;
        setPositionState(seconds);
        if (audio) audio.currentTime = seconds;
      },
      setPosition: setPositionState,
      setScrubbing: (next) => {
        scrubbingRef.current = next;
        setScrubbingState(next);
      },
      setVolume: (next) => {
        const audio = audioRef.current;
        setVolumeState(next);
        if (audio) audio.volume = next / 100;
      },
    }),
    [position, duration, playing, volume, scrubbing],
  );

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <audio
        ref={audioRef}
        src={TRACK.src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          audio.volume = volume / 100;
          if (Number.isFinite(audio.duration)) setDuration(audio.duration);
        }}
        onTimeUpdate={(e) => {
          // While a wheel holds the position, the readout is the wheel's, not the file's.
          if (!scrubbingRef.current) setPositionState(e.currentTarget.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayerContext(): PlayerApi {
  const ctx = React.useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer needs a PlayerProvider above it.");
  return ctx;
}
