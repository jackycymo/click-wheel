"use client";

import * as React from "react";
import { haptic, hapticsSupported, HapticTap } from "click-wheel";

const noop = () => () => {};
const snapshot = () => (hapticsSupported() ? "true" : "false");

const BUTTON =
  "relative inline-flex h-9 items-center justify-center rounded-md border bg-background px-4 font-mono text-xs font-medium shadow-xs outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]";

export function HapticsDemo() {
  const supported = React.useSyncExternalStore(noop, snapshot, () => "…");
  const [taps, setTaps] = React.useState(0);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4">
      <button type="button" onClick={() => haptic()} className={BUTTON}>
        haptic()
      </button>
      <button type="button" onClick={() => setTaps((n) => n + 1)} className={BUTTON}>
        <HapticTap style={{ clipPath: "inset(0 round 6px)" }} />
        {"<HapticTap />"}
        {taps > 0 ? <span className="ml-2 text-muted-foreground">×{taps}</span> : null}
      </button>
      <p className="font-mono text-xs text-muted-foreground">
        hapticsSupported() → {supported}
      </p>
    </div>
  );
}
