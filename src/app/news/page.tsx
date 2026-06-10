import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "News · CMU MHCI Alumni Directory",
};

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("news")
    .select("id, title, published_at, cover_image_url, external_link")
    .order("published_at", { ascending: false });

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <section className="border-b border-border px-6 py-16 text-center">
          <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
            CMU MHCI Alumni Directory
          </p>
          <h1 className="font-heading text-5xl md:text-7xl leading-none tracking-tight text-foreground">
            News
          </h1>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-16">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading text-2xl text-foreground mb-2">
                Nothing here yet
              </p>
              <p className="text-muted-foreground">
                Check back later for program news and community updates.
              </p>
            </div>
          ) : (
            <ul className="space-y-10">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/news/${post.id}`}
                    className="group block space-y-3"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={post.cover_image_url}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {new Date(post.published_at).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                      <h2 className="font-heading text-2xl text-foreground group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
