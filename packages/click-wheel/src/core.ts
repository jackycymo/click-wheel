"worklet";

/*
  Pure math shared by the web and React Native versions. No imports, no DOM.
  The "worklet" directive lets React Native run these on the UI thread; it is
  inert everywhere else.
*/

export const DEG = 180 / Math.PI;
/** How far a scroll gesture turns the ring: 900px of scrolling is one revolution. */
export const WHEEL_DEG_PER_PX = 0.4;
/** Pointer samples younger than this feed the release velocity. */
export const VELOCITY_WINDOW_MS = 100;
/** A finger that paused this long before lifting does not flick. */
export const RELEASE_PAUSE_MS = 60;
/** Below this the coast is over, in degrees per millisecond. */
export const MIN_VELOCITY = 0.02;
/** Velocity kept per millisecond while coasting; the iOS default. */
export const DEFAULT_DECELERATION_RATE = 0.998;
/** Presses closer to the hub than this fraction of the size are ignored: the angle is unstable there. */
export const HUB_DEAD_ZONE = 0.05;

export interface Sample {
  t: number;
  rotation: number;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Angle of a point around a center, in degrees. */
export function angleAt(cx: number, cy: number, x: number, y: number): number {
  return Math.atan2(y - cy, x - cx) * DEG;
}

/** Shortest signed arc from one angle to another, in degrees. */
export function arcDelta(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

export function degreesToUnits(deg: number, unitsPerTurn: number): number {
  return (deg / 360) * unitsPerTurn;
}

export function unitsToDegrees(units: number, unitsPerTurn: number): number {
  return (units / unitsPerTurn) * 360;
}

/** Snap a raw value to the step grid and the bounds. */
export function stepValue(raw: number, min: number, max: number, step: number): number {
  const stepped = Math.round((raw - min) / step) * step + min;
  return Number(clamp(stepped, min, max).toFixed(6));
}

/** 1 or -1 when moving from `prev` to `next` crosses a detent, else 0. */
export function detentCrossing(prev: number, next: number, min: number, detent: number): 1 | -1 | 0 {
  if (detent <= 0 || prev === next) return 0;
  const from = Math.floor((prev - min) / detent);
  const to = Math.floor((next - min) / detent);
  if (from === to) return 0;
  return to > from ? 1 : -1;
}

/**
 * One frame of coasting under exponential decay: the distance covered in
 * `dt` milliseconds, integrated exactly, and the velocity left afterwards.
 */
export function coastStep(
  velocity: number,
  dt: number,
  decelerationRate: number,
): { delta: number; velocity: number } {
  const keep = Math.pow(decelerationRate, dt);
  const delta = (velocity * (1 - keep)) / -Math.log(decelerationRate);
  return { delta, velocity: velocity * keep };
}

/** Angular velocity at release, in degrees per millisecond, from recent samples. */
export function releaseVelocity(samples: Sample[], now: number): number {
  const last = samples[samples.length - 1];
  const first = samples[0];
  if (!last || !first || last === first || now - last.t > RELEASE_PAUSE_MS) return 0;
  const dt = last.t - first.t;
  return dt > 0 ? (last.rotation - first.rotation) / dt : 0;
}

/**
 * Angular velocity, in degrees per millisecond, of a point at offset
 * (rx, ry) from the center moving at (vx, vy) pixels per millisecond.
 */
export function angularVelocity(rx: number, ry: number, vx: number, vy: number): number {
  const r2 = rx * rx + ry * ry;
  if (r2 === 0) return 0;
  return ((rx * vy - ry * vx) / r2) * DEG;
}

export interface KeyContext {
  value: number;
  min: number;
  max: number;
  step: number;
  unitsPerTurn: number;
}

/** The change in units a keyboard key asks for, or null for keys the wheel ignores. */
export function keyDelta(key: string, ctx: KeyContext): number | null {
  const page = Math.max(ctx.step, ctx.unitsPerTurn / 6);
  if (key === "ArrowRight" || key === "ArrowUp") return ctx.step;
  if (key === "ArrowLeft" || key === "ArrowDown") return -ctx.step;
  if (key === "PageUp") return page;
  if (key === "PageDown") return -page;
  if (key === "Home") return ctx.min - ctx.value;
  if (key === "End") return ctx.max - ctx.value;
  return null;
}
