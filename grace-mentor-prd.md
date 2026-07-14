# Grace Mentor — Product Requirements Document

**Status:** MVP scope, ready for build
**Platform name:** Grace Mentor (confirmed)

---

## 1. Overview & Problem Statement

Most unemployment or underemployment isn't purely "no jobs available" — it's a mismatch between what a candidate has and what the market needs, or a gap in interview/soft skills that never gets diagnosed because job seekers don't have access to people already working in their target field. Generic courses and job boards don't explain *why* someone specifically keeps getting rejected.

Grace Mentor closes that gap by pairing an unemployed/job-seeking user (**Mentee**) with a working professional (**Mentor**) who can diagnose their specific pain point and point them to the right resource, workshop, or guidance — rather than a one-size-fits-all course.

The platform is **remote-first and globally accessible** by design; geography is not a matching factor.

---

## 2. Goals & Success Metrics

- % of job seekers who complete onboarding and get matched within X days
- % of matches that convert to an actual 1:1 interaction
- Self-reported improvement in interview funnel stage after 60–90 days
- Mentor retention (are professionals coming back / taking repeat mentees)
- Resource/workshop engagement rate

---

## 3. User Types

### A. Job Seeker (Mentee)
Someone unemployed or underemployed, looking to identify and fix the specific reason they aren't landing offers.

### B. Working Professional (Mentor)
Someone currently employed, willing to share domain knowledge, review candidates, host workshops, or point mentees to resources.

**MVP scope note:** single role per account only. Dual-role accounts (e.g. someone who is both an employed mentor in their field *and* seeking mentorship in a different field) are a deferred feature — kept out of MVP to simplify onboarding and matching.

---

## 4. Onboarding & Profiling

Onboarding is the core diagnostic value of the product — not a throwaway form. **It is compulsory for both user types before accessing any part of the platform** (events, matching, testimonials). No browsing without completing profiling first.

### 4.1 Job Seeker (Mentee) Onboarding — 9 steps

1. **Basic info** — name, location, contact
2. **Current status** — unemployed / underemployed / employed-but-searching
3. **Career stage** — fresher / 1–3 yrs / 3–8 yrs / 8+ yrs / career switcher
4. **Target role & domain** — target industry/domain, target role(s), target companies (optional)
5. **Diagnostic funnel stage** (the differentiator):
   - No interview calls at all → likely resume/profile visibility issue
   - Calls but no progress past round 1 → likely fundamentals/screening issue
   - Reach final rounds but rejected → likely interview performance/culture-fit/negotiation issue
   - Offers but below expectation → likely negotiation/positioning issue
6. **Self-reported pain points** (multi-select + free text): resume, technical skills, communication/English fluency, interview confidence, system design/case studies, negotiation, lack of referrals/network, career direction unclear, employment gap explanation, other
7. **Interview history** — count in last 3–6 months, rough funnel drop-off point
8. **Resume upload** — optional but recommended (lets the platform/mentor see the gap instead of relying on self-report)
9. **Skills self-assessment** — skill list + confidence level per skill
10. **Availability** — hours/week, preferred mode (async chat / calls / workshops)
11. **3-month goal** — what success looks like (offer in hand / interview confidence / clarity on direction / specific skill certified, etc.)

*(Implementation groups these into a 9-step wizard; see Section 11.3 for the technical breakdown.)*

### 4.2 Working Professional (Mentor) Onboarding — 7 steps

1. **Basic info** — name, current company, role, years of experience
2. **Domain & specialization** — e.g. "backend engineering – fintech," "product marketing – SaaS"
3. **Type of help willing to give** (multi-select): 1:1 mentorship calls, resume review, mock interviews, resource sharing, hosting a workshop, referrals (sensitive — deferred, see Section 7), career guidance/direction-setting
4. **Pain points best positioned to help with** — mapped to the same tag list used in mentee onboarding
5. **Mentee seniority comfort** — fresher / mid / senior
6. **Availability & max mentees** — hours/week or month, preferred mode, cap on concurrent mentees (prevents overload/burnout)
7. **Verification** — LinkedIn OAuth (primary) or company-email verification (fallback), for trust & safety

