import { phaseRate, radioTuning, type ReferenceKind } from "./reference-data";
import type { RadioBuffer } from "./reference-radio";

export interface PreviewVoice {
  update: (value: number, bypass: boolean) => void;
  stop: () => void;
  position?: () => number;
  reduction?: () => number;
}

function hold(param: AudioParam, time: number) {
  if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(time);
  else {
    const value = param.value;
    param.cancelScheduledValues(time);
    param.setValueAtTime(value, time);
  }
}

export function smooth(param: AudioParam, value: number, ac: AudioContext) {
  hold(param, ac.currentTime);
  param.setTargetAtTime(value, ac.currentTime, 0.025);
}

function smoothGain(param: AudioParam, value: number, ac: AudioContext) {
  hold(param, ac.currentTime);
  param.exponentialRampToValueAtTime(Math.max(0.0001, value), ac.currentTime + 0.08);
}

export function sampleVoice(ac: AudioContext, destination: AudioNode, buffer: AudioBuffer, kind: ReferenceKind, value: number, bypass: boolean, offset = 0): PreviewVoice {
  const source = ac.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const output = ac.createGain();
  output.gain.setValueAtTime(0, ac.currentTime);
  output.gain.linearRampToValueAtTime(0.7, ac.currentTime + 0.12);
  output.connect(destination);
  const nodes: AudioNode[] = [source, output];
  let oscillator: OscillatorNode | undefined;
  let compressor: DynamicsCompressorNode | undefined;
  let update: PreviewVoice["update"];
  let initializing = true;
  const setParameter = (param: AudioParam, next: number) => {
    if (initializing) param.setValueAtTime(next, ac.currentTime);
    else smooth(param, next, ac);
  };
  const setGain = (param: AudioParam, next: number) => {
    if (initializing) param.setValueAtTime(Math.max(0.0001, next), ac.currentTime);
    else smoothGain(param, next, ac);
  };

  if (kind === "compressor") {
    const input = ac.createGain();
    compressor = ac.createDynamicsCompressor();
    compressor.threshold.value = -28;
    compressor.knee.value = 6;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    const makeup = ac.createGain();
    const original = ac.createGain();
    source.connect(input).connect(compressor).connect(makeup).connect(output);
    source.connect(original).connect(output);
    nodes.push(input, compressor, makeup, original);
    update = (attenuation, dry) => {
      const driveDb = 24 - attenuation;
      setGain(input.gain, Math.pow(10, driveDb / 20));
      // Match the average level while retaining the change in pick attack and sustain.
      const compensationDb = Math.max(0, driveDb + 10) * 0.875 - driveDb - 6;
      setGain(makeup.gain, dry ? 0 : Math.pow(10, compensationDb / 20));
      setParameter(original.gain, dry ? 1 : 0);
    };
  } else if (kind === "mxr") {
    const original = ac.createGain();
    const shifted = ac.createGain();
    oscillator = ac.createOscillator();
    const depth = ac.createGain();
    depth.gain.value = 650;
    oscillator.connect(depth);
    let tail: AudioNode = source;
    for (let i = 0; i < 4; i++) {
      const filter = ac.createBiquadFilter();
      filter.type = "allpass";
      filter.frequency.value = 850;
      filter.Q.value = 0.5;
      depth.connect(filter.frequency);
      tail.connect(filter);
      tail = filter;
      nodes.push(filter);
    }
    source.connect(original).connect(output);
    tail.connect(shifted).connect(output);
    nodes.push(original, shifted, oscillator, depth);
    oscillator.start();
    update = (speed, dry) => {
      setParameter(oscillator!.frequency, phaseRate(speed));
      setParameter(original.gain, dry ? 1 : 0.5);
      setParameter(shifted.gain, dry ? 0 : 0.5);
    };
  } else if (kind === "amplifier") {
    const drive = ac.createGain();
    const shaper = ac.createWaveShaper();
    const curve = new Float32Array(2048);
    for (let i = 0; i < curve.length; i++) curve[i] = Math.tanh((i * 2 / (curve.length - 1) - 1) * 2);
    shaper.curve = curve;
    shaper.oversample = "2x";
    const cabinet = ac.createBiquadFilter();
    cabinet.type = "lowpass";
    cabinet.frequency.value = 4200;
    const gain = ac.createGain();
    source.connect(drive).connect(shaper).connect(cabinet).connect(gain).connect(output);
    nodes.push(drive, shaper, cabinet, gain);
    update = volume => {
      const amount = volume / 10;
      setParameter(drive.gain, 1 + 10 * Math.pow(amount, 3));
      setParameter(gain.gain, 0.5 * Math.pow(amount, 1.5));
    };
  } else {
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 0.5;
    const gain = ac.createGain();
    source.connect(filter).connect(gain).connect(output);
    nodes.push(filter, gain);
    update = current => {
      let level = 1;
      let frequency = 18000;
      if (kind === "guitar") level = Math.pow(current / 10, 2);
      if (kind === "sculptor") {
        frequency = 9500 * Math.pow(0.16, current / 18);
        level = 0.55 + current / 60;
      }
      if (kind === "espresso") {
        const opening = current / 100;
        // Keep the recorded steam's airy hiss even when the valve is barely open.
        level = Math.pow(opening, 0.8);
        frequency = 6500 + 6500 * Math.sqrt(opening);
      }
      if (kind === "fellow") {
        const heat = (current - 40) / 60;
        level = 0.035 + 0.9 * Math.pow(heat, 1.8);
        frequency = 250 + 7750 * Math.pow(heat, 2);
      }
      setParameter(filter.frequency, frequency);
      setParameter(gain.gain, level);
    };
  }

  update(value, bypass);
  initializing = false;
  const started = ac.currentTime;
  const position = () => (offset + ac.currentTime - started) % buffer.duration;
  source.start(0, offset % buffer.duration);
  return {
    update, position,
    reduction: () => compressor?.reduction ?? 0,
    stop: () => {
      smooth(output.gain, 0, ac);
      source.stop(ac.currentTime + 0.15);
      oscillator?.stop(ac.currentTime + 0.15);
      window.setTimeout(() => nodes.forEach(node => node.disconnect()), 180);
    },
  };
}

