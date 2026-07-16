"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PainPoint } from "@/types";

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);

  if (session?.user?.role !== "mentor") {
    return (
      <div className="text-center py-20">
        <p className="text-white/60">Only mentors can host events.</p>
      </div>
    );
  }

  const togglePainPoint = (pt: string) => {
    setSelectedPainPoints(prev => 
      prev.includes(pt) ? prev.filter(p => p !== pt) : [...prev, pt]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      domain: formData.get("domain"),
      capacity: formData.get("capacity"),
      dateTime: formData.get("dateTime"),
      isFree,
      price: isFree ? 0 : Number(formData.get("price")),
      painPointTags: selectedPainPoints,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (result.success) {
        router.push(`/events/${result.event._id}`);
      } else {
        alert(result.error || "Failed to create event");
      }
    } catch {
      alert("An error occurred");
    }
    
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-rose-400">
        Host an Event
      </h1>
      <p className="text-white/60 mb-8">
        Create a group workshop, Q&A session, or masterclass for mentees.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-3xl" style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
        
        <div>
          <label className="block text-sm font-medium mb-2">Event Title</label>
          <input 
            name="title" 
            type="text" 
            required 
            placeholder="E.g. System Design Masterclass"
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
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea 
            name="description" 
            required 
            rows={4}
            placeholder="What will attendees learn?"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Domain</label>
            <input 
              name="domain" 
              type="text" 
              required 
              placeholder="E.g. Software Engineering"
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
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <input 
              name="dateTime" 
              type="datetime-local" 
              required 
              className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all text-sm scheme-dark"
              style={{ 
                background: "rgba(28,25,23,0.8)", 
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fafaf9"
              }}
              onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Capacity (Attendees)</label>
            <input 
              name="capacity" 
              type="number" 
              required 
              min={1}
              max={100}
              defaultValue={10}
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
            <label className="block text-sm font-medium mb-2">Pricing</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-black/20 cursor-pointer has-checked:border-amber-500 has-checked:bg-amber-500/10 transition-colors">
                <input type="radio" checked={isFree} onChange={() => setIsFree(true)} className="sr-only" />
                <span className="text-sm font-medium">Free</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-black/20 cursor-pointer has-checked:border-amber-500 has-checked:bg-amber-500/10 transition-colors">
                <input type="radio" checked={!isFree} onChange={() => setIsFree(false)} className="sr-only" />
                <span className="text-sm font-medium">Paid</span>
              </label>
            </div>
            {!isFree && (
              <div className="mt-3 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">$</span>
                <input 
                  name="price" 
                  type="number" 
                  min={1}
                  required={!isFree}
                  placeholder="0.00"
                  className="w-full rounded-xl pl-8 pr-4 py-3 focus:outline-none transition-all text-sm"
                  style={{ 
                    background: "rgba(28,25,23,0.8)", 
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fafaf9"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "rgba(245,158,11,0.5)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Pain Point Tags</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(PainPoint).map((pt) => {
              const isSelected = selectedPainPoints.includes(pt);
              return (
                <button
                  key={pt}
                  type="button"
                  onClick={() => togglePainPoint(pt)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                    isSelected 
                      ? 'bg-amber-600/30 border-amber-500 text-amber-200' 
                      : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5'
                  }`}
                >
                  {pt.replace(/_/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 mt-8 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#f59e0b,#d97706)",
            color: "#0c0a09",
            boxShadow: "0 4px 16px rgba(245,158,11,0.25)"
          }}
        >
          {isPending ? "Creating Event..." : "Publish Event"}
        </button>
      </form>
    </div>
  );
}
