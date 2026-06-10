import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/admin";
import { adminUpdateProfile } from "@/app/admin/actions";
import { Nav } from "@/components/nav";
import { ProfileForm } from "@/components/profile/profile-form";
import { redirect, notFound } from "next/navigation";
import type { Profile } from "@/lib/types";

export default async function AdminProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const admin = await getIsAdmin(supabase);
  if (!admin) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  // Bind the profile ID into the action so the form only needs FormValues.
  const action = adminUpdateProfile.bind(null, id);

  return (
    <>
      <Nav />
      <main className="pt-14 px-6 py-10">
        <div className="max-w-2xl mx-auto mb-8">
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Admin
          </p>
          <h1 className="font-heading text-3xl">
            Editing: {profile.name ?? profile.email}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Changes are applied immediately. Headshot upload is not available in
            admin edit mode.
          </p>
        </div>
        <ProfileForm profile={profile as Profile} submitAction={action} />
      </main>
    </>
  );
}
