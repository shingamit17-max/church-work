import NextLink from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[#0a0a0a] overflow-hidden relative">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">Perfect Mentor.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Grace Mentor connects ambitious professionals with industry experts. Get real guidance, overcome your specific pain points, and accelerate your career.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <NextLink 
            href="/register?role=mentee"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            Find a Mentor
          </NextLink>
          <NextLink 
            href="/register?role=mentor"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-all hover:scale-105 active:scale-95"
          >
            Become a Mentor
          </NextLink>
        </div>

        <div className="pt-12 text-sm text-white/40">
          Already have an account? <NextLink href="/login" className="text-teal-400 hover:underline">Sign in</NextLink>
        </div>
      </div>
    </div>
  );
}
