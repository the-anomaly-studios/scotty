# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

CMU MHCI Alumni Directory — a public alumni directory for Carnegie Mellon's Masters in Human-Computer Interaction program. Built with Next.js 16 (App Router), Supabase, and Shadcn/UI.

> **Important:** This is Next.js 16 with breaking changes. Read `node_modules/next/dist/docs/` before writing code. The proxy file convention replaces middleware — use `src/proxy.ts`, not `src/middleware.ts`.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (also runs TypeScript check)
npm run lint     # ESLint
```

No test suite yet. TypeScript errors surface via `npm run build`.

To add a Shadcn component:
```bash
npx shadcn@latest add <component-name>
```

## Architecture

### Stack
- **Next.js 16 App Router** with React Server Components (RSC) by default
- **Supabase** for database, auth, and file storage
- **Tailwind v4** — config lives entirely in `src/app/globals.css` via `@theme inline {}`, not in a `tailwind.config.ts`
- **Shadcn/UI** using the `base-nova` style with `@base-ui/react` (not Radix). This means `asChild` prop does not exist on Button — use `buttonVariants` with a `<Link>` instead
- **next-themes** for dark mode persistence (class strategy)

### Supabase clients — use the right one
- `src/lib/supabase/server.ts` — Server Components, Route Handlers, Server Actions (async, uses `cookies()`)
- `src/lib/supabase/client.ts` — Client Components only (`'use client'`)
- `src/lib/supabase/middleware.ts` — proxy session refresh and CMU domain enforcement

### Auth flow
Google OAuth via Supabase, restricted to `@andrew.cmu.edu` and `@alumni.cmu.edu`. Domain enforcement runs in `src/proxy.ts` — non-CMU sessions are signed out and redirected to `/auth/error`. The OAuth callback hits `/auth/callback/route.ts` which exchanges the code and redirects to `/profile/setup`.

### Design tokens
Defined as CSS custom properties in `src/app/globals.css`:
- `--primary` = CMU cardinal red (`oklch(0.44 0.213 18.5)` ≈ `#C41230`)
- `--background` = warm off-white in light mode, dark blue-grey in dark mode
- `--font-heading` = Instrument Serif (apply with `font-heading` class)
- `--font-sans` = Inter (default body font)

### Database
Migrations live in `supabase/migrations/`. Run them via the Supabase SQL editor or Supabase MCP (configured for this project). Current tables: `public.user_meta` (extends `auth.users`, holds `is_admin` flag, auto-created via trigger on signup).

### Routing conventions
- Protected routes (e.g. `/profile`, `/jobs/new`) redirect to `/login` in `src/lib/supabase/middleware.ts`
- `Nav` is a Server Component — it fetches the current user from Supabase on every render to show Sign in / Sign out state
- Server Actions for auth live in `src/app/auth/actions.ts`

### Commits
Do not add Claude as a co-author or contributor in commit messages.
