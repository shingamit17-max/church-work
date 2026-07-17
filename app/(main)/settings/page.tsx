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
        <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-white/60">Manage your account preferences and security requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Display & Appearance */}
          <div className="warm-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Display & Appearance</h2>
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="font-medium text-white">Theme</h3>
                <p className="text-sm text-white/60">Toggle between light and dark mode.</p>
              </div>
              <div>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="warm-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">Security & Roles</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-medium text-white">Password Reset</h3>
                  <p className="text-sm text-white/60">Request a temporary password.</p>
                </div>
                <button 
                  onClick={() => handleRequest("PASSWORD_RESET")}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-colors"
                >
                  Request Reset
                </button>
              </div>

              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-medium text-white">Change Role</h3>
                  <p className="text-sm text-white/60">Switch to Mentor or Mentee.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRequest("ROLE_CHANGE", { targetRole: "mentee" })}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors"
                  >
                    To Mentee
                  </button>
                  <button 
                    onClick={() => handleRequest("ROLE_CHANGE", { targetRole: "mentor" })}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs transition-colors"
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
          <div className="warm-card p-6 min-h-[300px]">
            <h2 className="text-xl font-semibold text-white mb-4">Request History</h2>
            {requests.length === 0 ? (
              <p className="text-white/40 text-sm italic">No recent requests.</p>
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req._id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">
                        {req.type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-white/50 mt-1">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        req.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                        req.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
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
