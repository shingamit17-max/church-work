import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { MentorProfile } from "@/models/MentorProfile";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function FindMentorsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentee") redirect("/login");

  await dbConnect();

  const mentorProfiles = await MentorProfile.find({})
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(20);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-sm mb-1" style={{ color: "#57534e" }}>Community</p>
          <h1 className="text-3xl font-semibold" style={{ letterSpacing: "-0.03em", color: "#fafaf9" }}>
            Find a Mentor
          </h1>
          <p className="text-sm mt-1" style={{ color: "#78716c" }}>
            Browse professionals from our community ready to guide you.
          </p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
        >
          <svg width="16" height="16" fill="none" stroke="#f97316" strokeWidth="1.75" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-sm" style={{ color: "#fbbf24" }}>
            {mentorProfiles.length} mentor{mentorProfiles.length !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>

      {/* AI matches CTA */}
      <div
        className="p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 100%)",
          border: "1px solid rgba(245,158,11,0.2)",
        }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl" style={{ background: "rgba(245,158,11,0.15)" }}>
          🤖
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-semibold text-sm mb-1" style={{ color: "#fafaf9" }}>Get AI-curated matches</h3>
          <p className="text-xs leading-relaxed" style={{ color: "#78716c" }}>
            Let our algorithm analyse your goals and pain points to surface the 2–4 best-fit mentors for you.
          </p>
        </div>
        <form action="/api/matches/generate" method="POST" className="shrink-0">
          <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap"
            style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#0c0a09", boxShadow: "0 4px 16px rgba(245,158,11,0.25)" }}
          >
            Generate Matches
          </button>
        </form>
      </div>

      {/* Mentor grid */}
      {mentorProfiles.length === 0 ? (
        <div className="p-16 rounded-2xl text-center" style={{ background: "rgba(41,37,36,0.5)", border: "1px dashed rgba(255,255,255,0.08)" }}>
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="font-semibold mb-2" style={{ color: "#fafaf9" }}>No mentors yet</h3>
          <p className="text-sm" style={{ color: "#57534e" }}>Our mentor community is growing. Check back soon or use AI matching above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentorProfiles.map((mentor) => {
            const user = mentor.userId as { name?: string; email?: string } | null;
            const initials = (user?.name || "M").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
            const slotsLeft = (mentor.maxMentees || 0) - (mentor.currentMenteeCount || 0);
            return (
              <div key={mentor._id.toString()} className="p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden"
                style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: "rgba(245,158,11,0.05)", filter: "blur(24px)", transform: "translate(30%,-30%)" }} />

                {/* Avatar + name */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#0c0a09" }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate" style={{ color: "#fafaf9" }}>{user?.name || "Grace Mentor"}</h3>
                    {mentor.currentRole && <p className="text-xs truncate mt-0.5" style={{ color: "#78716c" }}>{mentor.currentRole}</p>}
                    {mentor.company && <p className="text-xs mt-0.5" style={{ color: "#57534e" }}>@ {mentor.company}</p>}
                  </div>
                </div>

                {/* Domain tags */}
                {(mentor.domain || mentor.specialization) && (
                  <div className="flex flex-wrap gap-1.5 relative z-10">
                    {mentor.domain && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                        {mentor.domain}
                      </span>
                    )}
                    {mentor.specialization && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "#57534e" }}>
                        {mentor.specialization}
                      </span>
                    )}
                    <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.04)", color: "#44403c" }}>
                      {mentor.yearsExp}y exp
                    </span>
                  </div>
                )}

                {/* Bio */}
                {mentor.bio && (
                  <p className="text-xs leading-relaxed line-clamp-2 relative z-10" style={{ color: "#78716c" }}>{mentor.bio}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between relative z-10 mt-auto pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <span className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{
                      background: slotsLeft > 0 ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.05)",
                      color: slotsLeft > 0 ? "#4ade80" : "#57534e",
                      border: `1px solid ${slotsLeft > 0 ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    {slotsLeft > 0 ? `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} open` : "Full"}
                  </span>
                  <NextLink href={`/mentors/${mentor.shareSlug}`}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium"
                    style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" }}
                  >
                    View Profile →
                  </NextLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
