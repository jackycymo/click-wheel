"use client";

import Image from "next/image";
import { useState } from "react";
import "./playground.css";

export function OgPlayground() {
  const [size, setSize] = useState(190);
  const [weight, setWeight] = useState(600);
  const [tracking, setTracking] = useState(-0.08);

  return (
    <main className="og-playground">
      <div className="og-preview-scroll">
        <div className="og-artboard" aria-label="Click Wheel social sharing image">
          <Image
            className="og-player-art"
            src="/images/og-player-source.png"
            alt="Ivory player with a tactile circular dial and red accents"
            width={1200}
            height={630}
            unoptimized
            preload
          />
          <div className="og-copy">
            <h1 style={{ fontSize: size, fontWeight: weight, letterSpacing: `${tracking}em` }}>
              <span>Click</span>
              <span>Wheel</span>
            </h1>
            <p>Bring the joy of the iPod style click wheel to web.</p>
          </div>
        </div>
      </div>
      <fieldset className="og-controls">
        <legend>Typography · Archivo · 1200 × 630</legend>
        <label>
          Size <output>{size}px</output>
          <input aria-label="Title size" type="range" min="150" max="210" value={size}
            onChange={(event) => setSize(Number(event.target.value))} />
        </label>
        <label>
          Weight <output>{weight}</output>
          <input aria-label="Title weight" type="range" min="400" max="800" step="50" value={weight}
            onChange={(event) => setWeight(Number(event.target.value))} />
        </label>
        <label>
          Tracking <output>{tracking.toFixed(2)}em</output>
          <input aria-label="Title tracking" type="range" min="-0.1" max="0" step="0.01" value={tracking}
            onChange={(event) => setTracking(Number(event.target.value))} />
        </label>
      </fieldset>
    </main>
  );
}
