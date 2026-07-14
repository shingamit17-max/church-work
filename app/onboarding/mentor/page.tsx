"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDraft } from "@/hooks/useDraft";
import { submitMentorProfile } from "@/app/actions/onboarding";
import { CareerStage, PainPoint } from "@/types";

const initialMentorData = {
  company: "",
  currentRole: "",
  yearsExp: 0,
  domain: "",
  specialization: "",
  helpTypes: [] as string[],
  painPointsCanHelp: [] as PainPoint[],
  menteeSeniority: [] as CareerStage[],
  availability: {
    hoursPerMonth: 5,
    preferredMode: "async",
  },
  maxMentees: 2,
  bio: "",
  shareSlug: "",
};

export default function MentorOnboarding() {
  const { data, setDraftData, clearDraft, isLoaded } = useDraft("mentor_onboarding", initialMentorData);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const nextStep = () => setStep((p) => Math.min(7, p + 1));
  const prevStep = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitMentorProfile(data);
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

  const toggleArrayItem = (key: keyof typeof data, value: any) => {
    const arr = data[key] as any[];
    if (arr.includes(value)) {
      setDraftData({ [key]: arr.filter(item => item !== value) });
    } else {
      setDraftData({ [key]: [...arr, value] });
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl w-full">
      <div className="mb-6 flex items-center gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i + 1 <= step ? 'bg-teal-500' : 'bg-white/10'}`} />
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-6">Step {step} of 7</h2>

      <div className="space-y-6">
        {step === 1 && (
          <div>
            <h3 className="text-lg mb-4">Professional Background</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Current Company</label>
                <input 
                  type="text" 
                  value={data.company}
                  onChange={(e) => setDraftData({ company: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Current Role</label>
                <input 
                  type="text" 
                  value={data.currentRole}
                  onChange={(e) => setDraftData({ currentRole: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Years of Experience</label>
                <input 
                  type="number" 
                  min="0"
                  value={data.yearsExp}
                  onChange={(e) => setDraftData({ yearsExp: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg mb-4">Domain & Specialization</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Industry / Domain (e.g., Fintech, Healthcare)</label>
                <input 
                  type="text" 
                  value={data.domain}
                  onChange={(e) => setDraftData({ domain: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Specialization (e.g., Backend scalability, Product Strategy)</label>
                <input 
                  type="text" 
                  value={data.specialization}
                  onChange={(e) => setDraftData({ specialization: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg mb-4">How can you help? (Select all that apply)</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: '1:1', label: '1:1 Mentorship Calls' },
                { id: 'resume', label: 'Resume Review' },
                { id: 'mock', label: 'Mock Interviews' },
                { id: 'resource', label: 'Resource Sharing' },
                { id: 'workshop', label: 'Hosting Workshops' },
                { id: 'guidance', label: 'Career Guidance' },
              ].map((ht) => (
                <label key={ht.id} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${data.helpTypes.includes(ht.id) ? 'bg-teal-600/30 border-teal-500' : 'border-white/10 hover:bg-white/5'}`}>
                  <input 
                    type="checkbox" 
                    checked={data.helpTypes.includes(ht.id)}
                    onChange={() => toggleArrayItem("helpTypes", ht.id)}
                    className="hidden"
                  />
                  <span>{ht.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg mb-4">Which specific pain points can you help with?</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PainPoint).map(([k, v]) => (
                <label key={k} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${data.painPointsCanHelp.includes(v) ? 'bg-teal-600/30 border-teal-500' : 'border-white/10 hover:bg-white/5'}`}>
                  <input 
                    type="checkbox" 
                    checked={data.painPointsCanHelp.includes(v)}
                    onChange={() => toggleArrayItem("painPointsCanHelp", v)}
                    className="hidden"
                  />
                  <span className="capitalize">{v}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-lg mb-4">Target Mentee Experience Level</h3>
            <div className="space-y-3">
              {Object.entries(CareerStage).map(([k, v]) => (
                <label key={k} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${data.menteeSeniority.includes(v) ? 'bg-teal-600/30 border-teal-500' : 'border-white/10 hover:bg-white/5'}`}>
                  <input 
                    type="checkbox" 
                    checked={data.menteeSeniority.includes(v)}
                    onChange={() => toggleArrayItem("menteeSeniority", v)}
                    className="hidden"
                  />
                  <span>{v}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="text-lg mb-4">Availability & Bandwidth</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Hours per month</label>
                <input 
                  type="number" 
                  min="1"
                  value={data.availability.hoursPerMonth}
                  onChange={(e) => setDraftData({ availability: { ...data.availability, hoursPerMonth: parseInt(e.target.value) || 1 } })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Maximum concurrent mentees</label>
                <input 
                  type="number" 
                  min="1"
                  value={data.maxMentees}
                  onChange={(e) => setDraftData({ maxMentees: parseInt(e.target.value) || 1 })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2"
                  title="To prevent burnout"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Preferred Mode</label>
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

        {step === 7 && (
          <div>
            <h3 className="text-lg mb-4">Final Touches</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Short Bio (How you introduce yourself to mentees)</label>
                <textarea 
                  rows={3}
                  value={data.bio}
                  onChange={(e) => setDraftData({ bio: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 resize-none"
                  placeholder="I help backend engineers crack system design interviews..."
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Unique Profile Handle / Slug (for public sharing)</label>
                <div className="flex bg-black/20 border border-white/10 rounded-lg overflow-hidden">
                  <span className="px-3 py-2 bg-white/5 text-white/50 border-r border-white/10">gracementor.com/mentors/</span>
                  <input 
                    type="text" 
                    value={data.shareSlug}
                    onChange={(e) => setDraftData({ shareSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full bg-transparent px-4 py-2 focus:outline-none"
                    placeholder="john-doe"
                  />
                </div>
              </div>
              <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg text-sm text-teal-100">
                <p>Note: LinkedIn verification is bypassed for this MVP flow.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      <div className="mt-8 flex justify-between">
        <button 
          onClick={prevStep} 
          disabled={step === 1 || isSubmitting}
          className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          Back
        </button>
        {step < 7 ? (
          <button 
            onClick={nextStep}
            className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors"
          >
            Continue
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Complete Setup"}
          </button>
        )}
      </div>
    </div>
  );
}
