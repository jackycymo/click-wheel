"use client";

import * as React from "react";
import { ClickWheel } from "@/components/click-wheel";

export function PlainHub() {
  const [value, setValue] = React.useState(30);

  return (
    <ClickWheel.Root value={value} onValueChange={setValue} className="relative aspect-square w-40">
      <ClickWheel.Ring
        aria-label="Level"
        className="absolute inset-0 cursor-grab rounded-full border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring data-[turning]:cursor-grabbing"
      />
      {/* `render` swaps the button for a div: no focus stop, no click, just a readout. */}
      <ClickWheel.Center
        render={<div />}
        className="absolute left-1/2 top-1/2 flex size-[44%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background font-mono text-sm tabular-nums shadow-xs"
      >
        {value}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
