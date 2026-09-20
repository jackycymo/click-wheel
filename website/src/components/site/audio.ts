"use client";

// One shared AudioContext, created lazily inside a user gesture.
let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** The clicker: a short, quiet blip per detent, like the iPod's speaker tick. */
export function playClick() {
  const ac = getContext();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.value = 1800;
  const t = ac.currentTime;
  gain.gain.setValueAtTime(0.028, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + 0.014);
}
