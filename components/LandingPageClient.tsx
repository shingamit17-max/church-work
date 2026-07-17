'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

const ORBS = [
  { size: 420, x: 15, y: 20, color: 'rgba(245,158,11,0.07)', delay: 0 },
  { size: 320, x: 70, y: 60, color: 'rgba(244,63,94,0.05)', delay: 1.5 },
  { size: 260, x: 50, y: 10, color: 'rgba(245,158,11,0.05)', delay: 3 },
  { size: 180, x: 85, y: 80, color: 'rgba(251,191,36,0.06)', delay: 2 },
];

const SCRIPTURE = '"Let your light shine before others, that they may see your good deeds and glorify your Father in heaven." — Matthew 5:16';

export function LandingPageClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { 
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
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

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          <motion.div
            key="welcome"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 select-none"
            exit={{ y: '-100%', opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.y < -60 || velocity.y < -500) window.location.href = '/login';
            }}
            onClick={() => window.location.href = '/login'}
          >
            {/* Icon mark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="flex justify-center items-center h-24 mb-4">
                <Image src="/logo.png" alt="Grace Mentor Logo" width={96} height={96} priority style={{ width: 'auto', height: '100%' }} className="object-contain drop-shadow-lg" />
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
                    background: 'linear-gradient(135deg, #ef4444, #f97316)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 500,
                  }}
                >
                  Mentor
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-light text-foreground/70 max-w-2xl mx-auto">
                A faith-rooted community guiding careers with purpose and prayer.
              </p>
            </motion.div>

            {/* Scripture */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="text-center text-sm font-light italic max-w-md text-foreground/50"
              style={{ lineHeight: 1.7 }}
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
                <span className="text-xs tracking-[0.2em] uppercase text-foreground/50">
                  Tap to begin
                </span>
                <svg width="20" height="20" fill="none" stroke="currentColor" className="text-foreground/50" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
