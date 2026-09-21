"use client";

import * as React from "react";
import { TRACKS, type Track } from "@/lib/playlist";

export interface PlayerApi {
  position: number;
  duration: number;
  playing: boolean;
  volume: number;
  /** A wheel owns the position: from the first touch until the value commits. */
  scrubbing: boolean;
  toggle: () => void;
  /** Move the audio to a position. */
  seek: (seconds: number) => void;
  /** Move only the readout, while a wheel turns; `seek` lands it. */
  setPosition: (seconds: number) => void;
  setScrubbing: (scrubbing: boolean) => void;
  setVolume: (volume: number) => void;
  track: Track;
  error: string | null;
}

const PlayerContext = React.createContext<PlayerApi | null>(null);

/**
 * One HTML5 audio element for the whole site. Every wheel on every page
 * reads and drives the same playback, so nothing ever plays twice.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const scrubbingRef = React.useRef(false);
  const trackIndexRef = React.useRef(0);
  const playRequestRef = React.useRef(0);
  const volumeRef = React.useRef(64);
  const [trackIndex, setTrackIndex] = React.useState(0);
  const [position, setPositionState] = React.useState(0);
  const [duration, setDuration] = React.useState(TRACKS[0].duration);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolumeState] = React.useState(64);
  const [scrubbing, setScrubbingState] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const play = React.useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++playRequestRef.current;
    setError(null);
    void audio.play().catch((error: unknown) => {
      if (request !== playRequestRef.current || (error instanceof DOMException && error.name === "AbortError")) return;
      setPlaying(false);
      setError("Couldn't start this track. Press the center of the wheel to retry.");
    });
  }, []);

  const loadTrack = React.useCallback((index: number, autoplay: boolean) => {
    const audio = audioRef.current;
    if (!audio || !Number.isInteger(index) || !TRACKS[index]) return;
    const track = TRACKS[index];
    ++playRequestRef.current;
    trackIndexRef.current = index;
    scrubbingRef.current = false;
    setTrackIndex(index);
    setPositionState(0);
    setDuration(track.duration);
    setScrubbingState(false);
    setPlaying(false);
    setError(null);
    audio.src = track.src;
    audio.volume = volumeRef.current / 100;
    audio.load();
    if (autoplay) play();
  }, [play]);

  React.useEffect(() => {
    // Pick a starting song only in the browser, keeping SSR and hydration identical.
    loadTrack(Math.floor(Math.random() * TRACKS.length), false);
  }, [loadTrack]);

  const api = React.useMemo<PlayerApi>(
    () => ({
      position,
      duration,
      playing,
      volume,
      scrubbing,
      track: TRACKS[trackIndex],
      error,
      toggle: () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) play();
        else {
          ++playRequestRef.current;
          audio.pause();
        }
      },
      seek: (seconds) => {
        const audio = audioRef.current;
        const position = Math.max(0, Math.min(seconds, duration));
        setPositionState(position);
        if (audio) audio.currentTime = position;
      },
      setPosition: setPositionState,
      setScrubbing: (next) => {
        scrubbingRef.current = next;
        setScrubbingState(next);
      },
      setVolume: (next) => {
        const audio = audioRef.current;
        volumeRef.current = next;
        setVolumeState(next);
        if (audio) audio.volume = next / 100;
      },
    }),
    [position, duration, playing, volume, scrubbing, trackIndex, error, play],
  );

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const audio = e.currentTarget;
          audio.volume = volumeRef.current / 100;
          if (Number.isFinite(audio.duration)) setDuration(audio.duration);
        }}
        onTimeUpdate={(e) => {
          // While a wheel holds the position, the readout is the wheel's, not the file's.
          if (!scrubbingRef.current) setPositionState(e.currentTarget.currentTime);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => loadTrack((trackIndexRef.current + 1) % TRACKS.length, true)}
        onError={() => {
          setPlaying(false);
          setError("This track couldn't be loaded. Press the center of the wheel to retry.");
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayerContext(): PlayerApi {
  const ctx = React.useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer needs a PlayerProvider above it.");
  return ctx;
}
