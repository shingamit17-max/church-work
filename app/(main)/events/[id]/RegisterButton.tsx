"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterButton({ 
  eventId, 
  isRegistered, 
  isFull 
}: { 
  eventId: string; 
  isRegistered: boolean; 
  isFull: boolean;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  if (isRegistered) {
    return (
      <button disabled className="w-full py-3 bg-teal-500/20 text-teal-300 rounded-xl font-medium border border-teal-500/30">
        You are registered
      </button>
    );
  }

  if (isFull) {
    return (
      <button disabled className="w-full py-3 bg-white/5 text-white/40 rounded-xl font-medium cursor-not-allowed">
        Seats Full
      </button>
    );
  }

  const handleRegister = async () => {
    setIsPending(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST"
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Registered successfully!");
        router.refresh();
      } else {
        alert(data.error || "Failed to register");
      }
    } catch {
      alert("An error occurred");
    }
    setIsPending(false);
  };

  return (
    <button 
      onClick={handleRegister}
      disabled={isPending}
      className="w-full py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg,#f59e0b,#d97706)",
        color: "#0c0a09",
        boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
      }}
    >
      {isPending ? "Registering..." : "Register Now"}
    </button>
  );
}
