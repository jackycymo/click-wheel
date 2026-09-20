"use client";

import { useClickWheelContext, type ClickWheelState } from "./context";
import { renderPart, type PartProps } from "./render";

export type RotorProps = PartProps<ClickWheelState, "div">;

/**
 * A decorative element that rotates 1:1 with the finger, like the texture of
 * a real wheel. Give it a texture; it does the turning.
 */
export function Rotor(props: RotorProps) {
  const { state } = useClickWheelContext("Rotor");
  return renderPart("div", state, props, {
    "aria-hidden": true,
    "data-turning": state.turning ? "" : undefined,
    "data-disabled": state.disabled ? "" : undefined,
    style: { rotate: "var(--click-wheel-rotation, 0deg)" },
  });
}
