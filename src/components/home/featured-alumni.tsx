import { ProfileCard } from "@/components/people/profile-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Profile } from "@/lib/types";

export function FeaturedAlumni({ profiles }: { profiles: Profile[] }) {
  return (
    <section className="border-b border-border px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Featured this week
            </p>
            <h2 className="font-heading text-3xl text-foreground">Alumni spotlight</h2>
          </div>
          <Link
            href="/people"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground"
            )}
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
