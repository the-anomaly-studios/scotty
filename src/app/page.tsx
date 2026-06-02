import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        {/* Hero */}
        <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6 font-sans">
            Carnegie Mellon University
          </p>
          <h1 className="font-heading text-[clamp(4rem,16vw,14rem)] leading-none tracking-tight text-foreground">
            CMU MHCI
          </h1>
          <p className="mt-8 max-w-md text-muted-foreground text-lg leading-relaxed">
            A community directory for alumni of the Masters in Human-Computer
            Interaction program.
          </p>
          <div className="mt-10 flex gap-3 flex-wrap justify-center">
            <Link href="/people" className={cn(buttonVariants({ size: "lg" }))}>
              Browse Alumni
            </Link>
            <Link href="/about" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Learn More
            </Link>
          </div>
        </section>

        {/* Design system preview — verifies tokens are working */}
        <section className="border-t border-border px-6 py-16 max-w-7xl mx-auto">
          <h2 className="font-heading text-3xl mb-8 text-foreground">Design System</h2>
          <div className="grid gap-8">
            {/* Colors */}
            <div>
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Colors</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary" />
                  <span className="text-sm">Primary (CMU Red)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-background border border-border" />
                  <span className="text-sm">Background (Off-white)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-muted" />
                  <span className="text-sm">Muted</span>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Typography</p>
              <p className="font-heading text-4xl">Instrument Serif — headings</p>
              <p className="font-sans text-base mt-2 text-muted-foreground">Inter — body text and UI</p>
            </div>

            {/* Badges */}
            <div>
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge>UX Research</Badge>
                <Badge>Product Design</Badge>
                <Badge variant="outline">Accessibility</Badge>
                <Badge variant="secondary">Open to Mentorship</Badge>
              </div>
            </div>

            {/* Card */}
            <div>
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Card</p>
              <Card className="max-w-sm">
                <CardContent className="pt-6">
                  <p className="font-heading text-xl">Jane Smith</p>
                  <p className="text-sm text-muted-foreground mt-1">Product Designer · MHCI 2022</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">UX Research</Badge>
                    <Badge variant="outline">Figma</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Buttons */}
            <div>
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Buttons</p>
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
