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
  
  const profile = await MentorProfile.findOne({ shareSlug: slug }).populate("userId", "name email");
  if (!profile) {
    notFound();
  }

  const session = await auth();
  const mentorName = (profile.userId as { name: string }).name;
  const isAvailable = profile.currentMenteeCount < profile.maxMentees;
  
  return (
    <div className="min-h-screen bg-linear-to-b from-black to-[#0a0a0a] text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <BackButton fallbackUrl="/" />

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {mentorName}
                </h1>
                {isAvailable ? (
                  <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full border border-teal-500/30">
                    Accepting Mentees
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full border border-red-500/30">
                    At Capacity
                  </span>
                )}
              </div>
              
              <p className="text-xl text-white/80 mb-6 font-light">
                {profile.currentRole} at <span className="font-medium text-white">{profile.company}</span>
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white/80">
                  {profile.yearsExp} Years Exp
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white/80">
                  {profile.domain}
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white/80">
                  {profile.specialization}
                </span>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">About Me</h2>
                <p className="text-white/70 leading-relaxed">
                  {profile.bio || "This mentor hasn't written a bio yet."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-indigo-300">I can help with</h3>
                  <ul className="space-y-2">
                    {profile.painPointsCanHelp?.map((pt: string) => (
                      <li key={pt} className="flex items-center gap-2 text-white/70">
                        <span className="text-teal-400">✓</span> {pt.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-indigo-300">Mentorship Modes</h3>
                  <ul className="space-y-2">
                    {profile.helpTypes?.map((ht: string) => (
                      <li key={ht} className="flex items-center gap-2 text-white/70">
                        <span className="text-teal-400">✦</span> {ht}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            <div className="w-full md:w-80 bg-black/40 rounded-2xl p-6 border border-white/10 shrink-0">
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
