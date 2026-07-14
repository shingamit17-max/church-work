'use client';

import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef1 = useRef<HTMLDivElement>(null);
  const glowRef2 = useRef<HTMLDivElement>(null);
  const glowRef3 = useRef<HTMLDivElement>(null);
  const glowRef4 = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      // Move glow effect 1
      if (glowRef1.current) {
        const offsetX = (x - rect.width / 2) * 0.15;
        const offsetY = (y - rect.height / 2) * 0.15;
        glowRef1.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      }

      // Move glow effect 2
      if (glowRef2.current) {
        const offsetX = (x - rect.width / 2) * -0.1;
        const offsetY = (y - rect.height / 2) * -0.1;
        glowRef2.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      }

      // Move glow effect 3
      if (glowRef3.current) {
        const offsetX = (x - rect.width / 2) * 0.12;
        const offsetY = (y - rect.height / 2) * -0.12;
        glowRef3.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      }

      // Move glow effect 4
      if (glowRef4.current) {
        const offsetX = (x - rect.width / 2) * -0.08;
        const offsetY = (y - rect.height / 2) * 0.08;
        glowRef4.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
      }

      // Subtle text parallax
      if (textRef.current) {
        const offsetX = (x - rect.width / 2) * 0.03;
        const offsetY = (y - rect.height / 2) * 0.03;
        textRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgb(15, 10, 40) 0%, rgb(5, 5, 15) 100%)',
      }}
    >
      {/* Animated gradient background mesh */}
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-40px, 40px); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -40px); }
        }
        @keyframes drift4 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(35px, 25px); }
        }
        .drift1 { animation: drift1 12s ease-in-out infinite; }
        .drift2 { animation: drift2 14s ease-in-out infinite; }
        .drift3 { animation: drift3 16s ease-in-out infinite; }
        .drift4 { animation: drift4 18s ease-in-out infinite; }
      `}</style>

      {/* Background glow effects with animations */}
      <div 
        ref={glowRef1}
        className="drift1 absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none transition-transform duration-100"
      />
      <div 
        ref={glowRef2}
        className="drift2 absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/12 rounded-full blur-[100px] pointer-events-none transition-transform duration-100"
      />
      <div 
        ref={glowRef3}
        className="drift3 absolute top-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-100"
      />
      <div 
        ref={glowRef4}
        className="drift4 absolute bottom-1/3 left-1/3 w-72 h-72 bg-pink-500/8 rounded-full blur-[100px] pointer-events-none transition-transform duration-100"
      />
      
      {/* Additional ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      <div ref={textRef} className="relative z-10 max-w-3xl text-center space-y-8 transition-transform duration-100">
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
