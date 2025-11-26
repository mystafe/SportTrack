'use client';

import { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  color?: string;
  particleCount?: number;
}

export function Confetti({ active, color = '#FFD700', particleCount = 50 }: ConfettiProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      delay: number;
      duration: number;
      rotation: number;
    }>
  >([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: -10,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active, particleCount]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[101] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-sm confetti-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            backgroundColor: color,
            animation: `confetti-fall ${particle.duration}s ease-out ${particle.delay}s forwards`,
            transform: `rotate(${particle.rotation}deg)`,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}
    </div>
  );
}
