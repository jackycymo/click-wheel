import type { MetadataRoute } from "next";
import { PAGES } from "@/content/docs";
import { REGISTRY_ITEMS, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteUrl();
  const paths = [
    "/",
    ...PAGES.map((page) => page.href),
    "/llms.txt",
    "/llms-full.txt",
    "/docs.md",
    "/r/registry.json",
    ...REGISTRY_ITEMS.map((name) => `/r/${name}.json`),
  ];

  return paths.map((path) => ({ url: `${site}${path}` }));
}
