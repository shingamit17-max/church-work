'use client';

import { useEffect, useRef, useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
  isDark: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  decay: number;
}

export function WelcomeScreen({ onComplete, isDark }: WelcomeScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const initializeParticles = () => {
      ctx.font = 'bold 80px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 30, 30, 0.9)';
      ctx.fillText('Grace Church', canvas.width / 2, canvas.height / 2 - 50);
      ctx.fillText('Welcomes You', canvas.width / 2, canvas.height / 2 + 50);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      particlesRef.current = [];
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 128) {
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);

          if (Math.random() > 0.93) {
            particlesRef.current.push({
              x,
              y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              size: Math.random() * 2 + 0.5,
              opacity: 1,
              decay: Math.random() * 0.008 + 0.005,
            });
          }
        }
      }
    };

    initializeParticles();

    const animate = () => {
      ctx.fillStyle = isDark ? 'rgba(10, 10, 10, 0.05)' : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1;
        particle.opacity -= particle.decay;

        if (particle.opacity > 0) {
          activeParticles++;
          ctx.fillStyle = isDark 
            ? `rgba(150, 120, 255, ${particle.opacity})` 
            : `rgba(100, 80, 200, ${particle.opacity})`;
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

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const timeout = setTimeout(() => {
      if (isAnimating) onComplete();
    }, 5000);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [onComplete, isDark, isAnimating]);

  const bgStyle = isDark 
    ? 'linear-gradient(135deg, rgb(10, 10, 20) 0%, rgb(15, 10, 30) 100%)'
    : 'linear-gradient(135deg, rgb(250, 250, 255) 0%, rgb(240, 245, 255) 100%)';

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-pointer"
      onClick={onComplete}
      style={{ background: bgStyle }}
    />
  );
}
