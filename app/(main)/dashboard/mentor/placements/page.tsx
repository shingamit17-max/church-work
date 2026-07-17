
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MentorPlacementsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentor') {
    redirect('/login');
  }

  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';

  const mockPostedJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      type: 'Full-time',
      applications: 8,
      views: 245,
      postedAt: '2024-01-15',
      active: true,
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartUp Inc',
      location: 'New York, NY',
      type: 'Full-time',
      applications: 12,
      views: 342,
      postedAt: '2024-01-10',
      active: true,
    },
  ];

  return (
    <>
      <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Job Board</h1>
                <p className="text-white/60">Post and manage job opportunities for your mentees</p>
              </div>
              <button className="btn-amber px-6">
                Post Job
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="warm-card p-6">
                <div className="text-3xl font-bold text-white">2</div>
                <p className="text-white/60 text-sm mt-2">Active Postings</p>
              </div>
              
              <div className="warm-card p-6">
                <div className="text-3xl font-bold text-white">20</div>
                <p className="text-white/60 text-sm mt-2">Total Applications</p>
              </div>
              
              <div className="warm-card p-6">
                <div className="text-3xl font-bold text-white">587</div>
                <p className="text-white/60 text-sm mt-2">Total Views</p>
              </div>
            </div>

            {/* Job Postings */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Your Postings</h2>
              
              {mockPostedJobs.map((job) => (
                <div
                  key={job.id}
                  className="warm-card p-6 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          job.active
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-white/10 text-white/80'
                        }`}>
                          {job.active ? 'Active' : 'Closed'}
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
                      <p className="text-white/50 text-xs">Applications</p>
                      <p className="font-medium text-white">{job.applications}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Views</p>
                      <p className="font-medium text-white">{job.views}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Posted</p>
                      <p className="font-medium text-white">{job.postedAt}</p>
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
