import { afterEach, beforeEach, expect, mock, test } from "bun:test";
import { ReferenceAudioEngine } from "../src/components/site/reference-audio-engine";
import { claimAudio, enableAudio, getAudioContext, getRadioMedia, isAudioReady } from "../src/components/site/audio";
import { radioVoice, sampleVoice, smooth } from "../src/components/site/reference-audio-graph";
import { RadioBuffer } from "../src/components/site/reference-radio";

class Param {
  value = 1;
  setValueAtTime(value) { this.value = value; }
  linearRampToValueAtTime(value) { this.value = value; }
  exponentialRampToValueAtTime(value) { this.value = value; }
  setTargetAtTime(value) { this.value = value; }
  cancelAndHoldAtTime() {}
}
class AudioNodeStub {
  gain = new Param(); frequency = new Param(); Q = new Param();
  threshold = new Param(); knee = new Param(); ratio = new Param();
  attack = new Param(); release = new Param(); reduction = -6;
  connect(node) { return node; }
  disconnect() {}
  start() {}
  stop() {}
  getFloatTimeDomainData(samples) { samples.fill(0.1); }
}
class AudioContextStub extends EventTarget {
  state = "suspended";
  currentTime = 0;
  destination = new AudioNodeStub();
  sampleRate = 8000;
  resume() { this.state = "running"; this.dispatchEvent(new Event("statechange")); return Promise.resolve(); }
  decodeAudioData() { return Promise.resolve({ duration: 192 }); }
  createAnalyser() { return new AudioNodeStub(); }
  createDynamicsCompressor() { return new AudioNodeStub(); }
  createBufferSource() { return new AudioNodeStub(); }
  createGain() { return new AudioNodeStub(); }
  createBiquadFilter() { return new AudioNodeStub(); }
  createWaveShaper() { return new AudioNodeStub(); }
  createOscillator() { return new AudioNodeStub(); }
  createMediaElementSource() { return new AudioNodeStub(); }
  createBuffer(channels, length) { return { getChannelData: () => new Float32Array(length) }; }
}

class MediaStub {
  src = "";
  paused = true;
  readyState = 0;
  loads = 0;
  dataset = {};
  get currentSrc() { return this.src; }
  getAttribute() { return this.src || null; }
  removeAttribute() { this.src = ""; }
  play() {
    this.paused = false;
    const src = this.src;
    queueMicrotask(() => {
      if (this.src !== src || this.paused) return;
      this.readyState = 4;
      this.onplaying?.();
    });
    return Promise.resolve();
  }
  pause() { this.paused = true; }
  load() { ++this.loads; this.readyState = 0; this.paused = true; }
}

globalThis.AudioContext = AudioContextStub;
globalThis.window = Object.assign(new EventTarget(), { setTimeout, clearTimeout, setInterval, clearInterval });
globalThis.document = Object.assign(new EventTarget(), { hidden: false, createElement: () => new MediaStub(), body: { append() {} } });
const saved = new Map();
globalThis.sessionStorage = { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) };
const originalFetch = globalThis.fetch;
let engine;
let cleanup;
const settle = () => new Promise(resolve => setImmediate(resolve));

beforeEach(() => {
  saved.clear();
  claimAudio(null);
  const context = getAudioContext();
  context.state = "suspended";
  context.currentTime = 0;
  globalThis.fetch = mock(async () => new Response(new ArrayBuffer(8)));
  engine = new ReferenceAudioEngine();
  cleanup = engine.mount();
});
afterEach(() => { cleanup(); globalThis.fetch = originalFetch; });

test("saved music history alone does not unlock previews; successful context activation does", async () => {
  saved.set("click-wheel:player", JSON.stringify({ started: true }));
  engine.activate("guitar", 5);
  expect(engine.getSnapshot().status).toBe("blocked");
  expect(isAudioReady()).toBe(false);
  await enableAudio();
  await settle();
  expect(engine.getSnapshot().status).toBe("playing");
});

test("explicit mute survives other playback and dial gestures until unmuted", async () => {
  engine.activate("guitar", 5);
  engine.mute();
  await enableAudio();
  engine.interact();
  await settle();
  expect(engine.getSnapshot().muted).toBe(true);
  expect(engine.getSnapshot().status).toBe("muted");
  await engine.enable();
  await settle();
  expect(engine.getSnapshot().status).toBe("playing");
});

test("a slow sound load cannot start after leaving the grid", async () => {
  let resolve;
  globalThis.fetch = mock(() => new Promise(done => { resolve = done; }));
  await enableAudio();
  engine.activate("guitar", 5);
  expect(engine.getSnapshot().status).toBe("loading");
  engine.stop();
  resolve(new Response(new ArrayBuffer(8)));
  await settle();
  expect(engine.getSnapshot().kind).toBeNull();
  expect(engine.getSnapshot().status).toBe("idle");
});

