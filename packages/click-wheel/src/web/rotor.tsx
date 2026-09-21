"use client";

import { useClickWheelContext, type ClickWheelState } from "./context";
import { renderPart, type PartProps } from "./render";

export type RotorProps = PartProps<ClickWheelState, "div">;

// `will-change` keeps the rotor on its own compositor layer, so a turn moves a
// cached texture instead of repainting it on every pointer sample.
const ROTOR_STYLE = {
  rotate: "var(--click-wheel-rotation, 0deg)",
  willChange: "transform",
} as const;

/**
 * A decorative element that rotates 1:1 with the finger, like the texture of
 * a real wheel. Give it a texture; it does the turning.
 */
export function Rotor(props: RotorProps) {
  const { state } = useClickWheelContext("Rotor");
  return renderPart("div", state, props, {
    "aria-hidden": true,
    "data-dragging": state.dragging ? "" : undefined,
    "data-coasting": state.coasting ? "" : undefined,
    "data-disabled": state.disabled ? "" : undefined,
    style: ROTOR_STYLE,
  });
}
