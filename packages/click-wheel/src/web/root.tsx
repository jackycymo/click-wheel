"use client";

import * as React from "react";
import { ClickWheelContext, type ClickWheelContextValue, type ClickWheelState } from "./context";
import {
  angleAt,
  arcDelta,
  clamp,
  coastStep,
  DEFAULT_DECELERATION_RATE,
  degreesToUnits,
  detentCrossing,
  HUB_DEAD_ZONE,
  keyDelta,
  MIN_VELOCITY,
  releaseVelocity,
  type Sample,
  stepValue,
  unitsToDegrees,
  VELOCITY_WINDOW_MS,
  WHEEL_DEG_PER_PX,
} from "../core";
import { haptic } from "./haptics";
import { renderPart, useMergedRefs, type PartProps } from "./render";

export interface RootProps extends Omit<PartProps<ClickWheelState, "div">, "defaultValue"> {
  /** Controlled value. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Fires on every value change while turning, coasting, scrolling or keying. */
  onValueChange?: (value: number) => void;
  /** Fires once when an interaction ends. With inertia, that is when the wheel settles. */
  onValueCommitted?: (value: number) => void;
  /** Fires when the ring starts turning and when it stops, including the coast after a flick. */
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
  /** Keep spinning after a flick and slow down like an iOS scroll. */
  inertia?: boolean;
  /** Velocity kept per millisecond while coasting. 0.998 is iOS normal; 0.99 stops fast. */
  decelerationRate?: number;
  disabled?: boolean;
  /** Renders a hidden input with this name, for forms. */
  name?: string;
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
    inertia = false,
    decelerationRate = DEFAULT_DECELERATION_RATE,
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
    turning: false,
    wheeling: false,
    wheelTimer: 0,
    samples: [] as Sample[],
    velocity: 0,
    frame: 0,
    lastFrame: 0,
  });

  // Handlers and the coast loop read props from here, so a frame that runs
  // between renders never sees stale gearing or callbacks.
  const propsSnapshot = {
    value,
    min,
    max,
    step,
    unitsPerTurn,
    detent,
    haptics,
    inertia,
    decelerationRate,
    disabled,
    onValueChange,
    onValueCommitted,
    onTurningChange,
    onTick,
  };
  const latest = React.useRef(propsSnapshot);
  React.useEffect(() => {
    latest.current = propsSnapshot;
  });

  const emit = (raw: number, commit: boolean) => {
    const L = latest.current;
    const next = stepValue(raw, L.min, L.max, L.step);
    if (next !== g.current.emitted) {
      g.current.emitted = next;
      setInternalValue(next);
      L.onValueChange?.(next);
    }
    if (commit) L.onValueCommitted?.(next);
  };

  const spin = (deltaDeg: number) => {
    g.current.rotation += deltaDeg;
    rootRef.current?.style.setProperty("--click-wheel-rotation", `${g.current.rotation}deg`);
  };

  const crossDetents = (prev: number, next: number) => {
    const L = latest.current;
    const direction = detentCrossing(prev, next, L.min, L.detent);
    if (direction === 0) return;
    if (L.haptics) haptic();
    L.onTick?.(direction);
  };

  /** Turn the ring by an angle: rotate the rotor, move the value, tick detents. */
  const turnBy = (deltaDeg: number) => {
    const L = latest.current;
    spin(deltaDeg);
    const prev = g.current.float;
    const next = clamp(prev + degreesToUnits(deltaDeg, L.unitsPerTurn), L.min, L.max);
    g.current.float = next;
    crossDetents(prev, next);
    emit(next, false);
  };

  const startTurning = () => {
    if (g.current.turning) return;
    g.current.turning = true;
    setTurning(true);
    latest.current.onTurningChange?.(true);
  };

  /** The interaction is over: the pointer lifted with no flick, or the coast ran out. */
  const settle = () => {
    g.current.velocity = 0;
    g.current.turning = false;
    setTurning(false);
    latest.current.onTurningChange?.(false);
    emit(g.current.float, true);
  };

  const cancelCoast = () => {
    if (!g.current.frame) return;
    cancelAnimationFrame(g.current.frame);
    g.current.frame = 0;
    g.current.velocity = 0;
  };

  /** Stop a coast from the outside (scroll, keys): the wheel settles where it is. */
  const interrupt = () => {
    if (!g.current.frame) return;
    cancelCoast();
    settle();
  };

  /** Spin on with `velocity` in degrees per millisecond, losing speed like an iOS scroll. */
  const coast = (velocity: number, startedAt: number) => {
    g.current.velocity = velocity;
    g.current.lastFrame = startedAt;
    const frame = (now: number) => {
      const L = latest.current;
      const s = g.current;
      const dt = Math.min(now - s.lastFrame, 64);
      s.lastFrame = now;
      const stepped = coastStep(s.velocity, dt, L.decelerationRate);
      s.velocity = stepped.velocity;
      turnBy(stepped.delta);
      const atEnd = (s.float <= L.min && s.velocity < 0) || (s.float >= L.max && s.velocity > 0);
      if (Math.abs(s.velocity) < MIN_VELOCITY || atEnd || L.disabled) {
        s.frame = 0;
        settle();
        return;
      }
      s.frame = requestAnimationFrame(frame);
    };
    g.current.frame = requestAnimationFrame(frame);
  };

  /** Move the value by whole units: keyboard and programmatic steps. */
  const nudge = (deltaUnits: number) => {
    const L = latest.current;
    interrupt();
    g.current.float = L.value;
    g.current.emitted = L.value;
    spin(unitsToDegrees(deltaUnits, L.unitsPerTurn));
    const next = clamp(L.value + deltaUnits, L.min, L.max);
    crossDetents(L.value, next);
    emit(next, true);
  };

  const angleOf = (e: { clientX: number; clientY: number }) =>
    angleAt(g.current.cx, g.current.cy, e.clientX, e.clientY);

  const onPointerDown = (e: React.PointerEvent) => {
    const L = latest.current;
    if (L.disabled || g.current.pointerId !== -1 || e.button !== 0) return;
    const ring = ringRef.current;
    if (!ring) return;
    if (centerRef.current?.contains(e.target as Node)) return;
    const rect = ring.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // The angle is unstable right at the hub; ignore presses there.
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < Math.min(rect.width, rect.height) * HUB_DEAD_ZONE) {
      return;
    }
    e.preventDefault();
    try {
      ring.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic events in tests carry ids the browser does not know.
    }
    ring.focus({ preventScroll: true });
    // A touch grabs a spinning wheel: keep its momentum out, keep `turning` on.
    const wasCoasting = Boolean(g.current.frame);
    cancelCoast();
    Object.assign(g.current, {
      pointerId: e.pointerId,
      cx,
      cy,
      float: wasCoasting ? g.current.float : L.value,
      emitted: wasCoasting ? g.current.emitted : L.value,
    });
    g.current.lastAngle = angleOf(e);
    g.current.samples = [{ t: e.timeStamp, rotation: g.current.rotation }];
    startTurning();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (g.current.pointerId !== e.pointerId) return;
    const angle = angleOf(e);
    const delta = arcDelta(g.current.lastAngle, angle);
    g.current.lastAngle = angle;
    turnBy(delta);
    const samples = g.current.samples;
    samples.push({ t: e.timeStamp, rotation: g.current.rotation });
    while (samples.length > 1 && e.timeStamp - samples[0].t > VELOCITY_WINDOW_MS) samples.shift();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (g.current.pointerId !== e.pointerId) return;
    g.current.pointerId = -1;
    const L = latest.current;
    const velocity = L.inertia && !L.disabled ? releaseVelocity(g.current.samples, e.timeStamp) : 0;
    if (Math.abs(velocity) >= MIN_VELOCITY) {
      coast(velocity, e.timeStamp); // `turning` stays on until the wheel settles
      return;
    }
    settle();
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (g.current.pointerId !== e.pointerId) return;
    g.current.pointerId = -1;
    settle();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const L = latest.current;
    if (L.disabled) return;
    const deltaUnits = keyDelta(e.key, L);
    if (deltaUnits === null) return;
    e.preventDefault();
    nudge(deltaUnits);
  };

  // A scroll gesture over the wheel turns it. Listens on the root so the
  // center is covered too; non-passive so the page does not scroll.
  const onWheel = React.useEffectEvent((e: WheelEvent) => {
    const L = latest.current;
    if (L.disabled) return;
    e.preventDefault();
    interrupt();
    const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    const px = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : -e.deltaY) * scale;
    if (!g.current.wheeling) {
      g.current.wheeling = true;
      if (g.current.pointerId === -1) {
        g.current.float = L.value;
        g.current.emitted = L.value;
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
      if (gesture.frame) cancelAnimationFrame(gesture.frame);
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
    onPointerCancel,
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
