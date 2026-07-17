"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { PainPoint } from "@/types";
import type { Event as EventType } from "@/types";

const DOMAINS = ["Engineering", "Design", "Product", "Marketing", "Finance", "Healthcare", "Education", "Legal"];

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<(EventType & { hostId?: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState("");
  const [painPointFilter, setPainPointFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      try {
        const params = new URLSearchParams();
        if (domainFilter) params.append("domain", domainFilter);
        if (painPointFilter) params.append("painPoint", painPointFilter);
        const res = await fetch(`/api/events?${params.toString()}`);
        const data = await res.json();
        if (mounted && data.success) {
          setEvents(data.events);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    };
    
    const t = setTimeout(() => {
      setLoading(true);
      fetchEvents();
    }, 0);

    return () => { 
      mounted = false; 
      clearTimeout(t);
    };
  }, [domainFilter, painPointFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <p className="text-sm mb-1" style={{ color: "#57534e" }}>Community</p>
          <h1 className="text-3xl font-semibold" style={{ letterSpacing: "-0.03em", color: "#fafaf9" }}>
            Workshops & Events
          </h1>
          <p className="text-sm mt-1" style={{ color: "#78716c" }}>
            Join group sessions hosted by expert mentors in your field.
          </p>
        </div>
        {session?.user?.role === "mentor" && (
          <NextLink
            href="/events/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
            style={{
              background: "linear-gradient(135deg,#ef4444,#f97316)",
              color: "#0c0a09",
              boxShadow: "0 4px 16px rgba(245,158,11,0.25)",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
            </svg>
            Host an Event
          </NextLink>
        )}
      </div>

      {/* Filters */}
      <div
        className="p-5 rounded-2xl flex flex-col sm:flex-row gap-4"
        style={{ background: "rgba(41,37,36,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex-1">
          <label className="block text-xs font-medium mb-2" style={{ color: "#57534e" }}>Domain</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDomainFilter("")}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: !domainFilter ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${!domainFilter ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: !domainFilter ? "#fbbf24" : "#78716c",
              }}
            >
              All
            </button>
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomainFilter(domainFilter === d ? "" : d)}
                className="text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: domainFilter === d ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${domainFilter === d ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
                  color: domainFilter === d ? "#fbbf24" : "#57534e",
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:w-56">
          <label className="block text-xs font-medium mb-2" style={{ color: "#57534e" }}>Topic</label>
          <select
            value={painPointFilter}
            onChange={(e) => setPainPointFilter(e.target.value)}
            className="warm-input warm-select cursor-pointer w-auto text-sm"
          >
            <option value="">All Topics</option>
            {Object.values(PainPoint).map((pt) => (
              <option key={pt} value={pt}>{pt.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: "rgba(41,37,36,0.4)" }} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 rounded-2xl text-center" style={{ background: "rgba(41,37,36,0.5)", border: "1px dashed rgba(255,255,255,0.08)" }}>
          <div className="text-5xl mb-4">📅</div>
          <h3 className="font-semibold mb-2" style={{ color: "#fafaf9" }}>No events found</h3>
          <p className="text-sm" style={{ color: "#57534e" }}>Try adjusting your filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <NextLink href={`/events/${event._id}`} key={event._id} className="block group">
              <div
                className="h-full p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden transition-all"
                style={{
                  background: "rgba(41,37,36,0.7)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(245,158,11,0.2)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(41,37,36,0.9)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(41,37,36,0.7)";
                }}
              >
                {/* Ambient */}
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(245,158,11,0.04)", filter: "blur(20px)", transform: "translate(30%,-30%)" }} />

                {/* Top row */}
                <div className="flex justify-between items-start relative z-10">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: event.isFree ? "rgba(74,222,128,0.1)" : "rgba(245,158,11,0.1)",
                      color: event.isFree ? "#4ade80" : "#fbbf24",
                      border: `1px solid ${event.isFree ? "rgba(74,222,128,0.2)" : "rgba(245,158,11,0.2)"}`,
                    }}
                  >
                    {event.isFree ? "Free" : `$${event.price}`}
                  </span>
                  <div className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.06)", color: "#78716c" }} suppressHydrationWarning>
                    {new Date(event.dateTime).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="text-base font-semibold mb-2 line-clamp-2" style={{ color: "#fafaf9" }}>{event.title}</h3>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#78716c" }}>{event.description}</p>
                </div>

                {/* Tags */}
                {event.painPointTags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 relative z-10">
                    {event.painPointTags.slice(0, 2).map((pt: string) => (
                      <span key={pt} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)", color: "#57534e" }}>
                        {pt.replace(/_/g, " ")}
                      </span>
                    ))}
                    {event.painPointTags.length > 2 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.04)", color: "#44403c" }}>
                        +{event.painPointTags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-3 flex justify-between items-center relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", color: "#0c0a09" }}>
                      {event.hostId?.name?.charAt(0) || "?"}
                    </div>
                    <span className="text-xs truncate max-w-[80px]" style={{ color: "#78716c" }}>{event.hostId?.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: event.capacity - event.registeredCount > 5 ? "#4ade80" : "#fb7185" }}>
                    {Math.max(0, event.capacity - event.registeredCount)} spots left
                  </span>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}
