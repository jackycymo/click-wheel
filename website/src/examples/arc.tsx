"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";

export function Arc() {
  const [value, setValue] = React.useState(65);

  return (
    <ClickWheel.Root
      value={value}
      onValueChange={setValue}
      detent={10}
      className="relative aspect-square w-48"
    >
      {/* The value as an arc. CSS reads --click-wheel-fraction; no React render needed. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full [background:conic-gradient(var(--color-primary)_calc(var(--click-wheel-fraction)*360deg),var(--color-border)_0)] [mask:radial-gradient(circle_closest-side,transparent_calc(100%_-_6px),black_calc(100%_-_5px))]"
      />
      <ClickWheel.Ring
        aria-label="Level"
        className="absolute inset-3 cursor-grab rounded-full bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring data-[turning]:cursor-grabbing"
      >
        {/* A needle that follows the finger. Any element can use --click-wheel-rotation, not only the Rotor. */}
        <div aria-hidden="true" className="absolute inset-0 [rotate:var(--click-wheel-rotation,0deg)]">
          <div className="absolute left-1/2 top-2 h-[26%] w-0.5 -translate-x-1/2 rounded-full bg-foreground" />
        </div>
      </ClickWheel.Ring>
      <ClickWheel.Center
        render={<div />}
        className="absolute left-1/2 top-1/2 flex size-[40%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background font-mono text-sm tabular-nums shadow-xs"
      >
        {value}%
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
