
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
    <>
      <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
              <p className="text-white/60">Manage your professional information and preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <div className="warm-card p-6">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-stone-800 to-stone-900 border border-white/10 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-white text-center mb-1">{userName}</h2>
                  <p className="text-white/60 text-center text-sm mb-4">{userEmail}</p>
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/5 text-white/80 text-sm font-medium">
                      🎓 Job Seeker
                    </span>
                  </div>
                  <button className="btn-amber w-full">
                    Edit Profile Picture
                  </button>
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="warm-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={userName}
                        className="warm-input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={userEmail}
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Bio</label>
                      <textarea
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="warm-input resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Career Information */}
                <div className="warm-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Career Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Current Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Software Engineer"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Target Role</label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Engineer, Product Manager"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Years of Experience</label>
                      <input
                        type="number"
                        placeholder="0"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Skills</label>
                      <input
                        type="text"
                        placeholder="e.g., React, TypeScript, Node.js (comma-separated)"
                        className="warm-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3">
                  <button className="btn-amber px-8">
                    Save Changes
                  </button>
                  <button className="w-full px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium transition-colors text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
      </div>
    </>
  );
}
