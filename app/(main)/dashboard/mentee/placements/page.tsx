
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

  return (
    <>
      <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Job Opportunities</h1>
              <p className="text-white/60">Discover roles tailored to your profile and goals</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search by title, company..."
                className="warm-input"
              />
              <button className="btn-amber px-6">
                Search
              </button>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="warm-card p-6 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-linear-to-br from-stone-800 to-stone-900 border border-white/10 flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">
                            {job.title}
                          </h2>
                          <p className="text-white/60 text-sm">{job.company}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                          {job.match}%
                        </div>
                      </div>
                      <p className="text-xs text-white/50 mt-1">Match</p>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-white/10">
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Location</p>
                      <p className="font-medium text-white">{job.location}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Type</p>
                      <p className="font-medium text-white">{job.type}</p>
                    </div>
                    {job.salary && (
                      <div className="text-sm">
                        <p className="text-white/50 text-xs">Salary</p>
                        <p className="font-medium text-white">{job.salary}</p>
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="text-white/50 text-xs">Posted by</p>
                      <p className="font-medium text-white">{job.postedBy}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium transition-colors">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-white/80 font-medium transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
      </div>
    </>
  );
}
