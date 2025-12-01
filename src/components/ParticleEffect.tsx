'use client';

import { useEffect, useRef } from 'react';

interface ParticleEffectProps {
  /**
   * Number of particles to render
   * @default 50
   */
  particleCount?: number;
  /**
   * Particle colors
   * @default ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0']
   */
  colors?: string[];
  /**
   * Animation duration in milliseconds
   * @default 3000
   */
  duration?: number;
  /**
   * Whether to auto-start the animation
   * @default true
   */
  autoStart?: boolean;
  /**
   * Trigger animation
   */
  trigger?: boolean;
}

/**
 * ParticleEffect Component
 * Creates a beautiful particle explosion effect
 */
export function ParticleEffect({
  particleCount = 50,
  colors = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#a7f3d0'],
  duration = 3000,
  autoStart = true,
  trigger = false,
}: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      life: number;
      maxLife: number;
    }>
  >([]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        return {
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 4 + 2,
          life: 0,
          maxLife: duration,
        };
      });
      startTimeRef.current = performance.now();
    };

    // Animate particles
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      if (elapsed > duration) {
        particlesRef.current = [];
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravity
        particle.life += 16; // Assuming 60fps

        const alpha = 1 - particle.life / particle.maxLife;
        if (alpha <= 0) return false;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      if (particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    if (autoStart || trigger) {
      initParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, colors, duration, autoStart, trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ background: 'transparent' }}
    />
  );
}
