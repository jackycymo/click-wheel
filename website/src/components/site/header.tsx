import Link from "next/link";
import { IconWheel } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  ["Docs", "/docs"],
  ["Examples", "/examples/default"],
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium">
          <IconWheel width={24} height={24} />
          Click Wheel
        </Link>
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {NAV.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-2.5 py-1.5 transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
