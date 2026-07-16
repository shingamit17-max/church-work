import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MentorProfile } from "@/models/MentorProfile";
import { Event } from "@/models/Event";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function MentorDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentor") redirect("/login");

  await dbConnect();

  const matches = await Match.find({ mentorId: session.user.id }).sort({ createdAt: -1 });
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
          <p className="text-sm mb-1" style={{ color: "#57534e" }}>Welcome back 👋</p>
          <h1 className="text-3xl font-semibold" style={{ letterSpacing: "-0.03em", color: "#fafaf9" }}>
            Mentor Dashboard
          </h1>
        </div>
        <div
          className="flex items-center gap-4 px-5 py-3 rounded-2xl"
          style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}
        >
          <div>
            <p className="text-xs" style={{ color: "#57534e" }}>Active Mentees</p>
            <p className="text-2xl font-bold" style={{ color: "#4ade80", letterSpacing: "-0.03em" }}>
              {currentCount} <span className="text-sm font-normal" style={{ color: "#57534e" }}>/ {capacity}</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: matches.length, color: "#fafaf9" },
          { label: "Pending", value: pending.length, color: "#fbbf24" },
          { label: "Active", value: active.length, color: "#4ade80" },
          { label: "Events Hosted", value: hostedEvents.length, color: "#a78bfa" },
        ].map((s) => (
          <div key={s.label} className="p-5 rounded-2xl" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: "#57534e" }}>{s.label}</p>
            <p className="text-3xl font-light" style={{ color: s.color, letterSpacing: "-0.03em" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-8">

          {/* Pending requests */}
          <section>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold" style={{ color: "#fafaf9" }}>
                Connection Requests
                {pending.length > 0 && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)", verticalAlign: "middle" }}>
                    {pending.length} new
                  </span>
                )}
              </h2>
            </div>

            {pending.length === 0 ? (
              <div className="p-10 rounded-2xl text-center" style={{ background: "rgba(41,37,36,0.5)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm" style={{ color: "#78716c" }}>No pending requests right now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((match) => (
                  <div key={match.id} className="p-5 rounded-2xl" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>
                        New Request
                      </span>
                      <span className="text-xs" style={{ color: "#57534e" }}>Match ID: {match._id.toString().slice(-6)}</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: "#a8a29e" }}>{match.matchReason}</p>
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
            <h2 className="text-lg font-semibold mb-5" style={{ color: "#fafaf9" }}>Active Mentees</h2>
            {active.length === 0 ? (
              <div className="p-10 rounded-2xl text-center" style={{ background: "rgba(41,37,36,0.5)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                <div className="text-3xl mb-2">🤝</div>
                <p className="text-sm" style={{ color: "#78716c" }}>No active mentees yet. Accept a request to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {active.map((match) => (
                  <div key={match.id} className="p-5 rounded-2xl transition-all" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium block mb-3 w-fit" style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}>
                      Active
                    </span>
                    <p className="text-sm leading-relaxed mb-5 line-clamp-2" style={{ color: "#a8a29e" }}>{match.matchReason}</p>
                    <div className="space-y-2">
                      <NextLink href={`/chat/${match._id}`} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#0c0a09", boxShadow: "0 4px 12px rgba(245,158,11,0.2)" }}>
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
          <div className="p-6 rounded-2xl" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#fafaf9" }}>Your Public Profile</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "#57534e" }}>
              Share this link on LinkedIn or Twitter to invite mentees directly.
            </p>
            <div className="p-3 rounded-xl mb-4 font-mono" style={{ background: "rgba(12,10,9,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs truncate" style={{ color: "#f59e0b" }}>
                gracementor.com/mentors/{profile?.shareSlug || "…"}
              </p>
            </div>
            <NextLink
              href={`/mentors/${profile?.shareSlug}`}
              className="block text-center w-full py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#d6d3d1" }}
            >
              View Public Profile
            </NextLink>
          </div>

          {/* Events */}
          <div className="p-6 rounded-2xl" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: "#fafaf9" }}>Hosted Events</h3>
              <NextLink href="/events/create" className="text-xs px-2.5 py-1 rounded-lg" style={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
                + New
              </NextLink>
            </div>
            {hostedEvents.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-xs mb-4" style={{ color: "#57534e" }}>Host a group workshop or Q&A.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {hostedEvents.slice(0, 3).map((evt: { _id: string; title: string; dateTime: string; registeredCount: number; capacity: number }) => (
                  <NextLink key={evt._id} href={`/events/${evt._id}`} className="flex items-center justify-between p-3 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "#fafaf9" }}>{evt.title}</p>
                      <p className="text-[11px]" style={{ color: "#57534e" }}>{new Date(evt.dateTime).toLocaleDateString()}</p>
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
