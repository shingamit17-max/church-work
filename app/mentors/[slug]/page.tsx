import { Metadata } from "next";
import dbConnect from "@/lib/db";
import { MentorProfile } from "@/models/MentorProfile";
import { auth } from "@/lib/auth";
import BackButton from "@/components/BackButton";
import { notFound } from "next/navigation";
import RequestMentorshipButton from "./RequestMentorshipButton";

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  await dbConnect();
  
  const profile = await MentorProfile.findOne({ shareSlug: slug }).populate("userId", "name");
  
  if (!profile) {
    return { title: "Mentor Not Found" };
  }

  const mentorName = (profile.userId as { name: string }).name;
  
  return {
    title: `${mentorName} - Mentor at Grace Mentor`,
    description: `Get mentorship from ${mentorName}, ${profile.currentRole} at ${profile.company}. Specializing in ${profile.specialization}.`,
    openGraph: {
      title: `${mentorName} - Grace Mentor`,
      description: profile.bio,
    },
  };
}

export default async function PublicMentorProfile({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  await dbConnect();
  
  const profile = await MentorProfile.findOne({ shareSlug: slug }).populate("userId", "name email churchOrganization");
  if (!profile) {
    notFound();
  }

  const session = await auth();
  const mentorName = (profile.userId as { name: string }).name;
  const isAvailable = profile.currentMenteeCount < profile.maxMentees;
  
  return (
    <div className="min-h-screen text-[#fafaf9] pt-24 pb-12 px-4" style={{ background: "#1c1917" }}>
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton fallbackUrl="/" />

        <div 
          className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
          style={{
            background: "rgba(41,37,36,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
          }}
        >
          {/* Background glow */}
          <div 
            className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none rounded-full" 
            style={{ 
              background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
              transform: "translate(30%,-30%)"
            }} 
          />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {mentorName}
                </h1>
                {isAvailable ? (
                  <span 
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }}
                  >
                    Accepting Mentees
                  </span>
                ) : (
                  <span 
                    className="px-3 py-1 text-xs font-semibold rounded-full"
                    style={{ background: "rgba(244,63,94,0.1)", color: "#fb7185", border: "1px solid rgba(244,63,94,0.2)" }}
                  >
                    At Capacity
                  </span>
                )}
              </div>
              
              <p className="text-xl mb-6 font-light" style={{ color: "#a8a29e" }}>
                {profile.currentRole} at <span className="font-medium" style={{ color: "#fafaf9" }}>{profile.company}</span>
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {profile.yearsExp} Years Exp
                </span>
                <span className="px-3 py-1 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {profile.domain}
                </span>
                <span className="px-3 py-1 rounded-lg text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {profile.specialization}
                </span>
                {(profile.userId as any).churchOrganization && (
                  <span className="px-3 py-1 rounded-lg text-sm flex items-center gap-1" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fcd34d" }}>
                    ⌂ {(profile.userId as any).churchOrganization}
                  </span>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">About Me</h2>
                <p className="leading-relaxed" style={{ color: "#d6d3d1" }}>
                  {profile.bio || "This mentor hasn't written a bio yet."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: "#fafaf9" }}>I can help with</h3>
                  <ul className="space-y-2">
                    {profile.painPointsCanHelp?.map((pt: string) => (
                      <li key={pt} className="flex items-center gap-2" style={{ color: "#d6d3d1" }}>
                        <span style={{ color: "#fbbf24" }}>✓</span> {pt.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: "#fafaf9" }}>Mentorship Modes</h3>
                  <ul className="space-y-2">
                    {profile.helpTypes?.map((ht: string) => (
                      <li key={ht} className="flex items-center gap-2" style={{ color: "#d6d3d1" }}>
                        <span style={{ color: "#fbbf24" }}>✦</span> {ht}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: "#fafaf9" }}>Preferred Mentee Experience</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.menteeSeniority?.map((sen: string) => (
                      <span key={sen} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "#e7e5e4" }}>
                        {sen}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: "#fafaf9" }}>Availability</h3>
                  <p style={{ color: "#d6d3d1" }}>
                    <span className="font-semibold text-white">{profile.availability?.hoursPerMonth || "A few"}</span> hours per month via <span className="font-semibold text-white capitalize">{profile.availability?.preferredMode || "various"}</span> sessions.
                  </p>
                </div>
              </div>

            </div>

            <div 
              className="w-full md:w-80 rounded-2xl p-6 shrink-0"
              style={{ background: "rgba(28,25,23,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <h3 className="text-lg font-semibold mb-6">Request Mentorship</h3>
              <RequestMentorshipButton 
                mentorId={profile.userId._id.toString()} 
                isAvailable={isAvailable}
                userSession={session ? {
                  id: session.user.id,
                  role: (session.user as { role: string }).role,
                  onboardingComplete: (session.user as { onboardingComplete: boolean }).onboardingComplete
                } : null}
              />
              <p className="text-xs text-white/40 text-center mt-4">
                Mentorship on Grace Mentor is always free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
