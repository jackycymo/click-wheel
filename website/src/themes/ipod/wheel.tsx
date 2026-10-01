"use client";

import * as React from "react";
import { ClickWheel } from "click-wheel";
import "./ipod.css";

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
    <ClickWheel.Root {...rootProps} className={`ipod-wheel ${className ?? ""}`}>
      <ClickWheel.Ring aria-label={label} getAriaValueText={getAriaValueText} className="ipod-ring">
        <ClickWheel.Rotor className="ipod-rotor" />
        <span className="ipod-print" data-at="top">
          MENU
        </span>
        <span className="ipod-print" data-at="left">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 3h2v10H2zM14 3v10L8.5 8zM9 3v10L3.5 8z" />
          </svg>
        </span>
        <span className="ipod-print" data-at="right">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M12 3h2v10h-2zM2 3v10L7.5 8zM7 3v10L12.5 8z" />
          </svg>
        </span>
        <span className="ipod-print" data-at="bottom">
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 3v10l6-5zM10 3h2v10h-2zM13 3h2v10h-2z" />
          </svg>
        </span>
      </ClickWheel.Ring>
      <ClickWheel.Center aria-label={centerLabel} onClick={onCenterClick} className="ipod-center">
        {icon}
      </ClickWheel.Center>
    </ClickWheel.Root>
  );
}
