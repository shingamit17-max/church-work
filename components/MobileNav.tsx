"use client";

import { useState } from "react";
import NextLink from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

export default function MobileNav({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 md:hidden text-foreground/70 hover:text-foreground"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="relative w-72 max-w-sm bg-card border-r border-border h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-left">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="mb-10 mt-2">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
                Grace Mentor
              </h1>
            </div>
            
            <nav className="flex-1 space-y-2">
              <NextLink onClick={() => setIsOpen(false)} href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                Dashboard
              </NextLink>
              <NextLink onClick={() => setIsOpen(false)} href="/events" className="block px-4 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                Events
              </NextLink>
              <NextLink onClick={() => setIsOpen(false)} href="/testimonials" className="block px-4 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                Success Stories
              </NextLink>
              {session?.user?.role === 'mentor' && (
                <NextLink onClick={() => setIsOpen(false)} href={`/mentors/${session.user.id}`} className="block px-4 py-2 rounded-lg hover:bg-foreground/5 transition-colors">
                  Public Profile
                </NextLink>
              )}
            </nav>

            <div className="mt-auto border-t border-border pt-6">
              <div className="mb-4 px-4">
                  <p className="font-medium text-sm text-foreground">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">{session?.user?.email}</p>
              </div>
              <button 
                onClick={() => setShowSignoutConfirm(true)}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="p-6 max-w-sm w-full rounded-2xl animate-in fade-in zoom-in duration-200 bg-background border border-border shadow-xl">
            <h3 className="text-xl font-bold text-foreground mb-2">Sign Out</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSignoutConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-foreground/5 text-white/80 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
