"use server";

import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProfileFormValues } from "@/app/profile/actions";

async function requireAdmin() {
  const supabase = await createClient();
  const admin = await getIsAdmin(supabase);
  if (!admin) {
    return { supabase: null, error: "Forbidden" as const };
  }
  return { supabase, error: null };
}

export async function adminDeactivateProfile(profileId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: dbError } = await supabase!
    .from("profiles")
    .update({ is_active: false })
    .eq("id", profileId);

  if (dbError) return { error: dbError.message };

  revalidatePath("/people");
  revalidatePath(`/people/${profileId}`);
  redirect("/people");
}

export async function adminUpdateProfile(
  profileId: string,
  values: ProfileFormValues
) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const clean = {
    ...values,
    personal_email: values.personal_email || null,
    website: values.website || null,
  };

  const { error: dbError } = await supabase!
    .from("profiles")
    .update(clean)
    .eq("id", profileId);

  if (dbError) return { error: dbError.message };

  revalidatePath("/people");
  revalidatePath(`/people/${profileId}`);
  return { success: true };
}
