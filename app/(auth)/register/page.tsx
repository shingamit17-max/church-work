"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import NextLink from "next/link";
import { UserRole } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "NoAccountFound" 
      ? "No account found with this email. Please register below." 
      : null
  );
  const [isPending, setIsPending] = useState(false);
  const [campusSelect, setCampusSelect] = useState("");
  const [customCampus, setCustomCampus] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await register(formData);
      if (res?.error) setError(res.error);
      else if (res?.success) router.push("/onboarding");
    } catch (err) {
      console.error(err);
    }
    setIsPending(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center p-6"
      style={{ background: "#1c1917", color: "#fafaf9" }}
    >
      {/* Ambient orb */}
      <div
        className="fixed pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <NextLink href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Grace Mentor" className="h-10 w-auto object-contain" />
            <span className="font-semibold text-lg" style={{ letterSpacing: "-0.02em" }}>Grace Mentor</span>
          </NextLink>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-2xl"
          style={{
            background: "rgba(41,37,36,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-semibold mb-1" style={{ letterSpacing: "-0.02em" }}>
              Join Grace Mentor
            </h1>
            <p className="text-sm" style={{ color: "#78716c" }}>
              Create your free account to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">


            {/* Fields */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#d6d3d1" }}>Full name</label>
              <input name="name" type="text" required className="warm-input" placeholder="Grace Smith" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#d6d3d1" }}>Email address</label>
              <input name="email" type="email" required className="warm-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#d6d3d1" }}>Grace Campus / Organization</label>
              <select 
                className="warm-input warm-select cursor-pointer" 
                value={campusSelect} 
                onChange={(e) => {
                  setCampusSelect(e.target.value);
                  if (e.target.value !== "Other") setCustomCampus("");
                }}
              >
                <option value="">Select Campus...</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="East">East</option>
                <option value="Airport">Airport</option>
                <option value="Old High Court">Old High Court</option>
                <option value="Other">Other</option>
              </select>
              
              {campusSelect === "Other" && (
                <div className="mt-3">
                  <input 
                    type="text" 
                    className="warm-input" 
                    placeholder="Please specify your campus or organization" 
                    value={customCampus}
                    onChange={(e) => setCustomCampus(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <input 
                type="hidden" 
                name="churchOrganization" 
                value={campusSelect === "Other" ? customCampus : campusSelect} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#d6d3d1" }}>Password</label>
              <input name="password" type="password" required minLength={6} className="warm-input" placeholder="••••••••" />
              <p className="text-xs mt-1.5" style={{ color: "#57534e" }}>Minimum 6 characters</p>
            </div>

            {error && (
              <div
                className="p-3 rounded-xl text-sm"
                style={{
                  background: "rgba(244,63,94,0.1)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  color: "#fb7185",
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={isPending} className="btn-amber w-full" style={{ marginTop: "0.25rem" }}>
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account…
                </>
              ) : "Create Account →"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "#57534e" }}>
          Already have an account?{" "}
          <NextLink href="/login" style={{ color: "#fbbf24" }} className="font-medium hover:underline">
            Sign in
          </NextLink>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-warm-900 text-white">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
