
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import { MenteeProfile } from '@/models/MenteeProfile';
import { User } from '@/models/User';
import { MenteeProfileForm } from '@/components/MenteeProfileForm';

export default async function MenteeProfilePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'mentee') {
    redirect('/login');
  }

  await dbConnect();
  
  // Fetch fresh user data from DB since JWT session name might be stale
  const dbUser = await User.findById(session.user.id).select("name email").lean();
  const userName = dbUser?.name || session.user.name || 'User';
  const userEmail = dbUser?.email || session.user.email || '';

  const menteeProfile = await MenteeProfile.findOne({ userId: session.user.id }).lean();

  // Map the database document to the format expected by the form
  const initialData = {
    name: userName,
    email: userEmail,
    phoneNumber: menteeProfile?.phoneNumber || '',
    bio: menteeProfile?.bio || '',
    currentRole: menteeProfile?.currentRole || '',
    company: menteeProfile?.company || '',
    highestQualification: menteeProfile?.highestQualification || '',
    // Mongoose array conversions to ensure they are plain objects/arrays for React serialization
    targetRoles: Array.isArray(menteeProfile?.targetRoles) ? Array.from(menteeProfile.targetRoles) : [],
    skills: Array.isArray(menteeProfile?.skills) ? menteeProfile.skills.map((s: any) => ({ name: s.name })) : [],
    careerStage: menteeProfile?.careerStage || 'fresher', // default to fresher if not found
  };

  return (
    <>
      <div className="w-full max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your professional information and preferences</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
              {/* Profile Card Sidebar */}
              <div className="w-full xl:w-[320px] shrink-0">
                <div className="warm-card p-6 xl:sticky xl:top-24">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-stone-800 to-stone-900 border border-white/10 flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-foreground text-center mb-1">{userName}</h2>
                  <p className="text-muted-foreground text-center text-sm mb-4">{userEmail}</p>
                  <div className="text-center mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-muted text-foreground text-sm font-bold border-2 border-border shadow-[2px_2px_0px_var(--neo-border)]">
                      🎓 Job Seeker
                    </span>
                  </div>
                  <button className="btn-amber w-full">
                    Edit Profile Picture
                  </button>
                </div>
              </div>

              {/* Profile Information Forms */}
              <MenteeProfileForm initialData={initialData} />
            </div>
      </div>
    </>
  );
}
