import type { Metadata } from "next";
import { OgPlayground } from "./playground";

export const metadata: Metadata = {
  title: "OG Playground — Click Wheel",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OgPlayground />;
}
