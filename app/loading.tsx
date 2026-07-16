export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-warm-900 backdrop-blur-sm">
      <div className="relative flex flex-col items-center justify-center">
        {/* Glowing backdrop */}
        <div className="absolute w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Spinner ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400 border-r-rose-400 animate-spin" />
        </div>
        
        {/* Loading text */}
        <div className="mt-8 text-sm font-medium tracking-widest text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-rose-400 uppercase animate-pulse">
          Loading
        </div>
      </div>
    </div>
  );
}
