import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Double check onboarding
  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  const userRole = session.user.role === 'mentor' ? 'mentor' : 'mentee';
  const userName = session.user.name || 'User';
  const userEmail = session.user.email || '';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <DashboardSidebar userRole={userRole} userName={userName} userEmail={userEmail} />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
