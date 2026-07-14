'use client';

import NextLink from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface RoleSelectorProps {
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  mousePosition: { x: number; y: number };
}

export function RoleSelector({ onMouseMove, mousePosition }: RoleSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef1 = useRef<HTMLDivElement>(null);
  const glowRef2 = useRef<HTMLDivElement>(null);
  const glowRef3 = useRef<HTMLDivElement>(null);
  const glowRef4 = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Move glow effects
    if (glowRef1.current) {
      const offsetX = (x - rect.width / 2) * 0.15;
      const offsetY = (y - rect.height / 2) * 0.15;
      glowRef1.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    if (glowRef2.current) {
      const offsetX = (x - rect.width / 2) * -0.1;
      const offsetY = (y - rect.height / 2) * -0.1;
      glowRef2.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    if (glowRef3.current) {
      const offsetX = (x - rect.width / 2) * 0.12;
      const offsetY = (y - rect.height / 2) * -0.12;
      glowRef3.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    if (glowRef4.current) {
      const offsetX = (x - rect.width / 2) * -0.08;
      const offsetY = (y - rect.height / 2) * 0.08;
      glowRef4.current.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    if (contentRef.current) {
      const offsetX = (x - rect.width / 2) * 0.03;
      const offsetY = (y - rect.height / 2) * 0.03;
      contentRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden relative transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgb(15, 10, 40) 0%, rgb(5, 5, 15) 100%)',
      }}
    >
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
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up { animation: slideUp 0.8s ease-out; }
        
        @keyframes shimmer {
          0%, 100% { background-position: -1000px 0; }
          50% { background-position: 1000px 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.5), inset 0 0 30px rgba(99, 102, 241, 0.1); }
          50% { box-shadow: 0 0 60px rgba(99, 102, 241, 0.8), inset 0 0 40px rgba(99, 102, 241, 0.2); }
        }
        
        .role-card {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(20, 15, 50, 0.4) 100%);
          backdrop-filter: blur(10px);
        }
        
        .role-card:hover {
          border-color: rgba(99, 102, 241, 0.8);
          background: linear-gradient(135deg, rgba(40, 35, 90, 0.8) 0%, rgba(30, 25, 65, 0.6) 100%);
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.3), inset 0 0 30px rgba(99, 102, 241, 0.1);
        }
        
        .role-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .role-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }
        
        .role-button:hover::before {
          left: 100%;
        }
        
        .role-button:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 1) 0%, rgba(168, 85, 247, 1) 100%);
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(139, 92, 246, 0.6), 0 20px 40px rgba(99, 102, 241, 0.3);
        }
        
        .role-button:active {
          transform: scale(0.98);
        }
        
        .icon-wrapper {
          font-size: 48px;
          margin-bottom: 16px;
          transition: transform 0.3s ease;
        }
        
        .role-card:hover .icon-wrapper {
          transform: scale(1.2) rotate(5deg);
        }
      `}</style>

      {/* Background glow effects */}
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

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-6xl text-center space-y-16 animate-slide-up">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
            What brings you <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">here?</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto">
            Choose your path and begin your mentoring journey with Grace Church
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Job Seeker Card */}
          <div className="role-card rounded-2xl p-8 cursor-pointer group">
            <div className="flex flex-col items-center space-y-6">
              <div className="icon-wrapper">
                🎯
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">Job Seeker</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Find experienced mentors to guide your career, land better opportunities, and achieve your professional goals.
                </p>
              </div>
              <NextLink
                href="/register?role=mentee"
                className="role-button w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg mt-6"
              >
                Get Started
              </NextLink>
            </div>
          </div>

          {/* Mentor Card */}
          <div className="role-card rounded-2xl p-8 cursor-pointer group">
            <div className="flex flex-col items-center space-y-6">
              <div className="icon-wrapper">
                💼
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">Mentor</h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Share your expertise, guide emerging professionals, and make a meaningful impact in their careers.
                </p>
              </div>
              <NextLink
                href="/register?role=mentor"
                className="role-button w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg mt-6"
              >
                Become a Mentor
              </NextLink>
            </div>
          </div>
        </div>

        {/* Secondary Link */}
        <div className="pt-4 text-sm text-white/50 space-x-2">
          <span>Already have an account?</span>
          <NextLink href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
            Sign in
          </NextLink>
        </div>
      </div>
    </div>
  );
}
