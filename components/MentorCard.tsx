"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck, Eye } from "lucide-react";
import { motion, type Transition } from "framer-motion";
import RequestMentorshipButton from "@/app/mentors/[slug]/RequestMentorshipButton";
import { MentorProfile } from "@/types";

type UserData = {
  _id?: string;
  name?: string;
  email?: string;
  image?: string; // in case they have an avatar
  // verified is not in schema currently, but we handle it if added
  verified?: boolean; 
  churchOrganization?: string;
};

type MentorCardProps = {
  mentor: any; // We'll pass the hydrated mongoose document
  userSession: {
    id: string;
    role: string;
    onboardingComplete: boolean;
  } | null;
};

export default function MentorCard({ mentor, userSession }: MentorCardProps) {
  const router = useRouter();
  
  // Extract user info
  const user = mentor.userId as UserData | null;
  const name = user?.name || "Grace Mentor";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const isVerified = user?.verified === true; 
  
  // Availability calculation
  const slotsLeft = (mentor.maxMentees || 0) - (mentor.currentMenteeCount || 0);
  const isAvailable = slotsLeft > 0;
  
  // Bio truncation (line-clamp-2 is used via Tailwind)
  
  // Pain point tags processing
  const painPoints = mentor.painPointsCanHelp || [];
  const displayPainPoints = painPoints.slice(0, 3);
  const hiddenCount = painPoints.length - 3;
  
  // Stats
  const menteesHelped = mentor.impactStats?.menteesHelped || 0;
  const testimonials = mentor.impactStats?.testimonialsReceived || 0;

  const navigateToProfile = () => {
    router.push(`/mentors/${mentor.shareSlug}`);
  };

  const transition: Transition = { type: "spring", stiffness: 300, damping: 30 };

  return (
    <motion.div 
      initial="collapsed"
      whileHover="expanded"
      className="group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden h-full min-h-[160px]"
    >
      <motion.div layout="position" transition={transition} className="flex flex-col h-full w-full">
        {/* Header Row */}
        <div className="p-5 pb-3 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {user?.image ? (
            <img src={user.image} alt={name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-border" />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white border border-white/10 shadow-inner">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-base text-foreground truncate flex items-center gap-1.5">
              <span className="truncate">{name}</span>
              {isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
            </h3>
            {(mentor.currentRole || mentor.company) && (
              <p className="text-xs font-medium text-foreground/70 truncate mt-0.5">
                {mentor.currentRole}{mentor.company ? ` at ${mentor.company}` : ""}
              </p>
            )}
            {/* Availability Pill - Mobile only */}
            <div className="sm:hidden mt-2">
              <AvailabilityPill isAvailable={isAvailable} slotsLeft={slotsLeft} />
            </div>
          </div>
        </div>
        {/* Availability Pill - Desktop */}
        <div className="hidden sm:block shrink-0">
          <AvailabilityPill isAvailable={isAvailable} slotsLeft={slotsLeft} />
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex flex-col flex-1">
        <div className="mb-3 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-medium">
            {mentor.domain && (
              <span className="flex items-center gap-1">
                <span className="text-amber-500/70 text-[10px]">❖</span> {mentor.domain}
              </span>
            )}
            {typeof mentor.yearsExp === 'number' && (
              <span className="flex items-center gap-1">
                <span className="text-amber-500/70 text-[10px]">✦</span> {mentor.yearsExp} yrs exp
              </span>
            )}
            {user?.churchOrganization && (
              <span className="flex items-center gap-1">
                <span className="text-amber-500/70 text-[10px]">⌂</span> {user.churchOrganization}
              </span>
            )}
          </div>
        </div>
        
        <motion.div
          variants={{
            collapsed: { height: 0, opacity: 0 },
            expanded: { height: "auto", opacity: 1 }
          }}
          transition={{ staggerChildren: 0.1, ...transition }}
          className="overflow-hidden"
        >
          {/* Bio */}
          {mentor.bio && (
            <motion.p 
              variants={{ collapsed: { opacity: 0, y: 10 }, expanded: { opacity: 1, y: 0 } }}
              transition={transition}
              className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4"
            >
              {mentor.bio}
            </motion.p>
          )}
          
          {/* Pain Point Tags */}
          {painPoints.length > 0 && (
            <motion.div 
              variants={{ collapsed: { opacity: 0, y: 10 }, expanded: { opacity: 1, y: 0 } }}
              transition={transition}
              className="flex flex-wrap gap-1.5 mb-4"
            >
              {displayPainPoints.map((pt: string) => (
                <span key={pt} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                  {pt.replace(/_/g, " ")}
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  +{hiddenCount} more
                </span>
              )}
            </motion.div>
          )}

          {/* Stats Footer (Optional) */}
          {(menteesHelped > 0 || testimonials > 0) && (
            <motion.div 
              variants={{ collapsed: { opacity: 0, y: 10 }, expanded: { opacity: 1, y: 0 } }}
              transition={transition}
              className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground mb-4 pt-4 border-t border-border/50"
            >
              {menteesHelped > 0 && <span>{menteesHelped} mentees helped</span>}
              {testimonials > 0 && <span>{testimonials} testimonials</span>}
            </motion.div>
          )}
        </motion.div>

        <div className="mt-auto" />
      </div>

      {/* Footer Buttons */}
      <div className="p-3 pt-0 flex gap-2">
        <RequestMentorshipButton 
          mentorId={mentor.userId._id || mentor.userId} 
          isAvailable={isAvailable} 
          userSession={userSession}
          className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 text-background bg-foreground hover:bg-foreground/90 shadow-sm"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); navigateToProfile(); }}
          className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 flex items-center justify-center"
          title="Preview profile"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
      </motion.div>
    </motion.div>
  );
}

function AvailabilityPill({ isAvailable, slotsLeft }: { isAvailable: boolean, slotsLeft: number }) {
  if (isAvailable) {
    return (
      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} open
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-800/70 border border-red-100">
      Full
    </span>
  );
}
