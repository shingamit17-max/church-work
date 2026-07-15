import { DashboardSidebar } from '@/components/DashboardSidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  logo?: string;
  description: string;
  match: number;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary?: string;
  skills: string[];
  postedBy: string;
}

// Mock job data for LinkedIn-style display
const mockJobs: JobOpportunity[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    description: 'We are looking for a talented senior engineer to lead our backend team...',
    match: 92,
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $150k',
    skills: ['TypeScript', 'Node.js', 'React', 'AWS'],
    postedBy: 'John Doe',
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartUp Inc',
    description: 'Join our fast-growing startup as a Product Manager to shape our product strategy...',
    match: 85,
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100k - $130k',
    skills: ['Product Strategy', 'Analytics', 'Leadership'],
    postedBy: 'Jane Smith',
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    description: 'Create beautiful and intuitive user experiences for our global platform...',
    match: 78,
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $110k',
    skills: ['Figma', 'UI Design', 'User Research'],
    postedBy: 'Alex Johnson',
  },
];

export default async function PlacementsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentee') {
    redirect('/login');
  }

  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar userRole="mentee" userName={userName} userEmail={userEmail} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Job Opportunities</h1>
              <p className="text-slate-600 dark:text-slate-400">Discover roles tailored to your profile and goals</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search by title, company..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <button className="px-6 py-3 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                Search
              </button>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-slate-300 dark:hover:shadow-slate-700 transition-all hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">{job.company}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                          {job.match}%
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Match</p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Location</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.location}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Type</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.type}</p>
                    </div>
                    {job.salary && (
                      <div className="text-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-xs">Salary</p>
                        <p className="font-medium text-slate-900 dark:text-white">{job.salary}</p>
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Posted by</p>
                      <p className="font-medium text-slate-900 dark:text-white">{job.postedBy}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium transition-colors">
                      Save
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
