"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PainPoint } from "@/types";
import { use } from "react";

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
        alert("Feedback submitted successfully!");
        router.push("/dashboard");
      } else {
        alert("Failed to submit feedback");
      }
    } catch {
      alert("An error occurred");
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
        Post-Session Feedback
      </h1>
      <p className="text-white/60 mb-8">
        Your insights help mentees understand their real gaps. This feedback will be visible on their dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">
              Was the pain point you discussed the same as what they flagged at signup?
            </label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-500/10">
                <input type="radio" name="samePainPoint" value="true" required className="sr-only" />
                <span className="font-medium">Yes, it was accurate</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-500/10">
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
                  <input type="checkbox" name="observedPainPoints" value={pt} className="rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-black/50" />
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
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isPending ? "Submitting Feedback..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
