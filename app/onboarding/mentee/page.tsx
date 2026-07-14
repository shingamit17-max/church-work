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
  availability: {
    hoursPerWeek: 10,
    preferredMode: "async",
  },
  goal3Months: "",
  resumeUrl: "",
};

export default function MenteeOnboarding() {
  const { data, setDraftData, clearDraft, isLoaded } = useDraft("mentee_onboarding", initialMenteeData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const nextStep = () => setStep((p) => Math.min(9, p + 1));
  const prevStep = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitMenteeProfile(data);
      if (res.success) {
        clearDraft();
        // Since we update the DB, the token won't immediately reflect onboardingComplete=true
        // until we refresh the session. In Auth.js, we can reload the window to force a new session fetch,
        // or redirect to dashboard which might check session and fail? 
        // For now, redirect and window reload
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
    if (points.includes(pp)) {
      setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, painPoints: points.filter(p => p !== pp) } });
    } else {
      setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, painPoints: [...points, pp] } });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl w-full">
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i + 1 <= step ? 'bg-indigo-500' : 'bg-white/10'}`} />
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-6">Step {step} of 9</h2>

      <div className="space-y-6">
        {step === 1 && (
          <div>
            <h3 className="text-lg mb-4">Let's start with your current employment status</h3>
            <select 
              value={data.status} 
              onChange={(e) => setDraftData({ status: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
            >
              <option value="unemployed">Unemployed and actively looking</option>
              <option value="underemployed">Underemployed / Freelancing</option>
              <option value="employed-but-searching">Employed but looking for a switch</option>
            </select>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg mb-4">What's your career stage?</h3>
            <select 
              value={data.careerStage} 
              onChange={(e) => setDraftData({ careerStage: e.target.value as CareerStage })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
            >
              {Object.entries(CareerStage).map(([k, v]) => (
                <option key={k} value={v}>{v}</option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg mb-4">Target Domain & Roles</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Target Domain/Industry (e.g., SaaS, Fintech)</label>
                <input 
                  type="text" 
                  value={data.targetDomain}
                  onChange={(e) => setDraftData({ targetDomain: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                  placeholder="e.g. Fintech"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Target Roles</label>
                {data.targetRoles.map((role, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={role}
                      onChange={(e) => handleRoleChange(i, e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                      placeholder="e.g. Backend Engineer"
                    />
                    <button type="button" onClick={() => removeRole(i)} className="text-red-400 hover:text-red-300">✕</button>
                  </div>
                ))}
                <button type="button" onClick={addRole} className="text-teal-400 text-sm hover:underline">+ Add Role</button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg mb-4">Where are you getting stuck?</h3>
            <div className="space-y-3">
              {Object.entries(DiagnosticFunnelStage).map(([k, v]) => (
                <label key={k} className="flex items-center gap-3 p-3 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5">
                  <input 
                    type="radio" 
                    name="funnel" 
                    value={v} 
                    checked={data.diagnosticAnswers.funnelStage === v}
                    onChange={(e) => setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, funnelStage: e.target.value as DiagnosticFunnelStage } })}
                    className="accent-indigo-500"
                  />
                  <span>
                    {v === 'no_calls' ? "Not getting interview calls" :
                     v === 'stuck_round_1' ? "Stuck after round 1 / HR screening" :
                     v === 'final_round_rejects' ? "Reaching final rounds but getting rejected" :
                     "Getting offers but below expectation"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-lg mb-4">What do you think is your main pain point? (Select all that apply)</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PainPoint).map(([k, v]) => (
                <label key={k} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${data.diagnosticAnswers.painPoints.includes(v) ? 'bg-indigo-600/30 border-indigo-500' : 'border-white/10 hover:bg-white/5'}`}>
                  <input 
                    type="checkbox" 
                    checked={data.diagnosticAnswers.painPoints.includes(v)}
                    onChange={() => togglePainPoint(v)}
                    className="hidden"
                  />
                  <span className="capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="text-lg mb-4">Interview History</h3>
            <label className="block text-sm mb-1 text-white/70">How many interviews have you had in the last 3-6 months?</label>
            <input 
              type="number" 
              min="0"
              value={data.diagnosticAnswers.interviewCount}
              onChange={(e) => setDraftData({ diagnosticAnswers: { ...data.diagnosticAnswers, interviewCount: parseInt(e.target.value) || 0 } })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
            />
          </div>
        )}

        {step === 7 && (
          <div>
            <h3 className="text-lg mb-4">Key Skills</h3>
            {data.skills.map((skill, i) => (
              <div key={i} className="flex gap-4 mb-3 items-center">
                <input 
                  type="text" 
                  value={skill.name}
                  onChange={(e) => {
                    const newSkills = [...data.skills];
                    newSkills[i].name = e.target.value;
                    setDraftData({ skills: newSkills });
                  }}
                  className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                  placeholder="Skill (e.g. React)"
                />
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={skill.confidence}
                  onChange={(e) => {
                    const newSkills = [...data.skills];
                    newSkills[i].confidence = parseInt(e.target.value);
                    setDraftData({ skills: newSkills });
                  }}
                  className="w-32 accent-teal-400"
                />
                <span className="text-sm w-4">{skill.confidence}</span>
                <button type="button" onClick={() => {
                  const newSkills = [...data.skills];
                  newSkills.splice(i, 1);
                  setDraftData({ skills: newSkills });
                }} className="text-red-400">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => setDraftData({ skills: [...data.skills, { name: "", confidence: 5 }] })} className="text-teal-400 text-sm hover:underline">+ Add Skill</button>
            
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-sm font-medium mb-2">Resume Upload (Optional)</h4>
              {data.resumeUrl ? (
                <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-teal-400">Resume uploaded successfully!</span>
                  <button type="button" onClick={() => setDraftData({ resumeUrl: "" })} className="text-xs text-red-400 hover:underline">Remove</button>
                </div>
              ) : (
                <div className="bg-black/20 rounded-xl overflow-hidden border border-white/10">
                  <UploadDropzone
                    endpoint="resumeUploader"
                    onUploadBegin={() => setUploadingResume(true)}
                    onClientUploadComplete={(res) => {
                      setUploadingResume(false);
                      if (res?.[0]) {
                        setDraftData({ resumeUrl: res[0].url });
                      }
                    }}
                    onUploadError={(error: Error) => {
                      setUploadingResume(false);
                      alert(`ERROR! ${error.message}`);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 8 && (
          <div>
            <h3 className="text-lg mb-4">Availability & Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Hours per week available for mentorship</label>
                <input 
                  type="number" 
                  min="1"
                  value={data.availability.hoursPerWeek}
                  onChange={(e) => setDraftData({ availability: { ...data.availability, hoursPerWeek: parseInt(e.target.value) || 1 } })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Preferred Mode of Help</label>
                <select 
                  value={data.availability.preferredMode}
                  onChange={(e) => setDraftData({ availability: { ...data.availability, preferredMode: e.target.value as any } })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                >
                  <option value="async">Async Chat / Resources</option>
                  <option value="calls">1:1 Video Calls</option>
                  <option value="workshops">Workshops / Group Sessions</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 9 && (
          <div>
            <h3 className="text-lg mb-4">Your 3-Month Goal</h3>
            <label className="block text-sm mb-1 text-white/70">What does success look like for you in 3 months?</label>
            <textarea 
              rows={4}
              value={data.goal3Months}
              onChange={(e) => setDraftData({ goal3Months: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 resize-none"
              placeholder="e.g., To have an offer for a Mid-level Frontend role..."
            />
          </div>
        )}

      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={prevStep} 
          disabled={step === 1 || isSubmitting || uploadingResume}
          className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        {step < 9 ? (
          <button 
            onClick={nextStep}
            disabled={uploadingResume}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Complete Setup"}
          </button>
        )}
      </div>
    </div>
  );
}
