"use client";

import { useState } from "react";
import { register } from "@/app/actions/auth";
import NextLink from "next/link";
import { UserRole } from "@/types";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await register(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        router.push("/onboarding");
      }
    } catch (err) {
      console.error(err);
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">Join Grace Mentor</h1>
        <p className="text-white/60 mb-8">Create your account to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">I want to join as a:</label>
            <div className="flex gap-4">
              <label className="flex-1 cursor-pointer border border-white/10 rounded-lg p-3 text-center hover:bg-white/5 has-checked:bg-indigo-600/30 has-checked:border-indigo-500 transition-colors">
                <input type="radio" name="role" value={UserRole.MENTEE} className="hidden" defaultChecked />
                Mentee (Job Seeker)
              </label>
              <label className="flex-1 cursor-pointer border border-white/10 rounded-lg p-3 text-center hover:bg-white/5 has-checked:bg-teal-600/30 has-checked:border-teal-500 transition-colors">
                <input type="radio" name="role" value={UserRole.MENTOR} className="hidden" />
                Mentor (Professional)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              name="name" 
              type="text" 
              required 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              minLength={6}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Already have an account? <NextLink href="/login" className="text-teal-400 hover:underline">Log in</NextLink>
        </p>
      </div>
    </div>
  );
}
