'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { RoleSelector } from '@/components/RoleSelector';

export default function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('theme-preference');
    if (saved) {
      setIsDark(saved === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  const handleThemeToggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme-preference', newIsDark ? 'dark' : 'light');
  };

  if (!mounted) return null;

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} isDark={isDark} />;
  }

  return <RoleSelector isDark={isDark} onThemeToggle={handleThemeToggle} />;
}
