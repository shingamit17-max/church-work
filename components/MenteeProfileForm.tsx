"use client";

import { useState } from "react";
import { updateMenteeProfile } from "@/app/actions/profile";
import { toast } from "sonner";
import { CareerStage } from "@/types";

interface MenteeProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phoneNumber?: string;
    bio?: string;
    currentRole?: string;
    company?: string;
    highestQualification?: string;
    targetRoles?: string[];
    skills?: { name: string }[];
    careerStage: string;
  };
}

export function MenteeProfileForm({ initialData }: MenteeProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [careerStage, setCareerStage] = useState(initialData.careerStage);
  
  const isFresher = careerStage === CareerStage.FRESHER;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateMenteeProfile(formData);
      if (res.error) throw new Error(res.error);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <details className="warm-card flex flex-col h-full group" open>
          <summary className="p-6 font-bold text-lg text-foreground cursor-pointer list-none flex items-center justify-between [&::-webkit-details-marker]:hidden border-b-2 border-transparent group-open:border-border/50 transition-colors">
            Personal Information
            <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          
          <div className="p-6 pt-4 space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Full Name</label>
              <input type="text" name="fullName" defaultValue={initialData.name} className="warm-input" required />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Email Address</label>
              <input type="email" defaultValue={initialData.email} className="warm-input" disabled title="Email cannot be changed" />
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Phone Number</label>
              <input type="tel" name="phoneNumber" defaultValue={initialData.phoneNumber} placeholder="+1 (555) 000-0000" className="warm-input" />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-bold text-foreground mb-2">Bio</label>
              <textarea name="bio" defaultValue={initialData.bio} placeholder="Tell us about yourself..." className="warm-input resize-none flex-1 min-h-[120px]" />
            </div>
          </div>
        </details>

        {/* Career Information */}
        <details className="warm-card flex flex-col h-full group" open>
          <summary className="p-6 font-bold text-lg text-foreground cursor-pointer list-none flex items-center justify-between [&::-webkit-details-marker]:hidden border-b-2 border-transparent group-open:border-border/50 transition-colors">
            Career Information
            <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          
          <div className="p-6 pt-4 space-y-4 flex-1">
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Career Stage</label>
              <select 
                name="careerStage" 
                value={careerStage} 
                onChange={(e) => setCareerStage(e.target.value)} 
                className="warm-input bg-card"
              >
                {Object.entries(CareerStage).map(([key, val]) => (
                  <option key={key} value={val}>{val}</option>
                ))}
              </select>
            </div>

            {isFresher ? (
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">Highest Qualification</label>
                <input type="text" name="highestQualification" defaultValue={initialData.highestQualification} placeholder="e.g., Bachelor's in Computer Science" className="warm-input" />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Most Recent Job Title <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input type="text" name="currentRole" defaultValue={initialData.currentRole} placeholder="e.g., Software Engineer" className="warm-input" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-2">Most Recent Company <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input type="text" name="company" defaultValue={initialData.company} placeholder="e.g., Google" className="warm-input" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-bold text-foreground mb-2">Target Roles</label>
              <input type="text" name="targetRoles" defaultValue={initialData.targetRoles?.join(", ")} placeholder="e.g., Senior Engineer, Product Manager" className="warm-input" />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-bold text-foreground mb-2">Skills</label>
              <textarea name="skills" defaultValue={initialData.skills?.map(s => s.name).join(", ")} placeholder="e.g., React, TypeScript, Node.js (comma-separated)" className="warm-input resize-none flex-1 min-h-[120px]" />
            </div>
          </div>
        </details>
      </div>

      {/* Save Button */}
      <div className="warm-card p-6 flex items-center justify-between sm:justify-end gap-4 mt-2">
        <button type="button" className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-muted text-foreground font-bold border-2 border-border hover:bg-muted/80 transition-all text-sm">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 text-black bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-emerald-700/20 disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
