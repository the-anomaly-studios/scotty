import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function JoinCTA() {
  return (
    <section className="px-6 py-24 text-center">
      <div className="max-w-xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
          Join the community
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl text-foreground leading-tight">
          Are you an MHCI alum?
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Create your profile to appear in the directory, post jobs, and connect
          with fellow graduates.
        </p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
            Join the directory
          </Link>
          <Link
            href="/about"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
