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
      <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
        Host an Event
      </h1>
      <p className="text-white/60 mb-8">
        Create a group workshop, Q&A session, or masterclass for mentees.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
        
        <div>
          <label className="block text-sm font-medium mb-2">Event Title</label>
          <input 
            name="title" 
            type="text" 
            required 
            placeholder="E.g. System Design Masterclass"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea 
            name="description" 
            required 
            rows={4}
            placeholder="What will attendees learn?"
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date & Time</label>
            <input 
              name="dateTime" 
              type="datetime-local" 
              required 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white scheme-dark"
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
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pricing</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-black/20 cursor-pointer has-checked:border-indigo-500 has-checked:bg-indigo-500/10 transition-colors">
                <input type="radio" checked={isFree} onChange={() => setIsFree(true)} className="sr-only" />
                <span className="text-sm font-medium">Free</span>
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 bg-black/20 cursor-pointer has-checked:border-indigo-500 has-checked:bg-indigo-500/10 transition-colors">
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
                  className="w-full bg-black/20 border border-white/10 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200' 
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
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50 mt-8"
        >
          {isPending ? "Creating Event..." : "Publish Event"}
        </button>
      </form>
    </div>
  );
}
