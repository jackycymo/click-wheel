"use client";

import * as React from "react";
import { ClickWheelContext, type ClickWheelContextValue, type ClickWheelState } from "./context";
import { haptic } from "./haptics";
import { renderPart, useMergedRefs, type PartProps } from "./render";

export interface RootProps extends Omit<PartProps<ClickWheelState, "div">, "defaultValue"> {
  /** Controlled value. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Fires on every value change while turning, scrolling or keying. */
  onValueChange?: (value: number) => void;
  /** Fires once when an interaction ends. */
  onValueCommitted?: (value: number) => void;
  /** Fires when a pointer starts or stops turning the ring. */
  onTurningChange?: (turning: boolean) => void;
  /** Fires each time the value crosses a detent. */
  onTick?: (direction: 1 | -1) => void;
  min?: number;
  max?: number;
  /** Granularity of emitted values; also the arrow-key step. */
  step?: number;
  /** The gearing: how many units one full revolution covers. */
  unitsPerTurn?: number;
  /** Units between detents (haptic pulse + onTick). 0 turns detents off. */
  detent?: number;
  /** Pulse the haptic motor on each detent, where the platform supports it. */
  haptics?: boolean;
  disabled?: boolean;
  /** Renders a hidden input with this name, for forms. */
  name?: string;
}

const DEG = 180 / Math.PI;
/** How far a scroll gesture turns the ring: 900px of scrolling is one revolution. */
const WHEEL_DEG_PER_PX = 0.4;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * A rotary slider. Drag around the ring; one revolution moves the value by
 * `unitsPerTurn`, so range and precision are set by gearing instead of by
 * how many pixels of screen the control happens to span.
 */
