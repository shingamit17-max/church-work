"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";

type Testimonial = {
  _id: string;
  outcome: string;
  whatHelped: string;
  freeText?: string;
  painPoints: string[];
  authorId?: { name: string; role: string };
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => {
        if (data.success) setTestimonials(data.testimonials);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFlag = async (id: string) => {
    if (!confirm("Are you sure you want to flag this testimonial for review?")) return;
    
    try {
      const res = await fetch(`/api/testimonials/${id}/flag`, { method: "PATCH" });
      if (res.ok) {
        setTestimonials(prev => prev.filter(t => t._id !== id));
      }
    } catch {
      alert("Failed to flag");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">
          Success Stories
        </h1>
        <NextLink href="/testimonials/submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors font-medium shadow-lg shadow-indigo-500/25">
          Submit a Story
        </NextLink>
      </div>

      {loading ? (
        <div className="text-center text-white/50">Loading testimonials...</div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 border border-white/10 rounded-2xl bg-white/5 text-center text-white/50">
          No success stories shared yet. Be the first!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10">
                <p className="text-lg text-white/90 italic mb-6">&quot;{t.outcome}&quot;</p>
                <div className="text-sm text-white/70 mb-6">
                  <span className="font-semibold text-white/90">What helped:</span> {t.whatHelped}
                </div>
                
                {t.freeText && (
                  <p className="text-sm text-white/60 mb-6 line-clamp-3">{t.freeText}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {t.painPoints?.map((pt: string) => (
                    <span key={pt} className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70">
                      {pt.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <div className="font-medium">{t.authorId?.name || "Anonymous"}</div>
                    <div className="text-xs text-white/50 capitalize">{t.authorId?.role || "Mentee"}</div>
                  </div>
                  
                  <button 
                    onClick={() => handleFlag(t._id)}
                    className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                  >
                    Flag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
