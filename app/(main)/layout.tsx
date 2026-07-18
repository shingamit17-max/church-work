import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";
import type { UserRole } from "@/types";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Users who haven't selected a role yet should be sent to onboarding
  if (session.user.role === "unassigned" || !session.user.onboardingComplete) {
    // Allow them through only if they're already heading to onboarding
    // (handled by nested route, so just let the dashboard router decide)
  }

  const userRole = session.user.role as 'mentee' | 'mentor' | 'admin';
  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';
  const isProfileIncomplete = !session.user.onboardingComplete;

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar userRole={userRole} userName={userName} userEmail={userEmail} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {isProfileIncomplete && <ProfileCompletionBanner role={session.user.role as UserRole} />}
        <div className="flex-1 overflow-auto pt-24 px-4 pb-6 lg:p-8 lg:pt-8 bg-transparent">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
