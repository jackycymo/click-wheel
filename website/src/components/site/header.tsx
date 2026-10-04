"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconWheel } from "./icons";

const NAV = [
  ["Docs", "/docs", "/docs"],
  ["Examples", "/examples/default", "/examples"],
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-inner flex items-center justify-between">
        <Link href="/" className="site-header-brand flex items-center font-medium">
          <IconWheel width={24} height={24} />
          Click Wheel
        </Link>
        <nav aria-label="Main" className="flex items-center">
          {NAV.map(([label, href, section]) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === section || pathname.startsWith(`${section}/`) ? "location" : undefined}
              className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
