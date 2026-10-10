"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GITHUB_URL } from "@/lib/site";
import { IconGitHub, IconWheel } from "./icons";

const NAV = [
  ["Docs", "/docs", "/docs"],
  ["Examples", "/examples/default", "/examples"],
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background px-(--site-gutter) text-foreground [font-family:var(--font-archivo),Arial,sans-serif]">
      <div className="mx-auto flex h-(--site-header-height) w-full max-w-[calc(var(--site-width)-var(--site-gutter)*2)] flex-wrap items-center justify-between gap-3 border-b min-[761px]:flex-nowrap min-[761px]:gap-6">
        <Link href="/" className="flex items-center gap-2 text-[16px] font-medium tracking-[-0.035em] min-[761px]:gap-3 min-[761px]:text-[20px]">
          <IconWheel className="size-6 min-[761px]:size-[30px]" />
          Click Wheel
        </Link>
        <nav aria-label="Main" className="ml-auto flex items-center gap-1 text-[14px] min-[761px]:gap-[18px] min-[761px]:text-[16px]">
          {NAV.map(([label, href, section]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === section || pathname.startsWith(`${section}/`) ? "location" : undefined}
              className="rounded-md px-1.5 py-1.5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[761px]:px-2.5 aria-[current]:text-(--site-signal) aria-[current]:underline aria-[current]:decoration-1 aria-[current]:underline-offset-[6px]"
            >
              {label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring min-[761px]:px-2.5"
          >
            <IconGitHub className="size-[18px]" />
            <span className="sr-only min-[761px]:not-sr-only">GitHub</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
