'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types';
import { setRole } from '@/app/actions/auth';

const ROLES = [
  {
    role: UserRole.MENTEE,
    icon: '🎯',
    label: 'Job Seeker',
    sublabel: 'I want mentorship',
    description: 'Find mentors to guide your career, unlock opportunities, and achieve your professional goals with faith-rooted support.',
    cta: 'I am a Mentee',
    accentColor: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.1)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    role: UserRole.MENTOR,
    icon: '💼',
    label: 'Mentor',
    sublabel: 'I want to give back',
    description: 'Share your expertise, guide aspiring professionals, and make a meaningful Kingdom impact in people\'s careers.',
    cta: 'I am a Mentor',
    accentColor: '#4ade80',
    accentBg: 'rgba(74,222,128,0.1)',
    accentBorder: 'rgba(74,222,128,0.2)',
  },
];

export function OnboardingRoleSelector() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [hovered, setHovered] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => { 
    const t = setTimeout(() => setIsVisible(true), 0);
    return () => clearTimeout(t);
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
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-16"
      style={{ background: '#1c1917', color: '#fafaf9' }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', width: 500, height: 500, top: '20%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, bottom: '10%', right: '10%', background: 'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%)' }} />
      </div>

      <div
        className="relative z-10 w-full max-w-3xl transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)', fontSize: '0.875rem' }}
            >
              ✦
            </div>
            <span className="font-semibold" style={{ letterSpacing: '-0.02em' }}>Grace Mentor</span>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light mb-3" style={{ letterSpacing: '-0.03em' }}>
            Choose your path
          </h1>
          <p className="text-base" style={{ color: '#78716c' }}>
            How would you like to use Grace Mentor?
          </p>
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {ROLES.map((r) => (
            <button
              key={r.role}
              disabled={isPending}
              onClick={() => handleSelectRole(r.role)}
              onMouseEnter={() => setHovered(r.role)}
              onMouseLeave={() => setHovered(null)}
              className="w-full text-left p-8 rounded-2xl transition-all duration-300 relative overflow-hidden"
              style={{
                background: hovered === r.role ? `${r.accentBg}` : 'rgba(41,37,36,0.7)',
                border: `1px solid ${hovered === r.role ? r.accentBorder : 'rgba(255,255,255,0.07)'}`,
                transform: hovered === r.role ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hovered === r.role ? `0 20px 40px rgba(0,0,0,0.3)` : 'none',
              }}
            >
              {/* Ambient */}
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle, ${r.accentBg} 0%, transparent 70%)`,
                  filter: 'blur(16px)',
                  transform: 'translate(40%,-40%)',
                  opacity: hovered === r.role ? 1 : 0,
                }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-all duration-300"
                  style={{
                    background: hovered === r.role ? r.accentBg : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${hovered === r.role ? r.accentBorder : 'rgba(255,255,255,0.08)'}`,
                    transform: hovered === r.role ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {r.icon}
                </div>

                {/* Label */}
                <div className="mb-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: r.accentBg, color: r.accentColor, border: `1px solid ${r.accentBorder}` }}>
                    {r.sublabel}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold mb-3" style={{ color: '#fafaf9', letterSpacing: '-0.02em' }}>
                  {r.label}
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#78716c' }}>{r.description}</p>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-sm font-semibold text-center transition-all duration-300"
                  style={{
                    background: hovered === r.role ? `linear-gradient(135deg, ${r.accentColor}, ${r.accentColor}cc)` : 'rgba(255,255,255,0.06)',
                    color: hovered === r.role ? '#0c0a09' : '#a8a29e',
                    border: `1px solid ${hovered === r.role ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {isPending ? 'Setting up…' : r.cta}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-8" style={{ color: '#44403c' }}>
          You can update your profile and role preferences at any time in Settings.
        </p>
      </div>
    </div>
  );
}
