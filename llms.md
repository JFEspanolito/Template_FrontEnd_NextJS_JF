# Project: Next.js 16 + React 19 Template (Modern Stack)

## 1. Project Overview
A minimal, scalable boilerplate for Next.js 16 (App Router) and React 19.
Designed for rapid development of SaaS, dashboards, and landing pages.

**Key Features:**
* Full Type Safety (TypeScript) on App/Components.
* Modern Styling (Tailwind v4 + DaisyUI v5).
* Authentication ready (NextAuth v4).
* Database ready (MongoDB + Mongoose).
* SEO & Performance optimized.

## 2. Tech Stack (Strict Versions)
* **Framework:** Next.js ^16.1.6 (App Router)
* **Core:** React ^19.2.4 + React DOM ^19.2.4
* **Language:** TypeScript ^5.9.3 (mixed with JS for Models/Scripts)
* **Styling:**
    * **Tailwind CSS:** ^4.1.18 (Uses `@tailwindcss/postcss`).
    * **DaisyUI:** ^5.5.18 (V5 syntax).
    * **Motion:** Framer Motion ^12.33.0
    * **Utils:** `clsx` (Use `cn()` helper from `@/libs/utils`).
* **Database:**
    * MongoDB Driver: ^7.1.0
    * Mongoose ODM: ^9.1.6
* **Authentication:** NextAuth.js ^4.24.13.

## 3. Directory Structure Map
* `app/` -> App Router roots.
    * `(pages)/` -> Public marketing routes (Contact, FAQ).
    * `(private)/` -> Protected routes (Dashboard, Admin).
    * `api/` -> Server-side API endpoints (Auth, Stripe, Webhooks).
* `components/` -> UI Components.
    * `ui/` -> Reusable atoms (Oneko, MagicDock, CardFlip).
    * `layout/` -> Footer, Header, SocialDock.
* `libs/` -> Core utilities.
    * `db.ts` -> **Singleton** Database connection (Mongoose).
    * `next-auth.ts` -> Auth configuration.
    * `stripe.ts` -> Stripe initialization.
* `models/` -> Mongoose Schemas (.js files).
* `data/configProject.ts` -> UI/SEO/Branding constants.
* `configApi.js` -> **ROOT** Server-side secrets & env logic.
* `scripts/` -> Maintenance scripts (JS).

## 4. Key Development Guidelines
* **CSS & Styling (Tailwind v4):**
    * Do NOT look for `tailwind.config.js` for theme extensions; they are defined in CSS using `@theme` or native CSS variables.
* **Database Access:**
    * **Strict Rule:** NEVER call `mongoose.connect()` inside components. Always import `connectMongo` from `@/libs/db`.
* **Rendering Strategy:**
    * Default to **Server Components**.
    * Use `"use client"` only when interactivity is strictly required.
* **Authentication:**
    * Use `getServerSession` (server) or `useSession` (client).

## 5. Context Files
* `README.md`: Setup instructions.
* `package.json`: Definitive source of dependencies.