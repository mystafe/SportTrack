'use client';

import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  /**
   * Glow color
   * @default 'brand'
   */
  color?: 'brand' | 'green' | 'blue' | 'purple' | 'yellow' | 'red';
  /**
   * Glow intensity
   * @default 'medium'
   */
  intensity?: 'light' | 'medium' | 'strong';
  /**
   * Whether to animate the glow
   * @default true
   */
  animated?: boolean;
  className?: string;
}

const glowColors = {
  brand: 'from-brand/20 via-brand/10 to-brand/20',
  green: 'from-green-500/20 via-green-400/10 to-green-500/20',
  blue: 'from-blue-500/20 via-blue-400/10 to-blue-500/20',
  purple: 'from-purple-500/20 via-purple-400/10 to-purple-500/20',
  yellow: 'from-yellow-500/20 via-yellow-400/10 to-yellow-500/20',
  red: 'from-red-500/20 via-red-400/10 to-red-500/20',
};

const glowIntensities = {
  light: 'blur-xl',
  medium: 'blur-2xl',
  strong: 'blur-3xl',
};

/**
 * GlowEffect Component
 * Adds a beautiful glow effect around children
 */
export function GlowEffect({
  children,
  color = 'brand',
  intensity = 'medium',
  animated = true,
  className = '',
}: GlowEffectProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow background */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${glowColors[color]} ${glowIntensities[intensity]} ${animated ? 'animate-pulse-subtle' : ''} -z-10`}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
