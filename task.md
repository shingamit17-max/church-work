# Grace Mentor — Build Task Tracker

> **Purpose:** This file tracks every build task for the Grace Mentor platform.
> Any AI agent working on this project should read this file FIRST to know what's done, what's in progress, and what's next.
> Mark items `[x]` when complete, `[/]` when in progress, `[ ]` when not started.

**PRD:** [grace-mentor-prd.md](file:///d:/churchwork/grace-mentor-prd.md)
**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · MongoDB Atlas + Mongoose · Auth.js · Pusher · Claude AI · Inngest

---

## Current State

- **Phase 9 & 10 — Mentee & Mentor Dashboards:** `[x]` Done
- **Last completed action:** Separated `/dashboard` into role-specific nested routes (`/dashboard/mentee` and `/dashboard/mentor`).
- **Dev server verified:** Pending

---

## Phase 0 — Project Scaffold

- [x] Initialize Next.js 16 project with App Router, TypeScript, Tailwind CSS
- [x] Restructure directories to match PRD architecture:
  ```
  /app
    /api                ← Route Handlers (backend)
    /(auth)             ← login / register pages (outside main layout)
    /(onboarding)       ← multi-step onboarding (gated, no nav)
    /(main)             ← all post-onboarding pages (dashboard, events, etc.)
    /mentors/[slug]     ← public mentor profile (no auth required)
  /components           ← shared UI components
  /lib                  ← db, auth, ai, utils
  /models               ← Mongoose schemas
  /types                ← TypeScript interfaces
  ```
- [x] Configure path aliases (`@/*` → `./*` — already set in tsconfig)
- [x] Set up environment variables template (`.env.example`):
  - `MONGODB_URI`
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`
  - `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`
  - `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER`
  - `ANTHROPIC_API_KEY`
  - `UPLOADTHING_TOKEN`
  - `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`
  - `RESEND_API_KEY` (for magic-link emails)
- [x] Set up design system foundation:
  - Font: Inter (Google Fonts)
  - Theme: dark-mode first, indigo→violet gradient primary, teal secondary accent
  - Global CSS tokens and base styles in `app/globals.css`
  - Glassmorphism card component, transitions, micro-animations
- [x] Create shared TypeScript interfaces in `/types`:
  - `User`, `MenteeProfile`, `MentorProfile`, `Match`, `Message`
  - `Event`, `EventRegistration`, `Testimonial`, `MentorFeedback`, `Resource`
  - Enums: `UserRole`, `CareerStage`, `DiagnosticFunnelStage`, `PainPoint`, `MatchStatus`, etc.

---

## Phase 1 — Database & Mongoose Models

- [x] Install `mongoose`
- [x] Create `/lib/db.ts` — MongoDB connection singleton (cached for serverless)
- [x] Create Mongoose schemas in `/models/`:
  - [x] `User.ts` — `_id`, `name`, `email`, `role` (mentee|mentor), `onboardingComplete`, `linkedinId`, `createdAt`
  - [x] `MenteeProfile.ts` — `userId`, `status`, `careerStage`, `targetDomain`, `targetRoles[]`, `targetCompanies[]`, `diagnosticAnswers` (funnel stage, pain points, interview count), `resumeUrl`, `skills[]` (name + confidence), `availability`, `goal3Months`
  - [x] `MentorProfile.ts` — `userId`, `company`, `currentRole`, `yearsExp`, `domain`, `specialization`, `helpTypes[]`, `painPointsCanHelp[]`, `menteeSeniority[]`, `availability`, `maxMentees`, `currentMenteeCount`, `bio`, `shareSlug`, `impactStats`
  - [x] `Match.ts` — `menteeId`, `mentorId`, `status`, `matchScore`, `matchReason`, `createdAt`
  - [x] `Message.ts` — `matchId`, `senderId`, `content`, `type`, `attachments[]`, `createdAt`
  - [x] `Event.ts` — `hostId`, `title`, `description`, `painPointTags[]`, `domain`, `isFree`, `price`, `capacity`, `registeredCount`, `dateTime`, `status`, `paymentSplit` (platformFeePercent=0)
  - [x] `EventRegistration.ts` — `eventId`, `userId`, `paymentStatus`, `amountPaid`, `providerOrderId`
  - [x] `Testimonial.ts` — `authorId`, `mentorId` (optional), `painPoints[]`, `whatHelped`, `outcome`, `freeText`, `flagged`, `createdAt`
  - [x] `MentorFeedback.ts` — `matchId`, `mentorId`, `menteeId`, `samePainPoint`, `observedPainPoints[]`, `notes`, `createdAt`
  - [x] `Resource.ts` — `sharedBy`, `matchId`, `url`, `title`, `description`, `painPointTags[]`
- [x] Add indexes: `User.email` (unique), `MentorProfile.shareSlug` (unique), `Match` compound indexes, `Event.dateTime`, text indexes for Atlas Search

---

## Phase 2 — Authentication

- [x] Install `next-auth` (Auth.js), `@auth/mongodb-adapter` (or custom JWT strategy)
- [x] Create `/lib/auth.ts` — Auth.js config:
  - [x] LinkedIn OAuth provider (primary for mentors)
  - [x] Email magic-link provider (Resend for sending)
  - [x] Credentials provider (fallback)
  - [x] JWT session strategy with `userId`, `role`, `onboardingComplete` in token
  - [x] Callbacks: `jwt`, `session`, `signIn` — embed role + onboarding status
- [x] Create `/app/api/auth/[...nextauth]/route.ts`
- [x] Create `/(auth)/login/page.tsx` — login page with LinkedIn + magic-link + credentials
- [x] Create `/(auth)/register/page.tsx` — register page with role selection (mentee vs mentor)
- [x] Create `/middleware.ts`:
  - [x] Redirect to `/onboarding` if `onboardingComplete === false`
  - [x] Protect all `/(main)` routes (require auth + completed onboarding)
  - [x] Allow `/mentors/[slug]` publicly — no auth check
  - [x] Allow `/(auth)` routes without auth

---

## Phase 3 — Onboarding Flows

- [x] Create `/(onboarding)/layout.tsx` — gated layout (no main nav, progress bar only)
- [x] Create mentee onboarding wizard (`/(onboarding)/mentee/page.tsx`) — 9 steps:
  1. [x] Basic info (name, location, contact)
  2. [x] Current status (unemployed / underemployed / employed-but-searching)
  3. [x] Career stage (fresher / 1–3 yrs / 3–8 yrs / 8+ yrs / career switcher)
  4. [x] Target role & domain (industry, role(s), optional companies)
  5. [x] Diagnostic funnel stage (no calls / stuck at round 1 / final-round rejects / low offers)
  6. [x] Self-reported pain points (multi-select + free text)
  7. [x] Interview history (count in last 3–6 months, funnel drop-off)
  8. [x] Resume upload (optional) + Skills self-assessment (skill + confidence level)
  9. [x] Availability (hours/week, preferred mode) + 3-month goal
- [x] Create mentor onboarding wizard (`/(onboarding)/mentor/page.tsx`) — 7 steps:
  1. [x] Basic info (name, company, role, years of experience)
  2. [x] Domain & specialization
  3. [x] Type of help willing to give (multi-select)
  4. [x] Pain points best positioned to help with
  5. [x] Mentee seniority comfort level
  6. [x] Availability & max mentees
  7. [x] Verification (LinkedIn OAuth or company-email)
- [x] Draft persistence (save progress across steps, resume where left off)
- [x] On completion: update `User.onboardingComplete = true`, redirect to dashboard
- [x] Form validation for each step

---

## Phase 4 — Matching Engine

- [x] Create `/lib/matching.ts` — weighted scoring algorithm:
  - Domain/industry alignment: 40%
  - Pain-point overlap: 30%
  - Seniority fit: 15%
  - Availability overlap: 10%
  - Mode preference match: 5%
- [x] Output: ranked list of 2–4 suggested mentors with match reason string
- [x] Store `matchScore` and `matchReason` on `Match` document
- [x] API route: `POST /api/matches/generate` — run matching for a mentee
- [x] API route: `GET /api/matches` — get matches for current user
- [x] Unit tests: `/lib/matching.test.ts`
- [x] Set up MongoDB Atlas Search indexes for tag/text matching (or fallback to Mongoose queries for MVP)

---

## Phase 5 — Core MVP Features (Matching & Chat)

- [x] Create dashboard layouts:
  - [x] `/(main)/layout.tsx` — Dashboard shell (Sidebar/Topnav)
  - [x] `/(main)/dashboard/page.tsx` — Mentee/Mentor home (shows matches / active mentees)
- [x] Connections System:
  - [x] Implement `POST /api/connections/request` — Mentee requests Mentor
  - [x] Implement `POST /api/connections/accept` — Mentor accepts/rejects
- [x] Real-time Messaging (Pusher MVP):
  - [x] Install `pusher`, `pusher-js`
  - [x] Create `/(main)/chat/[matchId]/page.tsx` — Chat UI
  - [x] Create `POST /api/chat/send` — Save to DB, trigger Pusher event
- [x] Resource Sharing:
  - [x] Create `/models/Resource.ts`
  - [x] Create `/(main)/resources/page.tsx` — Resource library UI
  - [x] API routes to upload (links) and list resources
- [ ] Chat UI component with message list, input, typing indicator
- [ ] Resource sharing within chat:
  - [ ] Attach links/docs/notes tagged to pain points
  - [ ] Resource card component in chat
- [ ] Scheduling: mentor pastes scheduling link in profile (link-based, provider TBD)

---

## Phase 6 — Events Page

- [ ] Create `/(main)/events/page.tsx` — browsable/filterable event list:
  - [ ] Filter by: domain, pain-point tag, free/paid, date range
  - [ ] Event card: host, topic, price/"Free", date/time, seats left, pain-point tags
- [ ] Create `/(main)/events/[id]/page.tsx` — event detail page
- [ ] Create `/(main)/events/create/page.tsx` — mentor-side event creation form:
  - [ ] Fields: title, description, price/free, capacity, date/time, pain-point tags
  - [ ] API: `POST /api/events` — create event
- [ ] API: `GET /api/events` — list events with filters
- [ ] API: `POST /api/events/[id]/register` — register for event
- [ ] Registration tracking (EventRegistration model)
- [ ] Payment wiring: **DEFERRED** — `platformFeePercent=0` field present but no payment gateway yet

---

## Phase 7 — Testimonials

- [x] Create `/(main)/testimonials/page.tsx` — browse testimonials
- [x] Create `/(main)/testimonials/submit/page.tsx` — submit a success story:
  - [x] Fields: pain point tags, what helped (optional mentor tag-back), outcome, free-text
  - [x] API: `POST /api/testimonials`
- [x] API: `GET /api/testimonials` — list testimonials (with filters)
- [x] "Flag this story" button + API: `PATCH /api/testimonials/[id]/flag`
- [ ] Post-completion dashboard nudge (prompt mentee to write testimonial when match completed)

---

## Phase 8 — Mentor Public Profile

- [x] Create `/mentors/[slug]/page.tsx` — Public mentor profile
  - [x] Server component fetching `MentorProfile` by `shareSlug`
  - [x] Display bio, company, role, pain points, max capacity vs current mentees
- [x] "Request Mentorship" CTA logic:
  - [x] If logged out -> redirect to `/register?role=mentee&callbackUrl=/mentors/[slug]`
  - [x] If logged in as Mentee -> trigger `POST /api/connections/request` with `mentorId`
  - [x] If logged in as Mentor -> disable CTA (Mentors can't request Mentors)
- [x] Create simple un-gated layout for public profiles (using main site navigation, outside of `/(main)` layout).
- [x] Add basic SEO metadata for the public profile route (OpenGraph title/description based on mentor name & specialization).
- [ ] Auto-generated OG/share-card image (`@vercel/og`)
- [ ] API: `GET /api/mentors/[slug]` — public mentor data

---

## Phase 9 — Mentee Dashboard

- [x] Create `/(main)/dashboard/mentee/page.tsx`:
  - [x] Editable diagnostic answers snapshot (target role, pain points, funnel stage)
  - [x] Current matches with status (requested / accepted / ongoing)
  - [x] Event activity (registered/upcoming, past attended)
  - [x] Simple progress marker tied to 3-month goal
  - [x] Mentor-observed feedback signals (from MentorFeedback)
  - [x] "Re-take diagnostic" flow
  - [x] Testimonial-write prompt after match completion

---

## Phase 10 — Mentor Dashboard

- [x] Create `/(main)/dashboard/mentor/page.tsx`:
  - [x] Active mentees with profile snapshots
  - [x] Pending requests (accept/decline)
  - [x] Events they're hosting
  - [x] Post-session feedback prompt queue
  - [x] Profile share widget + LinkedIn post draft

---

## Phase 11 — AI Assistant (Claude-powered) [SKIPPED FOR MVP]

- [ ] Install `ai` (Vercel AI SDK), `@ai-sdk/anthropic`
- [ ] Create `/lib/ai.ts` — Claude config, system prompts
- [ ] Doubt-Resolution / Q&A:
  - [ ] API: `POST /api/ai/chat` — streamed Claude response
  - [ ] Scoped to career/job-search topics
  - [ ] Personalized with mentee's profile context (target role, pain points)
  - [ ] Chat UI with clear "AI-generated" labeling
- [ ] Mock Interview Host:
  - [ ] API: `POST /api/ai/mock-interview` — turn-by-turn interview
  - [ ] Mentee selects target role/domain + interview type (technical / behavioral / case study)
  - [ ] Structured feedback on completion
  - [ ] Results feed back into mentee dashboard as data points
- [ ] Create `/(main)/ai/page.tsx` — AI assistant page with chat + mock interview tabs

---

## Phase 12 — Mentor Feedback Loop

- [x] Post-session feedback prompt:
  - [x] After match marked complete → mentor gets check-in form:
    - "Was the pain point you discussed the same as what they flagged at signup?" (yes/no)
    - Optional: "What's the real gap?" (tag list + free text)
  - [x] API: `POST /api/feedback`
  - [x] Feedback is additive, not overwrite — both self-reported and mentor-observed shown
- [ ] Background nudge: 7+ days active match with no feedback → Inngest job nudges mentor

---

## Phase 13 — File Storage (Resumes)

- [x] Install `uploadthing`, `@uploadthing/react`
- [x] Configure UploadThing -> Cloudflare R2 (using default UploadThing UTFS for MVP)
- [x] Resume upload component (PDF/DOCX only, 4MB cap) integrated into Mentee Onboarding
- [x] Metadata-only URL stored in MongoDB (`MenteeProfile.resumeUrl`)
- [ ] Signed/expiring URLs for mentor access (deferred)
- [ ] Delete file on account removal

---

## Phase 14 — Background Jobs (Inngest)

- [x] Install `inngest`
- [x] Create `/app/api/inngest/route.ts` — Inngest serve endpoint
- [x] Implement jobs:
  - [x] `mentorFeedbackNudge` — 7 days after match active with no feedback → email/notification
  - [x] `testimonialPrompt` — match marked completed → dashboard nudge + email to mentee
  - [x] `shareCardGeneration` — mentor profile updated → re-generate OG share card
  - [x] `matchScoreRefresh` — new mentor feedback submitted → re-run matching score

---

## Phase 15 — UI Polish & Design System Pass

- [x] Final design system audit:
  - [x] Consistent glassmorphism, gradients, shadows across all pages
  - [x] Smooth page transitions and micro-animations on CTAs
  - [x] Mobile-first responsive pass on all pages
  - [x] Dark-mode first with proper contrast ratios
  - [x] Loading states (`app/loading.tsx`), skeleton screens, error states
- [x] Accessibility pass (ARIA labels, keyboard navigation, color contrast)
- [x] Performance optimization (lazy loading, image optimization, bundle analysis)

---

## Phase 16 — Payments (Deferred — Explicitly Last)

- [ ] Decide: Razorpay Route vs Stripe Connect
- [ ] Install payment SDK
- [ ] Create payment flow for paid events:
  - [ ] Checkout page
  - [ ] Webhook handler for payment confirmation
  - [ ] `EventRegistration.paymentStatus` updates
- [ ] Platform fee toggle (`platformFeePercent` — set to 0% at launch, configurable)
- [ ] Payout flow to mentors

---

## Verification Checklist

- [ ] `npx tsc --noEmit` — type-check passes
- [ ] `npx eslint app/` — lint passes (note: no `src/` dir, `app/` is at root)
- [ ] Matching algorithm unit tests pass
- [ ] Complete mentee onboarding → match suggestions appear with reasons
- [ ] Complete mentor onboarding → profile slug publicly accessible without auth
- [ ] Create paid event → checkout → mentor receives payout (Phase 16)
- [ ] Submit testimonial → mentor tag-back appears on mentor profile
- [ ] AI mock interview → feedback stored and surfaces on mentee dashboard
- [ ] "Share my profile" → OG card renders correctly on LinkedIn
