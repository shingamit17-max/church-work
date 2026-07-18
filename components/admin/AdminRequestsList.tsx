"use client";

import { useState } from "react";
import { processAdminRequest } from "@/app/actions/settings";
import { toast } from "sonner";

interface AdminRequestsListProps {
  initialRequests: any[];
}

export function AdminRequestsList({ initialRequests }: AdminRequestsListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  async function handleAction(requestId: string, action: "APPROVED" | "REJECTED") {
    setIsProcessing(requestId);
    const res = await processAdminRequest(requestId, action);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Request ${action.toLowerCase()} successfully`);
      
      if (res.result?.tempPassword) {
        // We could show a modal, but a permanent toast or alert is easier for now
        toast.info(`Temp Password Generated: ${res.result.tempPassword}`, { duration: 10000 });
        alert(`IMPORTANT: Password for user has been reset to: ${res.result.tempPassword}\n\nPlease copy this and provide it to the user.`);
      }

      // Remove from list
      setRequests(prev => prev.filter(r => r._id !== requestId));
    }
    setIsProcessing(null);
  }

  if (requests.length === 0) return null;

  return (
    <div className="neobrutal-box p-6 mt-8">
      <h2 className="text-xl font-bold text-foreground mb-6">Pending User Requests</h2>
      
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req._id} className="p-4 neobrutal-box bg-foreground/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-400">
                  {req.type.replace("_", " ")}
                </span>
                <span className="text-sm text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="font-medium text-foreground">{req.user?.name || "Unknown User"} <span className="text-muted-foreground font-normal">({req.user?.email})</span></p>
              
              {req.type === "ROLE_CHANGE" && req.details?.targetRole && (
                <p className="text-sm text-muted-foreground mt-1">
                  Wants to switch to: <strong className="text-foreground capitalize">{req.details.targetRole}</strong>
                </p>
              )}
              {req.type === "ACCOUNT_DELETION" && (
                <p className="text-sm text-red-400 mt-1">
                  Requesting permanent account deletion.
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction(req._id, "REJECTED")}
                disabled={isProcessing === req._id}
                className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-foreground/5 text-sm font-medium transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction(req._id, "APPROVED")}
                disabled={isProcessing === req._id}
                className="px-4 py-2 rounded-lg bg-linear-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-black text-sm font-semibold transition-all disabled:opacity-50"
              >
                {isProcessing === req._id ? "Processing..." : "Approve"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
