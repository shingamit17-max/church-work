"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDraft } from "@/hooks/useDraft";
import { submitMenteeProfile } from "@/app/actions/onboarding";
import { CareerStage, DiagnosticFunnelStage, PainPoint } from "@/types";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { MENTEE_DEFAULT_STEPS } from "@/lib/onboarding-defaults";

const initialMenteeData = {
  status: "unemployed" as "unemployed" | "underemployed" | "employed-but-searching",
  careerStage: CareerStage.FRESHER,
  targetDomain: "",
  targetRoles: [] as string[],
  diagnosticAnswers: {
    funnelStage: DiagnosticFunnelStage.NO_CALLS,
    painPoints: [] as PainPoint[],
    interviewCount: 0,
  },
  skills: [{ name: "", confidence: 5 }],
  availability: { hoursPerWeek: 10, preferredMode: "async" as "async" | "calls" | "workshops" },
  goal3Months: "",
  resumeUrl: "",
  customAnswers: [] as { questionId: string, answer: any }[],
};

const BASE_TOTAL_STEPS = 9;

const STEP_META = [
  { id: "status",       icon: "💼" },
  { id: "careerStage",  icon: "📈" },
  { id: "domain",       icon: "🎯" },
  { id: "funnel",       icon: "🚧" },
  { id: "painPoints",   icon: "🩹" },
  { id: "interviews",   icon: "📊" },
  { id: "skills",       icon: "⚡" },
  { id: "availability", icon: "🕐" },
  { id: "goal",         icon: "🌟" },
];

// ── Style helpers ────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "0.625rem",
  padding: "0.75rem 1rem",
  color: "var(--foreground)",
  fontSize: "0.9375rem",
  outline: "none",
};

const LABEL: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 500,
  color: "var(--muted-foreground)",
  marginBottom: "0.5rem",
};