---

## 5. Matching Logic

Match priority, weighted:

| Signal | Weight |
|---|---|
| Domain/industry alignment | 40% |
| Pain-point overlap | 30% |
| Seniority fit | 15% |
| Availability overlap | 10% |
| Mode preference match | 5% |

**Output to the job seeker:** a short ranked list of **2–4 suggested mentors** — not just one — with a one-line reason for each ("Matched because you both flagged 'system design interviews' as the gap").

Implementation: MongoDB Atlas Search for tag/text matching; score stored on the `Match` document to support future refinement as mentor feedback (Section 9) accumulates.

---

## 6. Core Features (MVP Scope)

### 6.1 Connection & Messaging
- 1:1 connection request flow: mentee requests → mentor accepts/declines
- Real-time notification to mentor on new request (Pusher)
- 1:1 chat within accepted matches (Pusher) — **free, always,** regardless of monetization elsewhere
- Resource sharing: within an active match, mentors can attach links/docs/notes tagged to a specific pain point
- Scheduling: link-based booking (mentor pastes their scheduling link in profile) — **provider TBD, deferred** (see Section 10)

### 6.2 Events / Workshops Page
First-class surface, not a feature bolted onto profiles.
- Browsable/filterable list: domain, pain-point tag, free/paid, date range
- Event card: host, topic, price or "Free," date/time, seats left, pain-point tags addressed
- Mentor-side event creation form: title, description, price or free, capacity, date/time, pain-point tags
- Payment handling for paid events — **deferred to last build phase** (see Section 8 & 10)

### 6.3 Success Stories / Testimonials Page
- Any user can share a success story — **open/free posting**, no requirement of a verified completed mentor connection (prioritizes early volume and social proof over verification rigor)
- Structured fields: pain point tag(s), what helped (optional tag-back to a specific mentor), outcome (offer received / role / timeframe), free-text story
- "Flag this story" button — cheap spam/fake-story safeguard, reviewed by admin
- Dashboard nudge: once a match is marked completed, the mentee's dashboard prompts them to write a testimonial (this is the primary testimonial acquisition channel — must be proactive, not something users have to remember)

### 6.4 Mentor Public Profile — `/mentors/[slug]`
**Publicly accessible, no auth required** — the one deliberate exception to the compulsory-onboarding gate, because it doubles as the platform's growth loop (mentor recruitment + mentee acquisition in one artifact).

Contains:
- Name, current role, company, domain/specialization
- Short bio line in the mentor's own words ("I help backend engineers crack system design interviews")
- Auto-generated impact stats: mentees helped, workshops hosted, testimonials received
- Testimonial quote cards (pulled from Success Stories, tagged to this mentor)
- Upcoming events they're hosting
- CTA: "Request mentorship" / "View events"
- Auto-generated OG/share-card image so the link previews well on LinkedIn/Twitter
- "Share my profile" button with a pre-written, editable LinkedIn post draft

### 6.5 Mentee Dashboard (private, not shareable)
Unlike the mentor profile, this stays private — a job seeker's unemployment status and pain points are sensitive, and forcing visibility could discourage honest self-reporting, which is the whole diagnostic value of onboarding.

Contains:
- Editable snapshot of diagnostic answers: target role, self-reported pain point(s), funnel drop-off stage
- Current matches with status (requested / accepted / ongoing)
- Event activity: registered/upcoming, past attended
- Simple progress marker tied to the stated 3-month goal
- Mentor-observed feedback signals surfaced (Section 9)
- "Re-take diagnostic" flow for when the situation changes
- Testimonial-write prompt after a match is marked completed

### 6.6 Mentor Dashboard
- Active mentees, with profile snapshots
- Pending requests (accept/decline)
- Events they're hosting
- Post-session feedback prompt queue (Section 9)
- Profile share widget + LinkedIn post draft

