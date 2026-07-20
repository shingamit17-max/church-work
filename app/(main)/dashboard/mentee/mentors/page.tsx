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
