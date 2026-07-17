import React from "react";
import Image from "next/image";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 p-4 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex flex-col items-center">
          <Image src="/logo.png" alt="Grace Mentor" width={48} height={48} className="h-12 w-auto object-contain mb-2 drop-shadow-md" />
          <p className="text-sm mt-1 text-muted-foreground">Let&apos;s set up your profile</p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
