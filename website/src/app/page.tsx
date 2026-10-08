import Link from "next/link";
import { Header } from "@/components/site/header";
import { HomeHero } from "@/components/site/home-hero";
import { InstallCommand } from "@/components/site/install-command";
import { ThemesBlock } from "@/components/site/themes-block";
import { MusicCredits } from "@/components/site/music-credits";
import { DesignReflection } from "@/components/site/design-reflection";

export default function Home() {
  return (
    <div className="bg-background text-foreground [font-family:var(--font-archivo),Arial,sans-serif]">
      <Header />
      <main>
        <HomeHero>
          <h1 id="hero-title" className="text-[clamp(48px,14.4vw,60px)] leading-[0.98] font-semibold tracking-[-0.08em] min-[421px]:text-[clamp(56px,12vw,88px)] min-[761px]:text-[clamp(64px,9.7vw,140px)]">Click Wheel</h1>
          <div>
            <p className="max-w-[440px] text-base leading-normal tracking-[-0.02em] min-[761px]:text-[17px] min-[1101px]:text-[19px]">
              Bring the joy of the iPod style click wheel back. A tactile React component for
              playback, volume, and everything you used to slide.
            </p>
            <Link
              href="/docs"
              className="mt-3 min-[761px]:mt-4 inline-flex w-fit items-center justify-between gap-7 border-b border-current py-2 text-base leading-[1.35] text-(--site-signal) no-underline transition-colors duration-150 ease-[ease] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-ring min-[761px]:text-[19px]"
            >
              Start building
            </Link>
          </div>
        </HomeHero>

        <DesignReflection />

        <div className="mx-auto w-full max-w-[calc(var(--site-content-width)+var(--site-gutter)*2)] px-(--site-gutter) pb-[120px]">
          <div className="grid grid-cols-1 items-center gap-6 border-t py-7 min-[761px]:grid-cols-[1fr_minmax(0,520px)] min-[761px]:gap-10 min-[761px]:py-[42px]">
            <a href="#themes" className="inline-flex w-fit items-center justify-between gap-7 border-b border-current py-2 text-base leading-[1.35] text-(--site-signal) no-underline transition-colors duration-150 ease-[ease] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-ring min-[761px]:text-[19px]">Explore the themes</a>
            <div className="min-w-0">
              <InstallCommand spacious />
            </div>
          </div>

          <section id="themes" className="scroll-mt-24 pt-10 pb-14 min-[761px]:pt-16 min-[761px]:pb-20">
            <h2 className="text-[32px] leading-[1.1] font-medium tracking-[-0.045em] min-[761px]:text-[42px]">Themes</h2>
            <div className="mt-8">
              <ThemesBlock plainTabs />
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-6 border-t pt-6 text-sm text-muted-foreground min-[761px]:flex-row">
            <div className="space-y-3">
              <MusicCredits />
              <p className="text-xs leading-relaxed">
                iPod photo by{" "}
                <a className="underline underline-offset-2 hover:text-foreground" href="https://commons.wikimedia.org/wiki/File:IPod4G.jpg">KAMiKAZOW</a>
                {" · "}<a className="underline underline-offset-2 hover:text-foreground" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
                {" · cropped"}
              </p>
            </div>
            <p className="shrink-0 text-right">
              By{" "}
              <a
                href="https://jackymo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                @jackycymo
              </a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
