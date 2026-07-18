"use client";

import { useState, useEffect } from "react";
import { submitAdminRequest, getUserRequests } from "@/app/actions/settings";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function SettingsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const res = await getUserRequests();
    if (res.requests) setRequests(res.requests);
  }

  async function handleRequest(type: "PASSWORD_RESET" | "ROLE_CHANGE" | "ACCOUNT_DELETION", details?: any) {
    if (isPending) return;
    setIsPending(true);
    const res = await submitAdminRequest(type, details);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Request submitted successfully to Admin");
      await fetchRequests();
    }
    setIsPending(false);
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Display & Appearance */}
          <div className="neobrutal-box p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Display & Appearance</h2>
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-medium text-foreground">Theme</h3>
                <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
              </div>
              <div>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="neobrutal-box p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Security & Roles</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-neo-border">
                <div>
                  <h3 className="font-medium text-foreground">Password Reset</h3>
                  <p className="text-sm text-muted-foreground">Request a temporary password.</p>
                </div>
                <button 
                  onClick={() => handleRequest("PASSWORD_RESET")}
                  disabled={isPending}
                  className="px-4 py-2 bg-foreground text-background font-bold border-2 border-neo-border shadow-[2px_2px_0px_var(--neo-border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all text-sm"
                >
                  Request Reset
                </button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-neo-border">
                <div>
                  <h3 className="font-medium text-foreground">Change Role</h3>
                  <p className="text-sm text-muted-foreground">Switch to Mentor or Mentee.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRequest("ROLE_CHANGE", { targetRole: "mentee" })}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-background text-foreground font-bold border-2 border-neo-border hover:bg-accent hover:text-white transition-colors text-xs"
                  >
                    To Mentee
                  </button>
                  <button 
                    onClick={() => handleRequest("ROLE_CHANGE", { targetRole: "mentor" })}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-background text-foreground font-bold border-2 border-neo-border hover:bg-accent hover:text-white transition-colors text-xs"
                  >
                    To Mentor
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h3 className="font-medium text-red-400">Delete Account</h3>
                  <p className="text-sm text-red-400/60">Request permanent deletion.</p>
                </div>
                <button 
                  onClick={() => {
                    if(confirm("Are you sure you want to request account deletion?")) {
                      handleRequest("ACCOUNT_DELETION");
                    }
                  }}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium text-sm transition-colors"
                >
                  Request Deletion
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Requests Log */}
          <div className="neobrutal-box p-6 min-h-[300px]">
            <h2 className="text-xl font-semibold text-foreground mb-4">Request History</h2>
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">No recent requests.</p>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req._id} className="p-4 border-2 border-neo-border flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground text-sm">
                        {req.type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 text-xs font-bold border-2 border-neo-border ${
                        req.status === 'PENDING' ? 'bg-amber-400 text-black' :
                        req.status === 'APPROVED' ? 'bg-green-400 text-black' :
                        'bg-red-400 text-black'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
