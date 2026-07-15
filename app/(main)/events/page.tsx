"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useSession } from "next-auth/react";
import { PainPoint } from "@/types";

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [domainFilter, setDomainFilter] = useState("");
  const [painPointFilter, setPainPointFilter] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (domainFilter) params.append("domain", domainFilter);
      if (painPointFilter) params.append("painPoint", painPointFilter);
      
      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [domainFilter, painPointFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
            Workshops & Events
          </h1>
          <p className="text-white/60 mt-2">Join group sessions hosted by expert mentors.</p>
        </div>
        
        {session?.user?.role === 'mentor' && (
          <NextLink href="/events/create" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-indigo-500/25 shrink-0">
            Host an Event
          </NextLink>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-white/50 mb-1">Filter by Domain</label>
          <input 
            type="text" 
            placeholder="E.g. Engineering, Design..."
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-white/50 mb-1">Filter by Topic</label>
          <select 
            value={painPointFilter}
            onChange={(e) => setPainPointFilter(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
          >
            <option value="">All Topics</option>
            {Object.values(PainPoint).map((pt) => (
              <option key={pt} value={pt}>{pt.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white/50 py-12">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="p-12 border border-white/10 rounded-2xl bg-white/5 text-center text-white/50">
          No upcoming events found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <NextLink href={`/events/${event._id}`} key={event._id} className="block group">
              <div className="h-full p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/10 transition-colors" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    event.isFree ? 'bg-teal-500/20 text-teal-300 border-teal-500/30' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}>
                    {event.isFree ? 'Free' : `$${event.price}`}
                  </span>
                  <div className="text-xs text-white/50 bg-black/40 px-2 py-1 rounded-md border border-white/10">
                    {new Date(event.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 relative z-10">{event.title}</h3>
                
                <div className="text-sm text-white/60 mb-4 line-clamp-2 flex-1 relative z-10">
                  {event.description}
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                  {event.painPointTags.slice(0, 2).map((pt: string) => (
                    <span key={pt} className="text-[10px] px-2 py-1 bg-white/10 rounded-md text-white/70">
                      {pt.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {event.painPointTags.length > 2 && (
                    <span className="text-[10px] px-2 py-1 bg-white/10 rounded-md text-white/50">
                      +{event.painPointTags.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="pt-4 border-t border-white/10 flex justify-between items-center relative z-10 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      {event.hostId?.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-xs text-white/70 truncate max-w-[100px]">{event.hostId?.name}</span>
                  </div>
                  <div className="text-xs text-white/50">
                    {event.capacity - event.registeredCount} spots left
                  </div>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}
