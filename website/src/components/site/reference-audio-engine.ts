import { claimAudio, enableAudio, getAudioContext, isAudioReady, releaseAudio, subscribeAudioOwner, subscribeAudioReady } from "./audio";
import { radioVoice, sampleVoice, type PreviewVoice } from "./reference-audio-graph";
import { settings, type ReferenceKind } from "./reference-data";
import { RadioBuffer } from "./reference-radio";

export type PreviewStatus = "idle" | "blocked" | "muted" | "loading" | "playing" | "paused" | "error";
interface Snapshot {
  kind: ReferenceKind | null;
  value: number;
  status: PreviewStatus;
  muted: boolean;
  bypass: boolean;
  level: number;
  reduction: number;
  position: number;
  message: string;
}

const MUTE_KEY = "click-wheel:preview-muted";
const SAMPLE_URLS: Record<Exclude<ReferenceKind, "braun">, string> = {
  guitar: "/audio/objects/guitar-funk.mp3", amplifier: "/audio/objects/guitar-funk.mp3",
  compressor: "/audio/objects/guitar-funk.mp3", mxr: "/audio/objects/guitar-funk.mp3",
  sculptor: "/audio/objects/grinder.mp3", espresso: "/audio/objects/steam-wand.mp3",
  fellow: "/audio/objects/kettle.mp3", ipod: "/audio/morning-coffee.mp3",
};

export class ReferenceAudioEngine {
  private snapshot: Snapshot = { kind: null, value: 0, status: "idle", muted: false, bypass: false, level: 0, reduction: 0, position: settings.ipod.initial, message: "" };
  private listeners = new Set<() => void>();
  private buffers = new Map<string, Promise<AudioBuffer>>();
  private voice: PreviewVoice | null = null;
  private analyser: AnalyserNode | null = null;
  private limiter: DynamicsCompressorNode | null = null;
  private samples = new Float32Array(1024);
  private revision = 0;
  private meterTimer = 0;
  private ipodPaused = false;
  private guitarPosition = 0;
  private values = Object.fromEntries(Object.entries(settings).map(([kind, config]) => [kind, config.initial])) as Record<ReferenceKind, number>;
  private scrubbing = false;
  private leaveTimer = 0;
  private radio: RadioBuffer | null = null;

  getSnapshot = () => this.snapshot;
  getPosition = () => this.snapshot.position;
  getValue = (kind: ReferenceKind) => kind === "ipod" ? this.snapshot.position : this.values[kind];
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  private publish(patch: Partial<Snapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach(listener => listener());
  }

  mount() {
    try { this.publish({ muted: sessionStorage.getItem(MUTE_KEY) === "true" }); } catch { /* Optional preference storage. */ }
    const unsubscribeReady = subscribeAudioReady(() => {
      if (isAudioReady() && !this.snapshot.muted) this.radio?.resume();
      if (isAudioReady() && this.snapshot.kind && !this.snapshot.muted && this.snapshot.status === "blocked") void this.start();
    });
    const unsubscribeOwner = subscribeAudioOwner(owner => {
      if (owner === "music") this.stop(false);
    });
    const pagehide = () => { this.stop(); this.radio?.cool(); };
    const hide = () => { if (document.hidden) pagehide(); };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("pagehide", pagehide);
    return () => {
      unsubscribeReady();
      unsubscribeOwner();
      document.removeEventListener("visibilitychange", hide);
      window.removeEventListener("pagehide", pagehide);
      this.stop();
      this.radio?.dispose();
      this.radio = null;
      this.analyser?.disconnect();
      this.analyser = null;
      this.limiter?.disconnect();
      this.limiter = null;
    };
  }

  activate(kind: ReferenceKind, value: number) {
    this.hold();
    if (kind === "braun") this.prepareRadio();
    if (this.snapshot.kind === kind && (this.voice || this.snapshot.status === "loading")) {
      this.update(kind, value);
      return;
    }
    this.silence();
    this.publish({ kind, value, bypass: false, message: "" });
    void this.start();
  }

  interact() {
    // A direct dial gesture also unlocks audio, but never overrides an explicit mute.
    if (!this.snapshot.muted) void this.enableCurrentAudio().catch(() => this.publish({ status: "blocked" }));
  }

  async enable() {
    this.silence();
    this.publish({ muted: false, status: this.snapshot.kind ? "blocked" : "idle", message: "" });
    try { sessionStorage.setItem(MUTE_KEY, "false"); } catch { /* Optional preference storage. */ }
    try { await this.enableCurrentAudio(); } catch { this.publish({ status: "blocked" }); }
  }

  private enableCurrentAudio() {
    if (this.snapshot.kind === "braun") {
      this.radio ??= new RadioBuffer();
      this.radio.retain();
      this.radio.prepare(this.snapshot.value);
    }
    return enableAudio();
  }

  mute() {
    this.silence();
    this.radio?.cool();
    this.publish({ muted: true, status: "muted" });
    try { sessionStorage.setItem(MUTE_KEY, "true"); } catch { /* Optional preference storage. */ }
    releaseAudio("preview");
  }

  update(kind: ReferenceKind, value: number) {
    this.values[kind] = value;
    if (this.snapshot.kind !== kind) return;
    this.publish({ value, ...(kind === "ipod" ? { position: value } : {}) });
    if (kind !== "ipod") this.voice?.update(value, this.snapshot.bypass);
  }

