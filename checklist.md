# Grace Mentor — Manual Verification Checklist

Run `smoke-test.mjs` first for the things that can be automated. Everything
below needs an actual human clicking through the real UI with real
credentials — an agent's "it's built" claim is not the same as "it works."

Check off each box only after you've personally seen it work, not after
reading the code and deciding it looks right.

---

## 1. Auth & route protection
- [ ] Log out completely (clear cookies), try to load `/dashboard` directly by URL — does it redirect to `/login` with no content flash first?
- [ ] Sign in with Google — do you land somewhere sensible, and does a `User` document actually appear in MongoDB with the right email?
- [ ] Try LinkedIn OAuth end to end (not just clicking the button) — does the callback complete without erroring, and does it pull company/title data as claimed, or fall back to company-email verification?
- [ ] Confirm you're on the correct route-protection filename for your Next.js version (`middleware.ts` for <16, `proxy.ts` for 16+) — see smoke-test.mjs output.
- [ ] Log in as User A, then in a private/incognito window try to hit User A's dashboard URL directly while logged in as User B — do you see your own data, or a leak?

## 2. Onboarding
- [ ] Complete the mentee 9-step wizard fully — refresh mid-wizard, does progress persist or does it reset to step 1?
- [ ] Complete the mentor 7-step wizard — same refresh test.
- [ ] Upload a real resume file (PDF) — open the stored URL afterward, does the actual file open, or is it a broken/expired link?
- [ ] After completing onboarding, confirm `onboardingComplete` actually flips to `true` in the database, not just in the UI state.
- [ ] Try to revisit `/onboarding` after completion — does it redirect you away, or let you resubmit endlessly?

## 3. Matching engine
- [ ] Create two test accounts with deliberately overlapping domain + pain points. Does the match score reflect that overlap, or is it a static/hardcoded number?
- [ ] Create two accounts with zero overlap. Do they get matched anyway (a bug), or correctly excluded?
- [ ] Read the generated "match reason" text — is it actually derived from the two profiles, or a generic templated sentence regardless of input?

## 4. Connections & messaging
- [ ] Mentee sends a connection request — does the mentor actually receive a notification (check the notification UI, not just the database record)?
- [ ] Mentor accepts — can both sides now message each other?
- [ ] Open two separate browser windows (or one normal + one incognito) logged in as each side of an accepted match. Send a message from one — does it appear in the other **without a page refresh**? This is the real test of whether Pusher is actually wired up versus just installed.
- [ ] Try messaging someone you have NOT been matched with (via direct URL manipulation if possible) — is it blocked?

## 5. Resources
- [ ] Mentor attaches a resource (link/doc) tagged to a pain point — does it show up on the correct mentee's dashboard, filtered correctly, or does every mentee see every resource?

## 6. Events
- [ ] Create an event as a mentor, set a small capacity (e.g. 2).
- [ ] Register 2 test mentee accounts — does the 3rd registration attempt get blocked or waitlisted, or does it silently overbook?
- [ ] Confirm the filter controls (domain, pain-point tag, free/paid, date range) actually filter results, not just render as UI with no logic behind them.

## 7. Public mentor profile
- [ ] Log out completely, visit a mentor's `/mentors/[slug]` URL directly — does it load without requiring login?
- [ ] Paste the URL into a service that shows link previews (or check the page source for OG meta tags) — does a share card actually render, or is it a blank/broken preview?
- [ ] Confirm impact stats (mentees helped, workshops hosted, testimonials received) reflect real counts, not placeholder numbers.

## 8. Testimonials
- [ ] Submit a testimonial and tag a specific mentor — does that mentor's public profile impact stats actually update, or only the testimonials page?
- [ ] Use the "flag this story" button — does anything actually happen (admin queue, hidden from view), or is it a button with no handler?

## 9. Dashboards
- [ ] Mentee dashboard: edit your diagnostic snapshot (target role, pain points) — does it save and persist on reload?
- [ ] Mentor dashboard: does the pending-requests list update in real time or only after a manual refresh?
- [ ] Admin dashboard: can a non-admin user reach `/dashboard/admin` by typing the URL directly? This wasn't in the original PRD scope — confirm it actually has role-based access control and isn't open to any logged-in user.

## 10. Background jobs (Inngest)
- [ ] Check the actual Inngest dashboard/logs (not the code) — has `mentorFeedbackNudge` fired for a real test match after the 7-day condition, or does it only exist as an unregistered function?
- [ ] Same check for `testimonialPrompt`, `shareCardGeneration`, and `matchScoreRefresh` — each should show real invocation history, not just be present in the codebase.

## 11. General red flags to watch for
- [ ] Search the codebase for `TODO`, `FIXME`, `console.log("test")`, or hardcoded mock data left in place of real logic.
- [ ] Check whether any "integrated" service (Pusher, UploadThing, Inngest, LinkedIn) has real API keys configured in `.env.local`, or whether the code path exists but has never actually been run against the live service.
- [ ] Run `npx tsc --noEmit` — does it pass cleanly, or are there suppressed/ignored type errors?

---

**Bottom line:** don't mark the MVP "done" off this alone — mark each row done only once you've personally reproduced the behavior. Anything you can't check off yet is the real remaining work, regardless of what a walkthrough summary claims.
