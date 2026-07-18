"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ProfileReminderToast({ isProfileIncomplete, role }: { isProfileIncomplete: boolean; role: string }) {
  const router = useRouter();

  useEffect(() => {
    if (isProfileIncomplete) {
      // Small delay ensures Toaster component in root layout has mounted
      const timer = setTimeout(() => {
        toast.warning("Profile Incomplete", {
          description: `Please finish setting up your ${role} profile to unlock messaging, events, and networking!`,
          duration: 10000,
          action: {
            label: "Complete Now",
            onClick: () => {
              router.push(role === "mentor" ? "/dashboard/mentor/profile" : "/dashboard/mentee/profile");
            }
          }
        });
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isProfileIncomplete, role, router]);

  return null;
}
