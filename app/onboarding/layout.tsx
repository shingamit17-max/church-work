import React from "react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 p-4 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
            Grace Mentor
          </h1>
          <p className="text-white/50 text-sm mt-1">Let's set up your profile</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
