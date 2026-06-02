import { claimOrCreateProfile } from "@/app/profile/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // claimOrCreateProfile always redirects — this page is a transition step
  await claimOrCreateProfile();
}
