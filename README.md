# The Racket Lifestyle

Premium, Nigeria-focused tennis, badminton and padel commerce MVP built with Next.js, Tailwind CSS, shadcn-compatible components, Supabase, Paystack and Resend integration points.

## Run locally

1. Copy `.env.example` to `.env.local` and add Supabase, Paystack and Resend credentials.
2. Generate a strong `RKL_SECRET` locally with `openssl rand -base64 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`.
3. Run `pnpm install`.
4. In Supabase SQL Editor, run `supabase/migrations/20260821120000_initial_schema.sql` (or link the project and run `supabase db push`).
5. Run `pnpm dev`.

### Add an admin account now

Use the seed script to create or reset the admin user with a hashed password:

```bash
ADMIN_EMAIL=admin@theracketlifestyle.com ADMIN_PASSWORD=admin123 node scripts/seed-admin.mjs
```

This writes the admin user to `data/store.json` using a hashed password, so you can sign in immediately in the local demo environment.

### Link Supabase to this project

1. Create a new Supabase project at https://supabase.com.
2. In the Supabase dashboard, open Project Settings > API and copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon/public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
3. Add those values to `.env.local` and keep the service role key server-only.
4. In the Supabase SQL editor, run the migration SQL from `supabase/migrations/20260821120000_initial_schema.sql`.
5. Restart the Next.js app so the new env values load.

The app can still run in local demo mode without Supabase, but for persistent users, inventory, payments and production login, the Supabase values above should be used.

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
