"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type RequestMentorshipButtonProps = {
  mentorId: string;
  isAvailable: boolean;
  userSession: {
    id: string;
    role: string;
    onboardingComplete: boolean;
  } | null;
}

export default function RequestMentorshipButton({ mentorId, isAvailable, userSession }: RequestMentorshipButtonProps) {
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
      alert("Mentors cannot request mentorship from other mentors.");
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
        alert("Mentorship request sent successfully!");
        router.push("/dashboard");
      } else {
        alert(data.error || "Failed to send request");
      }
    } catch (e) {
      alert("An error occurred");
    }
    setIsPending(false);
  };

  if (!isAvailable) {
    return (
      <button 
        disabled
        className="w-full py-3 px-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-medium cursor-not-allowed"
      >
        Currently Unavailable
      </button>
    );
  }

  if (userSession?.role === "mentor") {
    return (
      <button 
        disabled
        className="w-full py-3 px-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-medium cursor-not-allowed"
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
        className="w-full py-3 px-4 bg-white/5 border border-white/10 text-white/50 rounded-xl font-medium cursor-not-allowed"
        title="Complete your profile to request mentorship"
      >
        Profile Incomplete
      </button>
    );
  }

  return (
    <button 
      onClick={handleRequest}
      disabled={isPending}
      className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
    >
      {isPending ? "Sending Request..." : "Request Mentorship"}
    </button>
  );
}
