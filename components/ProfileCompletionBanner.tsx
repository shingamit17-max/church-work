import Link from "next/link";
import { UserRole } from "@/types";

interface ProfileCompletionBannerProps {
  role?: UserRole;
}

export function ProfileCompletionBanner({ role }: ProfileCompletionBannerProps) {
  return (
    <div
      className="w-full bg-linear-to-r from-orange-500/20 to-rose-500/20 border-b border-orange-500/30 text-white px-4 py-3 flex items-center justify-between shadow-sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(to right, rgba(249,115,22,0.2), rgba(244,63,94,0.2))',
        borderBottom: '1px solid rgba(249,115,22,0.3)',
        color: 'white',
      }}
    >
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg
          className="w-5 h-5 text-orange-400 shrink-0"
          width="20"
          height="20"
          style={{ minWidth: '20px', width: '20px', height: '20px', flexShrink: 0, color: 'rgb(251,146,60)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm font-medium" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          Your profile is incomplete. You can browse read-only content, but must finish setting up as a {role || "user"} to unlock messaging and connections.
        </p>
      </div>
      <Link
        href="/onboarding"
        className="shrink-0 ml-4 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors"
        style={{
          flexShrink: 0,
          marginLeft: '1rem',
          padding: '0.375rem 1rem',
          background: 'rgb(249,115,22)',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 600,
          borderRadius: '9999px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Complete Profile
      </Link>
    </div>
  );
}