export function Root(props: RootProps) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    onValueCommitted,
    onTurningChange,
    onTick,
    min = 0,
    max = 100,
    step = 1,
    unitsPerTurn = 100,
    detent = 0,
    haptics = true,
    disabled = false,
    name,
    children,
    ref: refProp,
    ...rest
  } = props;

  const [internalValue, setInternalValue] = React.useState(() =>
    clamp(defaultValue ?? min, min, max),
  );
  const value = clamp(valueProp ?? internalValue, min, max);
  const [turning, setTurning] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLElement>(null);
  const centerRef = React.useRef<HTMLElement>(null);
  const mergedRootRef = useMergedRefs(rootRef, refProp);

  // Gesture state lives outside React: pointermove must not wait for renders.
  const g = React.useRef({
    pointerId: -1,
    cx: 0,
    cy: 0,
    lastAngle: 0,
    float: 0,
    rotation: 0,
    emitted: NaN,
    wheeling: false,
    wheelTimer: 0,
  });

  const emit = (raw: number, commit: boolean) => {
    const stepped = Math.round((raw - min) / step) * step + min;
    const next = Number(clamp(stepped, min, max).toFixed(6));
    if (next !== g.current.emitted) {
      g.current.emitted = next;
      setInternalValue(next);
      onValueChange?.(next);
    }
    if (commit) onValueCommitted?.(next);
  };

  const spin = (deltaDeg: number) => {
    g.current.rotation += deltaDeg;
    rootRef.current?.style.setProperty("--click-wheel-rotation", `${g.current.rotation}deg`);
  };

  const crossDetents = (prev: number, next: number) => {
    if (detent <= 0 || prev === next) return;
    const from = Math.floor((prev - min) / detent);
    const to = Math.floor((next - min) / detent);
    if (from === to) return;
    if (haptics) haptic();
    onTick?.(to > from ? 1 : -1);
  };

  /** Turn the ring by an angle: rotate the rotor, move the value, tick detents. */
  const turnBy = (deltaDeg: number) => {
    spin(deltaDeg);
    const prev = g.current.float;
    const next = clamp(prev + (deltaDeg / 360) * unitsPerTurn, min, max);
    g.current.float = next;
    crossDetents(prev, next);
    emit(next, false);
  };

  /** Move the value by whole units: keyboard and programmatic steps. */
  const nudge = (deltaUnits: number) => {
    g.current.float = value;
    g.current.emitted = value;
    spin((deltaUnits / unitsPerTurn) * 360);
    const next = clamp(value + deltaUnits, min, max);
    crossDetents(value, next);
    emit(next, true);
  };

  const angleOf = (e: { clientX: number; clientY: number }) =>
    Math.atan2(e.clientY - g.current.cy, e.clientX - g.current.cx) * DEG;

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || g.current.pointerId !== -1 || e.button !== 0) return;
    const ring = ringRef.current;
    if (!ring) return;
    if (centerRef.current?.contains(e.target as Node)) return;
    const rect = ring.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // The angle is unstable right at the hub; ignore presses there.
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < Math.min(rect.width, rect.height) * 0.05) {
      return;
    }
    e.preventDefault();
    ring.setPointerCapture(e.pointerId);
    ring.focus({ preventScroll: true });
    Object.assign(g.current, {
      pointerId: e.pointerId,
      cx,
      cy,
      float: value,
      emitted: value,
    });
    g.current.lastAngle = angleOf(e);
    setTurning(true);
    onTurningChange?.(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (g.current.pointerId !== e.pointerId) return;
    const angle = angleOf(e);
    const delta = ((angle - g.current.lastAngle + 540) % 360) - 180; // shortest signed arc
    g.current.lastAngle = angle;
    turnBy(delta);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (g.current.pointerId !== e.pointerId) return;
    g.current.pointerId = -1;
    setTurning(false);
    onTurningChange?.(false);
    emit(g.current.float, true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const page = Math.max(step, unitsPerTurn / 6);
    let deltaUnits: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") deltaUnits = step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") deltaUnits = -step;
    else if (e.key === "PageUp") deltaUnits = page;
    else if (e.key === "PageDown") deltaUnits = -page;
    else if (e.key === "Home") deltaUnits = min - value;
    else if (e.key === "End") deltaUnits = max - value;
    if (deltaUnits === null) return;
    e.preventDefault();
    nudge(deltaUnits);
  };

  // A scroll gesture over the wheel turns it. Listens on the root so the
  // center is covered too; non-passive so the page does not scroll.
  const onWheel = React.useEffectEvent((e: WheelEvent) => {
    if (disabled) return;
    e.preventDefault();
    const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    const px = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : -e.deltaY) * scale;
    if (!g.current.wheeling) {
      g.current.wheeling = true;
      if (g.current.pointerId === -1) {
        g.current.float = value;
        g.current.emitted = value;
      }
    }
    turnBy(px * WHEEL_DEG_PER_PX);
    window.clearTimeout(g.current.wheelTimer);
    g.current.wheelTimer = window.setTimeout(() => {
      g.current.wheeling = false;
      if (g.current.pointerId === -1) emit(g.current.float, true);
    }, 150);
  });

  React.useEffect(() => {
    const root = rootRef.current;
    const gesture = g.current;
    if (!root) return;
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      window.clearTimeout(gesture.wheelTimer);
    };
  }, []);

  const state: ClickWheelState = { value, turning, disabled };
  const context: ClickWheelContextValue = {
    state,
    min,
    max,
    ringRef,
    centerRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onKeyDown,
  };
  const fraction = max > min ? (value - min) / (max - min) : 0;

  return (
    <ClickWheelContext.Provider value={context}>
      {renderPart(
        "div",
        state,
        {
          ...rest,
          children: (
            <>
              {children}
              {name ? <input type="hidden" name={name} value={value} /> : null}
            </>
          ),
        },
        {
          ref: mergedRootRef,
          "data-turning": turning ? "" : undefined,
          "data-disabled": disabled ? "" : undefined,
          style: { "--click-wheel-fraction": fraction } as React.CSSProperties,
        },
      )}
    </ClickWheelContext.Provider>
  );
}
