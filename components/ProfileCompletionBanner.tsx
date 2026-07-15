import Link from "next/link";
import { UserRole } from "@/types";

interface ProfileCompletionBannerProps {
  role?: UserRole;
}

export function ProfileCompletionBanner({ role }: ProfileCompletionBannerProps) {
  return (
    <div className="w-full bg-gradient-to-r from-orange-500/20 to-rose-500/20 border-b border-orange-500/30 text-white px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-orange-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm md:text-base font-medium">
          Your profile is incomplete. You can browse read-only content, but must finish setting up to unlock messaging and connections.
        </p>
      </div>
      <Link 
        href="/onboarding"
        className="shrink-0 ml-4 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors"
      >
        Complete Profile
      </Link>
    </div>
  );
}
