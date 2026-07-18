"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function PostJobModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      salary: formData.get("salary") as string,
      description: formData.get("description") as string,
      skills: (formData.get("skills") as string).split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to post job");

      toast.success("Job posted successfully!");
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2 bg-[#f97316] text-white font-bold border-2 border-black shadow-[3px_3px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-all rounded-xl"
      >
        Post Job
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-card w-full max-w-xl rounded-2xl border-[3px] border-border shadow-[8px_8px_0px_var(--neo-border)] p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-foreground">Post a New Job</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-2xl font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Job Title</label>
                <input required name="title" className="warm-input" placeholder="e.g. Frontend Developer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Company</label>
                  <input required name="company" className="warm-input" placeholder="Your Company" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Location</label>
                  <input required name="location" className="warm-input" placeholder="Remote, or City" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Job Type</label>
                  <select name="type" className="warm-input bg-card">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1">Salary Range (Optional)</label>
                  <input name="salary" className="warm-input" placeholder="e.g. $100k - $120k" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Required Skills (Comma separated)</label>
                <input required name="skills" className="warm-input" placeholder="React, TypeScript, Node.js" />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-1">Description</label>
                <textarea required name="description" className="warm-input min-h-[120px]" placeholder="Job responsibilities and requirements..." />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2 rounded-xl font-bold text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-black text-white dark:bg-white dark:text-black font-bold border-2 border-border shadow-[2px_2px_0px_#f97316] rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50">
                  {isSubmitting ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
