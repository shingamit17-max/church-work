'use client';

import { useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { RoleSelector } from '@/components/RoleSelector';

export default function LandingPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  return <RoleSelector onMouseMove={() => {}} mousePosition={mousePosition} />;
}
