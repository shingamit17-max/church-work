"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
}

export default function BackButton({ label = "Back", fallbackUrl = "/" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button 
      onClick={() => {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push(fallbackUrl);
        }
      }}
      className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors py-2 group mb-6"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="group-hover:-translate-x-1 transition-transform"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      {label}
    </button>
  );
}
