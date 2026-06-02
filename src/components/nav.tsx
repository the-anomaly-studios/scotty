import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/people", label: "People" },
  { href: "/jobs", label: "Jobs" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-lg font-normal tracking-tight text-foreground hover:text-primary transition-colors"
        >
          CMU MHCI
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 pl-2 border-l border-border">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
