"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";
import "./retro.css";

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
