"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PainPoint } from "@/types";

export default function SubmitTestimonialPage() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      outcome: formData.get("outcome"),
      whatHelped: formData.get("whatHelped"),
      freeText: formData.get("freeText"),
      painPoints: formData.getAll("painPoints"),
    };
    
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Success story submitted! Thank you.");
        router.push("/testimonials");
      } else {
        alert("Failed to submit");
      }
    } catch {
      alert("An error occurred");
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Share Your Success</h1>
      <p className="text-white/60 mb-8">Inspire others by sharing how mentorship helped you overcome challenges.</p>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
        
        <div>
          <label className="block text-sm font-medium mb-2">What was the final outcome?</label>
          <input 
            name="outcome" 
            required 
            placeholder="e.g. Landed a Senior Product Manager role at Acme Corp"
            className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm"
            style={{ 
              background: "rgba(28,25,23,0.8)", 
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafaf9"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What specifically helped you get there?</label>
          <input 
            name="whatHelped" 
            required 
            placeholder="e.g. Refining my system design interview answers"
            className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm"
            style={{ 
              background: "rgba(28,25,23,0.8)", 
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fafaf9"
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Detailed Story (Optional)</label>
          <textarea 
            name="freeText" 
            rows={4} 
            placeholder="Share the full journey..."
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

        <div>
          <label className="block text-sm font-medium mb-3">Which pain points did you overcome? (Select all that apply)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(PainPoint).map((pt) => (
              <label key={pt} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" name="painPoints" value={pt} className="rounded border-white/20 text-amber-500 focus:ring-amber-500 bg-black/50" />
                <span className="text-sm text-white/80">{pt.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            color: "#0c0a09",
            boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
          }}
        >
          {isPending ? "Submitting..." : "Submit Success Story"}
        </button>
      </form>
    </div>
  );
}
