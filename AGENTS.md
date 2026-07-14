<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Grace Mentor — Agent Instructions

## Project Overview

**Grace Mentor** is a mentorship platform connecting unemployed/underemployed job seekers (Mentees) with working professionals (Mentors) who can diagnose specific pain points and guide them toward the right resources.

- **PRD:** `grace-mentor-prd.md` — full product requirements
- **Task Tracker:** `task.md` — what's done, in progress, and next (READ THIS FIRST)

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.10 |
| UI | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Database | MongoDB Atlas + Mongoose | — |
| Auth | Auth.js (NextAuth) | — |
| Real-time | Pusher | — |
| AI | Claude via Vercel AI SDK | — |
| File Storage | UploadThing → Cloudflare R2 | — |
| Background Jobs | Inngest | — |
| OG Images | @vercel/og | — |
| Payments | Razorpay/Stripe (deferred) | — |

## Project Structure (Important!)

This project does NOT use a `src/` directory. The `app/` directory is at the project root.

```
d:\churchwork\
├── app/                    ← Next.js App Router (root-level, NO src/)
│   ├── api/                ← Route Handlers (backend)
│   ├── (auth)/             ← Login / register pages (outside main layout)
│   ├── (onboarding)/       ← Multi-step onboarding (gated, no nav)
│   ├── (main)/             ← All post-onboarding pages
│   └── mentors/[slug]/     ← Public mentor profile (no auth)
├── components/             ← Shared UI components
├── lib/                    ← DB, auth, AI, utils
├── models/                 ← Mongoose schemas
├── types/                  ← TypeScript interfaces & enums
├── public/                 ← Static assets
├── task.md                 ← BUILD PROGRESS TRACKER
├── grace-mentor-prd.md     ← Product Requirements Document
├── AGENTS.md               ← This file
└── CLAUDE.md               ← Claude-specific instructions
```

## Critical Rules

### 1. Read `task.md` Before Writing Code
Always check `task.md` to understand current build progress. Update it as you complete tasks.

### 2. Read Next.js 16 Docs Before Using APIs
This is Next.js **16**, not 15 or 14. Before using any Next.js API, check `node_modules/next/dist/docs/` for current conventions. Key differences from older versions may exist in:
- Route Handlers
- Middleware
- Metadata API
- Server/Client component patterns
- Dynamic routes & params

### 3. No `src/` Directory
All code goes at the root level. Path alias `@/*` maps to `./*` (not `./src/*`).

### 4. Tailwind CSS v4
This project uses Tailwind CSS **v4** (not v3). Do NOT use `tailwind.config.js` — v4 uses CSS-first configuration via `@theme` in `globals.css`. Check the Tailwind v4 docs for correct syntax.

### 5. Design System
- **Font:** Inter (Google Fonts)
- **Theme:** Dark-mode first, indigo→violet gradient primary, teal secondary accent
- **Components:** Glassmorphism cards, smooth transitions, micro-animations on CTAs
- **Layout:** Mobile-first, responsive throughout
- All UI must feel premium — avoid generic/plain designs

### 6. Build Order
Follow the phase order in `task.md`. Each phase is independently deployable. Later features (matching, AI) can be mocked with static data during earlier phases.

### 7. Environment Variables
Never hardcode secrets. Use `.env.local` for local dev. Reference `.env.example` for required variables.

### 8. MongoDB Patterns
- Use a connection singleton in `lib/db.ts` (cached for serverless/edge)
- Mongoose schemas go in `models/`
- Always handle connection errors gracefully

### 9. Authentication Flow
- JWT session strategy (not database sessions)
- Token contains: `userId`, `role`, `onboardingComplete`
- Middleware gates: `/(main)` requires auth + onboarding; `/(auth)` is public; `/mentors/[slug]` is public
- Onboarding is COMPULSORY before accessing any platform feature

### 10. Testing
```bash
npx tsc --noEmit          # type-check
npx eslint app/           # lint (note: app/ not src/)
npx jest lib/matching.test.ts   # matching unit tests
```

## Key Product Decisions (Do Not Override)

- 1:1 chat is **free, always** — never behind a paywall
- Mentor public profiles (`/mentors/[slug]`) are the **only** pages accessible without auth/onboarding
- Testimonials are **open posting** — no verified-connection requirement
- Platform fee starts at **0%** — the `platformFeePercent` field exists but is set to 0
- Geography is **irrelevant** — the platform is remote/global by design
- AI assistant is a **supplement** to mentors, never a replacement — always labeled as AI-generated
