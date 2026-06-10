"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  location: z.string().min(1, "Location is required").max(200),
  work_type: z.enum(["remote", "hybrid", "onsite"], { error: "Select a work type" }),
  employment_type: z.enum(["full-time", "part-time", "contract", "internship"], {
    error: "Select an employment type",
  }),
  description: z.string().min(1, "Description is required").max(5000),
  application_url: z.string().url("Must be a valid URL"),
});

export type JobFormValues = z.infer<typeof jobSchema>;

export async function postJob(values: JobFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = jobSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { error: "You need a profile before posting a job." };
  }

  const { error } = await supabase.from("jobs").insert({
    ...parsed.data,
    posted_by: profile.id,
  });

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  redirect("/jobs");
}

export async function deleteJob(jobId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("jobs").delete().eq("id", jobId);
  if (error) return { error: error.message };

  revalidatePath("/jobs");
}
