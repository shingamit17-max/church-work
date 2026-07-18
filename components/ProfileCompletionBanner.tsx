import Link from "next/link";
import { UserRole } from "@/types";

interface ProfileCompletionBannerProps {
  role?: UserRole;
}

export function ProfileCompletionBanner({ role }: ProfileCompletionBannerProps) {
  return (
    <div
      className="w-full bg-amber-400 border-b-[3px] border-black text-black px-4 py-3 flex items-center justify-between"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#fbbf24', // bg-amber-400
        borderBottom: '3px solid #000',
        color: '#000',
      }}
    >
      <div className="flex items-center gap-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg
          className="w-5 h-5 text-black shrink-0"
          width="20"
          height="20"
          style={{ minWidth: '20px', width: '20px', height: '20px', flexShrink: 0, color: '#000' }}
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
        href={role === "mentor" ? "/dashboard/mentor/profile" : "/dashboard/mentee/profile"}
        className="shrink-0 ml-4 px-4 py-1.5 bg-black hover:-translate-y-0.5 active:translate-y-0 text-white text-sm font-bold border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] transition-all"
        style={{
          flexShrink: 0,
          marginLeft: '1rem',
          padding: '0.375rem 1rem',
          background: '#000',
          color: 'white',
          fontSize: '0.875rem',
          fontWeight: 700,
          borderRadius: '0.75rem',
          border: '2px solid #000',
          boxShadow: '2px 2px 0px #000',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
        }}
      >
        Complete Profile
      </Link>
    </div>
  );
}
