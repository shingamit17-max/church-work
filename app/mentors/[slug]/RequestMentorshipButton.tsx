"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

type RequestMentorshipButtonProps = {
  mentorId: string;
  isAvailable: boolean;
  userSession: {
    id: string;
    role: string;
    onboardingComplete: boolean;
  } | null;
  className?: string;
}

export default function RequestMentorshipButton({ mentorId, isAvailable, userSession, className }: RequestMentorshipButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleRequest = async () => {
    if (!userSession) {
      // Not logged in -> redirect to register with callback
      router.push(`/register?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (userSession.role === "mentor") {
      toast.error("Mentors cannot request mentorship from other mentors.");
      return;
    }

    if (!userSession.onboardingComplete) {
      router.push("/onboarding");
      return;
    }

    setIsPending(true);
    try {
      const res = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentorId })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("Mentorship request sent successfully!");
        router.push("/dashboard");
      } else {
        toast.error(data.error || "Failed to send request");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
    setIsPending(false);
  };

  if (!isAvailable) {
    return (
      <button 
        disabled
        className={className || "w-full py-3 px-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-medium cursor-not-allowed"}
      >
        Currently full
      </button>
    );
  }

  if (userSession?.role === "mentor") {
    return (
      <button 
        disabled
        className={className || "w-full py-3 px-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-medium cursor-not-allowed"}
        title="Mentors cannot request mentors"
      >
        Mentors Cannot Request
      </button>
    );
  }

  if (userSession && !userSession.onboardingComplete) {
    return (
      <button 
        disabled
        className={className || "w-full py-3 px-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-medium cursor-not-allowed"}
        title="Complete your profile to request mentorship"
      >
        Profile Incomplete
      </button>
    );
  }

  return (
    <button 
      onClick={(e) => { e.stopPropagation(); handleRequest(); }}
      disabled={isPending}
      className={className || "w-full py-3 px-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center text-black bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_4px_16px_rgba(245,158,11,0.25)]"}
    >
      {isPending ? "Sending Request..." : "Request mentorship"}
    </button>
  );
}
