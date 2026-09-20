"use client";

import * as React from "react";
import { ClickWheel } from "@/components/click-wheel";

/*
  The stock skin: shadcn/ui tokens and Tailwind classes, nothing else.
  Swap --primary and friends for a new palette; the classes stay the same.
*/

export interface WheelProps extends Omit<ClickWheel.RootProps, "children" | "className"> {
  /** Accessible name for the ring. */
  label: string;
  getAriaValueText?: (value: number) => string;
  /** Center button content, handler and accessible name. */
  icon?: React.ReactNode;
  onCenterClick?: () => void;
  centerLabel?: string;
  className?: string;
}

export function Wheel({
  label,
  getAriaValueText,
  icon,
  onCenterClick,
  centerLabel,
  className,
  ...rootProps
}: WheelProps) {
  return (
    <ClickWheel.Root {...rootProps} className={`relative aspect-square ${className ?? ""}`}>
      {/* Value arc: a 2px conic stroke driven by --click-wheel-fraction. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full [background:conic-gradient(var(--color-primary)_calc(var(--click-wheel-fraction)*360deg),var(--color-border)_0)] [mask:radial-gradient(circle_closest-side,transparent_calc(100%_-_3px),black_calc(100%_-_2px))]"
      />
      <ClickWheel.Ring
        aria-label={label}
        getAriaValueText={getAriaValueText}
        className="absolute inset-2 cursor-grab rounded-full border border-border bg-muted shadow-sm outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring data-[turning]:cursor-grabbing data-[disabled]:cursor-default data-[disabled]:opacity-50"
      >
        {/* Tick texture that turns with the finger. */}
        <ClickWheel.Rotor className="absolute inset-0 rounded-full opacity-25 transition-opacity [background:repeating-conic-gradient(var(--color-foreground)_0_1deg,transparent_1deg_15deg)] [mask:radial-gradient(circle_closest-side,transparent_56%,black_57%_82%,transparent_83%)] data-[turning]:opacity-60" />
      </ClickWheel.Ring>
      <ClickWheel.Center
        aria-label={centerLabel}
        onClick={onCenterClick}
        className="absolute left-1/2 top-1/2 flex size-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-xs outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {icon}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
