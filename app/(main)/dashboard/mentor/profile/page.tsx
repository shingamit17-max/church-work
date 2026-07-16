
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function MentorProfilePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentor') {
    redirect('/login');
  }

  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';

  return (
    <>
      <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">My Mentor Profile</h1>
              <p className="text-slate-600 dark:text-slate-400">Build your public mentor profile to attract mentees</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Preview Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 sticky top-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-1">{userName}</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-center text-sm mb-4">{userEmail}</p>
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium">
                      👨‍💼 Mentor
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 rounded-lg bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-medium transition-colors mb-3">
                    Edit Picture
                  </button>
                  <button className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-medium transition-colors text-sm">
                    View Public Profile
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
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Professional Bio</label>
                      <textarea
                        placeholder="Share your professional background and mentoring expertise..."
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mentoring Information */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Mentoring Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Current Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Company</label>
                      <input
                        type="text"
                        placeholder="e.g., Google, Meta, Startup Inc"
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
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Expertise Areas</label>
                      <input
                        type="text"
                        placeholder="e.g., React, System Design, Career Growth (comma-separated)"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Max Mentees</label>
                      <input
                        type="number"
                        placeholder="5"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Mentoring Focus</label>
                      <textarea
                        placeholder="What specific challenges do you help mentees with? What's your mentoring style?"
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Social Links</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">LinkedIn</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Twitter</label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/yourhandle"
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Website/Portfolio</label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
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
    </>
  );
}
