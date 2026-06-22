"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, UserRound, LogOut } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/people", label: "People" },
  { href: "/jobs", label: "Jobs" },
  { href: "/news", label: "News" },
  { href: "/about", label: "About" },
];

type Props = {
  user: { email: string } | null;
  avatarUrl?: string | null;
};

export function MobileMenu({ user, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const initial = user?.email?.[0]?.toUpperCase() ?? "";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent transition-colors"
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle className="font-heading text-lg font-normal">Menu</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 mt-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden bg-muted border border-border">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={user.email} fill className="object-cover" />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground select-none">
                      {initial}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground truncate">{user.email}</span>
              </div>
              <Link
                href="/profile/edit"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                <UserRound className="h-4 w-4" />
                Edit Profile
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-accent rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full justify-center")}
            >
              Sign in
            </Link>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between px-3 py-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
