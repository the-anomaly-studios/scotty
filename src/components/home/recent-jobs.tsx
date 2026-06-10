import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Job } from "@/lib/types";

const WORK_TYPE_LABEL: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export function RecentJobs({ jobs }: { jobs: Job[] }) {
  return (
    <section className="border-b border-border px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Opportunities
            </p>
            <h2 className="font-heading text-3xl text-foreground">Recent jobs</h2>
          </div>
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground"
            )}
          >
            View all jobs →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No open positions yet.{" "}
            <Link href="/jobs/new" className="underline underline-offset-4 hover:text-foreground">
              Post one.
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {jobs.map((job) => (
              <li key={job.id} className="py-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{job.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {job.company} · {job.location}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="hidden sm:flex">
                    {WORK_TYPE_LABEL[job.work_type] ?? job.work_type}
                  </Badge>
                  <a
                    href={job.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Apply
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