test("starting the main player cancels an in-flight preview", async () => {
  let resolve;
  globalThis.fetch = mock(() => new Promise(done => { resolve = done; }));
  await enableAudio();
  engine.activate("guitar", 5);
  claimAudio("music");
  resolve(new Response(new ArrayBuffer(8)));
  await settle();
  expect(engine.getSnapshot().kind).toBeNull();
  expect(engine.getSnapshot().status).toBe("idle");
});

test("a stale tile leave cannot cancel the current tile's scheduled stop", async () => {
  await enableAudio();
  engine.activate("guitar", 5);
  await settle();
  engine.leave("guitar");
  engine.leave("sculptor");
  await Bun.sleep(200);
  expect(engine.getSnapshot().kind).toBeNull();
});

test("iPod pauses at its real position, remembers pause across hover, and resumes on play", async () => {
  await enableAudio();
  engine.activate("ipod", 42);
  await settle();
  getAudioContext().currentTime = 7;
  engine.toggleIpod();
  expect(engine.getSnapshot().status).toBe("paused");
  expect(engine.getPosition()).toBe(49);
  engine.stop();
  engine.activate("ipod", engine.getPosition());
  expect(engine.getSnapshot().status).toBe("paused");
  engine.toggleIpod();
  await settle();
  expect(engine.getSnapshot().status).toBe("playing");
  expect(engine.getPosition()).toBe(49);
});

test("switching away while a sample loads cannot replace the new tile's voice", async () => {
  let resolve;
  globalThis.fetch = mock(url => url.includes("guitar") ? new Promise(done => { resolve = done; }) : Promise.resolve(new Response(new ArrayBuffer(8))));
  await enableAudio();
  engine.activate("guitar", 5);
  engine.activate("espresso", 80);
  await settle();
  resolve(new Response(new ArrayBuffer(8)));
  await settle();
  expect(engine.getSnapshot().kind).toBe("espresso");
  expect(engine.getSnapshot().value).toBe(80);
  expect(engine.getSnapshot().status).toBe("playing");
});

test("closed steam and zero guitar volume are silent before their source starts", () => {
  for (const kind of ["espresso", "guitar"]) {
    const context = new AudioContextStub();
    const gains = [];
    context.createGain = () => {
      const node = new AudioNodeStub();
      node.gain.setTargetAtTime = mock();
      gains.push(node);
      return node;
    };
    const voice = sampleVoice(context, context.destination, { duration: 5 }, kind, 0, false);
    expect(gains[1].gain.value).toBe(0);
    expect(gains[1].gain.setTargetAtTime).not.toHaveBeenCalled();
    voice.stop();
  }
});

test("parameter changes work without cancelAndHoldAtTime support", () => {
  const param = { value: 0.5, cancelScheduledValues: mock(), setValueAtTime: mock(), setTargetAtTime: mock() };
  smooth(param, 0, { currentTime: 2 });
  expect(param.cancelScheduledValues).toHaveBeenCalledWith(2);
  expect(param.setValueAtTime).toHaveBeenCalledWith(0.5, 2);
  expect(param.setTargetAtTime).toHaveBeenCalledWith(0, 2, 0.025);
});

test("re-enabling an interrupted preview disposes its old loop before replacing it", async () => {
  const context = getAudioContext();
  const createBufferSource = context.createBufferSource;
  const sources = [];
  context.createBufferSource = () => {
    const source = new AudioNodeStub();
    source.stop = mock();
    sources.push(source);
    return source;
  };
  try {
    await enableAudio();
    engine.activate("guitar", 5);
    await settle();
    context.state = "suspended";
    context.dispatchEvent(new Event("statechange"));
    await engine.enable();
    await settle();
    expect(sources).toHaveLength(2);
    expect(sources[0].stop).toHaveBeenCalledTimes(1);
    engine.mute();
    expect(sources[1].stop).toHaveBeenCalledTimes(1);
  } finally {
    context.createBufferSource = createBufferSource;
  }
});

test("a delayed iPod seek commit cannot silence or change another active tile", async () => {
  await enableAudio();
  engine.activate("guitar", 5);
  await settle();
  engine.seek(75);
  await Bun.sleep(110);
  expect(engine.getPosition()).toBe(75);
  expect(engine.getSnapshot().kind).toBe("guitar");
  expect(engine.getSnapshot().value).toBe(5);
  expect(engine.getSnapshot().status).toBe("playing");
  expect(engine.getSnapshot().level).toBeGreaterThan(0);
});

