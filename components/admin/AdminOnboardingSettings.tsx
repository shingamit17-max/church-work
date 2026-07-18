"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";

type CustomQuestion = {
  _id: string;
  title: string;
  type: "text" | "mcq" | "checkbox";
  options: string[];
  targetRole: "MENTEE" | "MENTOR" | "BOTH";
  isRequired: boolean;
  order: number;
};

export function AdminOnboardingSettings() {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // New question form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"text" | "mcq" | "checkbox">("text");
  const [newOptions, setNewOptions] = useState("");
  const [newTargetRole, setNewTargetRole] = useState<"MENTEE" | "MENTOR" | "BOTH">("BOTH");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/admin/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const payload = {
        title: newTitle,
        type: newType,
        targetRole: newTargetRole,
        options: (newType === "mcq" || newType === "checkbox") ? newOptions.split(",").map(s => s.trim()).filter(Boolean) : [],
        isRequired: true,
      };

      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Question added!");
        setNewTitle("");
        setNewOptions("");
        setIsAdding(false);
        fetchQuestions();
      } else {
        toast.error("Failed to add question");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Question deleted");
        fetchQuestions();
      }
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="neobrutal-box p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Onboarding Questions</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage custom dynamic questions for the onboarding flow</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_var(--neo-border)] transition-all dark:border-none dark:shadow-none dark:rounded-xl"
        >
          {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> Add Question</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="mb-8 p-4 bg-muted border-2 border-neo-border dark:border-none dark:rounded-xl">
          <h3 className="font-bold mb-4">Create New Question</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Question Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 border-2 border-neo-border dark:bg-card dark:border-border dark:rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target Role</label>
              <select
                value={newTargetRole}
                onChange={(e) => setNewTargetRole(e.target.value as any)}
                className="w-full p-2 border-2 border-neo-border dark:bg-card dark:border-border dark:rounded-md"
              >
                <option value="BOTH">Both Mentor & Mentee</option>
                <option value="MENTOR">Mentor Only</option>
                <option value="MENTEE">Mentee Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Question Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full p-2 border-2 border-neo-border dark:bg-card dark:border-border dark:rounded-md"
              >
                <option value="text">Short Text</option>
                <option value="mcq">Multiple Choice (Radio)</option>
                <option value="checkbox">Checkboxes (Multi-select)</option>
              </select>
            </div>
            {(newType === "mcq" || newType === "checkbox") && (
              <div>
                <label className="block text-sm font-medium mb-1">Options (comma separated)</label>
                <input
                  type="text"
                  value={newOptions}
                  onChange={(e) => setNewOptions(e.target.value)}
                  className="w-full p-2 border-2 border-neo-border dark:bg-card dark:border-border dark:rounded-md"
                  placeholder="e.g. Yes, No, Maybe"
                  required
                />
              </div>
            )}
          </div>
          <button type="submit" className="mt-4 bg-emerald-500 text-white px-4 py-2 font-bold border-2 border-emerald-700 shadow-[4px_4px_0px_0px_#047857] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#047857] transition-all dark:border-none dark:shadow-none dark:rounded-xl">
            Save Question
          </button>
        </form>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No custom questions added yet.</p>
        ) : (
          questions.map((q) => (
            <div key={q._id} className="flex items-center justify-between p-4 bg-card border-2 border-neo-border dark:border-border dark:rounded-xl">
              <div className="flex items-start gap-4">
                <GripVertical className="text-muted-foreground mt-1 cursor-grab" />
                <div>
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    {q.title}
                    <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full uppercase">{q.targetRole}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase">{q.type}</span>
                  </h4>
                  {(q.type === "mcq" || q.type === "checkbox") && (
                    <p className="text-xs text-muted-foreground mt-1">Options: {q.options.join(", ")}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(q._id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
