# CMU MHCI Alumni Directory

A community-maintained directory for alumni of the [Masters in Human-Computer Interaction](https://hcii.cmu.edu/academics/mhci) program at Carnegie Mellon University. Browse profiles, post jobs, request mentorship, and stay up to date with program news — all behind CMU Google OAuth so every person in the directory is a verified alum.

## Features

| Feature | Details |
|---|---|
| **People directory** | Searchable, filterable grid of alumni profiles — by name, role, company, graduation year, location, skills, and mentorship availability |
| **Jobs board** | Alumni-posted opportunities across any role or industry; listings auto-expire after 60 days |
| **Mentorship requests** | One-click email to any alum who has opted in; falls back to LinkedIn when no personal email is shared |
| **News** | Program announcements and alumni spotlights, markdown-rendered |
| **WebGL hero** | Three.js simplex-noise text distortion on the home page; CSS shimmer fallback on touch devices |
| **Admin tooling** | Admins can deactivate profiles, edit any profile, and remove any job posting |
| **CMU-only auth** | Google OAuth via Supabase, restricted to `@andrew.cmu.edu` and `@alumni.cmu.edu` |

## Tech Stack

- **[Next.js 16](https://nextjs.org/)** — App Router, React Server Components, Server Actions
- **[Supabase](https://supabase.com/)** — Postgres database, Google OAuth, file storage (headshots), row-level security
- **[Tailwind CSS v4](https://tailwindcss.com/)** + **[Shadcn/UI](https://ui.shadcn.com/)** (base-nova style, base-ui primitives)
- **[Resend](https://resend.com/)** — transactional email for mentorship requests
- **[Three.js](https://threejs.org/)** — WebGL hero animation
- **[Zod](https://zod.dev/)** + **[React Hook Form](https://react-hook-form.com/)** — form validation

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com/) project with **Google OAuth** configured
  - Allowed redirect URL: `http://localhost:3000/auth/callback`
  - Restrict sign-ins to `@andrew.cmu.edu` and `@alumni.cmu.edu` (enforced in `src/proxy.ts`)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Optional — required for mentorship request emails
RESEND_API_KEY=re_...
MENTORSHIP_FROM_EMAIL=onboarding@resend.dev   # use your verified domain in production
```

### 3. Apply database migrations

Migrations live in `supabase/migrations/`. Apply them in order via the Supabase SQL editor or the Supabase CLI:

```bash
# Using the Supabase CLI (requires supabase login)
supabase db push
```

The migrations create four tables — `user_meta`, `profiles`, `news`, `jobs` — plus storage policies for the `headshots` bucket.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home — hero, stats, featured alumni, jobs, news
│   ├── about/                # Static about page
│   ├── people/               # Alumni directory + public profile pages
│   ├── jobs/                 # Jobs board + post-a-job form
│   ├── news/                 # News list + detail pages
│   ├── profile/              # Authenticated profile setup & edit
│   ├── admin/                # Admin-only profile edit
│   └── api/mentorship/       # Email API route (Resend)
├── components/
│   ├── hero/                 # Three.js WebGL title + mobile fallback
│   ├── home/                 # Stats bar, featured alumni, recent jobs/news, CTA
│   ├── people/               # ProfileCard, PeopleDirectory (search + filters)
│   ├── jobs/                 # PostJobForm
│   ├── mentorship/           # RequestMentorship dialog
│   └── profile/              # ProfileForm, HeadshotUploader, SkillsInput
├── lib/
│   ├── supabase/             # server.ts, client.ts, middleware.ts
│   ├── email/                # Resend email templates
│   ├── admin.ts              # getIsAdmin() helper
│   └── types.ts              # Shared TypeScript types
└── proxy.ts                  # Next.js 16 proxy (replaces middleware.ts)
```

> **Next.js 16 note:** This project uses the proxy file convention. Session refresh and route protection live in `src/proxy.ts`, not `src/middleware.ts`.

## Available Commands

```bash
npm run dev      # Development server at localhost:3000
npm run build    # Production build + TypeScript check
npm run lint     # ESLint
```

To add a Shadcn component:

```bash
npx shadcn@latest add <component-name>
```

## Authentication Flow

1. User clicks **Sign in** → `signInWithGoogle()` server action → Supabase Google OAuth
2. OAuth callback hits `/auth/callback` → exchanges code, redirects to `/profile/setup`
3. `src/proxy.ts` checks every request — non-CMU sessions are signed out and redirected to `/auth/error`
4. Protected routes (`/profile`, `/jobs/new`, `/admin`) redirect unauthenticated users to `/login`

## Admin Access

Set `is_admin = true` in the `public.user_meta` table for a user (via the Supabase dashboard). Admins gain:

- A toolbar on every public profile page with **Edit** and **Deactivate** buttons
- A **Delete** button on all job listings
- Access to `/admin/profiles/[id]/edit` to update any profile

All admin mutations are gated server-side by `getIsAdmin()` in addition to Supabase RLS policies.

## Mentorship Email Setup

1. Create a free account at [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Optionally verify a sending domain and update `MENTORSHIP_FROM_EMAIL`

Until a domain is verified, Resend's sandbox sender (`onboarding@resend.dev`) only delivers to your own account email — sufficient for local testing.

## Where to Get Help

- **Issues & PRD:** [github.com/the-anomaly-studios/scotty/issues](https://github.com/the-anomaly-studios/scotty/issues)
- **Supabase docs:** [supabase.com/docs](https://supabase.com/docs)
- **Next.js docs:** [nextjs.org/docs](https://nextjs.org/docs)

## Maintainer

Built and maintained by [Christian Johnson](https://github.com/cjallday7). This is not an official Carnegie Mellon University project.
