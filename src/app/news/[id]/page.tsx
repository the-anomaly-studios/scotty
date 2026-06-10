import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { marked } from "marked";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("title")
    .eq("id", id)
    .single();
  return { title: data ? `${data.title} · CMU MHCI News` : "News" };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  const bodyHtml = await marked(post.body);

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <article className="max-w-2xl mx-auto px-6 py-16 space-y-8">
          {/* Back */}
          <Link
            href="/news"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← All news
          </Link>

          {/* Header */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="font-heading text-4xl md:text-5xl leading-tight text-foreground">
              {post.title}
            </h1>
          </div>

          {/* Cover image */}
          {post.cover_image_url && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={post.cover_image_url}
                alt=""
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Body */}
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* External link CTA */}
          {post.external_link && (
            <div className="pt-4 border-t border-border">
              <a
                href={post.external_link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                Learn More
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
