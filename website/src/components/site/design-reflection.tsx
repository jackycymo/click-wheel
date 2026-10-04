import Image from "next/image";
import { ReferenceControl } from "./reference-controls";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({ subsets: ["latin"], weight: "400" });

const objects = [
  { kind: "braun", name: "Braun SK2", file: "braun-sk2-detail.jpg", width: 2000, height: 1333, crop: [350, 0, 1333], alt: "The tuning knob, frequency scale, and perforated grille of a Braun SK2 radio" },
  { kind: "sculptor", name: "Timemore Sculptor", file: "sculptor-detail.jpg", width: 1065, height: 1420, crop: [180, 720, 700], alt: "A close detail of the numbered grind adjustment dial on a black Timemore Sculptor" },
  { kind: "amplifier", name: "Fender Deluxe Reverb", file: "fender-deluxe-reverb-detail.jpg", width: 2000, height: 2000, crop: [550, 750, 650], alt: "The silver-capped volume knob and numbered skirt on a vintage Fender Deluxe Reverb amplifier" },
  { kind: "guitar", name: "Fender Stratocaster", file: "stratocaster-volume-detail.jpg", width: 5184, height: 3456, crop: [2960, 840, 650], alt: "The ribbed white volume knob and gold numbers on a Fender Stratocaster" },
  { kind: "fellow", name: "Fellow Stagg EKG", file: "stagg-ekg-detail.png", width: 3000, height: 3000, crop: [1840, 1870, 600], alt: "The temperature dial and menu button on a black Fellow Stagg EKG Pro base" },
  { kind: "compressor", name: "Universal Audio 1176LN", file: "1176ln-detail.jpg", width: 5787, height: 3858, crop: [440, 1520, 930], alt: "The silver input knob and white decibel scale of a Universal Audio 1176LN compressor" },
  { kind: "espresso", name: "La Marzocco Linea Micra", file: "linea-micra-steam-knob.png", width: 4000, height: 2667, crop: [1370, 480, 1150], alt: "A close detail of the fluted steam knob on a white La Marzocco Linea Micra" },
  { kind: "ipod", name: "Apple iPod", file: "ipod-4g-click-wheel.jpg", width: 1831, height: 3007, crop: [205, 1375, 1400], alt: "The gray Click Wheel, playback symbols, and white center button on a fourth-generation iPod" },
  { kind: "mxr", name: "MXR Phase 90", file: "mxr-phase-90.jpg", width: 1400, height: 1400, crop: [400, 130, 600], alt: "The black speed knob and MXR logo against the orange casing of a Phase 90 guitar pedal" },
] as const;

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

        <div className="grid min-w-0 grid-cols-3 gap-1.5 min-[761px]:gap-2.5" aria-label="Details of everyday rotary controls">
          {objects.map(({ kind, file, width, height, crop: [x, y, size], alt }) => (
            <ReferenceControl key={file} kind={kind}>
              <Image
                className="absolute max-w-none"
                src={`/images/objects/${file}`}
                alt={alt}
                width={width}
                height={height}
                quality={90}
                sizes={`(max-width: 1023px) ${Math.ceil(33 * width / size)}vw, ${Math.ceil(245 * width / size)}px`}
                style={{
                  width: `${width / size * 100}%`,
                  height: `${height / size * 100}%`,
                  left: `${-x / size * 100}%`,
                  top: `${-y / size * 100}%`,
                }}
              />
            </ReferenceControl>
          ))}
          <p className="col-span-3 mt-2 text-center text-sm text-[#606354] [@media(min-width:761px)_and_(hover:hover)]:hidden">Tap a photo to try the dial</p>
        </div>
      </div>
    </section>
  );
}
