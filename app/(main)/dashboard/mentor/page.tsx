import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MentorProfile } from "@/models/MentorProfile";
import { Event } from "@/models/Event";
import "@/models/User";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function MentorDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentor") redirect("/login");

  await dbConnect();

  const matches = await Match.find({ mentorId: session.user.id }).populate("menteeId", "name").sort({ createdAt: -1 });
  const profile = await MentorProfile.findOne({ userId: session.user.id });
  const hostedEvents = await Event.find({ hostId: session.user.id }).sort({ dateTime: 1 });

  const pending = matches.filter((m) => m.status === "pending");
  const active = matches.filter((m) => m.status === "accepted");
  const capacity = profile?.maxMentees || 0;
  const currentCount = profile?.currentMenteeCount || active.length;

  return (
    <div className="space-y-10 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm mb-1 text-muted-foreground">Welcome back 👋</p>
          <h1 className="text-3xl font-semibold text-foreground" style={{ letterSpacing: "-0.03em" }}>
            Mentor Dashboard
          </h1>
        </div>
        <div
          className="flex items-center gap-4 px-5 py-3 rounded-2xl"
          style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}
        >
          <div>
            <p className="text-xs text-muted-foreground">Active Mentees</p>
            <p className="text-2xl font-bold" style={{ color: "#4ade80", letterSpacing: "-0.03em" }}>
              {currentCount} <span className="text-sm font-normal text-muted-foreground">/ {capacity}</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(74,222,128,0.1)" }}>
            <svg width="20" height="20" fill="none" stroke="#4ade80" strokeWidth="1.75" viewBox="0 0 24 24">
              <circle cx="9" cy="7" r="4"/><path d="M2 20c0-3.3 3.1-6 7-6"/><circle cx="17" cy="11" r="3"/><path d="M14 20c0-2.2 1.3-4 3-4s3 1.8 3 4"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: matches.length, accent: "var(--foreground)" },
          { label: "Pending", value: pending.length, accent: "#fbbf24" },
          { label: "Active", value: active.length, accent: "#4ade80" },
          { label: "Events Hosted", value: hostedEvents.length, accent: "#a78bfa" },
        ].map(({ label, value, accent }) => (
          <div key={label} className="p-5 rounded-2xl flex flex-col gap-1 bg-card border border-border">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="text-3xl font-light" style={{ color: accent, letterSpacing: "-0.03em" }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-8">

          {/* Pending requests */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Connection Requests
                {pending.length > 0 && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", verticalAlign: "middle" }}>
                    {pending.length} new
                  </span>
                )}
              </h2>
            </div>

            {pending.length === 0 ? (
              <div className="p-10 rounded-2xl text-center bg-card/50 border border-border border-dashed">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm text-muted-foreground">No pending requests right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((match) => (
                  <div key={match._id.toString()} className="p-5 rounded-2xl bg-card border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-lg">{match.menteeId?.name || "Unknown Mentee"}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium border bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 w-fit">
                          New Request
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Match ID: {match._id.toString().slice(-6)}</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-5 text-muted-foreground">{match.matchReason}</p>
                    <div className="flex gap-3">
                      <form action="/api/connections/accept" method="POST" className="flex-1">
                        <input type="hidden" name="matchId" value={match._id.toString()} />
                        <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: "linear-gradient(135deg,#4ade80,#16a34a)", color: "#0c0a09", boxShadow: "0 4px 12px rgba(74,222,128,0.2)" }}>
                          Accept
                        </button>
                      </form>
                      <form action="/api/connections/reject" method="POST" className="flex-1">
                        <input type="hidden" name="matchId" value={match._id.toString()} />
                        <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.2)", color: "#fb7185" }}>
                          Decline
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active mentees */}
          <section>
            <h2 className="text-lg font-semibold mb-5 text-foreground">Active Mentees</h2>
            {active.length === 0 ? (
              <div className="p-10 rounded-2xl text-center bg-card/50 border border-border border-dashed">
                <div className="text-3xl mb-2">🤝</div>
                <p className="text-sm text-muted-foreground">No active mentees yet. Accept a request to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.map((match) => (
                  <div key={match._id.toString()} className="p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden group transition-all bg-card border border-border">
                    <div className="flex flex-col gap-1 z-10 relative">
                      <span className="font-bold text-lg">{match.menteeId?.name || "Unknown Mentee"}</span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium block mb-1 w-fit border bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
                        Active
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed relative z-10 line-clamp-3 text-muted-foreground">{match.matchReason}</p>
                    <div className="space-y-2">
                      <NextLink href={`/messages/${match._id}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#0c0a09", boxShadow: "0 4px 12px rgba(245,158,11,0.2)" }}>
                        Open Chat
                      </NextLink>
                      <NextLink href={`/feedback/${match._id.toString()}`} className="w-full flex items-center justify-center py-2 rounded-xl text-sm transition-all" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                        Leave Feedback
                      </NextLink>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Share profile */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="text-sm font-semibold mb-2 text-foreground">Your Public Profile</h3>
            <p className="text-xs mb-4 leading-relaxed text-muted-foreground">
              Share this link on LinkedIn or Twitter to invite mentees directly.
            </p>
            <div className="p-3 rounded-xl mb-4 font-mono bg-background border border-border">
              <p className="text-xs truncate" style={{ color: "#f97316" }}>
                gracementor.com/mentors/{profile?.shareSlug || "…"}
              </p>
            </div>
            <NextLink
              href={`/mentors/${profile?.shareSlug}`}
              className="block text-center w-full py-2.5 rounded-xl text-sm font-medium transition-all bg-card border border-border text-muted-foreground hover:text-foreground"
            >
              View Public Profile
            </NextLink>
          </div>

          {/* Events */}
          <div className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Hosted Events</h3>
              <NextLink href="/events/create" className="text-xs px-3 py-1.5 rounded-lg transition-all text-muted-foreground bg-foreground/5 border border-border">
                + New
              </NextLink>
            </div>
            {hostedEvents.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-xs mb-4 text-muted-foreground">Host a group workshop or Q&A.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {hostedEvents.slice(0, 3).map((evt: { _id: string; title: string; dateTime: string; registeredCount: number; capacity: number }) => (
                  <NextLink key={evt._id} href={`/events/${evt._id}`} className="flex items-center justify-between p-3 rounded-xl transition-all bg-foreground/5 border border-border">
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate text-foreground">{evt.title}</p>
                      <p className="text-[11px] text-muted-foreground" suppressHydrationWarning>{new Date(evt.dateTime).toLocaleDateString("en-GB")}</p>
                    </div>
                    <span className="text-xs ml-3 shrink-0" style={{ color: "#4ade80" }}>
                      {evt.registeredCount}/{evt.capacity}
                    </span>
                  </NextLink>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
