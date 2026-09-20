import Link from "next/link";
import { Header } from "@/components/site/header";
import { HeroDemo } from "@/components/site/hero-demo";
import { InstallCommand } from "@/components/site/install-command";
import { ThemesBlock } from "@/components/site/themes-block";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl px-5 pb-24">
        <div className="pb-12 pt-16 sm:pt-24">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Click Wheel</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            The good old iPod wheel style UI component that acts as a replacement for sliders.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/docs"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
            >
              Read the docs
            </Link>
            <a
              href="#themes"
              className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent"
            >
              See the themes
            </a>
          </div>
          <div className="mt-6 space-y-2">
            <InstallCommand label="web" />
            <InstallCommand item="click-wheel-native" label="native" />
          </div>
        </div>

        <HeroDemo />

        <section id="themes" className="mt-16 scroll-mt-20 border-t py-14">
          <h2 className="text-xl font-semibold tracking-tight">Themes</h2>
          <div className="mt-8">
            <ThemesBlock />
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground">
          <span>Built with Next.js, Base UI and Tailwind CSS. The wheel itself is plain React.</span>
          <span className="font-mono text-xs">
            <a href="/llms.txt" className="hover:text-foreground">llms.txt</a> ·{" "}
            <a href="/docs.md" className="hover:text-foreground">docs.md</a> ·{" "}
            <a href="/r/registry.json" className="hover:text-foreground">registry.json</a>
          </span>
        </footer>
      </main>
    </>
  );
}
