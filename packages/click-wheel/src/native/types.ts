import type { StyleProp, ViewStyle } from "react-native";

export interface ClickWheelState {
  /** The current value. */
  value: number;
  /** A finger is holding the ring. */
  dragging: boolean;
  /** The ring is spinning on after a flick, with no finger on it. */
  coasting: boolean;
  /** Whether the wheel is disabled. */
  disabled: boolean;
}

/** A style, or a function of the part's state that returns one. */
export type PartStyle = StyleProp<ViewStyle> | ((state: ClickWheelState) => StyleProp<ViewStyle>);

export function resolveStyle(style: PartStyle | undefined, state: ClickWheelState): StyleProp<ViewStyle> {
  return typeof style === "function" ? style(state) : style;
}
