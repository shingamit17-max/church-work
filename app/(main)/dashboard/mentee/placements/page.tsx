import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { JobOpportunity } from '@/models/JobOpportunity';

export default async function PlacementsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentee') {
    redirect('/login');
  }

  await dbConnect();
  const activeJobs = await JobOpportunity.find({ isActive: true })
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 });

  return (
    <>
      <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Job Opportunities</h1>
              <p className="text-muted-foreground font-medium">Discover roles tailored to your profile and goals</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search by title, company..."
                className="warm-input"
              />
              <button className="px-6 py-2 bg-[#f43f5e] text-white font-bold border-[3px] border-black shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Search
              </button>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {activeJobs.length === 0 ? (
                <div className="p-16 rounded-2xl text-center bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)]">
                  <div className="text-5xl mb-4">💼</div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">No jobs available</h3>
                  <p className="text-sm text-muted-foreground font-medium">Check back soon for new opportunities tailored to your profile.</p>
                </div>
              ) : activeJobs.map((job) => (
                <div
                  key={job._id.toString()}
                  className="p-6 rounded-2xl bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-card border-2 border-border flex items-center justify-center text-white font-black text-lg shrink-0 overflow-hidden">
                          {job.company.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-foreground group-hover:text-[#f43f5e] transition-colors">{job.title}</h3>
                          <p className="text-muted-foreground font-bold mt-1 text-sm">{job.company}</p>
                          <p className="text-muted-foreground/80 font-medium text-xs mt-0.5">Posted by {job.postedBy?.name || 'Mentor'} • {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#22c55e] border-[3px] border-black flex items-center justify-center text-white font-black text-lg shadow-[2px_2px_0px_var(--neo-border)]">
                          {job.match}%
                        </div>
                      </div>
                      <p className="text-xs font-bold text-foreground/60 mt-1">Match</p>
                    </div>
                  </div>

                  <p className="text-foreground/80 font-medium text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-block px-3 py-1 rounded-md bg-[#fef3c7] text-black border-2 border-black text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b-2 border-border/20">
                    <div className="text-sm">
                      <p className="text-foreground/60 font-bold text-xs">Location</p>
                      <p className="font-bold text-foreground">{job.location}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-foreground/60 font-bold text-xs">Type</p>
                      <p className="font-bold text-foreground">{job.type}</p>
                    </div>
                    {job.salary && (
                      <div className="text-sm">
                        <p className="text-foreground/60 font-bold text-xs">Salary</p>
                        <p className="font-bold text-foreground">{job.salary}</p>
                      </div>
                    )}
                    <div className="text-sm">
                      <p className="text-foreground/60 font-bold text-xs">Posted by</p>
                      <p className="font-bold text-foreground">{job.postedBy}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 rounded-xl bg-[#000] hover:-translate-y-0.5 active:translate-y-0 text-white font-bold border-2 border-black shadow-[3px_3px_0px_#f97316] transition-all">
                      View Details
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-xl bg-white hover:-translate-y-0.5 active:translate-y-0 text-foreground font-bold border-2 border-black shadow-[3px_3px_0px_var(--neo-border)] transition-all">
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
