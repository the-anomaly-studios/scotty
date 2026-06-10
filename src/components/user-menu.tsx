"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/app/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserRound } from "lucide-react";

type Props = {
  avatarUrl?: string | null;
  email: string;
};

export function UserMenu({ avatarUrl, email }: Props) {
  const initial = email[0].toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-muted border border-border hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open user menu"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt={email} fill className="object-cover" />
        ) : (
          <span className="text-xs font-medium text-muted-foreground select-none">
            {initial}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem>
          <Link href="/profile/edit" className="flex items-center gap-2 w-full">
            <UserRound className="h-4 w-4" />
            Edit Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <form action={signOut} className="w-full">
            <button type="submit" className="flex items-center gap-2 w-full">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
