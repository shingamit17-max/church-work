"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/hooks/useDraft";
import { submitMentorProfile } from "@/app/actions/onboarding";
import { CareerStage, PainPoint, MentorProfile } from "@/types";

const initialMentorData = {
  company: "",
  currentRole: "",
  yearsExp: 0,
  domain: "",
  specialization: "",
  helpTypes: [] as MentorProfile["helpTypes"],
  painPointsCanHelp: [] as PainPoint[],
  menteeSeniority: [] as CareerStage[],
  availability: {
    hoursPerMonth: 5,
    preferredMode: "async" as "async" | "calls" | "workshops",
  },
  maxMentees: 2,
  bio: "",
  shareSlug: "",
};

const TOTAL_STEPS = 7;

const STEP_META = [
  { title: "Professional Background", icon: "🏢", hint: "Tell us about your current role" },
  { title: "Domain & Specialization", icon: "🎯", hint: "What's your area of expertise?" },
  { title: "How You Can Help",        icon: "🤝", hint: "What formats of mentorship do you offer?" },
  { title: "Pain Points",             icon: "🩹", hint: "What specific challenges can you help mentees with?" },
  { title: "Target Mentees",          icon: "🎓", hint: "Who are you best equipped to help?" },
  { title: "Availability",            icon: "🕐", hint: "How much time can you commit?" },
  { title: "Final Touches",           icon: "✨", hint: "Your bio and public profile link" },
];

// ── Style helpers ────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: "100%",
  background: "rgba(12,10,9,0.6)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "0.625rem",
  padding: "0.75rem 1rem",
  color: "#fafaf9",
  fontSize: "0.9375rem",
  outline: "none",
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "#a8a29e",
  marginBottom: "0.5rem",
};

