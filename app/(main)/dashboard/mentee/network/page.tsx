
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

  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';

  return (
    <>
      <div className="max-w-6xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">My Network</h1>
              <p className="text-slate-600 dark:text-slate-400">Connect with mentors and professionals in your industry</p>
            </div>

            {/* Network Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">47</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Total Connections</p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">12</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Active Mentors</p>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">5</div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Recommendations Received</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex gap-4">
              <input
                type="text"
                placeholder="Search by name, role, company..."
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <button className="px-6 py-3 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                Search
              </button>
            </div>

            {/* Network Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {mockMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg dark:hover:shadow-lg hover:shadow-slate-300 dark:hover:shadow-slate-700 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{member.role}</p>
                      <p className="text-slate-500 dark:text-slate-500 text-xs">{member.company}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{member.bio}</p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>📍</span>
                      <span>{member.location}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {member.mutual} mutual connection{member.mutual !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {member.connected ? (
                      <>
                        <button className="flex-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium transition-colors">
                          Message
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium transition-colors">
                          View Profile
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                          Connect
                        </button>
                        <button className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium transition-colors">
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
