"use client";

import * as React from "react";
import { useClickWheelContext, type ClickWheelState } from "./context";
import { renderPart, useMergedRefs, type PartProps } from "./render";

export interface RingProps extends PartProps<ClickWheelState, "div"> {
  /** Formats the value for assistive tech, e.g. seconds to "1 min 20 sec". */
  getAriaValueText?: (value: number) => string;
}

// Needed for pointer capture on touch screens; everything else is yours.
const RING_STYLE: React.CSSProperties = {
  touchAction: "none",
  userSelect: "none",
  WebkitUserSelect: "none",
  WebkitTouchCallout: "none",
};

/**
 * The interactive ring. Drag around it, scroll over it, or focus it and use
 * the keyboard. Exposed to assistive tech as a slider.
 */
export function Ring(props: RingProps) {
  const { getAriaValueText, ref: refProp, ...rest } = props;
  const ctx = useClickWheelContext("Ring");
  const { state, min, max } = ctx;
  const ref = useMergedRefs(ctx.ringRef, refProp as React.Ref<HTMLElement>);

  return renderPart("div", state, rest, {
    ref,
    role: "slider",
    tabIndex: state.disabled ? -1 : 0,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": state.value,
    "aria-valuetext": getAriaValueText?.(state.value),
    "aria-disabled": state.disabled || undefined,
    "data-turning": state.turning ? "" : undefined,
    "data-disabled": state.disabled ? "" : undefined,
    style: RING_STYLE,
    onPointerDown: ctx.onPointerDown,
    onPointerMove: ctx.onPointerMove,
    onPointerUp: ctx.onPointerUp,
    onPointerCancel: ctx.onPointerUp,
    onKeyDown: ctx.onKeyDown,
  });
}
