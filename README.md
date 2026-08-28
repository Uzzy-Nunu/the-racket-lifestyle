# The Racket Lifestyle

Premium, Nigeria-focused tennis, badminton and padel commerce MVP built with Next.js, Tailwind CSS, shadcn-compatible components, Supabase, Paystack and Resend integration points.

## Run locally

1. Copy `.env.example` to `.env.local` and add Supabase, Paystack and Resend credentials.
2. Run `pnpm install`.
3. In Supabase SQL Editor, run `supabase/migrations/20260821120000_initial_schema.sql` (or link the project and run `supabase db push`).
4. Run `pnpm dev`.

Without payment credentials, checkout uses a safe local hand-off flow so you can evaluate the UI. Adding `PAYSTACK_SECRET_KEY` enables real Paystack initialization; do not test real payments until the payment verification and order persistence steps are connected to your production Supabase project.

## Deploy to Vercel

1. Import the GitHub repository `https://github.com/Uzzy-Nunu/the-racket-lifestyle.git` into Vercel.
2. Select the Next.js project framework automatically (the repo includes a `vercel.json` configuration for the standard build and output settings).
3. Add the environment variables from `.env.example` in the Vercel dashboard under Project > Settings > Environment Variables.
4. Set the production branch to `master` (or `main` if you rename it locally before the push).
5. Trigger the first deployment and verify the build succeeds.

## Structure

- `app/` — storefront, checkout, protected admin routes, and route handlers
- `components/` — reusable UI and client cart state
- `lib/` — product data, validation, Supabase, Paystack and Resend services
- `supabase/schema.sql` — initial database schema and core RLS policies
- `supabase/migrations/` — versioned schema migration ready for Supabase CLI / SQL Editor
- `docs/` — supplied project specifications (source of truth)
- `TODO.md` — delivery checklist and next milestones

## Security notes

- Keep all secret keys server-only; never prefix them with `NEXT_PUBLIC_`.
- Admin access uses Supabase Auth plus the `users.role` value (`admin` or `operations`).
- Webhook signatures are checked before processing. Persist webhook event IDs / payment references before production to make processing fully idempotent.
- Prices are recalculated server-side from authoritative products. The temporary seed catalogue is in `lib/products.ts`; replace it with Supabase queries before launch.