### 6.7 AI Assistant (Claude-powered)
Purpose: absorb volume that shouldn't consume human mentor time (basic doubts, FAQs, always-available mock interview practice), reserving mentor time for judgment calls, real feedback, and encouragement. **Positioned as a supplement to mentors, not a replacement.**

**6.7.1 Doubt-Resolution / Q&A**
- Scoped to career/job-search topics only — not general-purpose
- Available anytime, independent of mentor availability
- Personalized using the mentee's own profile context (target role, flagged pain points)

**6.7.2 Mock Interview Host**
- Mentee selects target role/domain + interview type (technical / behavioral / case study)
- AI conducts the interview turn-by-turn
- Structured feedback on completion (what went well, what was weak, specific suggestions)
- Feeds back into the mentee dashboard as a data point (e.g. "flagged: needs work on quantifying impact"), refining the pain-point profile the same way mentor feedback does
- Positioned as practice/warm-up before a real human mock interview, not a substitute

**Design considerations:**
- Clearly label all AI output as AI-generated, never presented as if from a real professional
- Consider rate-limiting or scoping AI mock interviews by domain depth — generic AI interviewing is weaker for niche/specialized roles than common ones
- Build via LLM API (structured prompting), not a custom ML model — keeps MVP scope realistic

### 6.8 Mentor Feedback Loop
Self-reported pain points at onboarding are a starting guess, not ground truth. Without a feedback mechanism, the platform's diagnostic value stays frozen at the mentee's day-one guess.

- After a 1:1 session is marked complete, mentor gets a short, low-effort check-in: "Was the pain point you discussed the same as what they flagged at signup?" (yes/no) + optional "what's the real gap?" (same tag list + free text)
- This is an **additive signal**, not an overwrite — mentee's dashboard shows both ("Self-reported: interview confidence · Mentor-observed: unclear technical communication")
- Keep it lightweight — mentors are donating free time; one tap + optional tag is the right friction level
- Background job nudges the mentor if a match has been active 7+ days with no feedback submitted
- Longer-term (not MVP): aggregated mentor-observed tags can reveal systemic patterns (e.g. most "resume issue" reports are actually positioning issues) — a future improvement to the onboarding diagnostic itself

---

## 7. Features Deferred Post-MVP

- Referral requests (sensitive — needs a trust/reputation system first)
- Ratings/reviews of mentors
- Paid mentorship tiers
- Group cohort programs
- Systematic progress tracking / re-assessment over time
- Dual-role accounts (mentor in one field, mentee in another)

---

## 8. Monetization Model (decided)

- 1:1 chat/communication between mentee and mentor: **free, always.**
- Workshops/events: each mentor sets their event as free or paid. Platform takes a cut of paid events (rate TBD).
- **At launch: 100% of paid-event revenue goes to the mentor — no platform fee.** The payment flow is built with a `platformFeePercent` field/toggle from day one (set to 0%) so a fee can be switched on later without re-architecting checkout/payout logic.
- Per `task.md`: **payment integration itself is deferred to the last build phase** — the schema/toggle is designed now, but Razorpay/Stripe wiring happens late.

---

## 9. Resolved Product Decisions

These were open questions in the original functional requirements / implementation plan, now confirmed in `task.md`:

| Decision | Resolution |
|---|---|
| Platform name | **Grace Mentor** |
| Payment provider (Razorpay vs Stripe) | **Deferred** — decision pushed to the payments build phase, not needed for MVP structure |
| Auth strategy | **LinkedIn OAuth (primary)** for mentor verification + **email magic-link** for mentees, with credentials as fallback |
| Real-time provider (Pusher vs Ably) | **Pusher** |
| Mentor profile access | `/mentors/[slug]` is **public, read-only**, the sole exception to the compulsory-onboarding gate |
| Onboarding gate | **Compulsory** for both roles before accessing any other part of the platform — confirmed intentional despite reduced SEO discoverability of events/testimonials to unauthenticated visitors |
| Resume upload | Optional, not mandatory, at onboarding |
| Geography | Irrelevant — platform is remote/global by design |
| Testimonials | Open/free posting, no verified-connection requirement — with a "flag this story" safeguard |

