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
  /** Playback has started at least once in this tab. */
  started: boolean;
  toggle: () => void;
  /** Move the audio to a position. */
  seek: (seconds: number) => void;
  /** Move only the readout, while a wheel turns; `seek` lands it. */
  setPosition: (seconds: number) => void;
  setScrubbing: (scrubbing: boolean) => void;
  setVolume: (volume: number) => void;
  /** Skip to the next track. Playback continues if it was playing. */
  next: () => void;
  /** Restart the track, or go back one when it has just started. */
  previous: () => void;
  track: Track;
  error: string | null;
}

const PlayerContext = React.createContext<PlayerApi | null>(null);

/*
  The tab remembers the track, the position and whether it was playing, so a
  reload lands where the listener left off. Playback after a reload is not a
  user gesture; when the browser refuses it, the player stays paused quietly.
*/
const STORAGE_KEY = "click-wheel:player";

interface Saved {
  src: string;
  position: number;
  playing: boolean;
  started: boolean;
}

function readSaved(): Saved | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved: unknown = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return null;
    const { src, position, playing, started } = saved as Record<string, unknown>;
    if (typeof src !== "string" || typeof position !== "number" || !Number.isFinite(position)) return null;
    return { src, position, playing: playing === true, started: started === true || playing === true };
  } catch {
    return null;
  }
}

function writeSaved(saved: Saved) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // Storage can be blocked; the player still works, it only forgets.
  }
}

/*
  "Started" is a small external store: true once play has run in this tab,
  read back from the saved state on the first call in the browser.
*/
const startedListeners = new Set<() => void>();
let startedCache: boolean | null = null;

function readStarted(): boolean {
  if (startedCache === null) startedCache = readSaved()?.started ?? false;
  return startedCache;
}

function markStarted() {
  if (startedCache === true) return;
  startedCache = true;
  for (const listener of startedListeners) listener();
}

function subscribeStarted(listener: () => void) {
  startedListeners.add(listener);
  return () => {
    startedListeners.delete(listener);
  };
}

/**
 * One HTML5 audio element for the whole site. Every wheel on every page
 * reads and drives the same playback, so nothing ever plays twice. It lives
 * in the root layout, which stays mounted across client-side navigation.
 */
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const scrubbingRef = React.useRef(false);
  const trackIndexRef = React.useRef(0);
  const playRequestRef = React.useRef(0);
  const volumeRef = React.useRef(64);
  const resumeRef = React.useRef<{ position: number; playing: boolean } | null>(null);
  const [trackIndex, setTrackIndex] = React.useState(0);
  const [position, setPositionState] = React.useState(0);
  const [duration, setDuration] = React.useState(TRACKS[0].duration);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolumeState] = React.useState(64);
  const [scrubbing, setScrubbingState] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const started = React.useSyncExternalStore(subscribeStarted, readStarted, () => false);


  const save = React.useCallback(() => {
    const audio = audioRef.current;
    const track = TRACKS[trackIndexRef.current];
    if (!audio || !track) return;
    writeSaved({
      src: track.src,
      position: audio.currentTime,
      playing: !audio.paused && !audio.ended,
      started: readStarted(),
    });
  }, []);

  const play = React.useCallback((quiet = false) => {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++playRequestRef.current;
    setError(null);
    void audio.play().catch((error: unknown) => {
      if (request !== playRequestRef.current || (error instanceof DOMException && error.name === "AbortError")) return;
      setPlaying(false);
      save();
      // Autoplay refused after a reload: not an error, the listener just presses play again.
      if (quiet && error instanceof DOMException && error.name === "NotAllowedError") return;
      setError("Couldn't start this track. Press the center of the wheel to retry.");
    });
  }, [save]);

  const loadTrack = React.useCallback(
    (index: number, autoplay: boolean, resumeAt?: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isInteger(index) || !TRACKS[index]) return;
      const track = TRACKS[index];
      ++playRequestRef.current;
      trackIndexRef.current = index;
      scrubbingRef.current = false;
      setTrackIndex(index);
      setPositionState(resumeAt ?? 0);
      setDuration(track.duration);
      setScrubbingState(false);
      setPlaying(false);
      setError(null);
      audio.src = track.src;
      audio.volume = volumeRef.current / 100;
      audio.load();
      if (autoplay) play();
      writeSaved({ src: track.src, position: resumeAt ?? 0, playing: autoplay, started: readStarted() });
    },
    [play],
  );

  React.useEffect(() => {
    // Pick up where this tab left off, or start a random song. Both happen only
    // in the browser, keeping SSR and hydration identical.
    const saved = readSaved();
    const index = saved ? TRACKS.findIndex((track) => track.src === saved.src) : -1;
    if (saved && index >= 0) {
      resumeRef.current = { position: saved.position, playing: saved.playing };
      loadTrack(index, false, saved.position);
    } else {
      loadTrack(Math.floor(Math.random() * TRACKS.length), false);
    }
  }, [loadTrack]);

  const api = React.useMemo<PlayerApi>(() => {
    const isPlaying = () => {
      const audio = audioRef.current;
      return !!audio && !audio.paused && !audio.ended;
    };
    const seek = (seconds: number) => {
      const audio = audioRef.current;
      const position = Math.max(0, Math.min(seconds, duration));
      setPositionState(position);
      if (audio) audio.currentTime = position;
      save();
    };
    return {
      position,
      duration,
      playing,
      volume,
      scrubbing,
      started,
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
      seek,
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
      next: () => loadTrack((trackIndexRef.current + 1) % TRACKS.length, isPlaying()),
      previous: () => {
        const audio = audioRef.current;
        if (audio && audio.currentTime > 3) seek(0);
        else loadTrack((trackIndexRef.current + TRACKS.length - 1) % TRACKS.length, isPlaying());
      },
    };
  }, [position, duration, playing, volume, scrubbing, started, trackIndex, error, play, loadTrack, save]);

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
          const resume = resumeRef.current;
          if (!resume) return;
          resumeRef.current = null;
          const at = Math.max(0, Math.min(resume.position, Math.max(0, audio.duration - 1)));
          audio.currentTime = at;
          setPositionState(at);
          if (resume.playing) play(true);
        }}
        onTimeUpdate={(e) => {
          // While a wheel holds the position, the readout is the wheel's, not the file's.
          if (!scrubbingRef.current) setPositionState(e.currentTarget.currentTime);
          save();
        }}
        onPlay={() => {
          setPlaying(true);
          markStarted();
          save();
        }}
        onPause={() => {
          setPlaying(false);
          save();
        }}
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
