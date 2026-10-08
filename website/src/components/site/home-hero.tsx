"use client";

import type { ReactNode } from "react";
import { HeroPlayer } from "./hero-player";
import { usePlayerContext } from "./player-provider";

export function HomeHero({ children }: { children: ReactNode }) {
  const { error } = usePlayerContext();

  return (
    <section className="mx-auto w-full max-w-(--site-width) overflow-x-clip px-(--site-gutter)" aria-labelledby="hero-title">
      <div className="grid grid-cols-1 items-start gap-5 pt-8 min-[761px]:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] min-[761px]:gap-10 min-[761px]:pt-10 min-[1101px]:gap-16">{children}</div>

      <div className="grid grid-cols-2 items-center gap-x-4 gap-y-6 pt-7 pb-9 min-[761px]:min-h-[650px] min-[761px]:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] min-[761px]:gap-6 min-[761px]:pt-10 min-[761px]:pb-[88px] min-[1101px]:grid-cols-[minmax(0,1fr)_350px_minmax(0,1fr)] min-[1101px]:gap-10">
        <div
          data-player-anchor
          className="relative isolate col-span-full min-w-0 w-full max-w-[280px] justify-self-center min-[421px]:max-w-[320px] min-[761px]:col-span-1 min-[761px]:col-start-2 min-[761px]:row-start-1 min-[761px]:max-w-none min-[761px]:justify-self-stretch before:pointer-events-none before:absolute before:bottom-px before:left-[2%] before:-z-1 before:h-11 before:w-[96%] before:origin-bottom-left before:rounded-xl before:bg-[linear-gradient(to_top,#38382c70,#38382c30_38%,#38382c00)] before:blur-[12px] before:[transform:skewX(-38deg)] min-[761px]:before:h-[60px] min-[761px]:before:[transform:skewX(-68deg)] min-[1101px]:before:h-[58px] min-[1101px]:before:[transform:skewX(-78deg)] after:pointer-events-none after:absolute after:-bottom-0.5 after:left-[3%] after:-z-1 after:h-[5px] after:w-[94%] after:rounded-[50%] after:bg-[#1d1e17] after:shadow-[0_1px_2px_#24251d80,10px_1px_12px_3px_#34352b30] after:blur-[0.7px]"
        >
          <HeroPlayer />
        </div>
      </div>
      {error ? <p className="mx-auto mb-8 max-w-[440px] text-center text-sm min-[761px]:-mt-12 min-[761px]:mb-10" role="alert">{error}</p> : null}
    </section>
  );
}
