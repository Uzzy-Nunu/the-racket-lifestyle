# AGENTS.md

## Project
The Racket Lifestyle — premium tennis, badminton and padel commerce, Nigeria-focused (Lagos and Abuja primary, nationwide shipping).

## Source of truth
Read:
- docs/00-project-context.md
- docs/01-prd/product-requirements.md
- docs/02-database/schema-and-data-dictionary.md
- docs/03-user-flows/user-journeys-and-flowcharts.md
- docs/04-design/brand-and-design-system.md
- docs/04-design/brand-identity-and-website-content.md
- docs/05-api/api-and-integration-specs.md
- docs/06-ai/ai-prompt-library.md
- docs/07-build/codex-build-roadmap.md

## Stack
Next.js
Node.js
Supabase
n8n
Resend
Vercel

## Rules
- Do not invent requirements.
- Database and deterministic backend rules are authoritative.
- AI must not be authoritative for money, payment status or order states.
- Keep every sourcing platform behind the supplier-adapter/registry interface — no platform is hard-coded as required; see `docs/06-ai/supplier-strategy.md`. Adding or swapping a platform must be a config/admin change, never a rewrite of order or fulfillment code.
- Payment provider is Paystack only for V1 — the provider interface stays abstract at the type level, but do not build a second provider unless explicitly asked.
- Never expose secrets to the browser.
- Do not store raw card data.
- Validate all external input.
- Protect admin routes.
- Make webhooks and fulfillment idempotent.
- Use structured AI outputs and schema validation.
- Run tests/type checks/lint after changes.
- Implement only the requested milestone.
- Do not deploy to Vercel until local acceptance passes.

## UI
Use the supplied brand reference and the project design guide.
The visual direction is premium, bright, editorial, racket-sport lifestyle, gender-inclusive and fashion-aware.
Typography: Fraunces (display), Instrument Sans (structural/nav/labels), Inter (body), Space Mono (spec/price accent only). Do not default to Archivo Black or Space Grotesk — see `docs/04-design/brand-and-design-system.md` for the reasoning.
Do not revert to generic dark sports styling.
