"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { audioNotReady, isAudioReady, subscribeAudioReady } from "./audio";
import { ReferenceAudioEngine } from "./reference-audio-engine";
import { formatValue, radioTuning } from "./reference-data";

const Context = createContext<ReferenceAudioEngine | null>(null);

export function ReferenceAudioProvider({ children }: { children: ReactNode }) {
  const [engine] = useState(() => new ReferenceAudioEngine());
  useEffect(() => engine.mount(), [engine]);
  return <Context.Provider value={engine}>{children}</Context.Provider>;
}

export function useReferenceAudio() {
  const engine = useContext(Context);
  if (!engine) throw new Error("Reference controls need a ReferenceAudioProvider");
  return engine;
}

const controlStyle = "pointer-events-auto min-h-9 shrink-0 cursor-pointer rounded px-2 text-xs underline decoration-current/40 underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

export function ReferenceAudioToolbar({ overlay = false }: { overlay?: boolean }) {
  const engine = useReferenceAudio();
  const preview = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getSnapshot);
  const ready = useSyncExternalStore(subscribeAudioReady, isAudioReady, audioNotReady);
  const soundButton = useRef<HTMLButtonElement>(null);
  const enabled = ready && !preview.muted;
  const active = preview.kind;
  const label = preview.muted ? "Unmute previews" : ready ? "Mute previews" : "Enable sound";
  const tuning = active === "braun" ? radioTuning(preview.value) : null;
  if (!active) return null;
  const caption = tuning?.strength === 0 ? null : formatValue(active, active === "ipod" ? preview.position : preview.value);
  const details = <>
    {preview.status === "error" ? <span role="status">{preview.message}</span> : null}
    {preview.status === "error" ? <button type="button" className={controlStyle} onClick={() => {
      soundButton.current?.focus({ preventScroll: true });
      engine.retry();
    }}>Retry sound</button> : null}
  </>;
  return <div
    data-reference-audio-controls=""
    data-preview-status={preview.status}
    data-preview-kind={active}
    className={overlay ? "pointer-events-none absolute inset-0 z-30 text-white" : "relative mt-3 min-h-10 min-w-0 text-[#606354]"}
  >
    <button ref={soundButton} type="button" className={overlay ? "pointer-events-auto absolute top-2 right-2 flex min-h-8 min-w-8 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-black/65 px-2 text-[11px] text-white hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" : `absolute top-0 right-0 ${controlStyle}`} onClick={() => enabled ? engine.mute() : void engine.enable()} aria-label={label} title={label}>
      {overlay ? <><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4Z" />{enabled ? <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /> : <path d="m16 9 5 6m0-6-5 6" />}</svg>{!enabled ? "Sound on" : null}</> : label}
    </button>
    {caption || preview.status === "error" ? <div className={overlay ? "absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/65 to-transparent px-3 pt-8 pb-2.5" : ""}>
      {caption ? <p className={`${overlay ? "text-white/85" : "flex min-h-10 items-center pr-32"} text-[11px] leading-relaxed tabular-nums`} aria-live="off">{caption}</p> : null}
      {preview.status === "error" ? <div className={`flex flex-wrap items-center justify-between gap-x-2 text-[11px] leading-relaxed ${overlay ? "text-white/85" : caption ? "mt-1" : "pt-10"}`}>{details}</div> : null}
    </div> : null}
  </div>;
}
