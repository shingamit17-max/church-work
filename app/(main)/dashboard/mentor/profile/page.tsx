
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
              <h1 className="text-4xl font-bold text-white mb-2">My Mentor Profile</h1>
              <p className="text-white/60">Build your public mentor profile to attract mentees</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Preview Card */}
              <div className="lg:col-span-1">
                <div className="warm-card p-6 sticky top-8">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-stone-800 to-stone-900 border border-white/10 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-white text-center mb-1">{userName}</h2>
                  <p className="text-white/60 text-center text-sm mb-4">{userEmail}</p>
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium">
                      👨‍💼 Mentor
                    </span>
                  </div>
                  <button className="btn-amber w-full mb-2">
                    Edit Picture
                  </button>
                  <button className="w-full px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white font-medium transition-colors text-sm">
                    View Public Profile
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
                      <label className="block text-sm font-medium text-white mb-2">Professional Bio</label>
                      <textarea
                        placeholder="Share your professional background and mentoring expertise..."
                        rows={4}
                        className="warm-input resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mentoring Information */}
                <div className="warm-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Mentoring Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Current Job Title</label>
                      <input
                        type="text"
                        placeholder="e.g., Senior Software Engineer"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Company</label>
                      <input
                        type="text"
                        placeholder="e.g., Google, Meta, Startup Inc"
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
                      <label className="block text-sm font-medium text-white mb-2">Expertise Areas</label>
                      <input
                        type="text"
                        placeholder="e.g., React, System Design, Career Growth (comma-separated)"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Max Mentees</label>
                      <input
                        type="number"
                        placeholder="5"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Mentoring Focus</label>
                      <textarea
                        placeholder="What specific challenges do you help mentees with? What's your mentoring style?"
                        rows={3}
                        className="warm-input resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="warm-card p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Social Links</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">LinkedIn</label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Twitter</label>
                      <input
                        type="url"
                        placeholder="https://twitter.com/yourhandle"
                        className="warm-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Website/Portfolio</label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
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
                  <button className="btn-ghost px-8">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
      </div>
    </>
  );
}
