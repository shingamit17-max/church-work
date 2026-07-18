
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface NetworkMember {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  avatar: string;
  mutual: number;
  connected: boolean;
}

const mockMembers: NetworkMember[] = [];

export default async function NetworkPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentee') {
    redirect('/login');
  }

  return (
    <>
      <div className="max-w-6xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">My Network</h1>
              <p className="text-muted-foreground font-medium">Connect with mentors and professionals in your industry</p>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl">
                <div className="text-4xl font-black text-foreground">0</div>
                <p className="text-muted-foreground font-bold text-sm mt-2">Total Connections</p>
              </div>
              
              <div className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl">
                <div className="text-4xl font-black text-foreground">0</div>
                <p className="text-muted-foreground font-bold text-sm mt-2">Active Mentors</p>
              </div>
              
              <div className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl">
                <div className="text-4xl font-black text-foreground">0</div>
                <p className="text-muted-foreground font-bold text-sm mt-2">Recommendations</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search by name, role, company..."
                className="warm-input"
              />
              <button className="px-6 py-2 bg-[#f43f5e] text-white font-bold border-[3px] border-border shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Search
              </button>
            </div>

            {/* Network Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {mockMembers.length === 0 ? (
                <div className="col-span-full p-16 rounded-2xl text-center bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)]">
                  <div className="text-5xl mb-4">🌐</div>
                  <h3 className="font-bold text-xl mb-2 text-foreground">No connections yet</h3>
                  <p className="text-sm text-muted-foreground font-medium">Start connecting with mentors and peers to build your network.</p>
                </div>
              ) : mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-6 bg-card border-[3px] border-border shadow-[4px_4px_0px_var(--neo-border)] rounded-2xl hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-[#292524] border-2 border-black flex items-center justify-center text-white text-xl font-black shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-foreground">{member.name}</h3>
                      <p className="text-muted-foreground font-bold text-sm">{member.role}</p>
                      <p className="text-foreground/80 font-bold text-xs mt-1">{member.company}</p>
                    </div>
                  </div>

                  <p className="text-foreground/70 font-medium text-sm mb-4 line-clamp-2">{member.bio}</p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-border/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-foreground/60">
                      <span>📍</span>
                      <span>{member.location}</span>
                    </div>
                    <div className="text-xs font-bold text-foreground/60">
                      {member.mutual} mutual connection{member.mutual !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {member.connected ? (
                      <>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-card text-foreground font-bold border-2 border-border shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-all">
                          Message
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-card text-foreground font-bold border-2 border-border shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-all">
                          View Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-[#ff6b6b] text-white font-bold border-2 border-border shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-all">
                          Connect
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-xl bg-card text-foreground font-bold border-2 border-border shadow-[3px_3px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-all hidden sm:block">
                          View Profile
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
      </div>
    </>
  );
}