test("sound activation primes one reusable radio media element before awaiting context resume", async () => {
  const stream = getRadioMedia();
  stream.unlocked = stream.unlocking = false;
  const originalPlay = stream.audio.play;
  stream.audio.play = mock(originalPlay.bind(stream.audio));
  try {
    const ready = enableAudio();
    expect(stream.audio.play).toHaveBeenCalledTimes(1);
    await ready;
    await settle();
    await enableAudio();
    expect(getRadioMedia().audio).toBe(stream.audio);
    expect(stream.audio.play).toHaveBeenCalledTimes(1);
  } finally {
    stream.audio.play = originalPlay;
  }
});

test("an old radio fade cannot stop a newly selected station on the shared element", async () => {
  await enableAudio();
  const context = getAudioContext();
  const buffer = new RadioBuffer();
  const first = radioVoice(context, context.destination, () => {}, buffer);
  first.update(44.4);
  first.stop();
  const second = radioVoice(context, context.destination, () => {}, buffer);
  second.update(14.8);
  await Bun.sleep(210);
  const paris = buffer.slots.find(slot => slot.station?.place === "Paris");
  expect(paris.audio.src).toContain("fip-hifi.aac");
  expect(paris.audio.paused).toBe(false);
  second.stop();
  buffer.dispose();
});

test("radio intent prepares the current station and neighbors without claiming playback", async () => {
  await enableAudio();
  claimAudio("music");
  engine.prepareRadio();
  await settle();
  expect([0, 1, 2].map(index => getRadioMedia(index).audio.dataset.radioStation).sort()).toEqual(["Jazz Sakura", "RTHK Radio 1", "Radio Swiss Jazz"]);
  expect(engine.getSnapshot().kind).toBeNull();
  expect(engine.getSnapshot().level).toBe(0);
  engine.mute();
  engine.prepareRadio();
  expect([0, 1, 2].every(index => getRadioMedia(index).audio.src === "")).toBe(true);
});

test("a warm adjacent station plays immediately without restarting its connection", async () => {
  await enableAudio();
  const buffer = new RadioBuffer();
  buffer.prepare(44.4);
  await settle();
  const japan = buffer.slots.find(slot => slot.station?.place === "Japan");
  const loads = japan.audio.loads;
  const status = mock();
  const voice = radioVoice(getAudioContext(), getAudioContext().destination, status, buffer);
  voice.update(44.4);
  voice.update(59.2);
  expect(status).toHaveBeenLastCalledWith("playing");
  expect(japan.audio.loads).toBe(loads);
  expect(japan.audio.paused).toBe(false);
  voice.stop();
  buffer.dispose();
});

test("a tuned radio keeps a noise floor while detuning masks the station with static", async () => {
  await enableAudio();
  const context = getAudioContext();
  const createGain = context.createGain;
  const gains = [];
  context.createGain = () => { const node = new AudioNodeStub(); gains.push(node); return node; };
  const buffer = new RadioBuffer();
  buffer.prepare(44.4);
  await settle();
  const voice = radioVoice(context, context.destination, () => {}, buffer);
  try {
    voice.update(44.4);
    const tunedNoise = gains.at(-1).gain.value;
    expect(tunedNoise).toBeGreaterThan(0);
    expect(gains.slice(1, 4).filter(node => node.gain.value > 0)).toHaveLength(1);
    voice.update(51);
    expect(gains.at(-1).gain.value).toBeGreaterThan(tunedNoise * 5);
    expect(gains.slice(1, 4).every(node => node.gain.value === 0)).toBe(true);
  } finally {
    voice.stop();
    buffer.dispose();
    context.createGain = createGain;
  }
});

test("radio preparation stays bounded and releases unused stream connections", async () => {
  await enableAudio();
  const buffer = new RadioBuffer();
  buffer.prepare(44.4);
  await settle();
  buffer.prepare(88.8);
  await settle();
  expect(buffer.slots).toHaveLength(3);
  expect(buffer.slots.map(slot => slot.station?.place).sort()).toEqual(["Melbourne", "Seattle", "United States"]);
  buffer.release(10);
  await Bun.sleep(20);
  expect(buffer.slots.every(slot => slot.station === null && slot.audio.paused && !slot.audio.src)).toBe(true);
  buffer.dispose();
});

test("brief reverse tuning preserves the already-buffered station ahead", async () => {
  await enableAudio();
  const buffer = new RadioBuffer();
  buffer.prepare(59.2);
  await settle();
  const melbourne = buffer.slots.find(slot => slot.station?.place === "Melbourne");
  const loads = melbourne.audio.loads;
  buffer.retain();
  buffer.prepare(44.4);
  buffer.prepare(59.2);
  buffer.prepare(74);
  expect(melbourne.audio.loads).toBe(loads);
  expect(melbourne.ready).toBe(true);
  buffer.dispose();
});
