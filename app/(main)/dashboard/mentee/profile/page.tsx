import { DashboardSidebar } from '@/components/DashboardSidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MenteeProfilePage() {
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
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">My Profile</h1>
              <p className="text-slate-600 dark:text-slate-400">Manage your professional information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-1">{userName}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-4">{userEmail}</p>
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                      🎓 Job Seeker
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                    Edit Profile Picture
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={userName}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={userEmail}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Bio</label>
                      <textarea
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Career Information */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Career Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Current Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Software Engineer"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Target Role</label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Engineer, Product Manager"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Years of Experience</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Skills</label>
                      <input
                        type="text"
                        placeholder="e.g., React, TypeScript, Node.js (comma-separated)"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3">
                  <button className="px-8 py-3 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors">
                    Save Changes
                  </button>
                  <button className="px-8 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
