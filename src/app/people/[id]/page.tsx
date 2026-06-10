import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";
import { Globe, Mail } from "lucide-react";
import { RequestMentorship } from "@/components/mentorship/request-mentorship";
import { getIsAdmin } from "@/lib/admin";
import { adminDeactivateProfile } from "@/app/admin/actions";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!profile) notFound();

  const p = profile as Profile;
  const displayName = p.name ?? "MHCI Alumni";

  // Determine the viewer so we can show the right mentorship CTA.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let viewerProfileId: string | null = null;
  if (user) {
    const { data: viewerProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();
    viewerProfileId = viewerProfile?.id ?? null;
  }
  const isAdminViewer = await getIsAdmin(supabase);

  return (
    <>
      <Nav />
      <main className="pt-14 min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Admin toolbar */}
          {isAdminViewer && (
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 text-sm">
              <span className="text-xs uppercase tracking-widest text-muted-foreground mr-2">Admin</span>
              <Link
                href={`/admin/profiles/${p.id}/edit`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Edit profile
              </Link>
              <form
                action={async () => {
                  "use server";
                  await adminDeactivateProfile(p.id);
                }}
              >
                <button
                  type="submit"
                  className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
                >
                  Deactivate
                </button>
              </form>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted border border-border shrink-0">
              {p.headshot_url ? (
                <Image src={p.headshot_url} alt={displayName} fill className="object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full font-heading text-3xl text-muted-foreground">
                  {displayName[0]?.toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-3xl leading-tight">{displayName}</h1>
              {(p.role || p.company) && (
                <p className="text-muted-foreground mt-1">
                  {[p.role, p.company].filter(Boolean).join(" · ")}
                </p>
              )}
              {p.location && (
                <p className="text-sm text-muted-foreground mt-0.5">{p.location}</p>
              )}
              {p.graduation_year && (
                <p className="text-sm text-muted-foreground mt-0.5">MHCI {p.graduation_year}</p>
              )}
              {p.is_mentorship_open && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge variant="secondary">Open to mentorship</Badge>
                  <RequestMentorship
                    toProfileId={p.id}
                    fromProfileId={viewerProfileId}
                    mentorName={displayName}
                    isAuthed={Boolean(user)}
                    isSelf={viewerProfileId === p.id}
                  />
                </div>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid gap-8">
            {/* Bio */}
            {p.bio && (
              <div>
                <h2 className="font-heading text-lg mb-2">About</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{p.bio}</p>
              </div>
            )}

            {/* Skills */}
            {p.skills.length > 0 && (
              <div>
                <h2 className="font-heading text-lg mb-3">Skills & focus areas</h2>
                <div className="flex flex-wrap gap-2">
                  {p.skills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(p.linkedin_url || p.personal_email || p.website || p.instagram || p.x || p.bluesky || p.tiktok) && (
              <div>
                <h2 className="font-heading text-lg mb-3">Links</h2>
                <div className="flex flex-wrap gap-2">
                  {p.linkedin_url && (
                    <Link
                      href={p.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <LinkedInIcon /> LinkedIn
                    </Link>
                  )}
                  {p.personal_email && (
                    <Link
                      href={`mailto:${p.personal_email}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <Mail className="h-4 w-4" /> Email
                    </Link>
                  )}
                  {p.website && (
                    <Link
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <Globe className="h-4 w-4" /> Website
                    </Link>
                  )}
                  {p.instagram && (
                    <Link
                      href={`https://instagram.com/${p.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <InstagramIcon /> Instagram
                    </Link>
                  )}
                  {p.x && (
                    <Link
                      href={`https://x.com/${p.x.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <XIcon /> X
                    </Link>
                  )}
                  {p.bluesky && (
                    <Link
                      href={`https://bsky.app/profile/${p.bluesky.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <BlueSkyIcon /> Bluesky
                    </Link>
                  )}
                  {p.tiktok && (
                    <Link
                      href={`https://tiktok.com/@${p.tiktok.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                    >
                      <TikTokIcon /> TikTok
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function BlueSkyIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 600 530" fill="currentColor" aria-hidden="true">
      <path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.604-132.26 82.697-152.22-67.108 11.421-142.55-7.449-163.25-81.433C20.155 217.613 10 86.532 10 68.825c0-88.687 77.742-60.816 125.72-24.795z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}
