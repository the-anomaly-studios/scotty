import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type NewsStub = {
  id: string;
  title: string;
  published_at: string;
  cover_image_url: string | null;
};

export function RecentNews({ posts }: { posts: NewsStub[] }) {
  return (
    <section className="border-b border-border px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
              Community
            </p>
            <h2 className="font-heading text-3xl text-foreground">Recent news</h2>
          </div>
          <Link
            href="/news"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground"
            )}
          >
            View all news →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No news posts yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.id}`}
                className="group space-y-3"
              >
                {post.cover_image_url ? (
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={post.cover_image_url}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-muted" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h3 className="font-heading text-lg text-foreground mt-0.5 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
