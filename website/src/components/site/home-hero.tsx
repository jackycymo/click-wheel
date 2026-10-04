"use client";

import type { ReactNode } from "react";
import { Demo as RetroDemo } from "@/themes/retro/demo";
import { usePlayerContext } from "./player-provider";
import "./home-hero.css";

export function HomeHero({ children }: { children: ReactNode }) {
  const { error } = usePlayerContext();

  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="home-hero-copy">{children}</div>

      <div className="home-hero-stage">
        <div className="home-hero-device" data-player-anchor>
          <RetroDemo mode="seek" defaultClicker />
        </div>
      </div>
      {error ? <p className="home-hero-error" role="alert">{error}</p> : null}
    </section>
  );
}
