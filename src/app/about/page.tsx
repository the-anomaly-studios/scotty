import { Nav } from "@/components/nav";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const metadata = {
  title: "About · CMU MHCI Alumni Directory",
  description:
    "Learn about the CMU Master of Human-Computer Interaction program and how to join the alumni directory.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-14">
        {/* Hero */}
        <section className="border-b border-border px-6 py-20 text-center">
          <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
            Carnegie Mellon University
          </p>
          <h1 className="font-heading text-5xl md:text-7xl leading-none tracking-tight text-foreground">
            About MHCI
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-muted-foreground text-lg leading-relaxed">
            The Masters in Human-Computer Interaction at Carnegie Mellon — the
            longest-running and most impactful HCI program in the world.
          </p>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
          {/* Program Overview */}
          <section className="space-y-4">
            <h2 className="font-heading text-3xl text-foreground">
              The Program
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              CMU&apos;s MHCI was the first program in the world dedicated
              entirely to preparing professionals for careers in human-computer
              interaction, user experience design, and user-centered research.
              Completed over one calendar year (August through August), the
              curriculum blends service and design thinking with rigorous HCI
              training.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Each cohort brings together students with diverse backgrounds —
              design, social science, business, and computer science — guided by
              faculty who are actively driving and defining the field. The
              program holds STEM designation and has produced over 1,200
              graduates since 1997.
            </p>
          </section>

          <Separator />

          {/* Highlights */}
          <section className="space-y-6">
            <h2 className="font-heading text-3xl text-foreground">
              What Makes It Distinctive
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  Capstone Project
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A seven-month, research-and-design team project with a real
                  industry client. Alumni consistently cite it as the most
                  formative experience of the program.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  Interdisciplinary Cohort
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Students arrive from design, psychology, business, and
                  engineering, bringing varied industry experience into every
                  studio critique and research session.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">
                  Faculty Expertise
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Professors draw from computer science, cognitive psychology,
                  behavioral science, and design — many are actively publishing
                  and practicing in the field.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground">Alumni Impact</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Graduates work as UX researchers, experience designers,
                  product managers, entrepreneurs, and engineers at
                  organizations shaping technology worldwide.
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* About the Directory */}
          <section className="space-y-4">
            <h2 className="font-heading text-3xl text-foreground">
              About This Directory
            </h2>
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
