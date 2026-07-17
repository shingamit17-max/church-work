"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterButton({ 
  eventId, 
  isRegistered, 
  isFull,
  customQuestions = []
}: { 
  eventId: string; 
  isRegistered: boolean; 
  isFull: boolean;
  customQuestions?: string[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
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
    if (customQuestions.length > 0 && !showModal) {
      setShowModal(true);
      return;
    }

    setIsPending(true);
    try {
      const customAnswersArray = Object.entries(answers).map(([q, a]) => ({ question: q, answer: a }));
      const res = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customAnswers: customAnswersArray })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Registered successfully!");
        router.refresh();
      } else {
        toast.error(data.error || "Failed to register");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
    setIsPending(false);
  };

  return (
    <>
      <button 
        onClick={handleRegister}
        disabled={isPending}
        className="w-full py-3 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg,#ef4444,#f97316)",
          color: "#0c0a09",
          boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
        }}
      >
        {isPending ? "Registering..." : "Register Now"}
      </button>

      {/* Registration Questions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="p-6 max-w-md w-full rounded-2xl animate-in fade-in zoom-in duration-200" style={{ background: 'rgba(41, 37, 36, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(16px)' }}>
            <h3 className="text-xl font-bold text-white mb-2">Registration Details</h3>
            <p className="text-white/60 mb-6 text-sm">The host requires you to answer a few questions before registering.</p>
            
            <div className="space-y-4 mb-6">
              {customQuestions.map((q, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-white mb-1">{q}</label>
                  <input 
                    type="text" 
                    required
                    value={answers[q] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                    className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50" 
                    placeholder="Your answer..." 
                  />
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-white/80 hover:text-white font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleRegister}
                disabled={isPending || customQuestions.some(q => !answers[q]?.trim())}
                className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium transition-colors disabled:opacity-50"
              >
                {isPending ? 'Registering...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
