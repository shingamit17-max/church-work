"use client";

import { useState, Suspense } from "react";
import { login } from "@/app/actions/auth";
import NextLink from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  
  const initialError = urlError === "AccessDenied" 
    ? "Access Denied: You do not have permission to sign in or an error occurred." 
    : urlError 
      ? `Sign in error: ${urlError}` 
      : null;

  const [internalError, setInternalError] = useState<string | null>(null);
  const error = internalError || initialError;

  const [isPending, setIsPending] = useState(false);
  
  // Controlled inputs for auto-fill
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setInternalError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await login(formData);
      if (res?.error) setInternalError(res.error);
    } catch (err) {
      console.error(err);
    }
    setIsPending(false);
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex relative overflow-hidden"
    >
      {/* Mobile-only background effects */}
      <div className="absolute inset-0 pointer-events-none lg:hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ top: "-10%", right: "-20%", background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ bottom: "-10%", left: "-20%", background: "radial-gradient(circle, rgba(244,63,94,0.05) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>
      {/* ── Left Panel – Brand ── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden bg-muted"
        style={{
          borderRight: "1px solid hsl(var(--border))",
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
          <NextLink href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Grace Mentor Logo" width={40} height={40} className="h-10 w-auto object-contain" />
            <span className="font-semibold text-xl" style={{ letterSpacing: "-0.02em" }}>Grace Mentor</span>
          </NextLink>
        </div>

        {/* Main copy */}
        <div className="relative z-10 max-w-md">
          <h1
            className="font-light mb-6"
            style={{ fontSize: "clamp(2.5rem,4vw,3.5rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            Career guidance rooted in{" "}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
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
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-base shrink-0 bg-amber-500/10 border border-amber-500/20"
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-sm mb-0.5 text-muted-foreground">{item.title}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scripture */}
        <div
          className="relative z-10 text-sm italic leading-relaxed pl-4 border-l-2 border-amber-500/40 text-muted-foreground max-w-[38rem]"
        >
          &quot;Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.&quot; — Matthew 5:16
        </div>
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="relative flex-1 flex flex-col justify-center items-center p-6 lg:p-12">
        {/* Mobile Header (Glassmorphism Pill) */}
        <div className="absolute top-6 w-full px-6 flex lg:hidden justify-center z-50">
          <div 
            className="flex items-center justify-between w-full max-w-sm px-4 py-3 rounded-full bg-background/50 backdrop-blur-xl border border-border shadow-xl"
          >
            <NextLink href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Grace Mentor Logo" width={28} height={28} className="h-7 w-auto object-contain" />
              <span className="font-semibold text-base" style={{ letterSpacing: "-0.02em" }}>Grace Mentor</span>
            </NextLink>
            
            {/* Profile Icon Placeholder */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
              <svg className="w-4 h-4 text-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1.5" style={{ letterSpacing: "-0.02em" }}>
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in to continue your journey
            </p>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all bg-card border border-border hover:bg-muted"
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
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or sign in with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
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
                <label className="text-sm font-medium text-muted-foreground">Password</label>
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
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
                <div className="p-8 sm:p-10 bg-card border border-border shadow-2xl rounded-2xl relative z-10 w-full max-w-sm animate-in fade-in zoom-in duration-200">
                  <h3 className="text-xl font-bold text-foreground mb-2 text-center">Login Error</h3>
                  <p className="text-foreground/60 mb-6 text-center">{error}</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setInternalError(null)}
                      className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-medium transition-colors"
                      type="button"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
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
          
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#1c1917", color: "#fafaf9" }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
