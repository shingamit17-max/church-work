import { DashboardSidebar } from '@/components/DashboardSidebar';
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
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar userRole="mentor" userName={userName} userEmail={userEmail} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Job Board</h1>
                <p className="text-slate-600 dark:text-slate-400">Post and manage job opportunities for your mentees</p>
              </div>
              <button className="px-6 py-3 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                Post Job
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">2</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Active Postings</p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">20</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Total Applications</p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">587</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Total Views</p>
              </div>
            </div>

            {/* Job Postings */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Postings</h2>
              
              {mockPostedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-slate-300 dark:hover:shadow-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          job.active
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                        }`}>
                          {job.active ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{job.company} • {job.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Type</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.type}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Applications</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.applications}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Views</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.views}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Posted</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.postedAt}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium transition-colors">
                      View Applications
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium transition-colors">
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
        </div>
      </main>
    </div>
  );
}
