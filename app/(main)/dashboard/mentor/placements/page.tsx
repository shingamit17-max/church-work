
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { JobOpportunity } from '@/models/JobOpportunity';
import { PostJobModal } from '@/components/PostJobModal';

export default async function MentorPlacementsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentor') {
    redirect('/login');
  }

  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';

  await dbConnect();
  const postedJobs = await JobOpportunity.find({ postedBy: session.user.id }).sort({ createdAt: -1 });
  const activePostings = postedJobs.filter(j => j.isActive).length;
  const totalApplications = postedJobs.reduce((acc, j) => acc + (j.applications?.length || 0), 0);
  const totalViews = postedJobs.reduce((acc, j) => acc + (j.views || 0), 0);

  return (
    <>
      <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Job Board</h1>
                <p className="text-white/60">Post and manage job opportunities for your mentees</p>
              </div>
              <PostJobModal />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl">
                <div className="text-4xl font-black text-foreground">{activePostings}</div>
                <p className="text-muted-foreground font-bold text-sm mt-2">Active Postings</p>
              </div>
              
              <div className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl">
                <div className="text-4xl font-black text-foreground">{totalApplications}</div>
                <p className="text-muted-foreground font-bold text-sm mt-2">Total Applications</p>
              </div>
              
              <div className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl">
                <div className="text-4xl font-black text-foreground">{totalViews}</div>
                <p className="text-muted-foreground font-bold text-sm mt-2">Total Views</p>
              </div>
            </div>

            {/* Job Postings */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Your Postings</h2>
              
              {postedJobs.length === 0 ? (
                <div className="p-16 rounded-2xl text-center bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)]">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">No jobs posted</h3>
                  <p className="text-sm text-muted-foreground font-medium">You haven't posted any job opportunities yet.</p>
                </div>
              ) : postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="warm-card p-6 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 ${
                          job.isActive
                            ? 'bg-[#dcfce7] border-black text-black'
                            : 'bg-muted border-border text-muted-foreground'
                        }`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{job.company} • {job.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/10">
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Type</p>
                      <p className="font-medium text-white">{job.type}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs font-bold">Applications</p>
                      <p className="font-medium text-foreground">{job.applications?.length || 0}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Views</p>
                      <p className="font-medium text-white">{job.views}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs font-bold">Posted</p>
                      <p className="font-medium text-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium transition-colors">
                      View Applications
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium transition-colors">
                      Edit
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg border border-red-300 dark:border-red-700/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 font-medium transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
      </div>
    </>
  );
}
