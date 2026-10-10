"use client";

// One shared AudioContext; only an explicit sound gesture resumes it.
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();
type AudioOwner = "music" | "preview" | null;
let owner: AudioOwner = null;
const ownerListeners = new Set<(owner: AudioOwner, previous: AudioOwner) => void>();
const radios: { audio: HTMLAudioElement; media: MediaElementAudioSourceNode; unlocked: boolean; unlocking: boolean }[] = [];
export const RADIO_BUFFER_SIZE = 3;

export function getRadioMedia(index = 0) {
  if (!radios[index]) {
    const audio = document.createElement("audio");
    audio.crossOrigin = "anonymous";
    audio.preload = "none";
    audio.muted = true;
    audio.hidden = true;
    audio.dataset.previewRadio = String(index);
    document.body.append(audio);
    radios[index] = { audio, media: getAudioContext().createMediaElementSource(audio), unlocked: false, unlocking: false };
  }
  return radios[index];
}

function unlockRadioMedia(index: number) {
  const stream = getRadioMedia(index);
  if (stream.unlocked || stream.unlocking) return;
  // Only prime silence or the selected station; a gesture elsewhere must not
  // restart a paused radio stream.
  if (stream.audio.getAttribute("src") && !stream.audio.src.endsWith("/audio/objects/silence.wav") && stream.audio.muted) return;
  if (!stream.audio.getAttribute("src")) stream.audio.src = "/audio/objects/silence.wav";
  stream.unlocking = true;
  // Safari grants HTML media permission per element, independently of AudioContext.
  // Call play in the original gesture and retain this element across station changes.
  void stream.audio.play().then(() => {
    stream.unlocked = true;
    if (stream.audio.src.endsWith("/audio/objects/silence.wav")) stream.audio.pause();
  }).catch(() => {}).finally(() => {
    stream.unlocking = false;
    listeners.forEach(listener => listener());
  });
}

export function getAudioContext(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    ctx.addEventListener("statechange", () => listeners.forEach(listener => listener()));
  }
  return ctx;
}

export const isAudioReady = () => ctx?.state === "running";
export const audioNotReady = () => false;
export function subscribeAudioReady(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export async function enableAudio() {
  const ac = getAudioContext();
  for (let index = 0; index < RADIO_BUFFER_SIZE; index++) unlockRadioMedia(index);
  if (ac.state !== "running") await ac.resume();
  listeners.forEach(listener => listener());
}

export function claimAudio(next: AudioOwner) {
  if (owner === next) return;
  const previous = owner;
  owner = next;
  ownerListeners.forEach(listener => listener(next, previous));
}

export const getAudioOwner = () => owner;

export function releaseAudio(current: AudioOwner) {
  if (owner === current) claimAudio(null);
}

export function subscribeAudioOwner(listener: (owner: AudioOwner, previous: AudioOwner) => void) {
  ownerListeners.add(listener);
  return () => { ownerListeners.delete(listener); };
}

/** The clicker: a short, quiet blip per detent, like the iPod's speaker tick. */
export function playClick() {
  void enableAudio().catch(() => {});
  const ac = getAudioContext();
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
