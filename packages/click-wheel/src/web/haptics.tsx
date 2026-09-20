"use client";

import * as React from "react";

/*
  Haptics on the web, as of late 2026:

  - Android (Chrome, Firefox, Samsung Internet): `navigator.vibrate`.
  - iOS 17.4 – 26.4: Safari has no Vibration API, but toggling a
    `<input type="checkbox" switch>` through its <label> fires the Taptic
    engine, even from script.
  - iOS 26.5+: script-driven toggles no longer vibrate. Only a real tap on a
    switch does, so render <HapticTap /> inside a tappable element.
  - Desktop: nothing vibrates. `navigator.vibrate` exists in Chrome and no-ops.
*/

function isIOS(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("-webkit-touch-callout", "none");
}

/** True when this browser has any path to a haptic pulse. */
export function hapticsSupported(): boolean {
  if (typeof navigator === "undefined") return false;
  return typeof navigator.vibrate === "function" || isIOS();
}

let iosSwitch: HTMLLabelElement | null = null;

function getIOSSwitch(): HTMLLabelElement {
  if (iosSwitch) return iosSwitch;
  const label = document.createElement("label");
  label.setAttribute("aria-hidden", "true");
  label.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("switch", "");
  input.tabIndex = -1;
  label.appendChild(input);
  document.body.appendChild(label);
  iosSwitch = label;
  return label;
}

/**
 * One short haptic pulse. `durationMs` only applies to the Vibration API;
 * iOS always produces its own fixed tick.
 */
export function haptic(durationMs = 4): void {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate === "function") {
    navigator.vibrate(durationMs);
    return;
  }
  if (isIOS()) getIOSSwitch().click();
}

const TAP_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  margin: 0,
  opacity: 0,
  clipPath: "inset(0 round 999px)",
  WebkitTapHighlightColor: "transparent",
};

/**
 * An invisible switch that covers its parent so a real tap ticks on iOS,
 * including 26.5+. Place it inside a positioned, round, tappable element;
 * the click still bubbles to the parent. Does nothing elsewhere.
 */
export function HapticTap(props: React.ComponentProps<"input">) {
  const { style, ...rest } = props;
  return (
    <input
      type="checkbox"
      aria-hidden="true"
      tabIndex={-1}
      {...{ switch: "" }}
      {...rest}
      style={{ ...TAP_STYLE, ...style }}
    />
  );
}
