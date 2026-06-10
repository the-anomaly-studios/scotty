import { Nav } from "@/components/nav";
import { HeroTitle } from "@/components/hero/hero-title";
import { StatsBar } from "@/components/home/stats-bar";
import { FeaturedAlumni } from "@/components/home/featured-alumni";
import { RecentJobs } from "@/components/home/recent-jobs";
import { RecentNews } from "@/components/home/recent-news";
import { JoinCTA } from "@/components/home/join-cta";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Profile, Job } from "@/lib/types";

// Returns year * 100 + ISO week number — stable for the whole week.
function isoWeekSeed(): number {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return d.getUTCFullYear() * 100 + week;
}

// Mulberry32 PRNG — deterministic shuffle given the same seed.
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default async function Home() {
  const supabase = await createClient();

  const [
    { data: allMeta },
    { data: featuredPool },
    { data: jobRows },
    { data: newsRows },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase.from("profiles").select("company, location").eq("is_active", true),
    supabase
      .from("profiles")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured_eligible", true),
    supabase
      .from("jobs")
      .select("*, poster:profiles!posted_by(id, name)")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("news")
      .select("id, title, published_at, cover_image_url")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase.auth.getUser(),
  ]);

  // Stats
  const meta = allMeta ?? [];
  const totalAlumni = meta.length;
  const uniqueCompanies = new Set(
    meta.map((p) => p.company as string | null).filter(Boolean)
  ).size;
  const uniqueLocations = new Set(
    meta
      .map((p) => {
        if (!p.location) return null;
        const parts = (p.location as string).split(",").map((s) => s.trim());
        return parts[parts.length - 1] || null;
      })
      .filter(Boolean)
  ).size;

  // Featured alumni — seeded weekly shuffle, capped at 6
  const featured = seededShuffle(featuredPool ?? [], isoWeekSeed()).slice(
    0,
    6
  ) as Profile[];

  const jobs = (jobRows ?? []) as Job[];

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        {/* Hero */}
        <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6">
          <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6 font-sans">
            Carnegie Mellon University
          </p>
          <HeroTitle text="CMU MHCI" />
          <p className="mt-8 max-w-md text-muted-foreground text-lg leading-relaxed">
            A community directory for alumni of the Masters in Human-Computer
            Interaction program.
          </p>
          <div className="mt-10 flex gap-3 flex-wrap justify-center">
            <Link href="/people" className={cn(buttonVariants({ size: "lg" }))}>
              Browse Alumni
            </Link>
            <Link
              href="/about"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Live stats */}
        <StatsBar
          totalAlumni={totalAlumni}
          uniqueCompanies={uniqueCompanies}
          uniqueLocations={uniqueLocations}
        />

        {/* Featured alumni */}
        {featured.length > 0 && <FeaturedAlumni profiles={featured} />}

        {/* Recent jobs */}
        <RecentJobs jobs={jobs} />

        {/* Recent news */}
        <RecentNews posts={newsRows ?? []} />

        {/* Join CTA — only for unauthenticated visitors */}
        {!user && <JoinCTA />}
      </main>
    </>
  );
}
