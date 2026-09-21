"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";
import "./galley.css";

/*
  Galley. The knob on an aircraft coffee maker: soft metal extruded from the
  same panel, a knurled rim that turns with the finger, a hub pressed into the
  surface, and a ring of indicator segments that light up as the value grows.
  Two soft shadows do the shaping; --click-wheel-fraction lights the segments.
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
    <ClickWheel.Root {...rootProps} className={`galley-wheel ${className ?? ""}`}>
      <div className="galley-lamps" aria-hidden="true" />
      <ClickWheel.Ring aria-label={label} getAriaValueText={getAriaValueText} className="galley-ring">
        <ClickWheel.Rotor className="galley-rotor" />
      </ClickWheel.Ring>
      <ClickWheel.Center aria-label={centerLabel} onClick={onCenterClick} className="galley-center">
        {icon}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
