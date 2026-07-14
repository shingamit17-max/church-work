'use client';

import NextLink from 'next/link';
import { useRef, useEffect, useState } from 'react';

interface RoleSelectorProps {
  isDark: boolean;
  onThemeToggle: () => void;
}

export function RoleSelector({ isDark, onThemeToggle }: RoleSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full transition-colors duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
      }`}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-fade-in-up { 
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-down { 
          animation: fadeInDown 0.5s ease-out forwards;
        }
        
        .animate-slide-in-right { 
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Card Styling */
        .role-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid;
        }
        
        /* Light mode card */
        .role-card.light {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
          border-color: rgba(100, 116, 139, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        
        .role-card.light:hover {
          border-color: rgba(79, 70, 229, 0.4);
          background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%);
          box-shadow: 0 20px 40px rgba(79, 70, 229, 0.15), 0 0 0 1px rgba(79, 70, 229, 0.1);
          transform: translateY(-4px);
        }
        
        /* Dark mode card */
        .role-card.dark {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
          border-color: rgba(148, 163, 184, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .role-card.dark:hover {
          border-color: rgba(129, 140, 248, 0.4);
          background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
          box-shadow: 0 20px 40px rgba(129, 140, 248, 0.2), 0 0 0 1px rgba(129, 140, 248, 0.15);
          transform: translateY(-4px);
        }
        
        /* Button styling */
        .btn-primary {
          position: relative;
          overflow: hidden;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: none;
          cursor: pointer;
        }
        
        .btn-primary.light {
          background: linear-gradient(135deg, rgb(79, 70, 229) 0%, rgb(99, 102, 241) 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
        }
        
        .btn-primary.light:hover {
          background: linear-gradient(135deg, rgb(67, 56, 202) 0%, rgb(88, 91, 228) 100%);
          box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
          transform: translateY(-2px);
        }
        
        .btn-primary.light:active {
          transform: translateY(0px);
        }
        
        .btn-primary.dark {
          background: linear-gradient(135deg, rgb(129, 140, 248) 0%, rgb(165, 142, 251) 100%);
          color: rgb(30, 41, 59);
          box-shadow: 0 4px 15px rgba(129, 140, 248, 0.3);
        }
        
        .btn-primary.dark:hover {
          background: linear-gradient(135deg, rgb(110, 120, 230) 0%, rgb(145, 120, 240) 100%);
          box-shadow: 0 8px 25px rgba(129, 140, 248, 0.4);
          transform: translateY(-2px);
        }
        
        .btn-primary.dark:active {
          transform: translateY(0px);
        }
        
        /* Icon wrapper */
        .icon-wrapper {
          font-size: 3.5rem;
          line-height: 1;
          margin-bottom: 1.5rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .role-card:hover .icon-wrapper {
          transform: scale(1.15) translateY(-4px);
        }
        
        /* Theme toggle button */
        .theme-toggle {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 50;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 1px solid;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .theme-toggle.light {
          border-color: rgba(100, 116, 139, 0.3);
          color: rgb(30, 41, 59);
        }
        
        .theme-toggle.light:hover {
          background: rgba(79, 70, 229, 0.1);
          border-color: rgba(79, 70, 229, 0.3);
          transform: scale(1.1) rotate(20deg);
        }
        
        .theme-toggle.dark {
          border-color: rgba(148, 163, 184, 0.3);
          color: rgb(226, 232, 240);
        }
        
        .theme-toggle.dark:hover {
          background: rgba(129, 140, 248, 0.15);
          border-color: rgba(129, 140, 248, 0.4);
          transform: scale(1.1) rotate(-20deg);
        }
      `}</style>

      {/* Theme Toggle Button */}
      <button
        onClick={onThemeToggle}
        className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      {/* Content Container */}
      <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-16 md:mb-20 animate-fade-in-down">
          <div className="space-y-6 text-center">
            <h1 className={`text-4xl md:text-6xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Begin Your Journey
            </h1>
            <p className={`text-lg md:text-xl font-light ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Choose your path with Grace Church mentorship
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 md:gap-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Job Seeker Card */}
          <div className={`role-card ${isDark ? 'dark' : 'light'} rounded-2xl p-8 md:p-10`}>
            <div className="flex flex-col items-center space-y-6">
              <div className="icon-wrapper animate-float">
                🎯
              </div>
              <div className="space-y-3 text-center">
                <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Job Seeker
                </h2>
                <p className={`text-sm md:text-base font-light leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Connect with experienced mentors to guide your career, unlock opportunities, and achieve your professional goals.
                </p>
              </div>
              <NextLink
                href="/register?role=mentee"
                className={`btn-primary ${isDark ? 'dark' : 'light'} w-full py-3 px-6 rounded-lg mt-2 text-center`}
              >
                Get Started
              </NextLink>
            </div>
          </div>

          {/* Mentor Card */}
          <div className={`role-card ${isDark ? 'dark' : 'light'} rounded-2xl p-8 md:p-10`}>
            <div className="flex flex-col items-center space-y-6">
              <div className="icon-wrapper animate-float" style={{ animationDelay: '0.3s' }}>
                💼
              </div>
              <div className="space-y-3 text-center">
                <h2 className={`text-2xl md:text-3xl font-semibold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Mentor
                </h2>
                <p className={`text-sm md:text-base font-light leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Share your expertise, guide aspiring professionals, and make a meaningful impact on their career journey.
                </p>
              </div>
              <NextLink
                href="/register?role=mentor"
                className={`btn-primary ${isDark ? 'dark' : 'light'} w-full py-3 px-6 rounded-lg mt-2 text-center`}
              >
                Become a Mentor
              </NextLink>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className={`mt-16 md:mt-20 text-center text-sm font-light ${
          isDark ? 'text-slate-500' : 'text-slate-600'
        }`}>
          Already have an account?{' '}
          <NextLink
            href="/login"
            className={`font-semibold transition-colors ${
              isDark
                ? 'text-indigo-400 hover:text-indigo-300'
                : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            Sign in
          </NextLink>
        </div>
      </div>
    </div>
  );
}
