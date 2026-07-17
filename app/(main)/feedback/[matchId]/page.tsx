"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PainPoint } from "@/types";
import BackButton from "@/components/BackButton";

export default function MentorFeedbackPage({ params }: { params: Promise<{ matchId: string }> }) {
  const resolvedParams = use(params);
  const matchId = resolvedParams.matchId;
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      matchId,
      samePainPoint: formData.get("samePainPoint") === "true",
      observedPainPoints: formData.getAll("observedPainPoints"),
      notes: formData.get("notes"),
    };
    
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Feedback submitted successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch {
      toast.error("An error occurred");
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <BackButton fallbackUrl="/dashboard" />
      <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-rose-400">
        Post-Session Feedback
      </h1>
      <p className="text-white/60 mb-8">
        Your insights help mentees understand their real gaps. This feedback will be visible on their dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 p-8 rounded-3xl relative overflow-hidden" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div 
          className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none rounded-full" 
          style={{ 
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            transform: "translate(30%,-30%)"
          }} 
        />
        
        <div className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">
              Was the pain point you discussed the same as what they flagged at signup?
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors has-checked:border-amber-500 has-checked:bg-amber-500/10">
                <input type="radio" name="samePainPoint" value="true" required className="sr-only" />
                <span className="font-medium">Yes, it was accurate</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors has-checked:border-amber-500 has-checked:bg-amber-500/10">
                <input type="radio" name="samePainPoint" value="false" required className="sr-only" />
                <span className="font-medium">No, there was a different real gap</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              What was the *real* gap you observed? (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(PainPoint).map((pt) => (
                <label key={pt} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" name="observedPainPoints" value={pt} className="rounded border-white/20 text-amber-500 focus:ring-amber-500 bg-black/50" />
                  <span className="text-sm text-white/80">{pt.replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Notes for the Mentee</label>
            <textarea 
              name="notes" 
              rows={4} 
              placeholder="E.g. They need to focus more on behavioral impact rather than technical implementation details..."
              className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm resize-none"
              style={{ 
                background: "rgba(28,25,23,0.8)", 
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fafaf9"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              color: "#0c0a09",
              boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
            }}
          >
            {isPending ? "Submitting Feedback..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
