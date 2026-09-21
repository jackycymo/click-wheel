"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Caveat } from "next/font/google";
import { Demo as RetroDemo } from "@/themes/retro/demo";
import { HeroDemo } from "./hero-demo";
import { usePlayerContext } from "./player-provider";
import { Segmented } from "./segmented";
import "./home-hero.css";

const handwriting = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-handwriting" });

type Appearance = "retro" | "basic";

export function HomeHero({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>("retro");
  const { error } = usePlayerContext();

  return (
    <section className={`home-hero ${handwriting.variable}`} data-appearance={appearance} aria-labelledby="hero-title">
      <div className="home-hero-backdrop" hidden={appearance !== "retro"}>
        <Image
          src="/images/college-desk-day.webp"
          alt=""
          fill
          sizes="(max-width: 959px) 1800px, (max-width: 1440px) 1500px, 100vw"
          quality={90}
          fetchPriority="high"
          className="home-hero-day object-cover"
        />
        <Image
          src="/images/college-desk-night.webp"
          alt=""
          fill
          sizes="(max-width: 959px) 1800px, (max-width: 1440px) 1500px, 100vw"
          quality={90}
          fetchPriority="high"
          className="home-hero-night object-cover"
        />
      </div>

      <div className="home-hero-inner">
        <div className="home-hero-toolbar">
          <div className="home-hero-appearance">
            <span className="home-hero-switch-note" aria-hidden="true">
              Switch it up
              <svg viewBox="0 0 54 28" fill="none">
                <path d="M2 8C13 21 30 24 49 12M38 9l12 2-6 11" />
              </svg>
            </span>
            <Segmented<Appearance>
              value={appearance}
              onValueChange={setAppearance}
              options={[
                { value: "retro", label: "Retro" },
                { value: "basic", label: "Basic" },
              ]}
              label="Demo appearance"
            />
          </div>
        </div>

        <div className="home-hero-layout">
          <div className="home-hero-device" data-player-anchor hidden={appearance !== "retro"}>
            <div className="home-hero-player">
              <RetroDemo mode="seek" defaultClicker />
            </div>
            <div className="home-hero-instructions">
              <svg className="home-hero-wheel-arrow" viewBox="0 0 100 120" fill="none" aria-hidden="true">
                <path d="M78 110C12 107 4 51 94 8M77 9l18-3-5 18" />
              </svg>
              <p>Give it a spin.</p>
              <span>Drag the wheel.<br />Press the center to play.</span>
            </div>
          </div>

          <div className="home-hero-copy">
            {children}
            {error ? <p className="mt-3 text-xs" role="alert">{error}</p> : null}
          </div>
        </div>

        <div className="home-hero-basic" data-player-anchor hidden={appearance !== "basic"}>
          <HeroDemo />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Drag to adjust, or focus the wheel and use the arrow keys. Press the center to play.
          </p>
        </div>
      </div>
    </section>
  );
}
