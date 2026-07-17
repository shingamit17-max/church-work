import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MenteeProfile } from "@/models/MenteeProfile";
import { EventRegistration } from "@/models/EventRegistration";
import NextLink from "next/link";
import { redirect } from "next/navigation";

const STAT_CARD = ({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) => (
  <div
    className="p-5 rounded-2xl flex flex-col gap-1 bg-card border border-border"
  >
    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
    <p className="text-3xl font-light" style={{ color: accent || "var(--foreground)", letterSpacing: "-0.03em" }}>{value}</p>
    {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
  </div>
);

export default async function MenteeDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentee") redirect("/login");

  await dbConnect();

  const matches = await Match.find({ menteeId: session.user.id }).sort({ matchScore: -1 });
  const profile = await MenteeProfile.findOne({ userId: session.user.id });
  const eventRegistrations = await EventRegistration.find({ userId: session.user.id })
    .populate("eventId", "title dateTime domain isFree price status")
    .sort({ createdAt: -1 });

  const acceptedMatches = matches.filter((m) => m.status === "accepted");
  const pendingMatches = matches.filter((m) => m.status === "pending");

  return (
    <div className="space-y-10 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm mb-1 text-muted-foreground">Welcome back 👋</p>
          <h1
            className="text-3xl font-semibold text-foreground"
            style={{ letterSpacing: "-0.03em" }}
          >
            {session.user.name?.split(" ")[0]}&apos;s Dashboard
          </h1>
        </div>
        <NextLink
          href="/onboarding"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all self-start md:self-auto"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#fbbf24",
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit Profile
        </NextLink>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <STAT_CARD label="Mentor Matches" value={matches.length} sub="AI generated" accent="#fbbf24" />
        <STAT_CARD label="Active Mentors" value={acceptedMatches.length} sub="Connections" accent="#4ade80" />
        <STAT_CARD label="Pending" value={pendingMatches.length} sub="Awaiting response" accent="#fb7185" />
        <STAT_CARD label="Events" value={eventRegistrations.length} sub="Registered" />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: mentor matches + events */}
        <div className="lg:col-span-2 space-y-8">

          {/* Mentor Matches */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-foreground">Your Mentor Matches</h2>
              <NextLink
                href="/dashboard/mentee/mentors"
                className="text-xs px-3 py-1.5 rounded-lg transition-all text-muted-foreground bg-foreground/5 border border-border"
              >
                Find more →
              </NextLink>
            </div>

            {matches.length === 0 ? (
              <div
                className="p-10 rounded-2xl text-center bg-card border border-dashed border-border"
              >
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-sm mb-5 text-muted-foreground">No mentor matches yet. Generate your first set of AI-curated matches.</p>
                <form action="/api/matches/generate" method="POST">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: "linear-gradient(135deg,#ef4444,#f97316)",
                      color: "#0c0a09",
                      boxShadow: "0 4px 16px rgba(245,158,11,0.25)",
                    }}
                  >
                    Generate AI Matches
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group transition-all bg-card border border-border"
                  >
                    {/* Ambient accent */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none transition-all"
                      style={{
                        background: match.status === 'accepted' ? 'rgba(74,222,128,0.06)' : 'rgba(245,158,11,0.06)',
                        filter: 'blur(20px)',
                        transform: 'translate(30%, -30%)',
                      }}
                    />
                    <div className="flex items-start justify-between relative z-10">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: match.status === 'accepted' ? 'rgba(74,222,128,0.1)' : match.status === 'pending' ? 'rgba(251,191,36,0.1)' : 'rgba(251,113,133,0.1)',
                          color: match.status === 'accepted' ? '#4ade80' : match.status === 'pending' ? '#fbbf24' : '#fb7185',
                          border: `1px solid ${match.status === 'accepted' ? 'rgba(74,222,128,0.2)' : match.status === 'pending' ? 'rgba(251,191,36,0.2)' : 'rgba(251,113,133,0.2)'}`,
                        }}
                      >
                        {match.status === 'accepted' ? '✓ Active' : match.status === 'pending' ? '· Pending' : '✕ Declined'}
                      </span>
                      <span className="text-2xl font-bold" style={{ color: "#4ade80", letterSpacing: "-0.03em" }}>
                        {match.matchScore}%
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed relative z-10 line-clamp-3 text-muted-foreground">
                      {match.matchReason}
                    </p>
                    <div className="relative z-10 mt-auto">
                      {match.status === 'pending' && (
                        <NextLink
                          href={`/mentors/${match.mentorId.toString()}`}
                          className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-medium transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#d6d3d1" }}
                        >
                          View Profile & Request
                        </NextLink>
                      )}
                      {match.status === 'accepted' && (
                        <NextLink
                          href={`/chat/${match._id}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                          style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#0c0a09", boxShadow: "0 4px 12px rgba(245,158,11,0.2)" }}
                        >
                          Open Chat
                        </NextLink>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Events */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-foreground">Event Activity</h2>
              <NextLink
                href="/events"
                className="text-xs px-3 py-1.5 rounded-lg transition-all text-muted-foreground bg-foreground/5 border border-border"
              >
                Browse Events →
              </NextLink>
            </div>

            {eventRegistrations.length === 0 ? (
              <div
                className="p-8 rounded-2xl text-center bg-card border border-dashed border-border"
              >
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm line-clamp-2 text-muted-foreground">You haven&apos;t registered for any events yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventRegistrations.map((reg: { _id: string; eventId: { _id: string; title: string; dateTime: string; domain: string; isFree: boolean; price: number; status: string } }) => {
                  const evt = reg.eventId;
                  return (
                    <div
                      key={reg._id}
                      className="flex items-center justify-between p-4 rounded-xl transition-all bg-card border border-border"
                    >
                      <div className="min-w-0">
                        <NextLink href={`/events/${evt._id}`} className="text-sm font-medium hover:underline block mb-0.5 truncate text-foreground">
                          {evt.title}
                        </NextLink>
                        <p className="text-xs text-muted-foreground">
                          {new Date(evt.dateTime).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} · {evt.domain}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full shrink-0 ml-4"
                        style={{
                          background: evt.status === "upcoming" ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.05)",
                          color: evt.status === "upcoming" ? "#fbbf24" : "#78716c",
                          border: `1px solid ${evt.status === "upcoming" ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        {evt.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: sidebar widgets */}
        <div className="space-y-5">
          {/* Diagnostic card */}
          <div
            className="p-6 rounded-2xl bg-card border border-border"
          >
            <h3 className="text-sm font-semibold mb-5 text-foreground">Your Diagnostic</h3>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs mb-1 text-muted-foreground">Target Role</p>
                  <p className="font-medium text-foreground">
                    {profile.targetRoles?.[0] || "Not set"}{profile.targetDomain ? ` in ${profile.targetDomain}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1 text-muted-foreground">Career Stage</p>
                  <p className="text-sm capitalize text-foreground">{profile.careerStage?.replace(/_/g, " ")}</p>
                </div>
                {profile.diagnosticAnswers?.painPoints?.length > 0 && (
                  <div>
                    <p className="text-xs mb-2 text-muted-foreground">Pain Points</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.diagnosticAnswers.painPoints.slice(0, 3).map((pt: string) => (
                        <span key={pt} className="text-[11px] px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                          {pt.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <NextLink href="/onboarding" className="text-xs hover:underline" style={{ color: "#78716c" }}>
                    Re-take diagnostic →
                  </NextLink>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete your profile to see your diagnostic.</p>
            )}
          </div>

          {/* 3-month goal */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.04) 100%)",
              border: "1px solid rgba(245,158,11,0.15)",
            }}
          >
            <h3 className="text-sm font-semibold mb-1" style={{ color: "#fafaf9" }}>3-Month Goal</h3>
            <p className="text-xs italic leading-relaxed mb-5" style={{ color: "#78716c" }}>
              &quot;{profile?.goal3Months || "Secure a new role"}&quot;
            </p>
            <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-1.5 rounded-full" style={{ width: "25%", background: "linear-gradient(90deg,#ef4444,#f97316)" }} />
            </div>
            <p className="text-xs mt-2 text-right text-muted-foreground">In Progress · 25%</p>
          </div>

          {/* Testimonial CTA */}
          <div
            className="p-6 rounded-2xl text-center bg-card border border-border"
          >
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="text-sm font-semibold mb-1 text-foreground">Share Your Journey</h3>
            <p className="text-xs mb-4 leading-relaxed text-muted-foreground">
              Did mentorship help you reach a milestone? Your story could inspire someone else.
            </p>
            <NextLink
              href="/testimonials/submit"
              className="block text-center w-full py-2.5 rounded-xl text-sm font-medium transition-all bg-card border border-border text-muted-foreground hover:text-foreground"
            >
              Write a Testimonial
            </NextLink>
          </div>
        </div>
      </div>
    </div>
  );
}