export function radioVoice(ac: AudioContext, destination: AudioNode, onStatus: (status: "loading" | "playing" | "error", message?: string) => void, buffer: RadioBuffer): PreviewVoice {
  const output = ac.createGain();
  output.gain.setValueAtTime(0, ac.currentTime);
  output.gain.linearRampToValueAtTime(0.7, ac.currentTime + 0.12);
  output.connect(destination);
  const signals = buffer.slots.map(slot => {
    const speaker = ac.createBiquadFilter();
    speaker.type = "lowpass";
    speaker.frequency.value = 6500;
    const gain = ac.createGain();
    gain.gain.value = 0;
    slot.media.connect(speaker).connect(gain).connect(output);
    return { slot, speaker, gain };
  });

  const noise = ac.createBufferSource();
  const noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const hiss = ac.createGain();
  hiss.gain.value = 0.025;
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = 1600;
  band.Q.value = 0.4;
  noise.connect(band).connect(hiss).connect(output);
  noise.start();

  let value = 0;
  let disposed = false;
  const levels = () => {
    if (disposed) return;
    const tuning = radioTuning(value);
    const selected = buffer.slots.find(slot => slot.station === tuning.station);
    const quality = selected?.ready ? tuning.strength : 0;
    for (const { slot, speaker, gain } of signals) {
      const strength = slot === selected ? quality : 0;
      smooth(gain.gain, 0.65 * Math.pow(strength, 1.2), ac);
      smooth(speaker.frequency, 1200 + 5300 * strength, ac);
    }
    // A tuned analog receiver still has a noise floor. Static grows as its
    // carrier weakens, so every dial movement has immediate audible feedback.
    smooth(hiss.gain, 0.003 + 0.022 * Math.pow(1 - quality, 1.5), ac);
    if (tuning.strength === 0) onStatus("playing");
    else if (selected?.error) onStatus("error", selected.error === "blocked" ? "Click the dial to play this station." : "Station unavailable. Retry or turn to another station.");
    else onStatus(selected?.ready ? "playing" : "loading");
  };
  buffer.retain();
  const unsubscribe = buffer.subscribe(levels);
  return {
    update: next => {
      value = next;
      levels();
      buffer.prepare(value);
    },
    stop: () => {
      if (disposed) return;
      disposed = true;
      unsubscribe();
      buffer.release();
      smooth(output.gain, 0, ac);
      noise.stop(ac.currentTime + 0.15);
      window.setTimeout(() => {
        for (const { slot, speaker, gain } of signals) {
          slot.media.disconnect(speaker);
          speaker.disconnect();
          gain.disconnect();
        }
        [output, noise, hiss, band].forEach(node => node.disconnect());
      }, 180);
    },
  };
}
