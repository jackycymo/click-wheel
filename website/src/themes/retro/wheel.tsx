"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";
import "./retro.css";

/*
  Retro hardware, soft. One grey and no outlines: a well pressed into the
  surface, a knob raised out of it, a push button that goes concave under
  the thumb. One accent index dot turns with the finger, and a printed tick
  scale takes the accent as the value grows (driven by --click-wheel-fraction).
  Four accents ship in retro.css; set data-accent on the wheel or an ancestor.
*/

export interface WheelProps extends Omit<ClickWheel.RootProps, "children" | "className"> {
  label: string;
  getAriaValueText?: (value: number) => string;
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
    <ClickWheel.Root {...rootProps} className={`retro-wheel ${className ?? ""}`}>
      <div className="retro-scale" aria-hidden="true" />
      <ClickWheel.Ring aria-label={label} getAriaValueText={getAriaValueText} className="retro-ring">
        <ClickWheel.Rotor className="retro-rotor" />
      </ClickWheel.Ring>
      <ClickWheel.Center aria-label={centerLabel} onClick={onCenterClick} className="retro-center">
        {icon}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
