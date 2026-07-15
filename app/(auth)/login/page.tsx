"use client";

import { useState } from "react";
import { login } from "@/app/actions/auth";
import NextLink from "next/link";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"mentee" | "mentor" | null>(null);

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
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left Side - Inspirational Message */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex-col justify-center items-center p-12">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-6 leading-tight">Grace Church</h1>
          <h2 className="text-3xl font-semibold mb-6 text-slate-200">Career Development Network</h2>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Tired of applying to endless jobs? Welcome to Grace Work, where we believe in your potential and your purpose.
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xl">
                ✨
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shape Your Future</h3>
                <p className="text-slate-400 text-sm">Get personalized mentorship from industry professionals who genuinely care.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xl">
                🙏
              </div>
              <div>
                <h3 className="font-semibold mb-2">Serve God&apos;s Kingdom</h3>
                <p className="text-slate-400 text-sm">Use your talents and gifts to make a meaningful impact in the world.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 text-xl">
                🤝
              </div>
              <div>
                <h3 className="font-semibold mb-2">Build Network</h3>
                <p className="text-slate-400 text-sm">Connect with like-minded professionals in a supportive community.</p>
              </div>
            </div>
          </div>

          <p className="text-slate-400 italic border-l-4 border-slate-500 pl-4">
            "Let your light shine before others, that they may see your good deeds and glorify your Father in heaven." - Matthew 5:16
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-slate-600 dark:text-slate-400">Sign in to your Grace Work account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("mentee")}
                className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${
                  selectedRole === "mentee"
                    ? "border-slate-700 dark:border-slate-300 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <div className="text-xl mb-1">🎓</div>
                <div>Job Seeker</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("mentor")}
                className={`p-4 rounded-lg border-2 transition-all text-center font-medium ${
                  selectedRole === "mentor"
                    ? "border-slate-700 dark:border-slate-300 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500"
                }`}
              >
                <div className="text-xl mb-1">👨‍💼</div>
                <div>Mentor</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 transition"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Password</label>
              <input
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-700 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <NextLink href="/register" className="font-semibold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-200">
              Create one here
            </NextLink>
          </p>
        </div>
      </div>
    </div>
  );
}
