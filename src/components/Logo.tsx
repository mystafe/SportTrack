'use client';

import { memo } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export const Logo = memo(function Logo() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            className="drop-shadow-md"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="logoGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <filter id="glowMobile">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Modern rounded square background */}
            <rect
              x="4"
              y="4"
              width="40"
              height="40"
              rx="10"
              ry="10"
              fill="url(#logoGradientMobile)"
              className="dark:opacity-95"
              filter="url(#glowMobile)"
            />
            {/* Activity tracking icon - stylized checkmark with pulse */}
            <g
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Checkmark representing completed activity */}
              <path d="M 16 24 L 20 28 L 32 16" strokeWidth="3" />
              {/* Pulse rings */}
              <circle cx="24" cy="24" r="8" opacity="0.3" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="12" opacity="0.2" strokeWidth="1" />
            </g>
          </svg>
        </div>
        <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-brand via-blue-500 to-brand-dark bg-clip-text text-transparent tracking-tight whitespace-nowrap">
          SPORT TRACK
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative group">
        <svg
          width="44"
          height="44"
          viewBox="0 0 48 48"
          className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logoGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glowDesktop">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Modern rounded square background with subtle shadow */}
          <rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="11"
            ry="11"
            fill="url(#logoGradientDesktop)"
            className="dark:opacity-95"
            filter="url(#glowDesktop)"
          />
          {/* Activity tracking icon - stylized checkmark with pulse effect */}
          <g
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Main checkmark representing completed activity */}
            <path d="M 18 24 L 22 28 L 30 20" strokeWidth="3.5" />
            {/* Pulse rings for dynamic feel */}
            <circle cx="24" cy="24" r="9" opacity="0.25" strokeWidth="2" />
            <circle cx="24" cy="24" r="13" opacity="0.15" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
      <span className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-brand via-blue-500 via-brand-light to-brand-dark bg-clip-text text-transparent tracking-tight uppercase">
        SPORT TRACK
      </span>
    </div>
  );
});
