"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import NextLink from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
    }
    setIsPending(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-teal-400">Welcome Back</h1>
        <p className="text-white/60 mb-8">Sign in to Grace Mentor to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isPending ? "Signing in..." : "Sign In with Email"}
          </button>
        </form>



        <p className="mt-8 text-center text-sm text-white/60">
          Don&apos;t have an account? <NextLink href="/register" className="text-teal-400 hover:underline">Register here</NextLink>
        </p>
      </div>
    </div>
  );
}
