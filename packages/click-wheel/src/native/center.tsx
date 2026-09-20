import * as React from "react";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { useClickWheelContext } from "./context";
import type { ClickWheelState } from "./types";

export interface CenterProps extends Omit<PressableProps, "style" | "disabled"> {
  /** A style, or a function of the wheel's state plus `pressed`. */
  style?: StyleProp<ViewStyle> | ((state: ClickWheelState & { pressed: boolean }) => StyleProp<ViewStyle>);
}

/**
 * The center button. Keep it a sibling of the Ring so presses never start a
 * turn. Pass `onPress` and an `accessibilityLabel`.
 */
export function Center(props: CenterProps) {
  const { style, ...rest } = props;
  const { state } = useClickWheelContext("Center");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: state.disabled }}
      disabled={state.disabled}
      style={({ pressed }) => (typeof style === "function" ? style({ ...state, pressed }) : style)}
      {...rest}
    />
  );
}
