import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { deleteJob } from "@/app/jobs/actions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Job } from "@/lib/types";

export const metadata = {
  title: "Jobs · CMU MHCI Alumni Directory",
};

const WORK_TYPE_LABEL: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const EMPLOYMENT_TYPE_LABEL: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

function timeAgo(dateStr: string) {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default async function JobsPage() {
  const supabase = await createClient();

  const [{ data: jobs }, { data: { user } }] = await Promise.all([
    supabase
      .from("jobs")
      .select("*, poster:profiles!posted_by(id, name)")
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  const currentProfileId = user
    ? (
        await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single()
      ).data?.id ?? null
    : null;

  const listings = (jobs ?? []) as Job[];

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        {/* Header */}
        <section className="border-b border-border px-6 py-16 text-center">
          <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
            CMU MHCI Alumni Directory
          </p>
          <h1 className="font-heading text-5xl md:text-7xl leading-none tracking-tight text-foreground">
            Jobs
          </h1>
          <p className="mt-6 max-w-md mx-auto text-muted-foreground">
            Opportunities shared by MHCI alumni and their networks.
          </p>
          <div className="mt-8">
            {user ? (
              <Link
                href="/jobs/new"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Post a job
              </Link>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Sign in to post
              </Link>
            )}
          </div>
        </section>

        {/* Listings */}
        <div className="max-w-3xl mx-auto px-6 py-16">
          {listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-foreground mb-2">
                No open positions
              </p>
              <p className="text-muted-foreground">
                Be the first to post a job for the MHCI community.
              </p>
            </div>
          ) : (
            <ul className="space-y-0 divide-y divide-border">
              {listings.map((job) => (
                <li key={job.id} className="py-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      {/* Title + company */}
                      <div>
                        <h2 className="font-heading text-xl text-foreground">
                          {job.title}
                        </h2>
                        <p className="text-muted-foreground">
                          {job.company} · {job.location}
                        </p>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary">
                          {WORK_TYPE_LABEL[job.work_type] ?? job.work_type}
                        </Badge>
                        <Badge variant="outline">
                          {EMPLOYMENT_TYPE_LABEL[job.employment_type] ?? job.employment_type}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      {/* Footer: poster + time + apply */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {job.poster && (
                          <Link
                            href={`/people/${job.poster.id}`}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            Posted by {job.poster.name ?? "MHCI Alumni"}
                          </Link>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(job.created_at)}
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <a
                          href={job.application_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            buttonVariants({ variant: "default", size: "sm" })
                          )}
                        >
                          Apply
                        </a>
                      </div>
                    </div>

                    {/* Delete button for owner */}
                    {currentProfileId === job.posted_by && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteJob(job.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="shrink-0 text-xs text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Delete listing"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
