import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  // The site reads the component source from ../packages at build time.
  outputFileTracingRoot: path.join(import.meta.dirname, ".."),
};

export default nextConfig;
