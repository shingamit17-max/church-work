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
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background text-foreground">
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <NextLink href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Grace Mentor" className="h-10 w-auto object-contain" />
            <span className="font-black text-xl tracking-tight">Grace Mentor</span>
          </NextLink>
        </div>

        {/* Card */}
        <div className="p-8 bg-card border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] rounded-none dark:border dark:rounded-2xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="mb-7">
            <h1 className="text-2xl font-black mb-1 text-foreground uppercase tracking-tight">
              Join Grace Mentor
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              Create your free account to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Fields */}
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">Full name</label>
              <input name="name" type="text" required className="warm-input" placeholder="Grace Smith" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">Email address</label>
              <input name="email" type="email" required className="warm-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-foreground">Grace Campus / Organization</label>
              <select 
                className="warm-input cursor-pointer bg-background" 
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
              <label className="block text-sm font-bold mb-2 text-foreground">Password</label>
              <input name="password" type="password" required minLength={6} className="warm-input" placeholder="••••••••" />
              <p className="text-xs mt-1.5 text-muted-foreground font-medium">Minimum 6 characters</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border-2 border-red-500 text-red-500 font-bold text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={isPending} className="btn-amber w-full mt-2">
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin inline mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Creating account…
                </>
              ) : "Create Account →"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6 font-medium text-muted-foreground">
          Already have an account?{" "}
          <NextLink href="/login" className="font-bold text-accent hover:underline">
            Sign in
          </NextLink>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
