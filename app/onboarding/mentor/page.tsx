"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDraft } from "@/hooks/useDraft";
import { submitMentorProfile } from "@/app/actions/onboarding";
import { CareerStage, PainPoint, MentorProfile } from "@/types";
import { toast } from "sonner";
import { MENTOR_DEFAULT_STEPS } from "@/lib/onboarding-defaults";

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
  customAnswers: [] as { questionId: string, answer: any }[],
};

const BASE_TOTAL_STEPS = 7;

const STEP_META = [
  { id: "background",     icon: "🏢" },
  { id: "domain",         icon: "🎯" },
  { id: "helpTypes",      icon: "🤝" },
  { id: "painPoints",     icon: "🩹" },
  { id: "targetMentees",  icon: "🎓" },
  { id: "availability",   icon: "🕐" },
  { id: "final",          icon: "✨" },
];

// ── Style helpers ────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: "100%",
  background: "var(--card)",
  border: "1px solid var(--border)",
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
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [builtInOverrides, setBuiltInOverrides] = useState<Record<string, any>>({});
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/questions').then(r => r.json()),
      fetch('/api/admin/config?keys[]=onboarding_mentor_steps').then(r => r.json())
    ])
    .then(([fetchedQuestions, config]) => {
      setCustomQuestions(fetchedQuestions.filter((q: any) => q.targetRole === 'MENTOR' || q.targetRole === 'BOTH'));
      if (config.onboarding_mentor_steps) {
        setBuiltInOverrides(config.onboarding_mentor_steps);
      }
    })
    .catch(console.error);
  }, []);

  if (!isLoaded) return null;

  const totalSteps = BASE_TOTAL_STEPS + customQuestions.length;

  const nextStep = () => setStep((p) => Math.min(totalSteps, p + 1));
  const prevStep = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitMentorProfile(data);
      if (res.success) {
        clearDraft();
        toast.success("Profile submitted successfully!");
        await update({ role: "mentor", onboardingComplete: true });
        router.push("/dashboard");
      } else {
        toast.error(res.error || "Failed to submit profile");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
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

  const handleCustomAnswer = (questionId: string, answer: any) => {
    const existing = data.customAnswers || [];
    const filtered = existing.filter((a: any) => a.questionId !== questionId);
    setDraftData({ customAnswers: [...filtered, { questionId, answer }] });
  };

  let meta;
  if (step <= BASE_TOTAL_STEPS) {
    const defaultData = MENTOR_DEFAULT_STEPS[step - 1];
    const iconData = STEP_META[step - 1];
    const override = builtInOverrides[defaultData.id] || {};
    meta = {
      title: override.title || defaultData.title,
      icon: iconData.icon,
      hint: override.hint || defaultData.hint,
    };
  } else {
    const q = customQuestions[step - BASE_TOTAL_STEPS - 1];
    meta = { title: q.title, icon: "📋", hint: "Additional Information" };
  }

  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full pb-12">
      <div className="relative z-10 w-full max-w-xl mx-auto">
        {/* Card */}
        <div className="p-8 rounded-2xl bg-card border border-border shadow-2xl relative z-10 w-full">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-primary">
                Step {step} of {totalSteps}
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
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: i + 1 <= step ? "#4ade80" : "bg-muted/20" }}
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
                    { id: '1:1', defaultLabel: '1:1 Mentorship Calls' },
                    { id: 'resume', defaultLabel: 'Resume Review' },
                    { id: 'mock', defaultLabel: 'Mock Interviews' },
                    { id: 'resource', defaultLabel: 'Resource Sharing' },
                    { id: 'workshop', defaultLabel: 'Hosting Workshops' },
                    { id: 'guidance', defaultLabel: 'Career Guidance' },
                  ] as { id: MentorProfile["helpTypes"][number]; defaultLabel: string }[]
                ).map((ht) => {
                  const selected = data.helpTypes.includes(ht.id);
                  const label = builtInOverrides?.helpTypes?.options?.[ht.id]?.label || ht.defaultLabel;
                  return (
                    <label key={ht.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: selected ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <input type="checkbox" checked={selected} onChange={() => toggleArrayItem("helpTypes", ht.id as MentorProfile["helpTypes"][number])} className="sr-only" />
                      <span className="text-sm font-medium" style={{ color: selected ? "#4ade80" : "#a8a29e" }}>{label}</span>
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
                        border: "1px solid var(--border)"
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
                    style={INPUT}
                    className="warm-select cursor-pointer"
                  >
                    <option value="async">{builtInOverrides?.availability?.options?.async?.label || "Async Chat / Resources"}</option>
                    <option value="calls">{builtInOverrides?.availability?.options?.calls?.label || "1:1 Video Calls"}</option>
                    <option value="workshops">{builtInOverrides?.availability?.options?.workshops?.label || "Workshops / Group Sessions"}</option>
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

            {/* Custom Dynamic Questions */}
            {step > BASE_TOTAL_STEPS && (
              <div className="space-y-4">
                {(() => {
                  const q = customQuestions[step - BASE_TOTAL_STEPS - 1];
                  if (!q) return null;
                  const currentAnswerObj = (data.customAnswers || []).find((a: any) => a.questionId === q._id);
                  const currentAnswer = currentAnswerObj ? currentAnswerObj.answer : (q.type === "checkbox" ? [] : "");

                  return (
                    <div>
                      <label style={LABEL}>{q.title}</label>
                      {q.type === "text" && (
                        <input
                          type="text"
                          value={currentAnswer}
                          onChange={(e) => handleCustomAnswer(q._id, e.target.value)}
                          style={INPUT}
                          placeholder="Your answer..."
                        />
                      )}
                      {q.type === "mcq" && (
                        <div className="space-y-2">
                          {q.options.map((opt: string) => (
                            <label key={opt} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border" style={{ background: currentAnswer === opt ? "var(--primary-foreground-soft)" : "transparent" }}>
                              <input type="radio" name={`custom-${q._id}`} value={opt} checked={currentAnswer === opt} onChange={() => handleCustomAnswer(q._id, opt)} className="sr-only" />
                              <span className="text-sm font-medium" style={{ color: currentAnswer === opt ? "var(--primary)" : "var(--foreground)" }}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === "checkbox" && (
                        <div className="space-y-2">
                          {q.options.map((opt: string) => {
                            const selectedArr = Array.isArray(currentAnswer) ? currentAnswer : [];
                            const isSelected = selectedArr.includes(opt);
                            return (
                              <label key={opt} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border" style={{ background: isSelected ? "var(--primary-foreground-soft)" : "transparent" }}>
                                <input type="checkbox" checked={isSelected} onChange={(e) => {
                                  const newArr = e.target.checked ? [...selectedArr, opt] : selectedArr.filter((a: string) => a !== opt);
                                  handleCustomAnswer(q._id, newArr);
                                }} className="sr-only" />
                                <div className="w-5 h-5 rounded border flex items-center justify-center transition-colors" style={{ background: isSelected ? "var(--primary)" : "transparent", borderColor: isSelected ? "var(--primary)" : "var(--border)" }}>
                                  {isSelected && <span className="text-white text-xs leading-none">✓</span>}
                                </div>
                                <span className="text-sm font-medium" style={{ color: isSelected ? "var(--primary)" : "var(--foreground)" }}>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
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
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: step === 1 ? "#44403c" : "#a8a29e",
                cursor: step === 1 ? "not-allowed" : "pointer",
              }}
            >
              &larr; Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isSubmitting ? "rgba(74,222,128,0.5)" : "var(--primary)",
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
                    Setting up...
                  </>
                ) : "Complete Setup (Done)"}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "#78716c" }}>
          Your progress is auto-saved - you can pick up where you left off.
        </p>
      </div>
    </div>
  );
}
