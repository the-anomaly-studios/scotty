"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  graduation_year: z.coerce
    .number({ error: "Graduation year is required" })
    .int()
    .min(1998)
    .max(new Date().getFullYear() + 2),
  linkedin_url: z.string().url("Must be a valid URL").min(1, "LinkedIn URL is required"),
  bio: z.string().max(500).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  personal_email: z.string().email().optional().nullable().or(z.literal("")),
  website: z.string().url().optional().nullable().or(z.literal("")),
  instagram: z.string().max(60).optional().nullable(),
  x: z.string().max(60).optional().nullable(),
  bluesky: z.string().max(60).optional().nullable(),
  tiktok: z.string().max(60).optional().nullable(),
  skills: z.array(z.string()),
  is_mentorship_open: z.boolean(),
  is_featured_eligible: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Called on first login — finds or creates a profile for the authenticated user
export async function claimOrCreateProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Check if user already has a claimed profile
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    redirect(`/profile/edit`);
  }

  // Try to match a stub by email
  const { data: stub } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", user.email!)
    .is("user_id", null)
    .single();

  if (stub) {
    await supabase
      .from("profiles")
      .update({ user_id: user.id })
      .eq("id", stub.id);
    redirect("/profile/edit");
  }

  // No stub — create a fresh profile
  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ email: user.email!, user_id: user.id })
    .select("id")
    .single();

  if (error || !created) {
    throw new Error("Failed to create profile");
  }

  redirect("/profile/edit");
}

export async function updateProfile(values: ProfileFormValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const clean = {
    ...parsed.data,
    personal_email: parsed.data.personal_email || null,
    website: parsed.data.website || null,
  };

  const { error } = await supabase
    .from("profiles")
    .update(clean)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile/edit");
  revalidatePath("/people");
  return { success: true };
}

// The image is uploaded directly from the browser to Supabase Storage (see
// HeadshotUploader); this action only persists the resulting public URL to the
// profile row, so its body is just a short string and never hits the Server
// Action body-size limit.
export async function setHeadshotUrl(url: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Only accept a public URL from our own headshots bucket for this user.
  const expectedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/headshots/${user.id}/`;
  if (!url.startsWith(expectedPrefix)) {
    return { error: "Invalid headshot URL" };
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ headshot_url: url })
    .eq("user_id", user.id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/profile/edit");
  revalidatePath("/people");
  return { success: true, url };
}
