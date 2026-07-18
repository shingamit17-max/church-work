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
          <p className="text-sm mb-1 font-bold text-foreground/70">Community</p>
          <h1 className="text-3xl font-black text-foreground" style={{ letterSpacing: "-0.03em" }}>
            Find a Mentor
          </h1>
          <p className="text-sm mt-1 text-muted-foreground font-medium">
            Browse professionals from our community ready to guide you.
          </p>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl border-2 border-border shadow-[2px_2px_0px_#000] bg-amber-200"
        >
          <svg width="16" height="16" fill="none" stroke="#000" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-sm font-bold text-black">
            {mentorProfiles.length} mentor{mentorProfiles.length !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>

      {/* AI matches CTA */}
      <div
        className="p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)]"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-2xl border-2 border-border shadow-[2px_2px_0px_var(--neo-border)] bg-card">
          🤖
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-black text-sm mb-1 text-foreground">Get AI-curated matches</h3>
          <p className="text-xs leading-relaxed font-bold text-foreground/70">
            Let our algorithm analyse your goals and pain points to surface the 2–4 best-fit mentors for you.
          </p>
        </div>
        <form action="/api/matches/generate" method="POST" className="shrink-0">
          <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap hover:-translate-y-0.5 active:translate-y-0"
            style={{ backgroundColor: "var(--foreground)", border: "2px solid var(--neo-border)", color: "var(--background)", boxShadow: "2px 2px 0px #f97316" }}
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
              <div key={mentor._id.toString()} className="rounded-2xl flex flex-col relative overflow-hidden transition-all hover:-translate-y-1 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)]">
                {/* Banner */}
                <div className="h-20 w-full border-b-[3px] border-border bg-amber-200" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                
                {/* Avatar */}
                <div className="px-5 relative flex justify-between items-end -mt-10 mb-2">
                  <div className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-black shrink-0 border-[3px] border-border bg-[#f97316] text-white shadow-[2px_2px_0px_var(--neo-border)]">
                    {initials}
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="font-black text-lg truncate text-foreground leading-tight">{user?.name || "Grace Mentor"}</h3>
                    {mentor.currentRole && <p className="text-sm font-bold truncate mt-1 text-foreground/70">{mentor.currentRole}</p>}
                    {mentor.company && <p className="text-xs font-bold mt-1 text-foreground/60">@ {mentor.company}</p>}
                  </div>

                  {/* Domain tags */}
                  {(mentor.domain || mentor.specialization) && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {mentor.domain && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#fef3c7] border border-black text-black">
                          {mentor.domain}
                        </span>
                      )}
                      {mentor.specialization && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-foreground">
                          {mentor.specialization}
                        </span>
                      )}
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-foreground">
                        {mentor.yearsExp}y exp
                      </span>
                    </div>
                  )}

                  {/* Bio */}
                  {mentor.bio && (
                    <p className="text-xs font-medium leading-relaxed line-clamp-2 text-foreground/80 mb-4">{mentor.bio}</p>
                  )}

                  <div className="mt-auto" />

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t-2 border-border/20">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border-2"
                      style={{
                        background: slotsLeft > 0 ? "#dcfce7" : "#f3f4f6",
                        color: "#000",
                        borderColor: "#000",
                      }}
                    >
                      {slotsLeft > 0 ? `${slotsLeft} slot${slotsLeft !== 1 ? "s" : ""} open` : "Full"}
                    </span>
                    <NextLink href={`/mentors/${mentor.shareSlug}`}
                      className="text-xs px-4 py-2 rounded-lg font-bold hover:-translate-y-0.5 transition-all bg-black border-2 border-border text-white shadow-[2px_2px_0px_#f97316]"
                    >
                      View Profile &rarr;
                    </NextLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
