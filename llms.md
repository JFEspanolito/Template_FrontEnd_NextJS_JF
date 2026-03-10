
# Astro 5 + React 19 Template (Modern Island Architecture)

## Shared AI Permission Policy

Canonical policy file: `/.llmrules`.

This repository uses `/.llmrules` as the baseline allow/deny permission policy for AI agents.
Some tools may not enforce this file automatically, so each client must map these rules
to its native permission system.

If a client cannot read `/.llmrules`, apply equivalent restrictions manually.

Recommended precedence:

1. Client-native security policy (hard enforcement)
2. `/.llmrules` (repository baseline)
3. `llms.md`, `CLAUDE.md`, or other guidance files (behavioral/context guidance)

## 1. Project Overview

High-performance, SEO-optimized boilerplate using Astro 5 and React 19.  
Implements Island Architecture to minimize JavaScript.  
Designed for SaaS, portfolios, and complex web apps using DDD (Domain-Driven Design).

### Key Features

- **Zero JS by default**: Astro static-first approach.
- **Islands of Interactivity**: Selective hydration with React 19.
- **Tailwind v4**: Native CSS theme engine with Vite.
- **Type Safety**: Strict TypeScript with custom `env.d.ts`.
- **Maintenance Tools**: Integrated scripts for image/audio optimization and file normalization.

---

## 2. Tech Stack (Strict Versions)

| Layer | Technology | Version |
|------|------------|---------|
| Framework | Astro | ^5.x |
| UI Runtime | React (via @astrojs/react) | ^19.x |
| Language | TypeScript | ^5.x |
| Styling | Tailwind CSS (Vite plugin) | ^4.x |
| UI System | DaisyUI | ^5.x |
| Motion | Framer Motion | ^12.x |
| Analytics | Google Analytics + Microsoft Clarity (Partytown) | — |
| Performance | @vercel/speed-insights | — |

---

## 3. Directory Structure Map

```
src/
├─ pages/                  -> Astro Routes (browser entry points)
├─ components/
│  ├─ pages/              -> React Views (full-page logic/state)
│  ├─ ui/                 -> React Atoms (Modal.tsx, etc.)
│  └─ analytics/          -> Analytics Banner (privacy-first island)
├─ layouts/               -> Master Layouts (Layout.astro = SEO + Fonts + Global CSS)
├─ libs/                  -> Utilities (utils.ts, cn(), API clients)
├─ env.d.ts               -> Environment variable typings
scripts/                  -> DevOps scripts (audio/image + filename normalization)
```

## 4. Key Development Guidelines

### Astro Islands

- Use `.astro` for static content.
- Use `.tsx` for interactive parts with:

  - `client:load`
  - `client:visible`
  - `client:only`

---

### Environment Variables

- Access via `import.meta.env`
- Use `PUBLIC_` prefix for browser-exposed vars.

---

### CSS (Tailwind v4)

- No `tailwind.config.js`
- Theme extensions live in:

`src/styles/global.css`

```
@theme {
  /* custom tokens here */
}
```

### Casing & Consistency

- **Strict rule**: file casing must match imports exactly.

Example:

```
import Modal from "@/components/ui/Modal";

```
Avoids Windows/Linux build conflicts.

Routing Strategy

Route layer: src/pages/xxx.astro

View logic: src/components/pages/XxxPage.tsx

Astro handles routing. React handles state.

5. Context Files
`astro.config.mjs`

Integrations + Vite configuration.

`src/env.d.ts`

Registry for environment variable types.

README.md

Project documentation and setup.