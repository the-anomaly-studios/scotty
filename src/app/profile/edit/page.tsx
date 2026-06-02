import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Nav } from "@/components/nav";
import { ProfileForm } from "@/components/profile/profile-form";
import type { Profile } from "@/lib/types";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/profile/setup");

  return (
    <>
      <Nav />
      <main className="pt-14 px-6 py-10">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="font-heading text-3xl">Edit your profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your profile is visible to everyone. Required fields are marked with{" "}
            <span className="text-destructive">*</span>
          </p>
        </div>
        <ProfileForm profile={profile as Profile} />
      </main>
    </>
  );
}
