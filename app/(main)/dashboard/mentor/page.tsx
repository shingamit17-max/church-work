import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { Match } from "@/models/Match";
import { MentorProfile } from "@/models/MentorProfile";
import NextLink from "next/link";
import { redirect } from "next/navigation";

export default async function MentorDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "mentor") redirect("/login");

  await dbConnect();
  
  const matches = await Match.find({ mentorId: session.user.id }).sort({ createdAt: -1 });
  const profile = await MentorProfile.findOne({ userId: session.user.id });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
            Mentor Dashboard
          </h1>
          <p className="text-white/60">Welcome back, {session.user.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{profile?.currentMenteeCount || 0} / {profile?.maxMentees || 0}</div>
          <div className="text-xs text-white/50 uppercase">Active Mentees</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Connection Requests</h2>
            {matches.filter(m => m.status === 'pending').length === 0 ? (
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 text-center">
                <p className="text-white/60">You don&apos;t have any pending requests.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.filter(m => m.status === 'pending').map((match) => (
                  <div key={match.id} className="p-6 border border-white/10 rounded-2xl bg-white/5">
                    <div className="mb-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                        New Request
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-6">{match.matchReason}</p>
                    
                    <div className="flex gap-2">
                      <form action={`/api/connections/accept`} method="POST" className="flex-1">
                        <input type="hidden" name="matchId" value={match._id.toString()} />
                        <button type="submit" className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-teal-500/25">
                          Accept
                        </button>
                      </form>
                      <form action={`/api/connections/reject`} method="POST" className="flex-1">
                        <input type="hidden" name="matchId" value={match._id.toString()} />
                        <button type="submit" className="w-full py-2.5 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-sm font-medium transition-colors">
                          Decline
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Active Mentees</h2>
            {matches.filter(m => m.status === 'accepted').length === 0 ? (
              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 text-center">
                <p className="text-white/60">No active mentees yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.filter(m => m.status === 'accepted').map((match) => (
                  <div key={match.id} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="mb-4">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Active Connection
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-6 line-clamp-2">{match.matchReason}</p>
                    <NextLink href={`/chat/${match._id}`} className="w-full block text-center py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors text-sm font-medium shadow-lg shadow-indigo-500/25">
                      Open Chat
                    </NextLink>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h3 className="font-semibold mb-4 text-center">Share Your Profile</h3>
            <p className="text-xs text-white/60 text-center mb-6">
              Invite mentees directly by sharing your public profile link on LinkedIn or Twitter.
            </p>
            <div className="bg-black/40 border border-white/10 p-3 rounded-lg flex items-center justify-between mb-4">
              <code className="text-xs text-teal-400 truncate flex-1">
                gracementor.com/mentors/{profile?.shareSlug}
              </code>
            </div>
            <NextLink href={`/mentors/${profile?.shareSlug}`} className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
              View Public Profile
            </NextLink>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <h3 className="font-semibold mb-2">Hosted Events</h3>
            <p className="text-xs text-white/60 mb-4">Host a group workshop or Q&A.</p>
            <button disabled className="w-full py-2 bg-white/5 border border-white/10 text-white/40 rounded-lg text-sm cursor-not-allowed">
              Coming in Phase 6
            </button>
          </section>

          <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 text-center">Feedback Queue</h3>
            {matches.filter(m => m.status === 'accepted').length === 0 ? (
              <p className="text-xs text-white/60 text-center mb-4">No active mentees to provide feedback for.</p>
            ) : (
              <div className="space-y-3">
                {matches.filter(m => m.status === 'accepted').map(match => (
                  <NextLink 
                    key={match._id.toString()}
                    href={`/feedback/${match._id.toString()}`} 
                    className="block w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm text-center transition-colors"
                  >
                    Leave feedback for Mentee
                  </NextLink>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
