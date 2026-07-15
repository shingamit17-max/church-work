import React from "react";
import NextLink from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import MobileNav from "@/components/MobileNav";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  // Double check onboarding
  if (!session.user.onboardingComplete) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex-col p-6 hidden md:flex">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
            Grace Mentor
          </h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NextLink href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Dashboard
          </NextLink>
          <NextLink href="/events" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Events
          </NextLink>
          <NextLink href="/testimonials" className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
            Success Stories
          </NextLink>
          {session.user.role === 'mentor' && (
            <NextLink href={`/mentors/${(session.user as { id: string }).id}`} className="block px-4 py-2 rounded-lg hover:bg-white/5 transition-colors">
              Public Profile
            </NextLink>
          )}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="mb-4">
            <p className="font-medium truncate">{session.user.name}</p>
            <p className="text-xs text-white/50 capitalize">{session.user.role}</p>
          </div>
          <form action={async () => {
            "use server";
            await signOut();
          }}>
            <button className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="md:hidden border-b border-white/10 p-4 bg-black/20 backdrop-blur-xl sticky top-0 z-40 flex justify-between items-center">
          <h1 className="font-bold text-lg">Grace Mentor</h1>
          <MobileNav session={session} />
        </header>
        
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
