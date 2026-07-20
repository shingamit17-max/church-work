"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck, Eye, X, Calendar, Star, Users, Briefcase } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, useId } from "react";
import RequestMentorshipButton from "@/app/mentors/[slug]/RequestMentorshipButton";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { getExpandedMentorDetails } from "@/app/actions/mentors";

type UserData = {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  verified?: boolean; 
  churchOrganization?: string;
};

type MentorCardProps = {
  mentor: any;
  userSession: {
    id: string;
    role: string;
    onboardingComplete: boolean;
  } | null;
};

export default function MentorCard({ mentor, userSession }: MentorCardProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  
  const [active, setActive] = useState(false);
  const [details, setDetails] = useState<{ testimonials: any[], upcomingEvents: any[] } | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);
  const layoutId = `mentor-${mentor._id}`;

  const user = mentor.userId as UserData | null;
  const name = user?.name || "Grace Mentor";
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const isVerified = user?.verified === true; 
  
  const slotsLeft = (mentor.maxMentees || 0) - (mentor.currentMenteeCount || 0);
  const isAvailable = slotsLeft > 0;
  
  const painPoints = mentor.painPointsCanHelp || [];
  const displayPainPoints = painPoints.slice(0, 3);
  const hiddenCount = painPoints.length - 3;
  
  const helpTypes = mentor.helpTypes || [];
  const menteeSeniority = mentor.menteeSeniority || [];
  
  const menteesHelped = mentor.impactStats?.menteesHelped || 0;
  const testimonialsCount = mentor.impactStats?.testimonialsReceived || 0;
  const workshopsHosted = mentor.impactStats?.workshopsHosted || 0;

  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      if (!details && !loadingDetails) {
        setLoadingDetails(true);
        getExpandedMentorDetails(user?._id || mentor.userId).then(res => {
          if (res.success) {
            setDetails({ testimonials: res.testimonials, upcomingEvents: res.upcomingEvents });
          }
          setLoadingDetails(false);
        });
      }
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [active, details, loadingDetails, user, mentor.userId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }
    if (active) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  const navigateToProfile = () => {
    router.push(`/mentors/${mentor.shareSlug}`);
  };

  const transition = shouldReduceMotion ? { duration: 0.15 } : { type: "spring" as const, stiffness: 300, damping: 30 };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] h-full w-full"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              layout
              layoutId={shouldReduceMotion ? undefined : layoutId}
              transition={transition}
              ref={ref}
              className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col pointer-events-auto"
              style={{ maxHeight: '90vh' }}
            >
              {/* Expanded Header */}
              <div className="p-6 border-b border-border bg-muted/30 shrink-0 flex justify-between items-start sticky top-0 z-10 backdrop-blur-md">
                <div className="flex gap-4">
                  <motion.div layout layoutId={shouldReduceMotion ? undefined : `avatar-${layoutId}`} transition={transition} className="shrink-0">
                    {user?.image ? (
                      <img src={user.image} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-border shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-neutral-800 to-neutral-900 text-white border border-white/10 shadow-inner">
                        {initials}
                      </div>
                    )}
                  </motion.div>
                  
                  <div>
                    <motion.h2 layout layoutId={shouldReduceMotion ? undefined : `name-${layoutId}`} transition={transition} className="font-bold text-xl text-foreground flex items-center gap-1.5">
                      {name}
                      {isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />}
                    </motion.h2>
                    <motion.p layout layoutId={shouldReduceMotion ? undefined : `role-${layoutId}`} transition={transition} className="text-sm font-medium text-foreground/70 mt-1">
                      {mentor.currentRole}{mentor.company ? ` at ${mentor.company}` : ""}
                    </motion.p>
                    <div className="mt-3">
                      <AvailabilityPill isAvailable={isAvailable} slotsLeft={slotsLeft} />
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setActive(false)}
                  className="w-8 h-8 rounded-full bg-muted/80 flex items-center justify-center text-foreground hover:bg-muted transition-colors border border-border shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                {/* Bio */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">About</h3>
                  {mentor.bio ? (
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{mentor.bio}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">This mentor hasn't written a bio yet.</p>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {painPoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" /> Pain Points
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {painPoints.map((pt: string) => (
                            <span key={pt} className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize border border-border/50">
                              {pt.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {helpTypes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-amber-500" /> Help Types
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {helpTypes.map((ht: string) => (
                            <span key={ht} className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize border border-border/50">
                              {ht.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {menteeSeniority.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4 text-amber-500" /> Works With
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {menteeSeniority.map((level: string) => (
                            <span key={level} className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize border border-border/50">
                              {level.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {mentor.availability && (
                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-500" /> Availability
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>• {mentor.availability.hoursPerMonth} hours / month</p>
                          <p className="capitalize">• {mentor.availability.preferredMode.replace(/_/g, " ")} mode</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/40 border border-border mb-8 overflow-x-auto">
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-black text-foreground">{menteesHelped}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Mentees</p>
                  </div>
                  <div className="w-px h-8 bg-border shrink-0" />
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-black text-foreground">{workshopsHosted}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Workshops</p>
                  </div>
                  <div className="w-px h-8 bg-border shrink-0" />
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-black text-foreground">{testimonialsCount}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Reviews</p>
                  </div>
                </div>

                {/* Testimonials */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Testimonials</h3>
                  {loadingDetails ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-20 bg-muted/50 rounded-xl" />
                      <div className="h-20 bg-muted/50 rounded-xl" />
                    </div>
                  ) : details?.testimonials && details.testimonials.length > 0 ? (
                    <div className="space-y-4">
                      {details.testimonials.map((testim, i) => (
                        <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border text-sm">
                          <p className="italic text-foreground/80 mb-3">"{testim.freeText}"</p>
                          <div className="flex items-center gap-2">
                            {testim.authorId?.image ? (
                              <img src={testim.authorId.image} className="w-5 h-5 rounded-full" alt="" />
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold">
                                {testim.authorId?.name?.[0] || "?"}
                              </div>
                            )}
                            <span className="text-xs font-semibold text-muted-foreground">{testim.authorId?.name || "Anonymous"}</span>
                            {testim.authorId?.currentRole && (
                              <span className="text-[10px] text-muted-foreground/70">{testim.authorId.currentRole}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/20 border border-border border-dashed text-center">
                      <p className="text-sm text-muted-foreground italic">No testimonials yet.</p>
                    </div>
                  )}
                </div>

                {/* Upcoming Events */}
                {details?.upcomingEvents && details.upcomingEvents.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Upcoming Events</h3>
                    <div className="space-y-3">
                      {details.upcomingEvents.map((evt, i) => (
                        <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold">{evt.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(evt.startTime).toLocaleDateString()} • {evt.eventType}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-6 border-t border-border bg-background shrink-0 flex gap-3">
                <RequestMentorshipButton 
                  mentorId={user?._id || mentor.userId} 
                  isAvailable={isAvailable} 
                  userSession={userSession}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:opacity-50 text-background bg-foreground hover:bg-foreground/90 shadow-sm"
                />
                <button 
                  onClick={navigateToProfile}
                  className="px-6 py-3 rounded-xl border border-border text-foreground hover:bg-muted font-bold text-sm transition-colors shrink-0"
                >
                  Full Profile
                </button>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Grid View Collapsed Card */}
      <motion.div 
        layout
        layoutId={shouldReduceMotion ? undefined : layoutId}
        transition={transition}
        onClick={() => setActive(true)}
        className="group flex flex-col bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-border/80 transition-all overflow-hidden h-full min-h-[160px] cursor-pointer"
      >
        <div className="flex flex-col h-full w-full pointer-events-none">
          {/* Header Row */}
          <div className="p-5 pb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <motion.div layout layoutId={shouldReduceMotion ? undefined : `avatar-${layoutId}`} transition={transition} className="shrink-0">
                {user?.image ? (
                  <img src={user.image} alt={name} className="w-12 h-12 rounded-full object-cover border border-border" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-neutral-800 to-neutral-900 text-white border border-white/10 shadow-inner">
                    {initials}
                  </div>
                )}
              </motion.div>
              <div className="min-w-0">
                <motion.h3 layout layoutId={shouldReduceMotion ? undefined : `name-${layoutId}`} transition={transition} className="font-bold text-base text-foreground truncate flex items-center gap-1.5">
                  <span className="truncate">{name}</span>
                  {isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 shrink-0" />}
                </motion.h3>
                {(mentor.currentRole || mentor.company) && (
                  <motion.p layout layoutId={shouldReduceMotion ? undefined : `role-${layoutId}`} transition={transition} className="text-xs font-medium text-foreground/70 truncate mt-0.5">
                    {mentor.currentRole}{mentor.company ? ` at ${mentor.company}` : ""}
                  </motion.p>
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
            
            <div className="overflow-hidden">
              {/* Bio */}
              {mentor.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                  {mentor.bio}
                </p>
              )}
              
              {/* Pain Point Tags */}
              {painPoints.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
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
                </div>
              )}

              {/* Stats Footer */}
              {(menteesHelped > 0 || testimonialsCount > 0) && (
                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground mb-4 pt-4 border-t border-border/50">
                  {menteesHelped > 0 && <span>{menteesHelped} mentees helped</span>}
                  {testimonialsCount > 0 && <span>{testimonialsCount} testimonials</span>}
                </div>
              )}
            </div>

            <div className="mt-auto" />
          </div>

          {/* Footer Buttons */}
          <div className="p-3 pt-0 flex gap-2 pointer-events-auto">
            <RequestMentorshipButton 
              mentorId={user?._id || mentor.userId} 
              isAvailable={isAvailable} 
              userSession={userSession}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 text-background bg-foreground hover:bg-foreground/90 shadow-sm"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}

function AvailabilityPill({ isAvailable, slotsLeft }: { isAvailable: boolean, slotsLeft: number }) {
  if (isAvailable) {
    return (
      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
        {slotsLeft} slot{slotsLeft !== 1 ? "s" : ""} open
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-800/70 dark:text-red-400 border border-red-100 dark:border-red-900/50">
      Full
    </span>
  );
}
