import * as React from "react";
import type { LayoutChangeEvent } from "react-native";
import type { PanGesture } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import type { ClickWheelState } from "./types";

export interface ClickWheelContextValue {
  state: ClickWheelState;
  min: number;
  max: number;
  step: number;
  /** Cumulative rotor angle in degrees. Read it in `useAnimatedStyle`. */
  rotation: SharedValue<number>;
  /** The value as a number from 0 to 1. Read it in `useAnimatedStyle`. */
  fraction: SharedValue<number>;
  /** The value's distance from `min` in revolutions: 1.5 is one and a half turns. */
  turns: SharedValue<number>;
  pan: PanGesture;
  onRingLayout: (event: LayoutChangeEvent) => void;
  nudge: (units: number) => void;
}

export const ClickWheelContext = React.createContext<ClickWheelContextValue | null>(null);

export function useClickWheelContext(part: string): ClickWheelContextValue {
  const ctx = React.useContext(ClickWheelContext);
  if (!ctx) throw new Error(`ClickWheel.${part} must be rendered inside ClickWheel.Root.`);
  return ctx;
}

/**
 * The wheel from any descendant: `state` for styles, `rotation` and
 * `fraction` as shared values for your own Reanimated styles. The native
 * equivalent of the web's data attributes and CSS variables.
 */
export function useClickWheel() {
  const { state, rotation, fraction, turns } = useClickWheelContext("useClickWheel");
  return { state, rotation, fraction, turns };
}
