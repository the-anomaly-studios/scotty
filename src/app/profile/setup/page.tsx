import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/sign-out-button";
import { Nav } from "@/components/nav";

export default async function ProfileSetupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <>
      <Nav />
      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-14">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="font-heading text-2xl font-normal">
              Welcome, {user.user_metadata?.full_name?.split(" ")[0] ?? "there"}
            </CardTitle>
            <CardDescription>
              You&apos;re signed in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>.
              Profile setup is coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignOutButton />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
