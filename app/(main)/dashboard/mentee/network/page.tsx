
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

const mockMembers: NetworkMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Senior Product Manager',
    company: 'Google',
    location: 'Mountain View, CA',
    bio: 'Passionate about building products that matter',
    avatar: 'SC',
    mutual: 3,
    connected: false,
  },
  {
    id: '2',
    name: 'Marcus Williams',
    role: 'Engineering Lead',
    company: 'Meta',
    location: 'Menlo Park, CA',
    bio: 'Building scalable systems at scale',
    avatar: 'MW',
    mutual: 2,
    connected: false,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Designer & Mentor',
    company: 'Design Co',
    location: 'Austin, TX',
    bio: 'Helping designers grow their careers',
    avatar: 'ER',
    mutual: 5,
    connected: true,
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Startup Founder',
    company: 'Tech Startup Inc',
    location: 'San Francisco, CA',
    bio: 'Building the future of tech',
    avatar: 'DK',
    mutual: 1,
    connected: false,
  },
];

export default async function NetworkPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentee') {
    redirect('/login');
  }

  return (
    <>
      <div className="max-w-6xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">My Network</h1>
              <p className="text-white/60">Connect with mentors and professionals in your industry</p>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="warm-card p-6">
                <div className="text-3xl font-bold text-white">47</div>
                <p className="text-white/60 text-sm mt-2">Total Connections</p>
              </div>
              
              <div className="warm-card p-6">
                <div className="text-3xl font-bold text-white">12</div>
                <p className="text-white/60 text-sm mt-2">Active Mentors</p>
              </div>
              
              <div className="warm-card p-6">
                <div className="text-3xl font-bold text-white">5</div>
                <p className="text-white/60 text-sm mt-2">Recommendations Received</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search by name, role, company..."
                className="warm-input"
              />
              <button className="btn-amber px-6">
                Search
              </button>
            </div>

            {/* Network Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="warm-card p-6 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-stone-800 to-stone-900 border border-white/10 flex items-center justify-center text-white text-xl font-bold shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-white/60 text-sm">{member.role}</p>
                      <p className="text-white/80 text-xs">{member.company}</p>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm mb-4">{member.bio}</p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <span>📍</span>
                      <span>{member.location}</span>
                    </div>
                    <div className="text-xs text-white/50">
                      {member.mutual} mutual connection{member.mutual !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {member.connected ? (
                      <>
                        <button className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white/80 font-medium transition-colors hover:bg-white/20">
                          Message
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium transition-colors">
                          View Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn-amber w-full">
                          Connect
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium transition-colors">
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
