import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const messages: Record<string, { title: string; description: string }> = {
  domain: {
    title: "Account not eligible",
    description:
      "Only @andrew.cmu.edu and @alumni.cmu.edu Google accounts can access this directory. Please sign in with your CMU email address.",
  },
  oauth: {
    title: "Sign-in failed",
    description:
      "Something went wrong during sign-in. Please try again.",
  },
  callback: {
    title: "Authentication error",
    description:
      "We couldn't complete the sign-in flow. Please try again.",
  },
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const { title, description } = messages[reason ?? ""] ?? messages.callback;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-4xl text-foreground">CMU MHCI</h1>
          <p className="mt-2 text-sm text-muted-foreground">Alumni Directory</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-xl font-normal">
              Sign-in error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{title}</AlertTitle>
              <AlertDescription>{description}</AlertDescription>
            </Alert>

            <Separator />

            <Link
              href="/login"
              className={cn(buttonVariants({ size: "lg" }), "w-full")}
            >
              Try again
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
