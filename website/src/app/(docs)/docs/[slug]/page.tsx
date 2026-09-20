import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPageView } from "@/components/site/blocks";
import { BASICS, getPage } from "@/content/docs";

type Props = { params: Promise<{ slug: string }> };

const slugs = BASICS.filter((page) => page.slug !== "getting-started").map((page) => page.slug);

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage((await params).slug);
  return page ? { title: `${page.title} — Click Wheel`, description: page.description ?? "Click Wheel docs." } : {};
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const page = slugs.includes(slug) ? getPage(slug) : undefined;
  if (!page) notFound();
  return <DocPageView page={page} />;
}
