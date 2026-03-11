# CLAUDE.md — Next.js Boilerplate Project

## Project Overview

Full-stack **Next.js 16 (App Router)** boilerplate with TypeScript, Tailwind CSS v4, MongoDB, NextAuth, Stripe, Resend, and i18n (ES/EN).

## Tech Stack

| Layer          | Technology                                  |
| -------------- | ------------------------------------------- |
| Framework      | Next.js 16 (App Router)                     |
| Language       | TypeScript 5.9 + strict mode                |
| Styling        | Tailwind CSS v4 + DaisyUI v5                |
| Database       | MongoDB Atlas + Mongoose 9                  |
| Auth           | NextAuth.js v4 (JWT strategy)               |
| Payments       | Stripe (checkout, subscriptions, webhooks)  |
| Email          | Resend (SMTP)                               |
| Package Mgr    | pnpm (exclusively)                          |
| Testing        | Vitest                                      |
| Deployment     | Vercel-ready                                |

## Architecture Rules

### Rendering Strategy
- **Server Components by default** — only add `"use client"` when interactivity is required.
- Pages in `app/` are server components unless explicitly marked.
- Layouts should remain server components when possible.

### Import Aliases
- Use `@/` for all imports (maps to `src/` via `tsconfig.json`).
- Example: `import { connectMongo } from "@/libs/db"`.

### Configuration Split
| File                     | Scope        | Purpose                                    |
| ------------------------ | ------------ | ------------------------------------------ |
| `data/configApi.ts`      | Server ONLY  | Secrets, API keys (`import "server-only"`)  |
| `data/configProject.ts`  | Client-safe  | App name, SEO, colors, social links         |

> **CRITICAL**: Never import `configApi.ts` in client components or files that run in the browser. It uses the `"server-only"` package and will throw at build time.

### Database
- Always use `connectMongo()` from `@/libs/db` before any Mongoose operation.
- MongoClient singleton via `clientPromise` is reserved for the NextAuth adapter.
- Models live in `models/` with Mongoose schemas.

### Authentication
- NextAuth configured in `libs/next-auth.ts` with JWT strategy.
- OAuth providers: Google, GitHub, LinkedIn, Facebook (conditional on env vars).
- Protected routes enforced by `middleware.ts` (matcher: `/dashboard/*`, `/admin/*`).
- Session carries `user.id` and `user.role` from JWT token.

### Payments (Stripe)
- Checkout, portal, and webhook handlers in `app/api/stripe/` and `app/api/webhook/stripe/`.
- Stripe singleton instance in `libs/stripe.ts` — never create `new Stripe()` per request.
- Webhook verifies signature via `STRIPE_WEBHOOK_SECRET`.

### Styling
- Tailwind CSS v4 with **CSS-first configuration** in `styles/globals.css`.
- DaisyUI v5 loaded via `@plugin "daisyui"` in CSS.
- Dark mode: class-based (managed by `next-themes`).
- Custom CSS variables for theme tokens (see `:root`, `.light`, `.dark` in globals.css).
- Use `@theme inline {}` for Tailwind theme extensions.

### Internationalization
- Client-side i18n via `LanguageContext` (ES/EN).
- Access translations with `const { t } = useLanguage()`.
- Persist language choice in `localStorage`.

## Key Directories

```
src/
  app/                    # Next.js App Router pages & API routes
    (pages)/              # Public pages (Contact, FAQ)
    (private)/            # Auth-protected pages (dashboard, admin)
    api/                  # API endpoints
  components/             # Reusable UI components
    auth/                 # Authentication components
    buttons/              # Button components
    icons/                # SVG icon components
    layout/               # Layout components (Header, Footer, Analytics)
    pagination/           # Pagination components
    sections/             # Page sections (FAQ, etc.)
    ui/                   # Generic UI (cards, modals, badges)
  contexts/               # React contexts (LanguageContext)
  core/                   # Hexagonal architecture domain layer
    creature/             # Example domain: entity, repo, use case
    shared/               # Shared types and errors
  data/                   # Configuration (configProject.ts, configApi.ts)
  libs/                   # Utility libraries (db, stripe, auth, seo, api)
  models/                 # Mongoose models (User, Lead, Invoice)
  styles/                 # Global CSS
scripts/                  # Build/conversion scripts (root level)
```

## Commands

```bash
pnpm dev                  # Start dev server
pnpm build                # Production build (+ sitemap generation)
pnpm start                # Start production server
pnpm lint                 # Run ESLint
pnpm test                 # Run Vitest
pnpm convert-images-to-webp  # Optimize images to WebP
```

## Environment Variables

See `.env.example` for the full list. Required vars for basic operation:
- `NEXTAUTH_SECRET` — Random secret for JWT signing
- `MONGODB_URI` — MongoDB Atlas connection string
- `NEXTAUTH_URL` — Canonical URL (e.g., `http://localhost:3000`)

Optional feature flags (features activate when their env vars are present):
- `GOOGLE_ID` + `GOOGLE_SECRET` → Google OAuth
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` → Payments
- `RESEND_API_KEY` → Transactional email

## Code Conventions

1. **Async/await everywhere** — no raw `.then()` chains.
2. **try/catch** on all async operations with meaningful error logging.
3. **Zod** for runtime validation of external input.
4. **No `any`** unless interfacing with third-party libs that lack types.
5. API routes return `NextResponse.json()` with appropriate status codes.
6. Error responses: `{ error: "Human-readable message" }` — never expose stack traces.
7. MongoDB queries in API routes must call `connectMongo()` first.
8. Use `configProject` (not hardcoded strings) for app name, URLs, and branding.

## Security Checklist

- [x] CSP headers in `next.config.ts`
- [x] `poweredByHeader: false`
- [x] HSTS with preload
- [x] X-Frame-Options: SAMEORIGIN
- [x] Stripe webhook signature verification
- [x] Auth middleware protecting private routes (`middleware.ts`)
- [x] Role-based access control (user, admin, editor, moderator)
- [x] Server-only secrets isolation (`configApi.js`)
- [x] MongoDB regex input escaping in admin queries
- [x] API error responses never expose internal `e.message` to clients
- [x] Pagination limits capped (max 100) to prevent DoS
- [x] Sitemap excludes `/api/*`, `/dashboard/*`, `/admin/*`

## Singleton Pattern

The following modules use lazy singletons — never instantiate per-request:

| Module            | Singleton accessor   |
| ----------------- | -------------------- |
| `libs/stripe.ts`  | `getStripe()`        |
| `libs/resend.ts`  | `getResend()`        |
| `libs/db.ts`      | `connectMongo()`     |

## Next.js 15+ Async APIs

In Next.js 15+, several APIs became async and **must be awaited**:

```ts
// headers() — e.g., in webhooks
const headersList = await headers();

// params — in dynamic route handlers
const { id } = await context.params;

// cookies(), searchParams — same pattern
```

## Type Augmentation

Session and JWT types are extended in `next-auth.d.ts`:
- `session.user.id` — MongoDB `_id`
- `session.user.role` — `"user" | "admin" | "editor" | "moderator"`
- `token.role` — stored in JWT by the `jwt` callback
