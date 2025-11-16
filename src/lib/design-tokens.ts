/**
 * Design Tokens
 *
 * Centralized design system tokens for SportTrack
 * These tokens define colors, typography, spacing, shadows, animations, etc.
 *
 * Usage:
 * - CSS Custom Properties: Use in globals.css
 * - TypeScript: Import and use in components
 * - Tailwind Config: Extend Tailwind theme
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colors = {
  // Primary Colors (Brand)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Brand color
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },

  // Secondary Colors (Accent)
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Neutral Colors (Grays)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Dark Mode Specific
  dark: {
    background: '#000000',
    surface: '#111111',
    surfaceElevated: '#1a1a1a',
    border: '#262626',
    text: {
      primary: '#fafafa',
      secondary: '#d4d4d4',
      muted: '#a3a3a3',
    },
  },

  // Light Mode Specific
  light: {
    background: '#ffffff',
    surface: '#fafafa',
    surfaceElevated: '#ffffff',
    border: '#e5e5e5',
    text: {
      primary: '#171717',
      secondary: '#525252',
      muted: '#a3a3a3',
    },
  },
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      '"SF Mono"',
      'Menlo',
      'Consolas',
      '"Liberation Mono"',
      'monospace',
    ],
  },

  // Font Sizes (px values)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles (Semantic)
  textStyles: {
    h1: {
      fontSize: 'clamp(1.875rem, 1.5rem + 1.5vw, 3rem)', // 30px - 48px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: 'clamp(1.5rem, 1.25rem + 1vw, 2.25rem)', // 24px - 36px
      fontWeight: '700',
      lineHeight: '1.25',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: 'clamp(1.25rem, 1.125rem + 0.5vw, 1.875rem)', // 20px - 30px
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: 'clamp(1.125rem, 1rem + 0.5vw, 1.5rem)', // 18px - 24px
      fontWeight: '600',
      lineHeight: '1.375',
      letterSpacing: '0em',
    },
    body: {
      fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1rem)', // 14px - 16px
      fontWeight: '400',
      lineHeight: '1.625',
      letterSpacing: '0em',
    },
    bodyLarge: {
      fontSize: 'clamp(1rem, 0.9375rem + 0.25vw, 1.125rem)', // 16px - 18px
      fontWeight: '400',
      lineHeight: '1.625',
      letterSpacing: '0em',
    },
    caption: {
      fontSize: 'clamp(0.75rem, 0.6875rem + 0.25vw, 0.875rem)', // 12px - 14px
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
    label: {
      fontSize: 'clamp(0.875rem, 0.8125rem + 0.25vw, 1rem)', // 14px - 16px
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '0.025em',
    },
  },
} as const;

// ============================================================================
// SPACING SYSTEM
// ============================================================================

export const spacing = {
  // Base unit: 4px
  baseUnit: 4,

  // Spacing scale (in px, converted to rem in CSS)
  scale: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
  },

  // Component spacing guidelines
  component: {
    padding: {
      xs: '0.5rem', // 8px
      sm: '0.75rem', // 12px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
    gap: {
      xs: '0.5rem', // 8px
      sm: '0.75rem', // 12px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
  },

  // Layout spacing guidelines
  layout: {
    container: {
      padding: {
        mobile: '1rem', // 16px
        desktop: '1.5rem', // 24px
      },
    },
    section: {
      gap: {
        mobile: '1.5rem', // 24px
        desktop: '2rem', // 32px
      },
    },
  },
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem', // 32px
  full: '9999px',
} as const;

// ============================================================================
// SHADOW SYSTEM (Elevation Levels)
// ============================================================================

export const shadows = {
  // Elevation levels (0-24)
  elevation: {
    0: 'none',
    1: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    2: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    3: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    4: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    5: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    6: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Dark mode shadows (lighter, more visible)
  elevationDark: {
    0: 'none',
    1: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    2: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    3: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    4: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
    5: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
    6: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
  },

  // Colored shadows (for brand elements)
  colored: {
    primary: '0 4px 14px 0 rgb(14 165 233 / 0.15)',
    primaryHover: '0 8px 20px 0 rgb(14 165 233 / 0.25)',
    success: '0 4px 14px 0 rgb(34 197 94 / 0.15)',
    warning: '0 4px 14px 0 rgb(245 158 11 / 0.15)',
    error: '0 4px 14px 0 rgb(239 68 68 / 0.15)',
  },
} as const;

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

export const animations = {
  // Duration scale
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
    slowest: '1000ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Animation patterns
  patterns: {
    fade: {
      in: {
        opacity: '0',
        transition: 'opacity 300ms ease-in',
      },
      out: {
        opacity: '1',
        transition: 'opacity 300ms ease-out',
      },
    },
    slide: {
      up: {
        transform: 'translateY(20px)',
        opacity: '0',
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      },
      down: {
        transform: 'translateY(-20px)',
        opacity: '0',
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      },
      left: {
        transform: 'translateX(20px)',
        opacity: '0',
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      },
      right: {
        transform: 'translateX(-20px)',
        opacity: '0',
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      },
    },
    scale: {
      in: {
        transform: 'scale(0.95)',
        opacity: '0',
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      },
      out: {
        transform: 'scale(1.05)',
        opacity: '0',
        transition: 'transform 300ms ease-out, opacity 300ms ease-out',
      },
    },
  },
} as const;

// ============================================================================
// Z-INDEX SYSTEM
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
  quoteTicker: 1090,
  bottomNavigation: 1100,
  safeArea: 999999,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// TOUCH TARGET SIZES
// ============================================================================

export const touchTargets = {
  minimum: '44px', // iOS standard
  recommended: '48px', // Android standard
  comfortable: '56px',
} as const;

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  zIndex,
  breakpoints,
  touchTargets,
} as const;

export default designTokens;
