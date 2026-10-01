"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";

const GROOVE = 4;
const MAX_GROOVES = 8;

export interface WheelProps extends Omit<ClickWheel.RootProps, "children" | "className"> {
  label: string;
  getAriaValueText?: (value: number) => string;
  icon?: React.ReactNode;
  onCenterClick?: () => void;
  centerLabel?: string;
  className?: string;
  grooves?: boolean;
}

export function Wheel({
  label,
  getAriaValueText,
  icon,
  onCenterClick,
  centerLabel,
  className,
  grooves: wantGrooves = false,
  min = 0,
  max = 100,
  unitsPerTurn = 100,
  ...rootProps
}: WheelProps) {
  const laps = Math.ceil((max - min) / unitsPerTurn - 1e-9);
  const grooves = wantGrooves && laps > 1 && laps <= MAX_GROOVES ? laps : 1;

  return (
    <ClickWheel.Root
      {...rootProps}
      min={min}
      max={max}
      unitsPerTurn={unitsPerTurn}
      className={`relative aspect-square ${className ?? ""}`}
    >
      {Array.from({ length: grooves }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="absolute rounded-full [background:conic-gradient(var(--primary)_calc(var(--groove-fill)*360deg),var(--border)_0)] [mask:radial-gradient(circle_closest-side,transparent_calc(100%_-_3px),black_calc(100%_-_2px))]"
          style={
            {
              inset: i * GROOVE,
              "--groove-fill":
                grooves === 1
                  ? "var(--click-wheel-fraction)"
                  : `clamp(0, calc(var(--click-wheel-turns) - ${i}), 1)`,
            } as React.CSSProperties
          }
        />
      ))}
      <ClickWheel.Ring
        aria-label={label}
        getAriaValueText={getAriaValueText}
        style={{ inset: grooves * GROOVE + 4 }}
        className="absolute cursor-grab rounded-full border border-border bg-muted shadow-sm outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring data-[dragging]:cursor-grabbing data-[disabled]:cursor-default data-[disabled]:opacity-50"
      >
        <ClickWheel.Rotor className="absolute inset-0 rounded-full opacity-25 transition-opacity [background:repeating-conic-gradient(var(--ticks)_0_1deg,transparent_1deg_15deg)] [mask:radial-gradient(circle_closest-side,transparent_56%,black_57%_82%,transparent_83%)] data-[dragging]:opacity-60 data-[coasting]:opacity-60" />
      </ClickWheel.Ring>
      <ClickWheel.Center
        aria-label={centerLabel}
        onClick={onCenterClick}
        className="absolute left-1/2 top-1/2 flex size-[38%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-hub text-hub-foreground shadow-xs outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 [&>svg]:size-[36%]"
      >
        {icon}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
