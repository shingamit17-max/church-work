# Grace Mentor — UX Flow & Feature Ideas

## Full User Flow

### 1. Landing → Auth
Animated welcome screen with subtle motion → user swipes/taps up → reveals sign in (returning user) or sign up (new user) → Google OAuth confirms identity, no password ever touches your servers.

### 2. First-time gate
- New user → forced into role selection (Mentee or Mentor) → onboarding wizard.
- Only after completing onboarding does the user see the real sidebar dashboard.
- Returning-but-incomplete users get a **profile-completion banner/modal**, not a hard block — they can peek at read-only content (e.g. the events list), but anything requiring a full profile (messaging, applying to a mentor) stays grayed out until they finish.

### 3. Sidebar dashboard shell
One consistent app shell for both roles — sidebar with Profile, Find a mentor, Events, Resources, Messages, Settings. Content and available actions differ by role, but the shell itself doesn't change, so switching between mentor/mentee views (if that's ever supported) feels seamless.

### 4. Matching
- Mentee fills in field/skills/goals during onboarding.
- Algorithm (start rule-based: domain + pain-point overlap; upgrade to AI-ranked later) surfaces 2–4 mentors with a one-line reason each.
- Mentee clicks a mentor's profile → can message directly or send a structured request first. A structured request-first model is better than open messaging from day one — it reduces spam hitting mentors' inboxes.

### 5. Messaging + notifications
- Mentor gets a notification (bell icon + optional email) on a new message/request.
- Simple accept-and-chat model, not an open inbox where anyone can message anyone.

### 6. Events / workshops
- Mentors publish events.
- Mentees browse/filter by domain, pain point, free/paid, date.
- Apply/register with capacity + waitlist logic.

### 7. Weekly calls
- Simplest MVP: mentor pastes their Calendly link (or a fixed Zoom link + weekly slot) into their profile; mentee books through it.
- Full Zoom API integration (auto-generated links, calendar sync) is a good v2 — it's a lot of OAuth/webhook plumbing for marginal gain over "here's my Calendly" at MVP stage.

### 8. Resources + assessment
- Field-specific quick assessment (e.g. 10-question skill check per domain) → instant score → tailored resource list (interview questions, prep docs) unlocked based on weak areas.
- This gives a mentee something useful to do immediately, while they wait for a mentor to respond to a request — closes the "dead time" gap right after onboarding.

---

## Additional Feature Ideas

- **Prayer / encouragement layer** — a private note or prayer request tied to a mentee's job search, visible only to their matched mentor. Something a generic job-networking platform can't offer — distinctly "for the church," not corporate.
- **Campus pastor/leader endorsement badge** — instead of relying only on open-ended trust signals (LinkedIn, etc.), let a campus admin flag someone as "vouched for." Builds trust faster in a close community than star ratings would.
- **Testimonial wall, not star ratings** — skip 1–5 star mentor ratings entirely (feels transactional for a church context) and lean fully into story-based testimonials instead, as already scoped in the PRD.
- **"Ask anonymously" option** — for someone embarrassed about being unemployed, allow browsing and even messaging a mentor without their name showing until the mentor accepts. Could increase honest engagement from people who'd otherwise avoid reaching out.

---

## Notes on Implementation

- The swipe-up landing→auth interaction is best built with **Framer Motion** in the actual Next.js app for real gesture physics (momentum, elastic bounce) — a working visual mockup of this interaction was prototyped separately and can be turned into production Framer Motion code on request.
- Design system direction: warm/community palette rather than a generic indigo-violet SaaS gradient, to feel appropriate for a church context rather than a corporate product.
