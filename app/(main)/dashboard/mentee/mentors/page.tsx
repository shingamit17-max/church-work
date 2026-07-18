import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { MentorProfile } from "@/models/MentorProfile";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import MentorCard from "@/components/MentorCard";

export default async function FindMentorsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentee") redirect("/login");

  await dbConnect();

  const mentorProfiles = await MentorProfile.find({})
    .populate("userId", "name email image verified churchOrganization")
    .sort({ createdAt: -1 })
    .limit(20);

  const userSession = session.user ? {
    id: session.user.id,
    role: session.user.role as string,
    onboardingComplete: session.user.onboardingComplete || false,
  } : null;

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
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-foreground/80">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mentorProfiles.map((mentor) => (
            <MentorCard key={mentor._id.toString()} mentor={JSON.parse(JSON.stringify(mentor))} userSession={userSession} />
          ))}
        </div>
      )}
    </div>
  );
}
