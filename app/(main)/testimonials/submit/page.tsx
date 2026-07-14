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
    } catch (err) {
      alert("An error occurred");
    }
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Share Your Success</h1>
      <p className="text-white/60 mb-8">Inspire others by sharing how mentorship helped you overcome challenges.</p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
        
        <div>
          <label className="block text-sm font-medium mb-2">What was the final outcome?</label>
          <input 
            name="outcome" 
            required 
            placeholder="e.g. Landed a Senior Product Manager role at Acme Corp"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What specifically helped you get there?</label>
          <input 
            name="whatHelped" 
            required 
            placeholder="e.g. Refining my system design interview answers"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Detailed Story (Optional)</label>
          <textarea 
            name="freeText" 
            rows={4} 
            placeholder="Share the full journey..."
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Which pain points did you overcome? (Select all that apply)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(PainPoint).map((pt) => (
              <label key={pt} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-black/20 cursor-pointer hover:bg-white/5 transition-colors">
                <input type="checkbox" name="painPoints" value={pt} className="rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-black/50" />
                <span className="text-sm text-white/80">{pt.replace(/_/g, ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Success Story"}
        </button>
      </form>
    </div>
  );
}
