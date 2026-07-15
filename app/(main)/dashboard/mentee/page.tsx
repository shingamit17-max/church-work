import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MenteeProfile } from "@/models/MenteeProfile";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function MenteeDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentee") redirect("/login");

  await dbConnect();
  
  const matches = await Match.find({ menteeId: session.user.id }).sort({ matchScore: -1 });
  const profile = await MenteeProfile.findOne({ userId: session.user.id });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
          Mentee Dashboard
        </h1>
        <p className="text-white/60">Welcome back, {session.user.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Mentor Matches</h2>
            </div>
            
            {matches.length === 0 ? (
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 text-center">
                <p className="text-white/60 mb-4">You don&apos;t have any mentor matches yet.</p>
                <form action="/api/matches/generate" method="POST">
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors shadow-lg shadow-indigo-500/25">
                    Generate AI Matches
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <div key={match.id} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <span className={`text-xs px-2.5 py-1 rounded-full border ${
                          match.status === 'accepted' ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 
                          match.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}>
                          {match.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-400">{match.matchScore}%</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/70 mb-6 relative z-10 line-clamp-3">{match.matchReason}</p>
                    
                    <div className="relative z-10">
                      {match.status === 'pending' && (
                        <NextLink href={`/mentors/${match.mentorId.toString()}`} className="w-full block text-center py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-sm font-medium">
                          View Profile & Request
                        </NextLink>
                      )}
                      {match.status === 'accepted' && (
                        <NextLink href={`/chat/${match._id}`} className="w-full block text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors text-sm font-medium shadow-lg shadow-indigo-500/25">
                          Open Chat
                        </NextLink>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Event Activity</h2>
            <div className="p-8 border border-white/10 rounded-2xl bg-white/5 text-center text-white/50">
              You haven&apos;t registered for any events yet. (Coming in Phase 6)
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-semibold mb-4">Your Diagnostic</h3>
            {profile ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/50 mb-1">Target Role</div>
                  <div className="text-sm">{profile.targetRoles?.[0] || "Not set"} in {profile.targetDomain}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-1">Career Stage</div>
                  <div className="text-sm capitalize">{profile.careerStage?.replace(/_/g, ' ')}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50 mb-2">Pain Points</div>
                  <div className="flex flex-wrap gap-2">
                    {profile.diagnosticAnswers?.painPoints?.slice(0, 3).map((pt: string) => (
                      <span key={pt} className="px-2 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-teal-400">
                        {pt.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {profile.diagnosticAnswers?.painPoints?.length > 3 && (
                      <span className="text-xs text-white/50 px-2 py-1">+{profile.diagnosticAnswers.painPoints.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-white/10">
                  <NextLink href="/onboarding" className="text-xs text-indigo-400 hover:underline">
                    Re-take diagnostic →
                  </NextLink>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/50">Profile data missing.</p>
            )}
          </section>

          <section className="bg-linear-to-br from-indigo-900/40 to-teal-900/20 border border-indigo-500/30 rounded-2xl p-6">
            <h3 className="font-semibold mb-2">3-Month Goal Tracker</h3>
            <p className="text-sm text-white/70 mb-4 italic">&quot;{profile?.goal3Months || 'Secure a new role'}&quot;</p>
            <div className="w-full bg-black/50 rounded-full h-2 mb-2">
              <div className="bg-teal-400 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="text-right text-xs text-white/50">In Progress (25%)</div>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="font-semibold mb-2">Share Your Journey</h3>
            <p className="text-xs text-white/60 mb-4">Did mentorship help you reach a milestone?</p>
            <NextLink href="/testimonials/submit" className="inline-block w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
              Write a Testimonial
            </NextLink>
          </section>
        </div>
      </div>
    </div>
  );
}
