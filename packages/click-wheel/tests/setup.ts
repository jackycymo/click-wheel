import { Window } from "happy-dom";

const window = new Window();
for (const key of ["document", "navigator", "HTMLElement", "Event", "KeyboardEvent", "PointerEvent", "MouseEvent", "WheelEvent", "FormData"] as const) {
  Object.defineProperty(globalThis, key, { configurable: true, value: window[key] });
}
Object.defineProperty(globalThis, "window", { configurable: true, value: window });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

let nextFrame = 0;
const frames = new Map<number, FrameRequestCallback>();
globalThis.requestAnimationFrame = (callback) => {
  const id = ++nextFrame;
  frames.set(id, callback);
  return id;
};
globalThis.cancelAnimationFrame = (id) => { frames.delete(id); };

export function advanceFrame(time: number) {
  const pending = [...frames.values()];
  frames.clear();
  for (const frame of pending) frame(time);
}

export function pendingFrames() {
  return frames.size;
}
