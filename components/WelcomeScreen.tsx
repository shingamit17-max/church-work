'use client';

import { useEffect, useRef, useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    decay: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles from text
    const initializeParticles = () => {
      ctx.font = 'bold 120px "Geist", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText('Grace Church', canvas.width / 2, canvas.height / 2 - 80);
      ctx.fillText('Welcomes You', canvas.width / 2, canvas.height / 2 + 80);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      particlesRef.current = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 128) {
          const pixelIndex = i / 4;
          const x = (pixelIndex % canvas.width);
          const y = Math.floor(pixelIndex / canvas.width);

          if (Math.random() > 0.92) {
            particlesRef.current.push({
              x,
              y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              size: Math.random() * 3 + 1,
              opacity: 1,
              decay: Math.random() * 0.01 + 0.008,
            });
          }
        }
      }
    };

    initializeParticles();

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.15; // gravity
        particle.opacity -= particle.decay;

        if (particle.opacity > 0) {
          activeParticles++;
          ctx.fillStyle = `rgba(200, 150, 255, ${particle.opacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (activeParticles === 0) {
        setIsAnimating(false);
        onComplete();
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Auto-complete after 5 seconds
    const timeout = setTimeout(() => {
      if (isAnimating) {
        onComplete();
      }
    }, 5000);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [onComplete, isAnimating]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-pointer"
      onClick={onComplete}
      style={{ background: 'radial-gradient(ellipse at 50% 50%, rgb(15, 10, 40) 0%, rgb(5, 5, 15) 100%)' }}
    />
  );
}
