import * as React from "react";
import { View, type AccessibilityActionEvent, type LayoutChangeEvent, type ViewProps } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { useClickWheelContext } from "./context";
import { resolveStyle, type PartStyle } from "./types";

export interface RingProps extends Omit<ViewProps, "style"> {
  style?: PartStyle;
  /** Formats the value for VoiceOver and TalkBack, e.g. seconds to "1 min 20 sec". */
  getAccessibilityValueText?: (value: number) => string;
}

const ACTIONS = [{ name: "increment" }, { name: "decrement" }];

/**
 * The interactive ring. Drag around it. Announced as an adjustable control;
 * the increment and decrement actions step the value.
 */
export function Ring(props: RingProps) {
  const { style, children, getAccessibilityValueText, onLayout, onAccessibilityAction, ...rest } = props;
  const ctx = useClickWheelContext("Ring");
  const { state, min, max, step } = ctx;

  const handleLayout = (event: LayoutChangeEvent) => {
    ctx.onRingLayout(event);
    onLayout?.(event);
  };

  const handleAction = (event: AccessibilityActionEvent) => {
    const name = event.nativeEvent.actionName;
    if (name === "increment") ctx.nudge(step);
    else if (name === "decrement") ctx.nudge(-step);
    onAccessibilityAction?.(event);
  };

  return (
    <GestureDetector gesture={ctx.pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityValue={{ min, max, now: state.value, text: getAccessibilityValueText?.(state.value) }}
        accessibilityState={{ disabled: state.disabled }}
        accessibilityActions={ACTIONS}
        onAccessibilityAction={handleAction}
        onLayout={handleLayout}
        style={resolveStyle(style, state)}
        {...rest}
      >
        {children}
      </View>
    </GestureDetector>
  );
}
