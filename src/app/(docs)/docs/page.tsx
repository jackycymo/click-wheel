import type { Metadata } from "next";
import { DocPageView } from "@/components/site/blocks";
import { getPage } from "@/content/docs";

const page = getPage("getting-started")!;

export const metadata: Metadata = {
  title: `${page.title} — Click Wheel`,
  description: page.description ?? "Click Wheel docs.",
};

export default function GettingStarted() {
  return <DocPageView page={page} />;
}
