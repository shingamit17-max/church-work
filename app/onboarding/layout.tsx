import React from "react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 p-4 text-warm-50" style={{ background: "#1c1917" }}>
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-rose-400">
            Grace Mentor
          </h1>
          <p className="text-sm mt-1" style={{ color: "#a8a29e" }}>Let&apos;s set up your profile</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
