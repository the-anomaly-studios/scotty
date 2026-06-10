import { Nav } from "@/components/nav";
import { PostJobForm } from "@/components/jobs/post-job-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Post a Job · CMU MHCI Alumni Directory",
};

export default async function PostJobPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/profile/setup");

  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="font-heading text-4xl text-foreground mb-2">Post a job</h1>
          <p className="text-muted-foreground mb-10">
            Listings are visible to all alumni for 60 days.
          </p>
          <PostJobForm />
        </div>
      </main>
    </>
  );
}
