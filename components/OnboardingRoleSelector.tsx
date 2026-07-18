'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Target, Briefcase } from 'lucide-react';
import { UserRole } from '@/types';
import { setRole } from '@/app/actions/auth';

const ROLES = [
  {
    role: UserRole.MENTEE,
    icon: <Target className="w-7 h-7" />,
    label: 'Job Seeker',
    sublabel: 'I want mentorship',
    description: 'Find mentors to guide your career, unlock opportunities, and achieve your professional goals with faith-rooted support.',
    cta: 'I am a Mentee',
    accentColor: '#f97316',
    accentBg: 'rgba(245,158,11,0.1)',
    accentBorder: 'rgba(245,158,11,0.2)',
  },
  {
    role: UserRole.MENTOR,
    icon: <Briefcase className="w-7 h-7" />,
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
    <div className="w-full">
      <div
        className="relative z-10 w-full max-w-3xl transition-opacity duration-700"
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
      >
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-3 uppercase tracking-tight text-foreground">
            Choose your path
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            How would you like to use Grace Mentor?
          </p>
        </div>

        {/* Role cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {ROLES.map((r) => (
            <button
              key={r.role}
              disabled={isPending}
              onClick={() => handleSelectRole(r.role)}
              className="w-full text-left p-8 bg-card border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_var(--neo-border)] dark:border dark:rounded-2xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            >
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-14 h-14 bg-background border-2 border-neo-border flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110 shadow-[2px_2px_0px_0px_var(--neo-border)] dark:border-none dark:shadow-none dark:bg-white/5 dark:rounded-xl"
                >
                  {r.icon}
                </div>

                {/* Label */}
                <div className="mb-3">
                  <span className="text-xs font-bold px-2 py-1 border-2 border-neo-border shadow-[2px_2px_0px_0px_var(--neo-border)] dark:border-none dark:shadow-none dark:rounded-full" style={{ background: r.accentBg, color: r.accentColor }}>
                    {r.sublabel}
                  </span>
                </div>
                <h2 className="text-2xl font-black mb-2 text-foreground uppercase tracking-tight">
                  {r.label}
                </h2>
                <p className="text-sm font-medium leading-relaxed mb-6 text-muted-foreground">{r.description}</p>

                {/* CTA */}
                <div
                  className="w-full py-3 bg-background border-2 border-neo-border text-foreground text-sm font-bold text-center transition-all duration-300 group-hover:bg-accent group-hover:text-white shadow-[2px_2px_0px_0px_var(--neo-border)] dark:border-none dark:shadow-none dark:bg-white/5 dark:rounded-xl"
                >
                  {isPending ? 'Setting up…' : r.cta}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-8 font-medium text-muted-foreground">
          You can update your profile and role preferences at any time in Settings.
        </p>
      </div>
    </div>
  );
}