export default function MentorOnboarding() {
  const { data, setDraftData, clearDraft, isLoaded } = useDraft("mentor_onboarding", initialMentorData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const nextStep = () => setStep((p) => Math.min(TOTAL_STEPS, p + 1));
  const prevStep = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitMentorProfile(data);
      if (res.success) {
        clearDraft();
        router.push("/dashboard");
      } else {
        alert(res.error || "Failed to submit profile");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    }
    setIsSubmitting(false);
  };

  const toggleArrayItem = (key: keyof typeof data, value: string) => {
    const arr = data[key] as string[];
    if (arr.includes(value)) {
      setDraftData({ [key]: arr.filter(item => item !== value) });
    } else {
      setDraftData({ [key]: [...arr, value] });
    }
  };

  const meta = STEP_META[step - 1];
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#1c1917", color: "#fafaf9" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: "absolute", width: 500, height: 500, top: "30%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: "linear-gradient(135deg,#4ade80,#16a34a)", boxShadow: "0 4px 12px rgba(74,222,128,0.3)", color: "#0c0a09" }}>✦</div>
            <span className="font-semibold text-sm" style={{ letterSpacing: "-0.02em" }}>Grace Mentor</span>
          </div>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "rgba(41,37,36,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium" style={{ color: "#4ade80" }}>
                Step {step} of {TOTAL_STEPS}
              </span>
              <span className="text-xs" style={{ color: "#44403c" }}>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#4ade80,#22c55e)" }}
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-1 mt-2.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: i + 1 <= step ? "#4ade80" : "rgba(255,255,255,0.06)" }}
                />
              ))}
            </div>
          </div>

          {/* Step header */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              {meta.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ letterSpacing: "-0.02em" }}>{meta.title}</h2>
              <p className="text-xs" style={{ color: "#78716c" }}>{meta.hint}</p>
            </div>
          </div>

          {/* Step content */}
          <div className="space-y-4 min-h-[200px]">
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label style={LABEL}>Current Company</label>
                  <input type="text" value={data.company} onChange={(e) => setDraftData({ company: e.target.value })} style={INPUT} placeholder="e.g. Acme Corp" />
                </div>
                <div>
                  <label style={LABEL}>Current Role</label>
                  <input type="text" value={data.currentRole} onChange={(e) => setDraftData({ currentRole: e.target.value })} style={INPUT} placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div>
                  <label style={LABEL}>Years of Experience</label>
                  <input type="number" min="0" value={data.yearsExp} onChange={(e) => setDraftData({ yearsExp: parseInt(e.target.value) || 0 })} style={INPUT} placeholder="e.g. 5" />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label style={LABEL}>Industry / Domain</label>
                  <input type="text" value={data.domain} onChange={(e) => setDraftData({ domain: e.target.value })} style={INPUT} placeholder="e.g. Fintech, Healthcare, Web3" />
                </div>
                <div>
                  <label style={LABEL}>Specialization</label>
                  <input type="text" value={data.specialization} onChange={(e) => setDraftData({ specialization: e.target.value })} style={INPUT} placeholder="e.g. System Design, Product Strategy" />
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: '1:1', label: '1:1 Mentorship Calls' },
                    { id: 'resume', label: 'Resume Review' },
                    { id: 'mock', label: 'Mock Interviews' },
                    { id: 'resource', label: 'Resource Sharing' },
                    { id: 'workshop', label: 'Hosting Workshops' },
                    { id: 'guidance', label: 'Career Guidance' },
                  ] as { id: MentorProfile["helpTypes"][number]; label: string }[]
                ).map((ht) => {
                  const selected = data.helpTypes.includes(ht.id);
                  return (
                    <label key={ht.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: selected ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <input type="checkbox" checked={selected} onChange={() => toggleArrayItem("helpTypes", ht.id as MentorProfile["helpTypes"][number])} className="sr-only" />
                      <span className="text-sm font-medium" style={{ color: selected ? "#4ade80" : "#a8a29e" }}>{ht.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PainPoint).map(([k, v]) => {
                  const selected = data.painPointsCanHelp.includes(v);
                  return (
                    <label key={k} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: selected ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <input type="checkbox" checked={selected} onChange={() => toggleArrayItem("painPointsCanHelp", v)} className="sr-only" />
                      <span className="text-xs font-medium capitalize" style={{ color: selected ? "#4ade80" : "#a8a29e" }}>{v.replace(/_/g, " ")}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-2">
                {Object.entries(CareerStage).map(([k, v]) => {
                  const selected = data.menteeSeniority.includes(v);
                  return (
                    <label key={k} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: selected ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <input type="checkbox" checked={selected} onChange={() => toggleArrayItem("menteeSeniority", v)} className="sr-only" />
                      <span className="text-sm font-medium capitalize" style={{ color: selected ? "#4ade80" : "#d6d3d1" }}>{v.replace(/_/g, " ")}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Step 6 */}
            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <label style={LABEL}>Hours per month</label>
                  <input type="number" min="1" value={data.availability.hoursPerMonth} onChange={(e) => setDraftData({ availability: { ...data.availability, hoursPerMonth: parseInt(e.target.value) || 1 } })} style={INPUT} />
                </div>
                <div>
                  <label style={LABEL}>Maximum concurrent mentees</label>
                  <input type="number" min="1" value={data.maxMentees} onChange={(e) => setDraftData({ maxMentees: parseInt(e.target.value) || 1 })} style={INPUT} title="To prevent burnout" />
                </div>
                <div>
                  <label style={LABEL}>Preferred Mode</label>
                  <select
                    value={data.availability.preferredMode}
                    onChange={(e) => setDraftData({ availability: { ...data.availability, preferredMode: e.target.value as "async" | "calls" | "workshops" } })}
                    style={{ ...INPUT, appearance: "none" }}
                  >
                    <option value="async">Async Chat / Resources</option>
                    <option value="calls">1:1 Video Calls</option>
                    <option value="workshops">Workshops / Group Sessions</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 7 */}
            {step === 7 && (
              <div className="space-y-4">
                <div>
                  <label style={LABEL}>Short Bio</label>
                  <textarea
                    rows={3}
                    value={data.bio}
                    onChange={(e) => setDraftData({ bio: e.target.value })}
                    style={{ ...INPUT, resize: "none" }}
                    placeholder="I help backend engineers crack system design interviews..."
                  />
                </div>
                <div>
                  <label style={LABEL}>Public Profile URL Slug</label>
                  <div className="flex rounded-xl overflow-hidden" style={{ background: "rgba(12,10,9,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="px-4 py-3 text-sm" style={{ background: "rgba(255,255,255,0.05)", borderRight: "1px solid rgba(255,255,255,0.1)", color: "#78716c" }}>
                      gracementor.com/mentors/
                    </span>
                    <input
                      type="text"
                      value={data.shareSlug}
                      onChange={(e) => setDraftData({ shareSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                      className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none"
                      style={{ color: "#fafaf9" }}
                      placeholder="john-doe"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-3 mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: step === 1 ? "#44403c" : "#a8a29e",
                cursor: step === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Back
            </button>

            {step < TOTAL_STEPS ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg,#4ade80,#16a34a)",
                  color: "#0c0a09",
                  boxShadow: "0 4px 12px rgba(74,222,128,0.25)",
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isSubmitting ? "rgba(74,222,128,0.5)" : "linear-gradient(135deg,#f59e0b,#d97706)",
                  color: "#0c0a09",
                  boxShadow: "0 4px 12px rgba(245,158,11,0.25)",
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Setting up…
                  </>
                ) : "Complete Setup ✓"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "#44403c" }}>
          Your progress is auto-saved — you can pick up where you left off.
        </p>
      </div>
    </div>
  );
}
