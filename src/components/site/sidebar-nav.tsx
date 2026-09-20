"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PAGES } from "@/content/docs";

const GROUPS = ["Basics", "Examples"] as const;

/** The docs sidebar. A column on large screens, a scrolling strip on small ones. */
export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <nav aria-label="Docs" className="hidden w-48 shrink-0 lg:block">
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10 pr-4">
          {GROUPS.map((group) => (
            <div key={group} className="mb-7">
              <p className="mb-2 text-xs font-medium">{group}</p>
              <ul className="space-y-0.5 text-sm">
                {PAGES.filter((page) => page.group === group).map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={page.href}
                      aria-current={pathname === page.href ? "page" : undefined}
                      className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground aria-[current]:bg-accent aria-[current]:text-foreground"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <nav aria-label="Docs" className="-mx-5 overflow-x-auto border-b px-5 lg:hidden">
        <ul className="flex gap-1 py-2 text-sm whitespace-nowrap">
          {PAGES.map((page) => (
            <li key={page.slug}>
              <Link
                href={page.href}
                aria-current={pathname === page.href ? "page" : undefined}
                className="block rounded-md px-2.5 py-1.5 text-muted-foreground aria-[current]:bg-accent aria-[current]:text-foreground"
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