---

## 10. Open Questions Still to Resolve

- **Scheduling provider** — Cal.com (self-hosted, more control) vs. Calendly (hosted embed, zero-ops). Marked **TBD/deferred** in `task.md`.
- **Payment provider** — Razorpay Route (simpler KYC for India-based mentors) vs. Stripe Connect (broader global payout support). Deferred to the payments phase, but worth deciding before that phase starts since it affects the `EventRegistration` schema fields.
- **Mentor supply/incentive strategy at cold start** — mentees are easy to attract; mentors are the scarce side. Recommended approach (not yet formally confirmed as a workstream): lead with shareable mentor profiles + testimonial tagging as the zero-scale hook, treat event revenue as a secondary incentive, and consider recruiting the first mentor cohort from one specific existing community (e.g. an alumni network) rather than open recruiting.
- **Mentee-side trust/safety** — do mentees need any verification too, to prevent spam or fake requests to mentors?
- **Mentor overload prevention** — capping mentee-slots per mentor is already in the profiling flow (Section 4.2); worth reinforcing with a visible "slots available" indicator on public profiles.
- **Systematic outcome tracking** — beyond voluntary testimonials, is there a plan to measure whether matches actually work over time? (Related to the deferred "progress tracking" feature in Section 7.)

---

## 11. Technical Architecture

### 11.1 Stack
- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** Auth.js (NextAuth) — LinkedIn OAuth provider, email magic-link (Resend/Nodemailer), credentials fallback. Session strategy: JWT with `userId`, `role`, `onboardingComplete` embedded in the token.
- **Real-time:** Pusher (1:1 messaging, mentor notifications on new requests)
- **File storage:** UploadThing → Cloudflare R2 (resumes; PDF/DOCX only, 5MB cap; metadata-only URL stored in MongoDB; signed/expiring URLs for mentor access; deleted on account removal)
- **AI:** Claude via Vercel AI SDK, streamed responses
- **OG images:** `@vercel/og` for mentor share cards
- **Background jobs:** Inngest
- **Payments (deferred):** Razorpay Route or Stripe Connect — decision pending (Section 10)

### 11.2 Top-Level Project Structure
```
/src
  /app
    /api          ← Route Handlers (backend)
    /(auth)       ← login / register pages (outside main layout)
    /(onboarding) ← multi-step onboarding (gated, no nav)
    /(main)       ← all post-onboarding pages (dashboard, events, etc.)
    /mentors/[slug] ← public mentor profile
  /components     ← shared UI components
  /lib            ← db, auth, ai, utils
  /models         ← Mongoose schemas
  /types          ← TypeScript interfaces
```

### 11.3 Data Models (MongoDB / Mongoose)

| Model | Key Fields |
|---|---|
| `User` | `_id`, `name`, `email`, `role` (`mentee`\|`mentor`), `onboardingComplete`, `linkedinId`, `createdAt` |
| `MenteeProfile` | `userId`, `status`, `careerStage`, `targetDomain`, `targetRoles`, `targetCompanies`, `diagnosticAnswers` (funnel stage, pain points, interview count), `resumeUrl`, `skills[]` (name + confidence), `availability`, `goal3Months` |
| `MentorProfile` | `userId`, `company`, `currentRole`, `yearsExp`, `domain`, `specialization`, `helpTypes[]`, `painPointsCanHelp[]`, `menteeSeniority[]`, `availability`, `maxMentees`, `currentMenteeCount`, `bio`, `shareSlug`, `impactStats` (menteeCount, workshopsHosted, testimonialsReceived) |
| `Match` | `menteeId`, `mentorId`, `status` (`pending`\|`accepted`\|`declined`\|`active`\|`completed`), `matchScore`, `matchReason`, `createdAt` |
| `Message` | `matchId`, `senderId`, `content`, `type` (`text`\|`resource`), `attachments[]`, `createdAt` |
| `Event` | `hostId`, `title`, `description`, `painPointTags[]`, `domain`, `isFree`, `price`, `capacity`, `registeredCount`, `dateTime`, `status`, `paymentSplit` (`platformFeePercent=0`) |
| `EventRegistration` | `eventId`, `userId`, `paymentStatus`, `amountPaid`, providerOrderId (Razorpay/Stripe — pending Section 10) |
| `Testimonial` | `authorId`, `mentorId` (optional tag), `painPoints[]`, `whatHelped`, `outcome`, `freeText`, `flagged`, `createdAt` |
| `MentorFeedback` | `matchId`, `mentorId`, `menteeId`, `samePainPoint` (bool), `observedPainPoints[]`, `notes`, `createdAt` |
| `Resource` | `sharedBy`, `matchId`, `url`, `title`, `description`, `painPointTags[]` |

