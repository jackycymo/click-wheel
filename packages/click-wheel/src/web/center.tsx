"use client";

import * as React from "react";
import { useClickWheelContext, type ClickWheelState } from "./context";
import { renderPart, useMergedRefs, type PartProps } from "./render";

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

  return renderPart("button", state, rest, {
    ref,
    type: rest.render ? undefined : "button",
    disabled: state.disabled || undefined,
    "data-turning": state.turning ? "" : undefined,
    "data-disabled": state.disabled ? "" : undefined,
  });
}
