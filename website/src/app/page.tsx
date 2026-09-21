import Link from "next/link";
import { Header } from "@/components/site/header";
import { HomeHero } from "@/components/site/home-hero";
import { InstallCommand } from "@/components/site/install-command";
import { ThemesBlock } from "@/components/site/themes-block";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomeHero>
          <h1 id="hero-title">Click Wheel</h1>
          <p className="home-hero-description">
            Bring the joy of the iPod style click wheel. A tactile React component for
            playback, volume, and everything you used to slide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-10 items-center gap-3 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Start building <span aria-hidden="true">↗</span>
            </Link>
            <a
              href="#themes"
              className="inline-flex h-10 items-center rounded-md border bg-background/70 px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Explore the themes
            </a>
          </div>
        </HomeHero>

        <div className="mx-auto w-full max-w-5xl px-5 pb-24">
          <div className="border-b py-8">
            <div className="min-w-0 space-y-2">
              <InstallCommand />
            </div>
          </div>

          <section id="themes" className="scroll-mt-20 py-14">
            <h2 className="text-xl font-semibold tracking-tight">Themes</h2>
            <div className="mt-8">
              <ThemesBlock />
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
            <span className="font-mono text-xs">
              <a href="/llms.txt" className="hover:text-foreground">llms.txt</a> ·{" "}
              <a href="/docs.md" className="hover:text-foreground">docs.md</a> ·{" "}
              <a href="/r/registry.json" className="hover:text-foreground">registry.json</a>
            </span>
          </footer>
        </div>
      </main>
    </>
  );
}
