import * as React from "react";
import { View, type LayoutChangeEvent, type ViewProps } from "react-native";
import { GestureStateManager, usePanGesture } from "react-native-gesture-handler";
import {
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from "react-native-reanimated";
import { ClickWheelContext, type ClickWheelContextValue } from "./context";
import {
  angleAt,
  angularVelocity,
  arcDelta,
  clamp,
  coastStep,
  DEFAULT_DECELERATION_RATE,
  degreesToUnits,
  detentCrossing,
  HUB_DEAD_ZONE,
  MIN_VELOCITY,
  stepValue,
  unitsToDegrees,
} from "../core";
import { haptic } from "./haptics";
import { resolveStyle, type ClickWheelState, type PartStyle } from "./types";

export interface RootProps extends Omit<ViewProps, "style"> {
  /** Controlled value. */
  value?: number;
  /** Starting value when uncontrolled. */
  defaultValue?: number;
  /** Fires on every value change while dragging, coasting or stepping. */
  onValueChange?: (value: number) => void;
  /** Fires once when an interaction ends. With inertia, that is when the wheel settles. */
  onValueCommitted?: (value: number) => void;
  /** Fires when a finger takes hold of the ring and when it lets go. A coast after a flick is not a drag; wait for `onValueCommitted`. */
  onDraggingChange?: (dragging: boolean) => void;
  /** Fires each time the value crosses a detent. */
  onTick?: (direction: 1 | -1) => void;
  min?: number;
  max?: number;
  /** Granularity of emitted values; also the accessibility step. */
  step?: number;
  /** The gearing: how many units one full revolution covers. */
  unitsPerTurn?: number;
  /** Units between detents (haptic tick + onTick). 0 turns detents off. */
  detent?: number;
  /** Tick the Taptic engine on each detent. */
  haptics?: boolean;
  /** Keep spinning after a flick and slow down like an iOS scroll. */
  inertia?: boolean;
  /** Velocity kept per millisecond while coasting. 0.998 is the iOS default; 0.99 stops fast. */
  decelerationRate?: number;
  disabled?: boolean;
  style?: PartStyle;
}

/**
 * A rotary slider. Drag around the ring; one revolution moves the value by
 * `unitsPerTurn`. Gestures and the coast run on the UI thread; React only
 * hears about value changes.
 */
export function Root(props: RootProps) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    onValueCommitted,
    onDraggingChange,
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
    style,
    children,
    ...viewProps
  } = props;

  const [internalValue, setInternalValue] = React.useState(() =>
    clamp(defaultValue ?? min, min, max),
  );
  const value = clamp(valueProp ?? internalValue, min, max);
  const [dragging, setDragging] = React.useState(false);
  const [coasting, setCoasting] = React.useState(false);

  // Everything the UI thread needs lives in shared values.
  const rotation = useSharedValue(0);
  const float = useSharedValue(value);
  const emitted = useSharedValue(value);
  const lastAngle = useSharedValue(0);
  const velocity = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const isCoasting = useSharedValue(false);
  const size = useSharedValue({ width: 0, height: 0 });
  const config = useSharedValue({ min, max, step, unitsPerTurn, detent, inertia, decelerationRate, disabled });
  const fraction = useDerivedValue(() => {
    const c = config.value;
    return c.max > c.min ? (float.value - c.min) / (c.max - c.min) : 0;
  });
  const turns = useDerivedValue(() => {
    const c = config.value;
    return (float.value - c.min) / c.unitsPerTurn;
  });

  React.useEffect(() => {
    config.value = { min, max, step, unitsPerTurn, detent, inertia, decelerationRate, disabled };
  }, [config, min, max, step, unitsPerTurn, detent, inertia, decelerationRate, disabled]);

  // Outside changes to `value` land while the wheel is at rest.
  React.useEffect(() => {
    if (!isDragging.value && !isCoasting.value) {
      float.value = value;
      emitted.value = value;
    }
  }, [value, float, emitted, isDragging, isCoasting]);

  // The JS side of the worklets. Stable identities, latest callbacks.
  const latest = React.useRef({ onValueChange, onValueCommitted, onDraggingChange, onTick, haptics });
  React.useEffect(() => {
    latest.current = { onValueChange, onValueCommitted, onDraggingChange, onTick, haptics };
  });
  const emitJS = React.useCallback((next: number) => {
    setInternalValue(next);
    latest.current.onValueChange?.(next);
  }, []);
  const tickJS = React.useCallback((direction: 1 | -1) => {
    if (latest.current.haptics) haptic();
    latest.current.onTick?.(direction);
  }, []);
  const draggingJS = React.useCallback((next: boolean) => {
    setDragging(next);
    latest.current.onDraggingChange?.(next);
  }, []);
  const commitJS = React.useCallback(() => {
    latest.current.onValueCommitted?.(emitted.value);
  }, [emitted]);
  const settleJS = React.useCallback(() => {
    draggingJS(false);
    setCoasting(false);
    commitJS();
  }, [draggingJS, commitJS]);

  // Every rotation change, from a finger, a coast or a step, moves the value here.
  useAnimatedReaction(
    () => rotation.value,
    (current, previous) => {
      if (previous === null || current === previous) return;
      const c = config.value;
      const prev = float.value;
      const next = clamp(prev + degreesToUnits(current - previous, c.unitsPerTurn), c.min, c.max);
      float.value = next;
      const direction = detentCrossing(prev, next, c.min, c.detent);
      if (direction !== 0) runOnJS(tickJS)(direction);
      const stepped = stepValue(next, c.min, c.max, c.step);
      if (stepped !== emitted.value) {
        emitted.value = stepped;
        runOnJS(emitJS)(stepped);
      }
    },
    [tickJS, emitJS],
  );

  // The coast: the same exponential decay as the web, one frame at a time.
  const coastRef = React.useRef<{ setActive: (active: boolean) => void } | null>(null);
  const stopCoastJS = React.useCallback(() => {
    coastRef.current?.setActive(false);
    settleJS();
  }, [settleJS]);
  const startCoastJS = React.useCallback((omega: number) => {
    velocity.value = omega;
    setCoasting(true);
    coastRef.current?.setActive(true);
  }, [velocity]);
  const cancelCoastJS = React.useCallback(() => {
    coastRef.current?.setActive(false);
    setCoasting(false);
  }, []);
  const coast = useFrameCallback((frame) => {
    "worklet";
    if (velocity.value === 0) return; // a finger grabbed the wheel; deactivation is on its way
    const c = config.value;
    const dt = Math.min(frame.timeSincePreviousFrame ?? 16, 64);
    const next = coastStep(velocity.value, dt, c.decelerationRate);
    velocity.value = next.velocity;
    rotation.value += next.delta;
    const atEnd =
      (float.value <= c.min && next.velocity < 0) || (float.value >= c.max && next.velocity > 0);
    if (Math.abs(next.velocity) < MIN_VELOCITY || atEnd || c.disabled) {
      velocity.value = 0;
      isCoasting.value = false;
      runOnJS(stopCoastJS)();
    }
  }, false);
  React.useEffect(() => {
    coastRef.current = coast;
  }, [coast]);

  const pan = usePanGesture({
    minDistance: 0,
    enabled: !disabled,
    onTouchesDown: (e) => {
      "worklet";
      // The angle is unstable right at the hub; let those touches go.
      const touch = e.allTouches[0];
      const { width, height } = size.value;
      if (!touch || width === 0) return;
      const r = Math.hypot(touch.x - width / 2, touch.y - height / 2);
      if (r < Math.min(width, height) * HUB_DEAD_ZONE) GestureStateManager.fail(e.handlerTag);
    },
    onBegin: (e) => {
      "worklet";
      const { width, height } = size.value;
      if (Math.hypot(e.x - width / 2, e.y - height / 2) < Math.min(width, height) * HUB_DEAD_ZONE) return;
      lastAngle.value = angleAt(width / 2, height / 2, e.x, e.y);
      // A touch grabs a spinning wheel: its momentum is gone, a finger is on it.
      if (velocity.value !== 0) {
        velocity.value = 0;
        isCoasting.value = false;
        runOnJS(cancelCoastJS)();
      }
      if (!isDragging.value) {
        isDragging.value = true;
        runOnJS(draggingJS)(true);
      }
    },
    onUpdate: (e) => {
      "worklet";
      const { width, height } = size.value;
      const angle = angleAt(width / 2, height / 2, e.x, e.y);
      const delta = arcDelta(lastAngle.value, angle);
      lastAngle.value = angle;
      rotation.value += delta;
    },
    onDeactivate: (e) => {
      "worklet";
      if (!isDragging.value) return;
      const c = config.value;
      const { width, height } = size.value;
      // Points per second from the gesture, points per millisecond for the math.
      const omega =
        c.inertia && !c.disabled && !e.canceled
          ? angularVelocity(e.x - width / 2, e.y - height / 2, e.velocityX / 1000, e.velocityY / 1000)
          : 0;
      isDragging.value = false;
      if (Math.abs(omega) >= MIN_VELOCITY) {
        velocity.value = omega; // set here so onFinalize knows a coast is on
        isCoasting.value = true;
        runOnJS(draggingJS)(false); // the finger is off; the wheel coasts until it settles
        runOnJS(startCoastJS)(omega);
        return;
      }
      runOnJS(settleJS)();
    },
    onFinalize: () => {
      "worklet";
      // A gesture that ended before it activated still needs to let go.
      if (!isDragging.value || velocity.value !== 0) return;
      isDragging.value = false;
      runOnJS(settleJS)();
    },
  });

  const onRingLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      size.value = { width, height };
    },
    [size],
  );

  /** Move the value by whole units, for accessibility actions and your own buttons. */
  const nudge = React.useCallback(
    (units: number) => {
      if (config.value.disabled) return;
      const degrees = unitsToDegrees(units, config.value.unitsPerTurn);
      runOnUI(() => {
        "worklet";
        rotation.value += degrees;
        runOnJS(commitJS)();
      })();
    },
    [config, rotation, commitJS],
  );

  const state: ClickWheelState = { value, dragging, coasting, disabled };
  const context: ClickWheelContextValue = {
    state,
    min,
    max,
    step,
    rotation,
    fraction,
    turns,
    pan,
    onRingLayout,
    nudge,
  };

  return (
    <ClickWheelContext.Provider value={context}>
      <View style={resolveStyle(style, state)} {...viewProps}>
        {children}
      </View>
    </ClickWheelContext.Provider>
  );
}
