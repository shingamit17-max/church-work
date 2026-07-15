'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { setRole } from '@/app/actions/auth';

export function OnboardingRoleSelector() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSelectRole = async (role: UserRole) => {
    setIsPending(true);
    try {
      await setRole(role);
      router.push(`/onboarding/${role}`);
    } catch (err) {
      console.error(err);
      setIsPending(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen w-full transition-colors duration-500 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`}
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        
        .role-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
          border-color: rgba(148, 163, 184, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .role-card:hover {
          border-color: rgba(100, 116, 139, 0.6);
          background: linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%);
          box-shadow: 0 20px 40px rgba(71, 85, 105, 0.2), 0 0 0 1px rgba(100, 116, 139, 0.3);
          transform: translateY(-4px);
        }
        
        .btn-primary {
          position: relative;
          overflow: hidden;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, rgb(100, 116, 139) 0%, rgb(120, 136, 159) 100%);
          color: rgb(15, 23, 42);
          box-shadow: 0 4px 15px rgba(100, 116, 139, 0.3);
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, rgb(120, 136, 159) 0%, rgb(148, 163, 184) 100%);
          box-shadow: 0 8px 25px rgba(100, 116, 139, 0.4);
          transform: translateY(-2px);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .icon-wrapper {
          font-size: 3.5rem;
          line-height: 1;
          margin-bottom: 1.5rem;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .role-card:hover .icon-wrapper {
          transform: scale(1.15) translateY(-4px);
        }
      `}</style>

      <div className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-4xl mb-16 md:mb-20 animate-fade-in-down">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-white">
              Choose Your Path
            </h1>
            <p className="text-lg md:text-xl font-light text-slate-400">
              Select how you'd like to use Grace Mentor to continue onboarding.
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 md:gap-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="role-card rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center space-y-6">
              <div className="icon-wrapper animate-float">🎯</div>
              <div className="space-y-3 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Job Seeker</h2>
                <p className="text-sm md:text-base font-light leading-relaxed text-slate-400">
                  Find mentors to guide your career, unlock opportunities, and achieve your professional goals.
                </p>
              </div>
              <button
                disabled={isPending}
                onClick={() => handleSelectRole(UserRole.MENTEE)}
                className="btn-primary w-full py-3 px-6 rounded-lg mt-2 text-center"
              >
                I am a Mentee
              </button>
            </div>
          </div>

          <div className="role-card rounded-2xl p-8 md:p-10">
            <div className="flex flex-col items-center space-y-6">
              <div className="icon-wrapper animate-float" style={{ animationDelay: '0.3s' }}>💼</div>
              <div className="space-y-3 text-center">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Mentor</h2>
                <p className="text-sm md:text-base font-light leading-relaxed text-slate-400">
                  Share your expertise, guide aspiring professionals, and make a meaningful impact.
                </p>
              </div>
              <button
                disabled={isPending}
                onClick={() => handleSelectRole(UserRole.MENTOR)}
                className="btn-primary w-full py-3 px-6 rounded-lg mt-2 text-center"
              >
                I am a Mentor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
