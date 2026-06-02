"use client";

import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <Button type="submit" variant="outline" className="gap-2">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </form>
  );
}
