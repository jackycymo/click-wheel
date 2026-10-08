"use client";

import { ClickWheel } from "click-wheel";
import { IconPause, IconPlay } from "./icons";
import { fmt, speakTime, usePlayer } from "./use-player";

const CELLS = 20;

export function HeroPlayer() {
  const player = usePlayer({ mode: "seek", defaultClicker: true });
  const litCells = Math.round((player.position / player.track.duration) * CELLS);

  return (
    <div className="mx-auto w-full rounded-[18px] border border-[#e4e3da] bg-[linear-gradient(125deg,#eeede6_0%,#e7e6de_46%,#d9d8cf_100%)] px-6 pt-5 pb-[30px] text-[#1f1f1d] shadow-[inset_3px_2px_2px_#ffffffed,inset_-2px_-1px_2px_#8e8d7b80,1px_0_1px_#85857555] min-[421px]:px-[30px] min-[421px]:pt-[26px] min-[421px]:pb-10">
      <div className="mt-5 rounded-xl bg-[#0d0d0d] p-3.5 font-doto font-black text-[#f1f1ee] shadow-[inset_6px_6px_12px_#000c,inset_-3px_-3px_8px_#ffffff0f,0_1px_0_#fffffff0] min-[421px]:px-5 min-[421px]:py-[18px]">
        <div className="flex justify-between gap-2 text-[10px] tracking-[0.06em] text-[#b8b9af] uppercase min-[421px]:text-[13px]">
          <span className="truncate">{player.track.title}</span>
          <span className="text-(--site-signal)">{player.playing ? "play" : "stop"}</span>
        </div>
        <div className="mt-3.5 text-[28px] leading-none tracking-[0.04em] tabular-nums min-[421px]:text-[32px]">
          {fmt(player.position)}
          <small className="text-[16px] text-[#b8b9af]"> / {fmt(player.track.duration)}</small>
        </div>
        <div className="mt-4 flex gap-[3px]" aria-hidden="true">
          {Array.from({ length: CELLS }, (_, i) => (
            <i key={i} data-on={i < litCells || undefined} className="h-1.5 flex-1 bg-[#262626] data-[on]:bg-(--site-signal)" />
          ))}
        </div>
      </div>
      <ClickWheel.Root
        {...player.wheel}
        className="relative mx-auto mt-7 aspect-square w-[90%] min-[421px]:mt-9 before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(135deg,#deddd4_0%,#eeede6_44%,#d4d3c9_100%)] before:shadow-[inset_1px_2px_3px_#77776770,inset_-1px_-1px_1px_#ffffff,0_1px_1px_#ffffffb3]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-[2%] rounded-full bg-[conic-gradient(var(--site-signal)_calc(var(--click-wheel-fraction)*360deg),#1f1f1d_0)] opacity-95 [mask-image:repeating-conic-gradient(#000_0_0.9deg,transparent_0.9deg_15deg),radial-gradient(circle_closest-side,transparent_88%,#000_89%)] [mask-composite:intersect]"
        />
        <ClickWheel.Ring
          aria-label="Playback position"
          getAriaValueText={speakTime}
          className="absolute inset-0 cursor-grab rounded-full bg-transparent outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-(--site-signal) data-[dragging]:cursor-grabbing data-[disabled]:cursor-default data-[disabled]:opacity-50"
        >
          <ClickWheel.Rotor className="absolute inset-[15%] rounded-full after:absolute after:top-[4%] after:left-1/2 after:aspect-square after:w-[9%] after:-translate-x-1/2 after:rounded-full after:bg-(--site-signal) after:shadow-[inset_1px_1px_2px_#0004]" />
        </ClickWheel.Ring>
        <ClickWheel.Center
          aria-label={player.playing ? "Pause" : "Play"}
          onClick={player.togglePlay}
          className="absolute top-1/2 left-1/2 flex aspect-square w-[36%] -translate-1/2 items-center justify-center rounded-full border border-transparent text-[#1f1f1d] shadow-[inset_1px_1px_1px_#ffffffa6,inset_-1px_-1px_1px_#aeada04d,3px_4px_5px_#59594b26,8px_12px_14px_#59594b26] outline-none transition-shadow duration-[80ms] ease-[ease] [--button-face:linear-gradient(135deg,#f0efe8,#d9d8ce)] [-webkit-tap-highlight-color:transparent] [background:var(--button-face)_padding-box,linear-gradient(135deg,#fff_10%,#eeede5_40%,#c5c4b8_65%,#bab9ae_90%)_border-box] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-(--site-signal) active:shadow-[inset_1px_2px_3px_#59594b40,1px_2px_3px_#59594b26] active:[--button-face:linear-gradient(135deg,#deddd3,#e9e8e0)] disabled:cursor-default disabled:opacity-50 active:[&>*]:translate-y-px [&>svg]:size-[36%]"
        >
          {player.playing ? <IconPause /> : <IconPlay />}
        </ClickWheel.Center>
      </ClickWheel.Root>
    </div>
  );
}
