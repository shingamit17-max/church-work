import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ProfileCompletionBanner } from "@/components/ProfileCompletionBanner";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const userRole = session.user.role === 'mentor' ? 'mentor' : 'mentee';
  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';
  const isProfileIncomplete = !session.user.onboardingComplete;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <DashboardSidebar userRole={userRole} userName={userName} userEmail={userEmail} />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {isProfileIncomplete && <ProfileCompletionBanner role={session.user.role as any} />}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
