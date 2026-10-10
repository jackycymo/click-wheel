import Image from "next/image";
import { ReferenceControl } from "./reference-controls";
import { ReferenceAudioProvider } from "./reference-audio";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({ subsets: ["latin"], weight: "400" });

const objects = ["braun", "sculptor", "amplifier", "guitar", "fellow", "compressor", "espresso", "ipod", "mxr"] as const;

export function DesignReflection() {
  return (
    <section
      id="reflection-title"
      className="mx-auto max-w-(--site-width) scroll-mt-26 px-(--site-gutter) pt-10 pb-16 min-[761px]:pt-16 min-[761px]:pb-28"
      aria-label="Design inspiration"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className={`${newsreader.className} max-w-[680px] text-lg leading-normal font-normal tracking-[-0.015em] text-pretty min-[761px]:text-xl [&>p+p]:mt-6`}>
          <p>
            A dial or a wheel is a perfect example of good hardware design, it&apos;s
            timeless, simple and beautiful. From the Braun SK2 radio to Fellow
            kettles, coffee grinders, guitar amplifiers, and the iPod, the same
            idea keeps appearing: turn to explore a range, stop to make a choice.
          </p>
          <p>
            It’s compact, tactile, and satisfying to use. Yet a control so familiar
            in physical products is surprisingly rare in digital interfaces. There
            may be good reasons for that, but I wanted to explore what it could
            feel like on a touchscreen. So here’s my take on bringing the wheel
            to mobile UI.
          </p>
        </div>

        <ReferenceAudioProvider>
        <div className="grid min-w-0 grid-cols-3 gap-1.5 min-[761px]:gap-2.5" aria-label="Details of everyday rotary controls">
          {objects.map(kind => (
            <ReferenceControl key={kind} kind={kind}>
              {kind === "ipod" ? (
                <Image
                  className="absolute max-w-none"
                  src="/images/objects/ipod-4g-click-wheel.jpg"
                  alt="The gray wheel and white center button on a fourth-generation Apple iPod"
                  width={1831}
                  height={3007}
                  quality={90}
                  sizes="(max-width: 1023px) 44vw, 321px"
                  style={{ width: "130.786%", height: "214.786%", left: "-14.643%", top: "-98.214%" }}
                />
              ) : null}
            </ReferenceControl>
          ))}
        </div>
        </ReferenceAudioProvider>
      </div>
    </section>
  );
}
