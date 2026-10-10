import { expect, mock, test } from "bun:test";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { PlayerProvider } from "../src/components/site/player-provider";
import { claimAudio, releaseAudio } from "../src/components/site/audio";

test("late saved-track metadata waits for the active preview before restoring playback", async () => {
  const storage = new Map([["click-wheel:player", JSON.stringify({ src: "/audio/morning-coffee.mp3", position: 30, playing: true, started: true })]]);
  Object.defineProperty(globalThis, "sessionStorage", { configurable: true, value: {
    getItem: (key: string) => storage.get(key),
    setItem: (key: string, value: string) => storage.set(key, value),
  } });
  Object.defineProperty(globalThis, "AudioContext", { configurable: true, value: class {
    state = "running";
    addEventListener() {}
    createMediaElementSource() { return {}; }
  } });
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  try {
    await React.act(async () => root.render(<PlayerProvider><span>Player test</span></PlayerProvider>));
    const audio = container.querySelector("audio")!;
    const play = mock(() => Promise.resolve());
    audio.play = play;
    audio.pause = mock();
    Object.defineProperty(audio, "duration", { value: 192 });
    await React.act(async () => {
      claimAudio("preview");
      audio.dispatchEvent(new Event("loadedmetadata"));
    });
    expect(audio.currentTime).toBe(30);
    expect(play).not.toHaveBeenCalled();
    await React.act(async () => releaseAudio("preview"));
    expect(play).toHaveBeenCalledTimes(1);
  } finally {
    await React.act(async () => root.unmount());
    container.remove();
    claimAudio(null);
  }
});
