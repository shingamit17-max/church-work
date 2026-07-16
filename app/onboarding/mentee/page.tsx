"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/hooks/useDraft";
import { submitMenteeProfile } from "@/app/actions/onboarding";
import { CareerStage, DiagnosticFunnelStage, PainPoint } from "@/types";
import { UploadDropzone } from "@/lib/uploadthing";

const initialMenteeData = {
  status: "unemployed",
  careerStage: CareerStage.FRESHER,
  targetDomain: "",
  targetRoles: [] as string[],
  diagnosticAnswers: {
    funnelStage: DiagnosticFunnelStage.NO_CALLS,
    painPoints: [] as PainPoint[],
    interviewCount: 0,
  },
  skills: [{ name: "", confidence: 5 }],
  availability: { hoursPerWeek: 10, preferredMode: "async" },
  goal3Months: "",
  resumeUrl: "",
};

const TOTAL_STEPS = 9;

const STEP_META = [
  { title: "Employment Status",    icon: "💼", hint: "Tell us where you're at right now" },
  { title: "Career Stage",         icon: "📈", hint: "How far along is your career journey?" },
  { title: "Target Domain & Roles",icon: "🎯", hint: "What are you aiming for?" },
  { title: "Where You're Stuck",   icon: "🚧", hint: "Identify the bottleneck in your job search" },
  { title: "Pain Points",          icon: "🩹", hint: "What specific challenges are you facing?" },
  { title: "Interview History",    icon: "📊", hint: "Help us gauge your experience level" },
  { title: "Skills & Resume",      icon: "⚡", hint: "Show your strengths and upload your CV" },
  { title: "Availability",         icon: "🕐", hint: "How much time can you commit?" },
  { title: "3-Month Goal",         icon: "🌟", hint: "What does success look like for you?" },
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

export default function MenteeOnboarding() {
  const { data, setDraftData, clearDraft, isLoaded } = useDraft("mentee_onboarding", initialMenteeData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const nextStep = () => setStep((p) => Math.min(TOTAL_STEPS, p + 1));
  const prevStep = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitMenteeProfile(data);
      if (res.success) {
        clearDraft();
        window.location.href = "/dashboard";
      } else {
        alert(res.error || "Failed to submit profile");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
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

  const meta = STEP_META[step - 1];
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "#1c1917", color: "#fafaf9" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: "absolute", width: 500, height: 500, top: "30%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs" style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}>✦</div>
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
              <span className="text-xs font-medium" style={{ color: "#f59e0b" }}>
                Step {step} of {TOTAL_STEPS}
              </span>
              <span className="text-xs" style={{ color: "#44403c" }}>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg,#f59e0b,#fbbf24)" }}
              />
            </div>
            {/* Step dots */}
            <div className="flex gap-1 mt-2.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-0.5 rounded-full transition-all duration-300"
                  style={{ background: i + 1 <= step ? "#f59e0b" : "rgba(255,255,255,0.06)" }}
                />
              ))}
            </div>
          </div>

          {/* Step header */}
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
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
            {/* Step 1 — Status */}
            {step === 1 && (
              <div className="space-y-2">
                {[
                  { value: "unemployed", label: "Unemployed and actively looking", icon: "🔍" },
                  { value: "underemployed", label: "Underemployed / Freelancing", icon: "⚡" },
                  { value: "employed-but-searching", label: "Employed but looking to switch", icon: "↗️" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: data.status === opt.value ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${data.status === opt.value ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <input type="radio" name="status" value={opt.value} checked={data.status === opt.value} onChange={() => setDraftData({ status: opt.value })} className="sr-only" />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-sm font-medium" style={{ color: data.status === opt.value ? "#fbbf24" : "#d6d3d1" }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Step 2 — Career stage */}
            {step === 2 && (
              <div className="space-y-2">
                {Object.entries(CareerStage).map(([k, v]) => (
                  <label key={k} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      background: data.careerStage === v ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${data.careerStage === v ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <input type="radio" name="careerStage" value={v} checked={data.careerStage === v} onChange={() => setDraftData({ careerStage: v as CareerStage })} className="sr-only" />
                    <span className="text-sm font-medium" style={{ color: data.careerStage === v ? "#fbbf24" : "#d6d3d1" }}>{v}</span>
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
                  <button type="button" onClick={addRole} className="mt-2 text-xs font-medium transition-all" style={{ color: "#f59e0b" }}>
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
                  return (
                    <label key={k} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: data.diagnosticAnswers.funnelStage === v ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${data.diagnosticAnswers.funnelStage === v ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <input type="radio" name="funnel" value={v} checked={data.diagnosticAnswers.funnelStage === v} onChange={() => setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, funnelStage: v as DiagnosticFunnelStage } })} className="sr-only" />
                      <span className="text-sm font-medium" style={{ color: data.diagnosticAnswers.funnelStage === v ? "#fbbf24" : "#d6d3d1" }}>{labels[v] || v}</span>
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
                      className="p-3 rounded-xl text-left text-xs font-medium capitalize transition-all"
                      style={{
                        background: selected ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selected ? "rgba(245,158,11,0.35)" : "rgba(255,255,255,0.07)"}`,
                        color: selected ? "#fbbf24" : "#a8a29e",
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
              <div>
                <label style={LABEL}>Interviews in the last 3–6 months</label>
                <input
                  type="number"
                  min="0"
                  value={data.diagnosticAnswers.interviewCount}
                  onChange={(e) => setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, interviewCount: parseInt(e.target.value) || 0 } })}
                  style={INPUT}
                  placeholder="0"
                />
                <p className="text-xs mt-2" style={{ color: "#44403c" }}>This helps your mentor calibrate advice to your actual experience.</p>
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
                          <input type="range" min="1" max="10" value={skill.confidence} onChange={(e) => { const s = [...data.skills]; s[i].confidence = parseInt(e.target.value); setDraftData({ skills: s }); }} className="w-20" style={{ accentColor: "#f59e0b" }} />
                          <span className="text-sm w-4 text-right" style={{ color: "#fbbf24" }}>{skill.confidence}</span>
                        </div>
                        <button type="button" onClick={() => { const s = [...data.skills]; s.splice(i, 1); setDraftData({ skills: s }); }} className="text-xs px-2 py-1.5 rounded-lg" style={{ color: "#fb7185", background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.15)" }}>✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setDraftData({ skills: [...data.skills, { name: "", confidence: 5 }] })} className="text-xs font-medium" style={{ color: "#f59e0b" }}>+ Add Skill</button>
                  </div>
                </div>

                <div className="pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <label style={LABEL}>Resume Upload <span style={{ color: "#44403c", fontWeight: 400 }}>(optional)</span></label>
                  {data.resumeUrl ? (
                    <div className="p-4 rounded-xl flex items-center justify-between" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
                      <span className="text-sm" style={{ color: "#4ade80" }}>✓ Resume uploaded</span>
                      <button type="button" onClick={() => setDraftData({ resumeUrl: "" })} className="text-xs" style={{ color: "#fb7185" }}>Remove</button>
                    </div>
                  ) : (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px dashed rgba(255,255,255,0.12)" }}>
                      <UploadDropzone
                        endpoint="resumeUploader"
                        onUploadBegin={() => setUploadingResume(true)}
                        onClientUploadComplete={(res) => { setUploadingResume(false); if (res?.[0]) setDraftData({ resumeUrl: res[0].url }); }}
                        onUploadError={(error: Error) => { setUploadingResume(false); alert(`Upload error: ${error.message}`); }}
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
                      { value: "async", label: "Async chat & resources", icon: "💬" },
                      { value: "calls", label: "1:1 video calls", icon: "📹" },
                      { value: "workshops", label: "Group workshops", icon: "👥" },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: data.availability.preferredMode === opt.value ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
                          border: `1px solid ${data.availability.preferredMode === opt.value ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.07)"}`,
                        }}
                      >
                        <input type="radio" name="mode" value={opt.value} checked={data.availability.preferredMode === opt.value} onChange={() => setDraftData({ availability: { ...data.availability, preferredMode: opt.value } })} className="sr-only" />
                        <span>{opt.icon}</span>
                        <span className="text-sm font-medium" style={{ color: data.availability.preferredMode === opt.value ? "#fbbf24" : "#d6d3d1" }}>{opt.label}</span>
                      </label>
                    ))}
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
                <p className="text-xs mt-2" style={{ color: "#44403c" }}>
                  Be specific — your mentor will use this to anchor your sessions.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-3 mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={prevStep}
              disabled={step === 1 || isSubmitting || uploadingResume}
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
                disabled={uploadingResume}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg,#f59e0b,#d97706)",
                  color: "#0c0a09",
                  boxShadow: "0 4px 12px rgba(245,158,11,0.25)",
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
                  background: isSubmitting ? "rgba(74,222,128,0.5)" : "linear-gradient(135deg,#4ade80,#16a34a)",
                  color: "#0c0a09",
                  boxShadow: "0 4px 12px rgba(74,222,128,0.25)",
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

        {/* Step labels */}
        <p className="text-center text-xs mt-5" style={{ color: "#44403c" }}>
          Your progress is auto-saved — you can pick up where you left off.
        </p>
      </div>
    </div>
  );
}
