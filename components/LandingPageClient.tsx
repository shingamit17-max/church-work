'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';

const ORBS = [
  { size: 420, x: 15, y: 20, color: 'rgba(245,158,11,0.07)', delay: 0 },
  { size: 320, x: 70, y: 60, color: 'rgba(244,63,94,0.05)', delay: 1.5 },
  { size: 260, x: 50, y: 10, color: 'rgba(245,158,11,0.05)', delay: 3 },
  { size: 180, x: 85, y: 80, color: 'rgba(251,191,36,0.06)', delay: 2 },
];

const SCRIPTURE = '"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven." — Matthew 5:16';

export function LandingPageClient() {
  const [showAuth, setShowAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white" style={{ background: '#1c1917' }}>
      {/* Ambient orbs */}
      {mounted && ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 8 + i * 2, delay: orb.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <AnimatePresence mode="wait">
        {!showAuth ? (
          /* ── Welcome Screen ── */
          <motion.div
            key="welcome"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none"
            exit={{ y: '-100%', opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y < -60 || velocity.y < -500) setShowAuth(true);
            }}
            onClick={() => setShowAuth(true)}
          >
            {/* Icon mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 32px rgba(245,158,11,0.35)' }}
              >
                ✦
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="text-center mb-6"
            >
              <h1
                className="text-6xl md:text-8xl font-light tracking-tight mb-3"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                Grace{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 500,
                  }}
                >
                  Mentor
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-light" style={{ color: '#a8a29e', maxWidth: '36rem' }}>
                A faith-rooted community guiding careers with purpose and prayer.
              </p>
            </motion.div>

            {/* Scripture */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-center text-sm font-light italic max-w-md"
              style={{ color: '#57534e', lineHeight: 1.7 }}
            >
              {SCRIPTURE}
            </motion.p>

            {/* Swipe cue */}
            <motion.div
              className="absolute bottom-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: '#57534e' }}>
                  Tap to begin
                </span>
                <svg width="20" height="20" fill="none" stroke="#78716c" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* ── Auth Panel ── */
          <motion.div
            key="auth"
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full max-w-sm">
              {/* Logo mark small */}
              <div className="flex justify-center mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 16px rgba(245,158,11,0.3)' }}
                >
                  ✦
                </div>
              </div>

              {/* Card */}
              <div
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(41,37,36,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold mb-1" style={{ letterSpacing: '-0.02em' }}>Welcome back</h2>
                  <p className="text-sm" style={{ color: '#78716c' }}>Sign in to your Grace Mentor account</p>
                </div>

                <div className="space-y-3">
                  {/* Google */}
                  <button
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all"
                    style={{ background: '#fff', color: '#1c1917', border: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f4')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => signIn('linkedin', { callbackUrl: '/dashboard' })}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all"
                    style={{ background: '#0A66C2', color: '#fff', border: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#004182')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#0A66C2')}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Continue with LinkedIn
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  <span className="text-xs" style={{ color: '#57534e' }}>or</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* Email */}
                <button
                  onClick={() => (window.location.href = '/login')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#a8a29e',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#fafaf9';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#a8a29e';
                  }}
                >
                  Sign in with email
                </button>

                <p className="text-center text-xs mt-5" style={{ color: '#57534e' }}>
                  No account?{' '}
                  <a href="/register" style={{ color: '#fbbf24' }} className="hover:underline">
                    Create one free
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
