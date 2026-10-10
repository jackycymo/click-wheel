import { getRadioMedia, isAudioReady, RADIO_BUFFER_SIZE } from "./audio";
import { RADIO_STATIONS, radioTuning } from "./reference-data";

type Station = (typeof RADIO_STATIONS)[number];
interface RadioSlot {
  audio: HTMLAudioElement;
  media: MediaElementAudioSourceNode;
  station: Station | null;
  ready: boolean;
  error: "blocked" | "unavailable" | null;
  generation: number;
  timeout: number;
}

// Keep live decoders rolling silently, rather than replacing the audible stream
// on every turn. Only the current station and its neighbors use connections.
export class RadioBuffer {
  readonly slots: RadioSlot[];
  private listeners = new Set<() => void>();
  private active = false;
  private idleTimer = 0;
  private disposed = false;
  private selected: Station | null = null;
  private neighborTimer = 0;

  constructor() {
    this.slots = Array.from({ length: RADIO_BUFFER_SIZE }, (_, index) => {
      const { audio, media } = getRadioMedia(index);
      const slot: RadioSlot = { audio, media, station: null, ready: false, error: null, generation: 0, timeout: 0 };
      const current = () => !this.disposed && slot.station?.url === audio.currentSrc;
      audio.onplaying = () => {
        if (!current() || audio.paused || audio.readyState < 3) return;
        slot.ready = true;
        slot.error = null;
        clearTimeout(slot.timeout);
        this.emit();
      };
      audio.oncanplay = () => { if (current()) this.resumeSlot(slot); };
      audio.onwaiting = () => {
        if (!current()) return;
        slot.ready = false;
        this.armTimeout(slot);
        this.emit();
      };
      audio.onerror = audio.onended = () => { if (current()) this.fail(slot, "unavailable"); };
      return slot;
    });
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }

  private emit() { this.listeners.forEach(listener => listener()); }

  prepare(value: number) {
    if (this.disposed) return;
    const selected = RADIO_STATIONS.indexOf(radioTuning(value).station);
    const wanted = RADIO_STATIONS.slice(Math.max(0, selected - 1), selected + 2);
    const station = RADIO_STATIONS[selected];
    this.ensureStation(station, wanted);
    if (this.selected !== station || !this.active) {
      this.selected = station;
      clearTimeout(this.neighborTimer);
      // Preserve the last neighboring buffer during a brief reversal. The
      // selected station is never delayed; only speculative eviction waits.
      if (this.active) this.neighborTimer = window.setTimeout(() => this.prepareNeighbors(wanted), 250);
      else this.prepareNeighbors(wanted);
    }
    this.resume();
    if (!this.active) this.release();
    this.emit();
  }

  private ensureStation(station: Station, wanted: readonly Station[]) {
    let slot = this.slots.find(candidate => candidate.station === station);
    if (slot && !slot.error) return;
    slot ??= this.slots.find(candidate => !candidate.station || !wanted.includes(candidate.station))!;
    this.clearSlot(slot);
    slot.station = station;
    slot.audio.dataset.radioStation = station.name;
    slot.audio.preload = "auto";
    slot.audio.src = station.url;
    slot.audio.load();
  }

  private prepareNeighbors(wanted: readonly Station[]) {
    wanted.forEach(station => this.ensureStation(station, wanted));
    for (const slot of this.slots) {
      if (slot.station && !wanted.includes(slot.station)) this.clearSlot(slot);
    }
    this.resume();
    this.emit();
  }

  resume() {
    if (this.disposed || !isAudioReady()) return;
    this.slots.forEach(slot => this.resumeSlot(slot));
  }

  private resumeSlot(slot: RadioSlot) {
    if (!slot.station || slot.error || !isAudioReady() || !slot.audio.paused) return;
    const generation = slot.generation;
    this.armTimeout(slot);
    void slot.audio.play().catch(error => {
      if (this.disposed || generation !== slot.generation || error?.name === "AbortError") return;
      this.fail(slot, error?.name === "NotAllowedError" ? "blocked" : "unavailable");
    });
  }

  private armTimeout(slot: RadioSlot) {
    clearTimeout(slot.timeout);
    slot.timeout = window.setTimeout(() => this.fail(slot, "unavailable"), 12000);
  }

  private fail(slot: RadioSlot, error: RadioSlot["error"]) {
    slot.ready = false;
    slot.error = error;
    slot.audio.pause();
    clearTimeout(slot.timeout);
    this.emit();
  }

  retain() {
    this.active = true;
    clearTimeout(this.idleTimer);
  }

  release(delay = 15000) {
    this.active = false;
    clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => this.cool(), delay);
  }

  private clearSlot(slot: RadioSlot) {
    ++slot.generation;
    clearTimeout(slot.timeout);
    slot.station = null;
    slot.ready = false;
    slot.error = null;
    slot.audio.pause();
    slot.audio.removeAttribute("src");
    delete slot.audio.dataset.radioStation;
    slot.audio.preload = "none";
    slot.audio.load();
  }

  cool() {
    clearTimeout(this.idleTimer);
    clearTimeout(this.neighborTimer);
    this.selected = null;
    this.slots.forEach(slot => this.clearSlot(slot));
    this.emit();
  }

  dispose() {
    this.disposed = true;
    this.listeners.clear();
    this.cool();
    for (const { audio } of this.slots) audio.onplaying = audio.oncanplay = audio.onwaiting = audio.onerror = audio.onended = null;
  }
}
