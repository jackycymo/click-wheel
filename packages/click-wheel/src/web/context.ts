"use client";

import * as React from "react";

export interface ClickWheelState {
  /** The current value. */
  value: number;
  /** Whether the ring is turning: a pointer is on it, or it is still spinning after a flick. */
  turning: boolean;
  /** Whether the wheel is disabled. */
  disabled: boolean;
}

export interface ClickWheelContextValue {
  state: ClickWheelState;
  min: number;
  max: number;
  ringRef: React.RefObject<HTMLElement | null>;
  centerRef: React.RefObject<HTMLElement | null>;
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerMove: (event: React.PointerEvent) => void;
  onPointerUp: (event: React.PointerEvent) => void;
  onPointerCancel: (event: React.PointerEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export const ClickWheelContext = React.createContext<ClickWheelContextValue | null>(null);

export function useClickWheelContext(part: string): ClickWheelContextValue {
  const ctx = React.useContext(ClickWheelContext);
  if (!ctx) {
    throw new Error(`ClickWheel.${part} must be rendered inside ClickWheel.Root.`);
  }
  return ctx;
}
