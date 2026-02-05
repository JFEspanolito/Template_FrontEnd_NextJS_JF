# AI Engineering & Architecture Guide

## 1. Design Philosophy
This project is a **scalable boilerplate** meant to be cloned for new SaaS or Landing Page projects.
- **Goal:** Minimize setup time for Auth, DB, and Payments without accumulating tech debt.
- **Rule:** Code should be modular. If a feature (e.g., Stripe) is removed, the rest of the app must not break.
- **Rendering:** Prioritize **Server Components (RSC)** for initial load and SEO. Use Client Components only when interactivity is required.

## 2. Configuration Strategy (Dual-Config Pattern)
We separate configuration into two distinct domains. **Do not mix them.**

### A. Client/UI Config (`data/configProject.ts`)
- **Purpose:** Public-facing values, branding, SEO, text content.
- **Security:** SAFE for client-side bundles.
- **Location:** `data/configProject.ts`
- **Usage:** Import primarily in Components, Layouts, and Metadata generation.
- **Example:** `appName`, `colors`, `socials`, `seoTags`, `marketing.tagline`.

### B. Server/API Config (`configApi.js`)
- **Purpose:** Secrets, API keys, Environment logic, backend-only settings.
- **Security:** **CRITICAL**. Never expose to client.
- **Location:** **Root directory** (`./configApi.js`).
- **Usage:** Import ONLY in API Routes, Server Actions, or `libs/`.
- **Validation:** This file enforces the existence of required `.env` variables at runtime.

## 3. Data Layer Architecture

### Database Connection (`libs/db.ts`)
- **Pattern:** We use a **Singleton Pattern** for Mongoose to prevent connection exhaustion in serverless environments (Vercel/Next.js).
- **Protocol:** ALWAYS import `connectMongo` from `@/libs/db`.
- **Anti-Pattern:** **NEVER** instantiate `mongoose.connect()` manually inside a component or page.

### Data Models (`models/*.js`)
- **Format:** Models are defined in **JavaScript** (`.js`), not TypeScript, to avoid complex hydration typing issues with Mongoose.
- **Consumption:** They are imported and used by TypeScript files (API/Libs) which handle the typing via interfaces if needed.
- **Plugin:** We use a `toJSON` plugin (`models/plugins/toJSON.js`) to sanitize output (removing `_id`, `__v`) before sending to the frontend.

## 4. Authentication Flow (NextAuth v4)
- **Adapter:** `@auth/mongodb-adapter`.
- **Session Strategy:** Database-based sessions are preferred for robustness.
- **Routes:**
  - `(private)/`: Contains protected pages. Middleware or per-page checks guard these.
  - `components/auth/`: Contains UI for Login/Register forms.

## 5. UI System (Tailwind v4 + DaisyUI v5)
- **Engine:** Tailwind CSS v4 (using `@tailwindcss/postcss`).
- **Theming:** DaisyUI v5. Themes are configured in CSS/HTML attributes, not just JS config.
- **Structure:**
  - `components/ui/`: Atomic, reusable components (Buttons, Badges, Cards).
  - `components/sections/`: Large, distinct page blocks (Hero, FAQ, Pricing).
  - `layout/`: Global layout wrappers (Header, Footer, Sidebar).
- **Helper:** Use `cn()` from `@/libs/utils` for conditional class merging.

## 6. API Route Conventions (`app/api/`)
- **Design:** Next.js App Router handlers (`GET`, `POST`, `PUT`, `DELETE`).
- **Response Format Standard:**
  ```json
  {
    "success": true,
    "data": { ... },
    "error": "Optional error message"
  }