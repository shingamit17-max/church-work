"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface Step {
  targetId?: string;
  title: string;
  content: string;
  position: "top" | "bottom" | "center";
}

const COMMON_STEPS: Step[] = [
  {
    title: "Welcome to Grace Mentor! 🎉",
    content: "Let's take a quick tour to help you get familiar with the mobile experience.",
    position: "center",
  },
  {
    targetId: "mobile-menu-btn",
    title: "Main Navigation",
    content: "Tap this menu anytime to access your Dashboard, Profile, and Settings.",
    position: "bottom",
  },
  {
    targetId: "mobile-bell-btn",
    title: "Real-time Alerts",
    content: "Watch this bell! You'll be notified here instantly of any important updates.",
    position: "bottom",
  },
];

const MENTEE_STEPS: Step[] = [
  ...COMMON_STEPS,
  {
    targetId: "tour-link-find-mentors",
    title: "Find Mentors",
    content: "Browse our directory of experienced professionals and request a mentorship match.",
    position: "bottom",
  },
  {
    targetId: "tour-link-job-board",
    title: "Job Board",
    content: "Discover exclusive job placements and opportunities curated by our mentors.",
    position: "bottom",
  },
  {
    targetId: "tour-link-my-network",
    title: "My Network",
    content: "Manage your active mentorships and view your professional connections.",
    position: "bottom",
  },
  {
    targetId: "tour-link-events",
    title: "Events",
    content: "Join exclusive webinars, workshops, and meetups hosted by our community.",
    position: "bottom",
  },
  {
    targetId: "tour-link-resources",
    title: "Resources",
    content: "Access helpful guides, templates, and materials to boost your career.",
    position: "top",
  },
];

const MENTOR_STEPS: Step[] = [
  ...COMMON_STEPS,
  {
    targetId: "tour-link-events",
    title: "Events",
    content: "Host and manage webinars or workshops to share your knowledge with the community.",
    position: "bottom",
  },
  {
    targetId: "tour-link-job-board",
    title: "Job Board",
    content: "Post job opportunities or recommend mentees to roles in your network.",
    position: "bottom",
  },
  {
    targetId: "tour-link-resources",
    title: "Resources",
    content: "Access helpful guides, templates, and materials to boost your career.",
    position: "top",
  },
];

export function MobileOnboardingTour({ role }: { role: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const storageKey = `has_seen_mobile_tour_${role}`;
  const tourSteps = role === "mentor" ? MENTOR_STEPS : MENTEE_STEPS;

  useEffect(() => {
    // Only run on mobile (width < 1024px, typical lg breakpoint)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const hasSeenTour = localStorage.getItem(storageKey);
      if (!hasSeenTour) {
        // slight delay to let UI render completely
        setTimeout(() => setIsVisible(true), 1000);
      }
    }
  }, [storageKey]);

  const updateTargetRect = () => {
    const step = tourSteps[currentStep];
    if (step.targetId) {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  };

  // Update rect on step change or scroll/resize
  useEffect(() => {
    if (!isVisible) return;
    
    // Open sidebar if step requires a sidebar link
    const step = tourSteps[currentStep];
    if (step.targetId?.startsWith("tour-link-")) {
      window.dispatchEvent(new CustomEvent("set-mobile-menu", { detail: true }));
    } else {
      window.dispatchEvent(new CustomEvent("set-mobile-menu", { detail: false }));
    }

    // Wait a tick for the DOM/Sidebar to render and slide in before grabbing the rect
    const timeout = setTimeout(updateTargetRect, 350); 
    
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, { passive: true });
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [currentStep, isVisible]);

  if (!isVisible) return null;

  const handleFinish = () => {
    localStorage.setItem(storageKey, "true");
    setIsVisible(false);
    window.dispatchEvent(new CustomEvent("set-mobile-menu", { detail: false }));
  };

  const step = tourSteps[currentStep];

  // Calculate Tooltip Position
  let top = "50%";
  let left = "50%";
  let transform = "translate(-50%, -50%)";

  if (step.position === "bottom" && targetRect) {
    top = `${targetRect.bottom + 16}px`;
    left = "50%";
    transform = "translateX(-50%)";
  } else if (step.position === "top" && targetRect) {
    top = `${targetRect.top - 16}px`;
    left = "50%";
    transform = "translate(-50%, -100%)";
  }

  return (
    <>
      {/* Dimmed Overlay */}
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Target Highlight (Cutout illusion) */}
      {targetRect && (
        <div
          className="fixed z-[101] border-4 border-amber-400 rounded-lg pointer-events-none transition-all duration-300 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      )}

      {/* Tooltip Dialog */}
      <div
        className="fixed z-[102] w-[90%] max-w-[320px] bg-card border-4 border-border rounded-xl shadow-[8px_8px_0px_var(--neo-border)] p-6 transition-all duration-300"
        style={{ top, left, transform }}
      >
        <button
          onClick={handleFinish}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-black text-foreground mb-3 pr-6">
          {step.title}
        </h3>
        <p className="text-sm font-medium text-foreground/80 mb-6 leading-relaxed">
          {step.content}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </span>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep((p) => p - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-border bg-muted hover:bg-muted/80 text-foreground shadow-[2px_2px_0px_var(--neo-border)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            
            {currentStep < tourSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep((p) => p + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-border bg-amber-400 hover:bg-amber-500 text-black shadow-[2px_2px_0px_var(--neo-border)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="h-10 px-4 flex items-center justify-center gap-2 rounded-lg border-2 border-border bg-sage-400 hover:bg-sage-500 text-black font-bold shadow-[2px_2px_0px_var(--neo-border)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
              >
                <Check className="w-4 h-4" />
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