export default function MenteeOnboarding() {
  const { data, setDraftData, clearDraft, isLoaded } = useDraft("mentee_onboarding", initialMenteeData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);
  const [builtInOverrides, setBuiltInOverrides] = useState<Record<string, any>>({});
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/questions').then(r => r.json()),
      fetch('/api/admin/config?keys[]=onboarding_mentee_steps').then(r => r.json())
    ])
    .then(([fetchedQuestions, config]) => {
      setCustomQuestions(fetchedQuestions.filter((q: any) => q.targetRole === 'MENTEE' || q.targetRole === 'BOTH'));
      if (config.onboarding_mentee_steps) {
        setBuiltInOverrides(config.onboarding_mentee_steps);
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
      const res = await submitMenteeProfile(data);
      if (res.success) {
        clearDraft();
        toast.success("Profile submitted successfully!");
        await update({ role: "mentee", onboardingComplete: true });
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

  const handleRoleChange = (index: number, val: string) => {
    const newRoles = [...data.targetRoles];
    newRoles[index] = val;
    setDraftData({ targetRoles: newRoles });
  };
  const addRole = () => setDraftData({ targetRoles: [...data.targetRoles, ""] });
  const removeRole = (index: number) => {
    const newRoles = [...data.targetRoles];
    newRoles.splice(index, 1);
    setDraftData({ targetRoles: newRoles });
  };
  const togglePainPoint = (pp: PainPoint) => {
    const points = data.diagnosticAnswers.painPoints;
    setDraftData({
      diagnosticAnswers: {
        ...data.diagnosticAnswers,
        painPoints: points.includes(pp) ? points.filter((p) => p !== pp) : [...points, pp],
      },
    });
  };

  const handleCustomAnswer = (questionId: string, answer: any) => {
    const existing = data.customAnswers || [];
    const filtered = existing.filter((a: any) => a.questionId !== questionId);
    setDraftData({ customAnswers: [...filtered, { questionId, answer }] });
  };

  let meta;
  if (step <= BASE_TOTAL_STEPS) {
    const defaultData = MENTEE_DEFAULT_STEPS[step - 1];
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
        <div
          className="p-8 rounded-2xl bg-card border border-border"
        >
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-medium text-primary">
                Step {step} of {totalSteps}
              </span>
              <span className="text-xs text-muted"> {Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-muted/20">
              <div
                className="h-1.5 rounded-full transition-all duration-500 bg-primary"
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-1 mt-2.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: i + 1 <= step ? "var(--primary)" : "var(--muted)" }}
                />
              ))}
            </div>
          </div>

          {/* Step header */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-primary/10 border border-primary/20"
            >
              {meta.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ letterSpacing: "-0.02em" }}>{meta.title}</h2>
              <p className="text-xs text-muted-foreground">{meta.hint}</p>
            </div>
          </div>

          {/* Step content */}
          <div className="space-y-4 min-h-[200px]">
            {/* Step 1 — Status */}
            {step === 1 && (
              <div className="space-y-2">
                {[
                  { value: "unemployed", defaultLabel: "Unemployed and actively looking", icon: "🔍" },
                  { value: "underemployed", defaultLabel: "Underemployed / Freelancing", icon: "⚡" },
                  { value: "employed-but-searching", defaultLabel: "Employed but looking to switch", icon: "↗️" },
                ].map((opt) => {
                  const label = builtInOverrides?.status?.options?.[opt.value]?.label || opt.defaultLabel;
                  return (
                    <label key={opt.value} onClick={() => setDraftData({ status: opt.value as "unemployed" | "underemployed" | "employed-but-searching" })} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border"
                      style={{
                        background: data.status === opt.value ? "var(--primary-foreground-soft)" : "transparent",
                      }}
                    >
                      <input type="radio" name="status" value={opt.value} checked={data.status === opt.value} readOnly className="sr-only" />
                      <span className="text-lg">{opt.icon}</span>
                      <span className="text-sm font-medium" style={{ color: data.status === opt.value ? "var(--primary)" : "var(--foreground)" }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Step 2 — Career stage */}
            {step === 2 && (
              <div className="space-y-2">
                {Object.entries(CareerStage).map(([k, v]) => (
                  <label key={k} onClick={() => setDraftData({ careerStage: v as CareerStage })} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border"
                    style={{
                      background: data.careerStage === v ? "var(--primary-foreground-soft)" : "transparent",
                    }}
                  >
                    <input type="radio" name="careerStage" value={v} checked={data.careerStage === v} readOnly className="sr-only" />
                    <span className="text-sm font-medium" style={{ color: data.careerStage === v ? "var(--primary)" : "var(--foreground)" }}>{v}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Step 3 — Domain & Roles */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label style={LABEL}>Target Domain / Industry</label>
                  <input type="text" value={data.targetDomain} onChange={(e) => setDraftData({ targetDomain: e.target.value })} style={INPUT} placeholder="e.g. Fintech, SaaS, Healthcare" />
                </div>
                <div>
                  <label style={LABEL}>Target Roles</label>
                  <div className="space-y-2">
                    {data.targetRoles.map((role, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={role} onChange={(e) => handleRoleChange(i, e.target.value)} style={{ ...INPUT, flex: 1 }} placeholder="e.g. Backend Engineer" />
                        <button type="button" onClick={() => removeRole(i)} className="px-3 py-2 rounded-lg text-sm transition-all" style={{ background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.15)", color: "#fb7185" }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={addRole} className="mt-2 text-xs font-medium transition-all" style={{ color: "var(--primary)" }}>
                    + Add another role
                  </button>
                </div>
              </div>
            )}

            {/* Step 4 — Funnel stage */}
            {step === 4 && (
              <div className="space-y-2">
                {Object.entries(DiagnosticFunnelStage).map(([k, v]) => {
                  const labels: Record<string, string> = {
                    no_calls: "Not getting interview calls",
                    stuck_round_1: "Stuck after Round 1 / HR screening",
                    final_round_rejects: "Reaching finals but getting rejected",
                    low_offers: "Getting offers but below expectation",
                  };
                  const label = builtInOverrides?.funnel?.options?.[v]?.label || labels[v] || v;
                  return (
                    <label key={k} onClick={() => setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, funnelStage: v as DiagnosticFunnelStage } })} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border"
                      style={{
                        background: data.diagnosticAnswers.funnelStage === v ? "var(--primary-foreground-soft)" : "transparent",
                      }}
                    >
                      <input type="radio" name="funnel" value={v} checked={data.diagnosticAnswers.funnelStage === v} readOnly className="sr-only" />
                      <span className="text-sm font-medium" style={{ color: data.diagnosticAnswers.funnelStage === v ? "var(--primary)" : "var(--foreground)" }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Step 5 — Pain points */}
            {step === 5 && (
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PainPoint).map((v) => {
                  const selected = data.diagnosticAnswers.painPoints.includes(v);
                  return (
                    <button key={v} type="button" onClick={() => togglePainPoint(v)}
                      className="p-3 rounded-xl text-left text-xs font-medium capitalize transition-all border border-border"
                      style={{
                        background: selected ? "var(--primary-foreground-soft)" : "transparent",
                        color: selected ? "var(--primary)" : "var(--muted-foreground)",
                      }}
                    >
                      {v.replace(/_/g, " ")}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 6 — Interview count */}
            {step === 6 && (
              <div className="space-y-3">
                <label style={LABEL}>Interviews in the last 3–6 months</label>
                <div className="space-y-2">
                  {[
                    { value: 0, defaultLabel: "0 (None yet)" },
                    { value: 1, defaultLabel: "1 to 3 interviews" },
                    { value: 4, defaultLabel: "4 to 10 interviews" },
                    { value: 10, defaultLabel: "10+ interviews" },
                  ].map((opt) => {
                    const label = builtInOverrides?.interviews?.options?.[opt.value.toString()]?.label || opt.defaultLabel;
                    return (
                      <label key={opt.value} onClick={() => setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, interviewCount: opt.value } })} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border"
                        style={{
                          background: data.diagnosticAnswers.interviewCount === opt.value ? "var(--primary-foreground-soft)" : "transparent",
                        }}
                      >
                        <input type="radio" name="interviewCount" value={opt.value} checked={data.diagnosticAnswers.interviewCount === opt.value} readOnly className="sr-only" />
                        <span className="text-sm font-medium" style={{ color: data.diagnosticAnswers.interviewCount === opt.value ? "var(--primary)" : "var(--foreground)" }}>{label}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-xs mt-3 text-muted-foreground">This helps your mentor calibrate advice to your actual experience.</p>
              </div>
            )}

            {/* Step 7 — Skills + Resume */}
            {step === 7 && (
              <div className="space-y-5">
                <div>
                  <label style={LABEL}>Key Skills & Confidence</label>
                  <div className="space-y-3">
                    {data.skills.map((skill, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <input type="text" value={skill.name} onChange={(e) => { const s = [...data.skills]; s[i].name = e.target.value; setDraftData({ skills: s }); }} style={{ ...INPUT, flex: 1 }} placeholder="e.g. React, Python…" />
                        <div className="flex items-center gap-2 shrink-0">
                          <input type="range" min="1" max="10" value={skill.confidence} onChange={(e) => { const s = [...data.skills]; s[i].confidence = parseInt(e.target.value); setDraftData({ skills: s }); }} className="w-20" style={{ accentColor: "var(--primary)" }} />
                          <span className="text-sm w-4 text-right text-primary">{skill.confidence}</span>
                        </div>
                        <button type="button" onClick={() => { const s = [...data.skills]; s.splice(i, 1); setDraftData({ skills: s }); }} className="text-xs px-2 py-1.5 rounded-lg" style={{ color: "#fb7185", background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.15)" }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setDraftData({ skills: [...data.skills, { name: "", confidence: 5 }] })} className="text-xs font-medium text-primary">+ Add Skill</button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <label style={LABEL}>Resume Upload <span className="text-muted-foreground font-normal">(optional)</span></label>
                  {data.resumeUrl ? (
                    <div className="p-4 rounded-xl flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-sm text-emerald-500">✓ Resume uploaded</span>
                      <button type="button" onClick={() => setDraftData({ resumeUrl: "" })} className="text-xs text-rose-500">Remove</button>
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-dashed border-border">
                      <UploadDropzone
                        endpoint="resumeUploader"
                        onUploadBegin={() => setUploadingResume(true)}
                        onClientUploadComplete={(res) => { setUploadingResume(false); if (res?.[0]) setDraftData({ resumeUrl: res[0].url }); }}
                        onUploadError={(error: Error) => { setUploadingResume(false); toast.error(`Upload error: ${error.message}`); }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 8 — Availability */}
            {step === 8 && (
              <div className="space-y-5">
                <div>
                  <label style={LABEL}>Hours per week for mentorship</label>
                  <input type="number" min="1" value={data.availability.hoursPerWeek} onChange={(e) => setDraftData({ availability: { ...data.availability, hoursPerWeek: parseInt(e.target.value) || 1 } })} style={INPUT} />
                </div>
                <div>
                  <label style={LABEL}>Preferred mode</label>
                  <div className="space-y-2">
                    {[
                      { value: "async", defaultLabel: "Async chat & resources", icon: "💬" },
                      { value: "calls", defaultLabel: "1:1 video calls", icon: "📹" },
                      { value: "workshops", defaultLabel: "Group workshops", icon: "👥" },
                    ].map((opt) => {
                      const label = builtInOverrides?.availability?.options?.[opt.value]?.label || opt.defaultLabel;
                      return (
                        <label key={opt.value} onClick={() => setDraftData({ availability: { ...data.availability, preferredMode: opt.value as "async" | "calls" | "workshops" } })} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border"
                          style={{
                            background: data.availability.preferredMode === opt.value ? "var(--primary-foreground-soft)" : "transparent",
                          }}
                        >
                          <input type="radio" name="mode" value={opt.value} checked={data.availability.preferredMode === opt.value} readOnly className="sr-only" />
                          <span>{opt.icon}</span>
                          <span className="text-sm font-medium" style={{ color: data.availability.preferredMode === opt.value ? "var(--primary)" : "var(--foreground)" }}>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 9 — Goal */}
            {step === 9 && (
              <div>
                <label style={LABEL}>What does success look like in 3 months?</label>
                <textarea
                  rows={5}
                  value={data.goal3Months}
                  onChange={(e) => setDraftData({ goal3Months: e.target.value })}
                  style={{ ...INPUT, resize: "none", lineHeight: "1.6" }}
                  placeholder="e.g. To have an offer for a Mid-level Frontend role at a company I'm proud of…"
                />
                <p className="text-xs mt-2 text-muted-foreground">
                  Be specific — your mentor will use this to anchor your sessions.
                </p>
              </div>
            )}
          </div>

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
                          <label key={opt} onClick={() => handleCustomAnswer(q._id, opt)} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border" style={{ background: currentAnswer === opt ? "var(--primary-foreground-soft)" : "transparent" }}>
                            <input type="radio" name={`custom-${q._id}`} value={opt} checked={currentAnswer === opt} readOnly className="sr-only" />
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
                            <label key={opt} onClick={(e) => {
                              e.preventDefault();
                              const newArr = isSelected ? selectedArr.filter((a: string) => a !== opt) : [...selectedArr, opt];
                              handleCustomAnswer(q._id, newArr);
                            }} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border border-border" style={{ background: isSelected ? "var(--primary-foreground-soft)" : "transparent" }}>
                              <input type="checkbox" checked={isSelected} readOnly className="sr-only" />
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

          {/* Navigation */}
          <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-border">
            <button
              onClick={prevStep}
              disabled={step === 1 || isSubmitting || uploadingResume}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all bg-muted/10 border border-border text-muted-foreground"
            >
              &larr; Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={uploadingResume}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all bg-primary text-primary-foreground shadow-lg"
              >
                Continue &rarr;
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all bg-emerald-600 text-white shadow-lg"
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

        {/* Step labels */}
        <p className="text-foreground text-xs mt-5 text-muted-foreground">
          Your progress is auto-saved - you can pick up where you left off.
        </p>
      </div>
    </div>
  );
}
