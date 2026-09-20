"use client";

import * as React from "react";
import { ClickWheel } from "@/components/click-wheel";
import "./te.css";

/*
  Teenage engineering inspired. Flat matte disc, one orange index dot that
  turns with the finger, a printed tick scale that fills orange as the value
  grows (driven by --click-wheel-fraction), and a black hub.
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
    <ClickWheel.Root {...rootProps} className={`te-wheel ${className ?? ""}`}>
      <div className="te-scale" aria-hidden="true" />
      <ClickWheel.Ring aria-label={label} getAriaValueText={getAriaValueText} className="te-ring">
        <ClickWheel.Rotor className="te-rotor" />
      </ClickWheel.Ring>
      <ClickWheel.Center aria-label={centerLabel} onClick={onCenterClick} className="te-center">
        {icon}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
