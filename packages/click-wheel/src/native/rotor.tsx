import * as React from "react";
import { StyleSheet, type ViewProps } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useClickWheelContext } from "./context";
import { resolveStyle, type PartStyle } from "./types";

export interface RotorProps extends Omit<ViewProps, "style"> {
  style?: PartStyle;
}

/**
 * A decorative view that rotates 1:1 with the finger, on the UI thread.
 * Give it a texture; it does the turning. Extra transforms in `style` are kept.
 */
export function Rotor(props: RotorProps) {
  const { style, children, ...rest } = props;
  const { state, rotation } = useClickWheelContext("Rotor");
  const base = StyleSheet.flatten(resolveStyle(style, state)) ?? {};
  const { transform: extra, ...rested } = base;
  const others = Array.isArray(extra) ? extra : [];
  const turn = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, ...others],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[rested, turn]}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}
