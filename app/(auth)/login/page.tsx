"use client";

import { useState } from "react";
import { login, forceSeedAccounts } from "@/app/actions/auth";
import NextLink from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [seedStatus, setSeedStatus] = useState("");
  
  // Controlled inputs for quick login auto-fill
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSeed = async () => {
    setSeedStatus("Seeding...");
    try {
      await forceSeedAccounts();
      setSeedStatus("Test accounts seeded successfully! You can now log in.");
    } catch (e) {
      setSeedStatus("Error seeding accounts.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await login(formData);
      if (res?.error) setError(res.error);
    } catch (err) {
      console.error(err);
    }
    setIsPending(false);
  };

  const handleQuickLoginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = e.target.value;
    if (role === "admin") {
      setEmail("admin@gracementor.com");
      setPassword("admin123"); // Replace with actual admin test credentials if different
    } else if (role === "mentor") {
      setEmail("mentor@gracementor.com");
      setPassword("mentor123");
    } else if (role === "mentee") {
      setEmail("mentee@gracementor.com");
      setPassword("mentee123");
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#1c1917", color: "#fafaf9" }}
    >
      {/* ── Left Panel – Brand ── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #1c1917 0%, #0c0a09 60%, #1a100a 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Ambient orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 480,
            height: 480,
            top: "10%",
            left: "30%",
            background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)",
            transform: "translate(-50%,-50%)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 300,
            height: 300,
            bottom: "15%",
            left: "60%",
            background: "radial-gradient(circle, rgba(244,63,94,0.06) 0%, transparent 70%)",
            transform: "translate(-50%,50%)",
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
            style={{
              background: "linear-gradient(135deg,#f59e0b,#d97706)",
              boxShadow: "0 4px 16px rgba(245,158,11,0.35)",
            }}
          >
            ✦
          </div>
          <span className="font-semibold text-lg tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Grace Mentor
          </span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 max-w-md">
          <h1
            className="font-light mb-6"
            style={{ fontSize: "clamp(2.5rem,4vw,3.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            Career guidance rooted in{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              faith &amp; community
            </span>
          </h1>

          <div className="space-y-5">
            {[
              { icon: "✦", title: "Purposeful mentorship", desc: "Get matched with professionals who share your values and want to see you thrive." },
              { icon: "🙏", title: "Faith-centred support", desc: "Prayer, encouragement, and accountability built into every mentoring relationship." },
              { icon: "🤝", title: "Real connections", desc: "Not just a job board — a community of people who genuinely care about your success." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0"
                  style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-sm mb-0.5" style={{ color: "#e7e5e4" }}>{item.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#57534e" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scripture */}
        <div
          className="relative z-10 text-sm italic leading-relaxed pl-4"
          style={{ borderLeft: "2px solid rgba(245,158,11,0.4)", color: "#78716c", maxWidth: "38rem" }}
        >
          &quot;Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.&quot; — Matthew 5:16
        </div>
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 4px 12px rgba(245,158,11,0.3)" }}
          >
            ✦
          </div>
          <span className="font-semibold" style={{ letterSpacing: "-0.02em" }}>Grace Mentor</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1.5" style={{ letterSpacing: "-0.02em" }}>
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: "#78716c" }}>
              Sign in to continue your journey
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all"
              style={{ background: "#fff", color: "#1c1917" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f5f5f4")}
              onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "#57534e" }}>or sign in with email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#d6d3d1" }}>
                Email address
              </label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="warm-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium" style={{ color: "#d6d3d1" }}>Password</label>
              </div>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="warm-input"
                placeholder="••••••••"
              />
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

            <button
              type="submit"
              disabled={isPending}
              className="btn-amber w-full"
              style={{ marginTop: "0.5rem" }}
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#78716c" }}>
            Don&apos;t have an account?{" "}
            <NextLink href="/register" style={{ color: "#fbbf24" }} className="font-medium hover:underline">
              Create one free
            </NextLink>
          </p>
          
          {/* Quick Login Dropdown for Demo purposes */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <label className="block text-xs font-medium mb-2 text-white/50 text-center uppercase tracking-wider">
              Quick Demo Login
            </label>
            <div className="relative">
              <select 
                onChange={handleQuickLoginChange}
                className="w-full px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer transition-colors text-center"
              >
                <option value="" className="bg-slate-900 text-white">Select a test account to auto-fill...</option>
                <option value="admin" className="bg-slate-900 text-white">Admin Account</option>
                <option value="mentor" className="bg-slate-900 text-white">Mentor Account</option>
                <option value="mentee" className="bg-slate-900 text-white">Mentee Account</option>
              </select>
              <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {/* Temporary Seed Button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSeed}
              className="text-xs text-amber-500 hover:text-amber-400 underline"
            >
              Click here to create/reset test accounts in the DB
            </button>
            {seedStatus && <p className="text-xs text-green-400 mt-2">{seedStatus}</p>}
          </div>

        </div>
      </div>
    </div>
  );
}
