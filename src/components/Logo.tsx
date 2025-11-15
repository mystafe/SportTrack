'use client';

import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function Logo() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <svg
            width="32"
            height="32"
            viewBox="0 0 40 40"
            className="drop-shadow-md"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="logoGradientMobile" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {/* Simple circle background */}
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="url(#logoGradientMobile)"
              className="dark:opacity-95"
            />
            {/* Very simple running person icon */}
            <g fill="white">
              {/* Head */}
              <circle cx="20" cy="18" r="3" />
              {/* Body */}
              <rect x="18.5" y="21" width="3" height="8" rx="1.5" />
              {/* Arms - simple V shape */}
              <path
                d="M 20 22 L 15 26 M 20 22 L 25 26"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Legs - simple running position */}
              <path
                d="M 20 29 L 17 36 M 20 29 L 23 36"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
        <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-brand via-sky-400 to-brand-dark bg-clip-text text-transparent uppercase tracking-tight whitespace-nowrap flex items-center">
          SPORT TRACK
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative group">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          className="drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="logoGradientDesktop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Simple circle background */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#logoGradientDesktop)"
            className="dark:opacity-95"
          />
          {/* Very simple running person icon */}
          <g fill="white">
            {/* Head */}
            <circle cx="20" cy="18" r="3.5" />
            {/* Body */}
            <rect x="18" y="21" width="4" height="9" rx="2" />
            {/* Arms - simple V shape */}
            <path
              d="M 20 22 L 14 27 M 20 22 L 26 27"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Legs - simple running position */}
            <path
              d="M 20 30 L 16 38 M 20 30 L 24 38"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
      <span className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-brand via-sky-400 via-brand-light to-brand-dark bg-clip-text text-transparent tracking-tight uppercase">
        SPORT TRACK
      </span>
    </div>
  );
}
