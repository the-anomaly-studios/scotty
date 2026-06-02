# CMU MHCI Alumni Directory

A community directory for alumni of the [Masters in Human-Computer Interaction](https://hcii.cmu.edu/academics/mhci) program at Carnegie Mellon University. Browse alumni profiles, find job opportunities, and connect with fellow MHCI graduates.

## Stack

- **Next.js 16** (App Router)
- **Supabase** — database, auth, and file storage
- **Tailwind CSS v4** + **Shadcn/UI**
- **Resend** — transactional email for mentorship requests
- Deployed on **Vercel**

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project with Google OAuth configured for `@andrew.cmu.edu` and `@alumni.cmu.edu` accounts

### Environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
```

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Migrations live in `supabase/migrations/`. Apply them via the Supabase SQL editor in order.

## Features

- **People directory** — searchable, filterable grid of alumni profiles with skills, location, and mentorship availability
- **Jobs board** — alumni-posted opportunities, auto-expiring after 60 days
- **Mentorship requests** — send a message directly to any alumni open to mentorship
- **News** — program announcements and alumni spotlights
- **Google OAuth** — sign in with your CMU email; only `@andrew.cmu.edu` and `@alumni.cmu.edu` accounts are accepted

## Project Tracking

Issues and implementation slices are tracked on GitHub: [the-anomaly-studios/scotty](https://github.com/the-anomaly-studios/scotty/issues). Parent PRD is [issue #1](https://github.com/the-anomaly-studios/scotty/issues/1).
