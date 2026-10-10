export type ReferenceKind = "braun" | "sculptor" | "amplifier" | "guitar" | "fellow" | "compressor" | "espresso" | "ipod" | "mxr";

export const settings = {
  braun: { sweep: -151, label: "Braun world radio tuning", min: 0, max: 100, step: 0.1, initial: 44.4, unit: "", name: "Braun SK2" },
  sculptor: { sweep: -340, label: "Timemore grind size", min: 0, max: 18, step: 0.1, initial: 8, unit: "grind", name: "Timemore Sculptor" },
  amplifier: { sweep: 300, label: "Fender amplifier volume", min: 1, max: 10, step: 0.1, initial: 3, unit: "volume", name: "Fender Deluxe Reverb" },
  guitar: { sweep: 300, label: "Stratocaster volume", min: 0, max: 10, step: 0.1, initial: 5, unit: "volume", name: "Fender Stratocaster" },
  fellow: { sweep: 270, label: "Fellow kettle temperature", min: 40, max: 100, step: 1, initial: 92, unit: "°C", name: "Fellow Stagg EKG" },
  compressor: { sweep: -270, label: "1176 input attenuation", min: 0, max: 48, step: 1, initial: 24, unit: "dB attenuation", name: "Universal Audio 1176LN" },
  espresso: { sweep: 270, label: "La Marzocco steam valve", min: 0, max: 100, step: 1, initial: 0, unit: "% steam", name: "La Marzocco Linea Micra" },
  ipod: { sweep: 270, label: "iPod playback position", min: 0, max: 192, step: 1, initial: 42, unit: "", name: "Apple iPod" },
  mxr: { sweep: 270, label: "MXR phase speed", min: 0, max: 100, step: 1, initial: 50, unit: "% speed", name: "MXR Phase 90" },
} as const;

// Positions are a curated world dial, not terrestrial broadcast frequencies.
export const RADIO_STATIONS = [
  { position: 0, name: "NTS 1", place: "London", url: "https://audio-edge-jfbmv.sin.d.radiomast.io/nts1", homepage: "https://www.nts.live/" },
  { position: 14.8, name: "FIP", place: "Paris", url: "https://icecast.radiofrance.fr/fip-hifi.aac", homepage: "https://www.radiofrance.fr/fip" },
  { position: 29.6, name: "Radio Swiss Jazz", place: "Switzerland", url: "https://livestreaming-node-2.srg-ssr.ch/srgssr/rsj/mp3/128", homepage: "https://www.radioswissjazz.ch/" },
  { position: 44.4, name: "RTHK Radio 1", place: "Hong Kong", url: "https://stm.rthk.hk/radio1", homepage: "https://www.rthk.hk/radio/radio1" },
  { position: 59.2, name: "Jazz Sakura", place: "Japan", url: "https://kathy.torontocast.com:3330/;", homepage: "https://asiadreamradio.torontocast.stream/stations/en/index.html" },
  { position: 74, name: "Triple R", place: "Melbourne", url: "https://realtime.rrr.org.au/p1h", homepage: "https://www.rrr.org.au/" },
  { position: 88.8, name: "KEXP", place: "Seattle", url: "https://kexp.streamguys1.com/kexp160.aac", homepage: "https://www.kexp.org/" },
  { position: 100, name: "Radio Paradise", place: "United States", url: "https://stream.radioparadise.com/aac-128", homepage: "https://radioparadise.com/" },
] as const;

export function radioTuning(value: number) {
  const station = RADIO_STATIONS.reduce((nearest, current) => Math.abs(current.position - value) < Math.abs(nearest.position - value) ? current : nearest);
  const strength = Math.max(0, 1 - Math.abs(station.position - value) / 5);
  return { station, strength };
}

export const phaseRate = (value: number) => 0.15 * Math.pow(40, value / 100);

export function formatValue(kind: ReferenceKind, value: number) {
  if (kind === "braun") {
    const { station, strength } = radioTuning(value);
    return strength > 0 ? `${station.place} · ${station.name}` : "Between stations";
  }
  if (kind === "ipod") return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  if (kind === "mxr") return `${phaseRate(value).toFixed(2)} Hz sweep`;
  if (kind === "espresso" && value === 0) return "Valve closed";
  return `${Number(value.toFixed(1))}${kind === "fellow" ? "" : " "}${settings[kind].unit}`;
}

export const SOUND_CREDITS = [
  { name: "funk guitar riff", author: "mareproduction", url: "https://freesound.org/people/mareproduction/sounds/188088/", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  { name: "grinding coffee 5", author: "casadalenha", url: "https://freesound.org/people/casadalenha/sounds/723041/", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0/" },
  { name: "Coffee machine expelling steam", author: "nickmaysoundmusic", url: "https://freesound.org/people/nickmaysoundmusic/sounds/503557/", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
  { name: "Kettle Boil", author: "OwlStorm / Ashe Kirk", url: "https://freesound.org/people/OwlStorm/sounds/212179/", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/" },
];
