"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PainPoint } from "@/types";
import { toast } from "sonner";

export default function CreateEventPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");

  if (session?.user?.role !== "mentor" && session?.user?.role !== "admin") {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Only mentors can host events.</p>
      </div>
    );
  }

  const togglePainPoint = (pt: string) => {
    setSelectedPainPoints(prev => 
      prev.includes(pt) ? prev.filter(p => p !== pt) : [...prev, pt]
    );
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setCustomQuestions([...customQuestions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const removeQuestion = (idx: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== idx));
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
      recurrence: formData.get("recurrence"),
      customQuestions,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (result.success) {
        toast.success("Event has been created", { description: formData.get("title") as string });
        router.push(`/events/${result.event._id}`);
      } else {
        toast.error(result.error || "Failed to create event");
      }
    } catch {
      toast.error("An error occurred");
    }
    
    setIsPending(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-black mb-2 uppercase tracking-tight text-foreground">
        Host an Event
      </h1>
      <p className="text-muted-foreground font-medium mb-8">
        Create a group workshop, Q&A session, or masterclass for mentees.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-card border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] rounded-none dark:border dark:rounded-2xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        
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
          <div>
            <label className="block text-sm font-medium mb-2">Recurrence</label>
            <select 
              name="recurrence" 
              className="warm-input warm-select cursor-pointer"
            >
              <option value="none" className="bg-slate-900">Does not repeat</option>
              <option value="daily" className="bg-slate-900">Daily</option>
              <option value="weekly" className="bg-slate-900">Weekly</option>
              <option value="monthly" className="bg-slate-900">Monthly</option>
            </select>
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

        {/* Custom Questions Builder */}
        <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-4">
          <div className="flex flex-col gap-1 mb-2">
            <h3 className="text-sm font-semibold text-white">Registration Form Questions</h3>
            <p className="text-xs text-white/50">Ask mentees custom questions when they register (e.g. "What date are you available?", "What is your main challenge?").</p>
          </div>
          
          {customQuestions.length > 0 && (
            <div className="space-y-3 mb-4">
              {customQuestions.map((q, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-white/40 font-medium text-xs mt-0.5">{idx + 1}.</span>
                  <span className="flex-1 text-sm text-white/80">{q}</span>
                  <button type="button" onClick={() => removeQuestion(idx)} className="text-white/40 hover:text-red-400">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-3">
            <input 
              type="text" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type a new question..."
              className="flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all"
              style={{ background: "rgba(28,25,23,0.8)", border: "1px solid rgba(255,255,255,0.1)", color: "#fafaf9" }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addQuestion(); } }}
            />
            <button 
              type="button" 
              onClick={addQuestion}
              disabled={!newQuestion.trim()}
              className="px-4 py-2 rounded-xl text-sm font-medium border border-amber-500/20 text-amber-500 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
            >
              Add
            </button>
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