  bypass() {
    const bypass = !this.snapshot.bypass;
    this.publish({ bypass });
    this.voice?.update(this.snapshot.value, bypass);
  }

  seek(position: number) {
    if (this.snapshot.kind !== "ipod") {
      this.publish({ position });
      return;
    }
    this.silence();
    this.publish({ position, value: position });
    void this.start();
  }

  toggleIpod() {
    this.ipodPaused = this.snapshot.kind === "ipod" && this.snapshot.status === "playing";
    this.silence();
    this.publish({ kind: "ipod", value: this.snapshot.position });
    if (this.ipodPaused) {
      this.publish({ status: "paused" });
      releaseAudio("preview");
    } else {
      this.interact();
      void this.start();
    }
  }

  retry() {
    this.silence();
    this.interact();
    void this.start();
  }

  leave(kind: ReferenceKind) {
    if (this.snapshot.kind !== kind) return;
    this.hold();
    this.leaveTimer = window.setTimeout(() => {
      if (this.snapshot.kind === kind) this.stop();
    }, 180);
  }

  hold() {
    clearTimeout(this.leaveTimer);
  }

  prepareRadio() {
    if (this.snapshot.muted || document.hidden) return;
    this.radio ??= new RadioBuffer();
    this.radio.prepare(this.values.braun);
  }

  coolRadio() {
    if (this.snapshot.kind !== "braun") this.radio?.release(180);
  }

  setScrubbing(active: boolean) {
    this.scrubbing = active;
  }

  stop(restoreMusic = true) {
    this.hold();
    this.silence();
    this.publish({ kind: null, status: "idle", message: "" });
    if (restoreMusic) releaseAudio("preview");
  }

  private silence() {
    ++this.revision;
    if (this.voice?.position) {
      const position = this.voice.position();
      if (this.snapshot.kind === "ipod") this.publish({ position });
      if (["guitar", "amplifier", "compressor", "mxr"].includes(this.snapshot.kind ?? "")) this.guitarPosition = position;
    }
    if (!this.voice && this.snapshot.kind === "braun") this.radio?.release();
    this.voice?.stop();
    this.voice = null;
    clearInterval(this.meterTimer);
    this.publish({ level: 0, reduction: 0 });
  }

  private async buffer(url: string) {
    let pending = this.buffers.get(url);
    if (!pending) {
      pending = fetch(url, { signal: AbortSignal.timeout(15000) })
        .then(response => {
          if (!response.ok) throw new Error("Audio file unavailable");
          return response.arrayBuffer();
        })
        .then(bytes => getAudioContext().decodeAudioData(bytes));
      this.buffers.set(url, pending);
      pending.catch(() => { this.buffers.delete(url); });
    }
    return pending;
  }

  private async start() {
    const { kind, muted } = this.snapshot;
    if (!kind) return;
    if (muted || !isAudioReady()) {
      this.publish({ status: muted ? "muted" : "blocked" });
      return;
    }
    if (kind === "ipod" && this.ipodPaused) {
      this.publish({ status: "paused" });
      releaseAudio("preview");
      return;
    }
    const request = ++this.revision;
    claimAudio("preview");
    this.publish({ status: "loading", message: "" });
    const ac = getAudioContext();
    if (!this.analyser) {
      this.analyser = ac.createAnalyser();
      this.analyser.fftSize = this.samples.length;
      this.analyser.connect(ac.destination);
      this.limiter = ac.createDynamicsCompressor();
      this.limiter.threshold.value = -4;
      this.limiter.knee.value = 0;
      this.limiter.ratio.value = 20;
      this.limiter.attack.value = 0.001;
      this.limiter.release.value = 0.12;
      this.limiter.connect(this.analyser);
    }
    try {
      if (kind === "braun") {
        this.radio ??= new RadioBuffer();
        this.voice = radioVoice(ac, this.limiter!, (status, message = "") => {
          if (request === this.revision) this.publish({ status, message });
        }, this.radio);
        this.voice.update(this.snapshot.value, false);
      } else {
        const buffer = await this.buffer(SAMPLE_URLS[kind]);
        if (request !== this.revision) return;
        const offset = kind === "ipod" ? this.snapshot.position : ["guitar", "amplifier", "compressor", "mxr"].includes(kind) ? this.guitarPosition : 0;
        this.voice = sampleVoice(ac, this.limiter!, buffer, kind, this.snapshot.value, this.snapshot.bypass, offset);
        this.publish({ status: "playing" });
      }
      this.meterTimer = window.setInterval(() => {
        if (!this.analyser || !this.voice) return;
        this.analyser.getFloatTimeDomainData(this.samples);
        const rms = Math.sqrt(this.samples.reduce((sum, sample) => sum + sample * sample, 0) / this.samples.length);
        const position = kind === "ipod" && !this.scrubbing ? this.voice.position!() : this.snapshot.position;
        this.publish({ level: rms, reduction: this.voice.reduction?.() ?? 0, position, ...(kind === "ipod" ? { value: position } : {}) });
      }, 100);
    } catch {
      if (request !== this.revision) return;
      this.publish({ status: "error", message: "This sound couldn’t load. Try again." });
      releaseAudio("preview");
    }
  }
}