### 11.4 Middleware / Route Protection
`src/middleware.ts`:
- Redirect to `/onboarding` if `onboardingComplete === false`
- Protect all `/(main)` routes (require auth + completed onboarding)
- Allow `/mentors/[slug]` publicly, no auth check

### 11.5 Background Jobs (Inngest)

| Job | Trigger | Action |
|---|---|---|
| `mentorFeedbackNudge` | 7 days after match → active with no feedback | Email/notification to mentor |
| `testimonialPrompt` | Match marked completed | Dashboard nudge + email to mentee |
| `shareCardGeneration` | Mentor profile updated | Re-generate OG share card |
| `matchScoreRefresh` | New mentor feedback submitted | Re-run matching score for mentee |

### 11.6 Design System
- **Font:** Inter
- **Theme:** dark-mode first, indigo→violet gradient primary, teal secondary accent
- **Components:** glassmorphism cards, smooth transitions, micro-animations on CTAs
- **Layout:** mobile-first, responsive throughout

---

## 12. Build Roadmap

```
Phase 0  — Project scaffold (Next.js 15, App Router, Tailwind, path aliases)
Phase 1  — Database & Mongoose models
Phase 2  — Authentication (Auth.js: LinkedIn OAuth + magic-link + credentials, middleware gate)
Phase 3  — Onboarding flows (mentee 9-step wizard, mentor 7-step wizard, draft persistence)
Phase 4  — Matching engine (weighted scoring, Atlas Search, unit tests)
Phase 5  — Core MVP features (connection requests, resource sharing, Pusher messaging/chat)
Phase 6  — Events page (browse/filter, detail, creation form — payment wiring deferred)
Phase 7  — Testimonials (submit, browse, flag, post-completion nudge)
Phase 8  — Mentor public profile (`/mentors/[slug]`, OG image, LinkedIn share draft, impact stats)
Phase 9  — Mentee dashboard
Phase 10 — Mentor dashboard
Phase 11 — AI Assistant (doubt-resolution chat + mock interview host, via Claude)
Phase 12 — Mentor feedback loop (post-session prompt, Inngest nudge job)
Phase 13 — File storage (UploadThing + Cloudflare R2 for resumes)
Phase 14 — Background jobs (all 4 Inngest jobs)
Phase 15 — UI polish & design system pass
Phase 16 — Payments (Razorpay/Stripe decision + integration) — explicitly last, per confirmed decision
```

Each phase is independently deployable to Vercel; matching and AI can be mocked with static data during earlier phases so later phases aren't blocked.

---

## 13. Verification Plan

**Automated:**
```bash
npx tsc --noEmit          # type-check
npx eslint src/           # lint
npx jest src/lib/matching.test.ts   # matching algorithm unit tests
```

**Manual:**
- Complete mentee onboarding → verify match suggestions appear with reasons
- Complete mentor onboarding → verify profile slug is publicly accessible without auth
- Create a paid event → run through checkout → verify mentor receives payout (once payments phase is built)
- Submit a testimonial → verify mentor tag-back appears on mentor profile
- Run an AI mock interview session → verify feedback is stored and surfaces on the mentee dashboard
- Test "Share my profile" → verify OG card renders correctly when the URL is pasted into LinkedIn
