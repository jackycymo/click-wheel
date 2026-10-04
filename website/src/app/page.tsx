import Link from "next/link";
import { Header } from "@/components/site/header";
import { HomeHero } from "@/components/site/home-hero";
import { InstallCommand } from "@/components/site/install-command";
import { ThemesBlock } from "@/components/site/themes-block";
import { MusicCredits } from "@/components/site/music-credits";
import { DesignReflection } from "@/components/site/design-reflection";

export default function Home() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <HomeHero>
          <h1 id="hero-title">Click Wheel</h1>
          <div className="home-hero-intro">
            <p className="home-hero-description">
              Bring the joy of the iPod style click wheel back. A tactile React component for
              playback, volume, and everything you used to slide.
            </p>
            <Link
              href="/docs"
              className="home-text-link"
            >
              Start building
            </Link>
          </div>
        </HomeHero>

        <DesignReflection />

        <div className="home-content">
          <div className="home-install">
            <a href="#themes" className="home-text-link">Explore the themes</a>
            <div className="home-install-command">
              <InstallCommand />
            </div>
          </div>

          <section id="themes" className="home-themes scroll-mt-24">
            <h2>Themes</h2>
            <div className="mt-8">
              <ThemesBlock />
            </div>
          </section>

          <footer className="flex flex-wrap items-start justify-between gap-6 border-t pt-6 text-sm text-muted-foreground">
            <div className="space-y-3">
              <MusicCredits />
              <p className="text-xs leading-relaxed">
                iPod photo by{" "}
                <a className="underline underline-offset-2 hover:text-foreground" href="https://commons.wikimedia.org/wiki/File:IPod4G.jpg">KAMiKAZOW</a>
                {" · "}<a className="underline underline-offset-2 hover:text-foreground" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>
                {" · cropped"}
              </p>
            </div>
            <span className="font-mono text-xs">
              <a href="/llms.txt" className="hover:text-foreground">llms.txt</a> ·{" "}
              <a href="/docs.md" className="hover:text-foreground">docs.md</a> ·{" "}
              <a href="/r/registry.json" className="hover:text-foreground">registry.json</a>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}
