'use client';

import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function Logo() {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 40 40" 
            className="drop-shadow-sm"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Background circle */}
            <circle 
              cx="20" 
              cy="20" 
              r="18" 
              fill="url(#logoGradient)" 
              className="dark:opacity-90"
            />
            {/* Running figure */}
            <path 
              d="M 12 28 L 14 24 L 16 26 L 18 22 L 20 24 L 22 20 L 24 22 L 26 18 L 28 20" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              fill="none"
              filter="url(#glow)"
            />
            {/* Head */}
            <circle 
              cx="12" 
              cy="28" 
              r="2.5" 
              fill="white"
              filter="url(#glow)"
            />
          </svg>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-xs sm:text-sm bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
            sport
          </span>
          <span className="font-semibold text-xs sm:text-sm bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
            track
          </span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg 
          width="36" 
          height="36" 
          viewBox="0 0 40 40" 
          className="drop-shadow-md transition-transform duration-300 hover:scale-110"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logoGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="glowDesktop">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 20 20"
              to="360 20 20"
              dur="20s"
              repeatCount="indefinite"
            />
          </defs>
          {/* Animated background circle */}
          <circle 
            cx="20" 
            cy="20" 
            r="18" 
            fill="url(#logoGradientDesktop)" 
            className="dark:opacity-90"
            opacity="0.95"
          >
            <animate 
              attributeName="opacity" 
              values="0.9;1;0.9" 
              dur="3s" 
              repeatCount="indefinite"
            />
          </circle>
          {/* Running figure */}
          <path 
            d="M 12 28 L 14 24 L 16 26 L 18 22 L 20 24 L 22 20 L 24 22 L 26 18 L 28 20" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
            filter="url(#glowDesktop)"
          >
            <animate 
              attributeName="stroke-dasharray" 
              values="0,20;10,10;0,20" 
              dur="2s" 
              repeatCount="indefinite"
            />
          </path>
          {/* Head */}
          <circle 
            cx="12" 
            cy="28" 
            r="2.5" 
            fill="white"
            filter="url(#glowDesktop)"
          >
            <animate 
              attributeName="cy" 
              values="28;26;28" 
              dur="1.5s" 
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <span className="font-bold text-xl bg-gradient-to-r from-brand via-brand-light to-brand-dark bg-clip-text text-transparent tracking-tight">
        SportTrack
      </span>
    </div>
  );
}

