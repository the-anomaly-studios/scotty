import { Nav } from "@/components/nav";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "About · CMU MHCI Alumni Directory",
  description:
    "About the community-maintained CMU MHCI Alumni Directory and how to join.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        {/* About the Directory */}
        <section className="border-b border-border px-6 py-20 text-center">
          <h1 className="font-heading text-5xl md:text-7xl leading-none tracking-tight text-foreground">
            About This Directory
          </h1>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
          <section className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              This site is a community-maintained directory of MHCI alumni. It
              exists to make it easy to find and reconnect with fellow graduates
              — by graduation year, role, location, or skill. It is not
              affiliated with or operated by Carnegie Mellon University.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Profiles are created and controlled by alumni themselves. Only
              verified CMU email addresses can sign in, so every person in the
              directory is a real member of the community.
            </p>
          </section>

          <Separator />

          {/* How to Join */}
          <section className="space-y-6">
            <h2 className="font-heading text-3xl text-foreground">
              Join the Directory
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Getting listed takes about two minutes and requires only your CMU
              Google account.
            </p>
            <ol className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Sign in with Google",
                  body: 'Click "Sign In" in the navigation bar and authenticate with your @andrew.cmu.edu or @alumni.cmu.edu Google account. No other accounts are accepted.',
                },
                {
                  step: "2",
                  title: "Create or claim your profile",
                  body: "After signing in you will be prompted to set up your profile. Add your graduation year, current role, location, and any skills or interests you want to share.",
                },
                {
                  step: "3",
                  title: "You're listed",
                  body: "Your public profile is immediately visible in the directory. You can edit or delete it at any time from your profile page.",
                },
              ].map(({ step, title, body }) => (
                <li key={step} className="flex gap-4">
                  <span className="font-heading text-2xl text-primary leading-none mt-0.5 shrink-0">
                    {step}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="pt-2">
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Sign In to Join
              </Link>
            </div>
          </section>

          <Separator />

          {/* Contact + Links */}
          <section className="space-y-4">
            <h2 className="font-heading text-3xl text-foreground">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions, corrections, or requests to have your data removed,
              email{" "}
              <a
                href="mailto:christian@theanomalystudios.com"
                className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                christian@theanomalystudios.com
              </a>
              .
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For information about the MHCI program itself, visit the official{" "}
              <a
                href="https://hcii.cmu.edu/academics/mhci"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                CMU MHCI program page
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
