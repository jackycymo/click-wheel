"use client";

import * as React from "react";
import { useClickWheelContext, type ClickWheelState } from "./context.js";
import { useRenderPart, useMergedRefs, type PartProps } from "./render.js";

export type CenterProps = PartProps<ClickWheelState, "button">;

/**
 * The center button. Presses here never start a turn. Pass `onClick` and an
 * `aria-label`; render it as a `div` for a plain hub.
 */
export function Center(props: CenterProps) {
  const { ref: refProp, ...rest } = props;
  const ctx = useClickWheelContext("Center");
  const { state } = ctx;
  const ref = useMergedRefs(ctx.centerRef, refProp as React.Ref<HTMLElement>);

  const element = useRenderPart("button", state, rest, {
    ref,
    disabled: state.disabled || undefined,
    "data-dragging": state.dragging ? "" : undefined,
    "data-coasting": state.coasting ? "" : undefined,
    "data-disabled": state.disabled ? "" : undefined,
  });
  const merged = element.props as React.ComponentPropsWithRef<"button">;
  const disabled = state.disabled || merged.disabled;
  const button = element.type === "button" || typeof element.type !== "string";

  return React.cloneElement(element, {
    type: merged.type ?? (button ? "button" : undefined),
    disabled: button ? disabled || undefined : undefined,
    "aria-disabled": disabled || merged["aria-disabled"],
    "data-disabled": disabled ? "" : undefined,
    tabIndex: disabled && !button ? -1 : merged.tabIndex,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      merged.onClick?.(event);
    },
  } as React.ComponentPropsWithRef<"button">);
}
