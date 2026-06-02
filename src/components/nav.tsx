import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/people", label: "People" },
  { href: "/jobs", label: "Jobs" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
          <Separator orientation="vertical" className="mx-2 h-5" />
          {user ? (
            <SignOutButton />
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            >
              Sign in
            </Link>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
