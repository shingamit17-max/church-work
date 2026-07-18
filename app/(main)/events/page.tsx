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
          <p className="text-sm mb-1 text-muted-foreground font-bold uppercase tracking-wider">Community</p>
          <h1 className="text-4xl font-black text-foreground mb-2">
            Workshops & Events
          </h1>
          <p className="text-muted-foreground font-medium">
            Join group sessions hosted by expert mentors in your field.
          </p>
        </div>
        {(session?.user?.role === "mentor" || session?.user?.role === "admin") && (
          <NextLink
            href="/events/create"
            className="btn-amber shrink-0"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M12 5v14M5 12h14"/>
            </svg>
            Host an Event
          </NextLink>
        )}
      </div>

      {/* Filters */}
      <div className="neobrutal-box p-5 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-black mb-2 text-foreground uppercase tracking-wider">Domain</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setDomainFilter("")}
              className={`text-xs px-3 py-1.5 font-bold transition-all border-2 ${
                !domainFilter 
                  ? "bg-foreground text-background border-neo-border shadow-[2px_2px_0px_var(--neo-border)]" 
                  : "bg-background text-foreground border-neo-border hover:bg-muted"
              }`}
            >
              All
            </button>
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomainFilter(domainFilter === d ? "" : d)}
                className={`text-xs px-3 py-1.5 font-bold transition-all border-2 ${
                  domainFilter === d 
                    ? "bg-foreground text-background border-neo-border shadow-[2px_2px_0px_var(--neo-border)]" 
                    : "bg-background text-foreground border-neo-border hover:bg-muted"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:w-56">
          <label className="block text-xs font-black mb-2 text-foreground uppercase tracking-wider">Topic</label>
          <select
            value={painPointFilter}
            onChange={(e) => setPainPointFilter(e.target.value)}
            className="warm-input cursor-pointer w-full text-sm font-bold bg-background"
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
            <div key={i} className="h-64 neobrutal-box animate-pulse bg-muted" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="p-16 neobrutal-box text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-2xl font-black mb-2 text-foreground">No events found</h3>
          <p className="text-muted-foreground font-medium">Try adjusting your filters or check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <NextLink href={`/events/${event._id}`} key={event._id} className="block group">
              <div className="h-full p-6 neobrutal-box flex flex-col gap-4 relative transition-all group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_var(--neo-border)] bg-background">
                {/* Top row */}
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs px-2.5 py-1 font-bold border-2 border-neo-border ${
                      event.isFree ? "bg-green-400 text-black shadow-[2px_2px_0px_var(--neo-border)]" : "bg-yellow-400 text-black shadow-[2px_2px_0px_var(--neo-border)]"
                    }`}
                  >
                    {event.isFree ? "Free" : `$${event.price}`}
                  </span>
                  <div className="text-xs font-bold text-muted-foreground" suppressHydrationWarning>
                    {new Date(event.dateTime).toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                  </div>
                </div>

                <div className="flex-1 mt-2">
                  <h3 className="text-xl font-black mb-2 line-clamp-2 text-foreground">{event.title}</h3>
                  <p className="text-sm font-medium leading-relaxed line-clamp-2 text-muted-foreground">{event.description}</p>
                </div>

                {/* Tags */}
                {event.painPointTags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {event.painPointTags.slice(0, 2).map((pt: string) => (
                      <span key={pt} className="text-[11px] font-bold px-2 py-0.5 border-2 border-neo-border bg-muted text-foreground">
                        {pt.replace(/_/g, " ")}
                      </span>
                    ))}
                    {event.painPointTags.length > 2 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 border-2 border-neo-border bg-muted text-foreground">
                        +{event.painPointTags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-4 mt-2 flex justify-between items-center border-t-2 border-neo-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center text-xs font-black bg-accent text-background border-2 border-neo-border">
                      {event.hostId?.name?.charAt(0) || "?"}
                    </div>
                    <span className="text-sm font-bold text-foreground truncate max-w-[80px]">{event.hostId?.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 border-2 border-neo-border ${
                    event.capacity - event.registeredCount > 5 ? "bg-green-400 text-black" : "bg-red-400 text-black"
                  }`}>
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
