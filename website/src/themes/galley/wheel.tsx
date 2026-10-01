"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";
import "./galley.css";

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
