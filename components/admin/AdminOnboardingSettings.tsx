"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, CheckCircle2, Lock, Edit2, X } from "lucide-react";
import { MENTEE_DEFAULT_STEPS, MENTOR_DEFAULT_STEPS } from "@/lib/onboarding-defaults";

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
  const [activeRole, setActiveRole] = useState<"MENTEE" | "MENTOR" | "BOTH">("BOTH");
  const [newTargetRole, setNewTargetRole] = useState<"MENTEE" | "MENTOR" | "BOTH">("BOTH");

  // Config overrides
  const [menteeOverrides, setMenteeOverrides] = useState<Record<string, any>>({});
  const [mentorOverrides, setMentorOverrides] = useState<Record<string, any>>({});
  const [editingBuiltIn, setEditingBuiltIn] = useState<{ role: "MENTEE" | "MENTOR", stepId: string } | null>(null);
  const [builtInEditDraft, setBuiltInEditDraft] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, cRes] = await Promise.all([
        fetch("/api/admin/questions"),
        fetch("/api/admin/config?keys[]=onboarding_mentee_steps&keys[]=onboarding_mentor_steps")
      ]);
      const [qData, cData] = await Promise.all([qRes.json(), cRes.json()]);
      setQuestions(qData);
      if (cData.onboarding_mentee_steps) setMenteeOverrides(cData.onboarding_mentee_steps);
      if (cData.onboarding_mentor_steps) setMentorOverrides(cData.onboarding_mentor_steps);
    } catch (err) {
      toast.error("Failed to load settings");
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
        fetchData();
      } else {
        toast.error("Failed to add question");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleSaveBuiltIn = async () => {
    if (!editingBuiltIn || !builtInEditDraft) return;
    
    const roleKey = editingBuiltIn.role === "MENTEE" ? "onboarding_mentee_steps" : "onboarding_mentor_steps";
    const currentOverrides = editingBuiltIn.role === "MENTEE" ? menteeOverrides : mentorOverrides;
    const newOverrides = { ...currentOverrides, [editingBuiltIn.stepId]: builtInEditDraft };

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: roleKey, value: newOverrides }),
      });
      if (res.ok) {
        toast.success("Saved successfully");
        if (editingBuiltIn.role === "MENTEE") setMenteeOverrides(newOverrides);
        else setMentorOverrides(newOverrides);
        setEditingBuiltIn(null);
      }
    } catch (e) {
      toast.error("Failed to save changes");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Question deleted");
        fetchData();
      }
    } catch (err) {
      toast.error("Failed to delete question");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="neobrutal-box p-6 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">Onboarding Questions</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage custom dynamic questions for the onboarding flow</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-muted p-1 rounded-xl border-2 border-neo-border dark:border-none">
            {(["BOTH", "MENTEE", "MENTOR"] as const).map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActiveRole(role);
                  setNewTargetRole(role);
                }}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeRole === role
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === "BOTH" ? "All / Both" : role}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_var(--neo-border)] transition-all dark:border-none dark:shadow-none dark:rounded-xl whitespace-nowrap"
          >
            {isAdding ? "Cancel" : <><Plus className="w-4 h-4" /> Add Question</>}
          </button>
        </div>
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

      <div className="space-y-8">
        
        {/* Built-in Steps */}
        <div className="space-y-6">
          {(activeRole === "BOTH" || activeRole === "MENTEE") && (
            <div>
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-3">Built-in Mentee Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MENTEE_DEFAULT_STEPS.map((s) => {
                  const override = menteeOverrides[s.id] || {};
                  const title = override.title || s.title;
                  const hint = override.hint || s.hint;
                  return (
                    <div key={s.id} className="flex justify-between items-start p-3 bg-muted/30 border border-border rounded-xl group transition-all hover:border-primary/50">
                      <div className="flex gap-3 items-start">
                        <div className="mt-0.5"><Lock className="w-4 h-4 text-muted-foreground" /></div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingBuiltIn({ role: "MENTEE", stepId: s.id });
                          setBuiltInEditDraft(override);
                        }}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(activeRole === "BOTH" || activeRole === "MENTOR") && (
            <div>
              <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-3">Built-in Mentor Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MENTOR_DEFAULT_STEPS.map((s) => {
                  const override = mentorOverrides[s.id] || {};
                  const title = override.title || s.title;
                  const hint = override.hint || s.hint;
                  return (
                    <div key={s.id} className="flex justify-between items-start p-3 bg-muted/30 border border-border rounded-xl group transition-all hover:border-primary/50">
                      <div className="flex gap-3 items-start">
                        <div className="mt-0.5"><Lock className="w-4 h-4 text-muted-foreground" /></div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setEditingBuiltIn({ role: "MENTOR", stepId: s.id });
                          setBuiltInEditDraft(override);
                        }}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <hr className="border-border" />

        {/* Custom Questions */}
        <div>
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4">Custom Questions</h3>
          <div className="space-y-4">
            {questions.filter(q => q.targetRole === activeRole).length === 0 ? (
              <p className="text-muted-foreground text-sm p-4 bg-muted/50 rounded-xl border border-border">
                No custom questions found for the {activeRole} role.
              </p>
            ) : (
              questions
                .filter(q => q.targetRole === activeRole)
                .map((q) => (
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
      </div>

      {/* Built-in Editor Modal */}
      {editingBuiltIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg">Edit Built-in Question</h3>
              <button onClick={() => setEditingBuiltIn(null)} className="p-1 hover:bg-muted rounded-md"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {(() => {
                const defaults = editingBuiltIn.role === "MENTEE" ? MENTEE_DEFAULT_STEPS : MENTOR_DEFAULT_STEPS;
                const stepDefault = defaults.find(s => s.id === editingBuiltIn.stepId);
                if (!stepDefault) return null;
                
                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Title</label>
                      <input 
                        type="text" 
                        value={builtInEditDraft?.title ?? stepDefault.title} 
                        onChange={e => setBuiltInEditDraft({ ...builtInEditDraft, title: e.target.value })}
                        className="w-full p-2 border-2 border-neo-border dark:bg-black/20 dark:border-border dark:rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-muted-foreground">Hint / Description</label>
                      <input 
                        type="text" 
                        value={builtInEditDraft?.hint ?? stepDefault.hint} 
                        onChange={e => setBuiltInEditDraft({ ...builtInEditDraft, hint: e.target.value })}
                        className="w-full p-2 border-2 border-neo-border dark:bg-black/20 dark:border-border dark:rounded-md"
                      />
                    </div>
                    {stepDefault.options && (
                      <div className="pt-4 border-t border-border">
                        <label className="block text-sm font-bold mb-3 text-muted-foreground">Option Labels</label>
                        <div className="space-y-3">
                          {stepDefault.options.map(opt => (
                            <div key={opt.value} className="flex flex-col gap-1">
                              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded w-fit">{opt.value}</span>
                              <input 
                                type="text"
                                value={builtInEditDraft?.options?.[opt.value]?.label ?? opt.label}
                                onChange={e => {
                                  const newOptions = { ...builtInEditDraft?.options };
                                  newOptions[opt.value] = { ...newOptions[opt.value], label: e.target.value };
                                  setBuiltInEditDraft({ ...builtInEditDraft, options: newOptions });
                                }}
                                className="w-full p-2 border-2 border-neo-border dark:bg-black/20 dark:border-border dark:rounded-md text-sm"
                                placeholder={`Default: ${opt.label}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
              <button onClick={() => setEditingBuiltIn(null)} className="px-4 py-2 text-sm font-medium hover:bg-muted border border-border rounded-lg transition-colors">Cancel</button>
              <button onClick={handleSaveBuiltIn} className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg shadow-[2px_2px_0px_0px_var(--neo-border)] hover:translate-y-0.5 hover:shadow-none transition-all dark:border-none dark:shadow-none">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
