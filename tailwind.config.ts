import type { Config } from 'tailwindcss';
import { designTokens } from './src/lib/design-tokens';

export default {
  darkMode: 'class',
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5e9',
          dark: '#0284c7',
          light: '#38bdf8',
        },
        primary: designTokens.colors.primary,
        secondary: designTokens.colors.secondary,
        success: designTokens.colors.success,
        warning: designTokens.colors.warning,
        error: designTokens.colors.error,
        info: designTokens.colors.info,
        neutral: designTokens.colors.neutral,
      },
      boxShadow: {
        card: designTokens.shadows.elevation[2],
        'elevation-1': designTokens.shadows.elevation[1],
        'elevation-2': designTokens.shadows.elevation[2],
        'elevation-3': designTokens.shadows.elevation[3],
        'elevation-4': designTokens.shadows.elevation[4],
        'elevation-5': designTokens.shadows.elevation[5],
        'elevation-6': designTokens.shadows.elevation[6],
        'colored-primary': designTokens.shadows.colored.primary,
        'colored-primary-hover': designTokens.shadows.colored.primaryHover,
        'colored-success': designTokens.shadows.colored.success,
        'colored-warning': designTokens.shadows.colored.warning,
        'colored-error': designTokens.shadows.colored.error,
      },
      borderRadius: {
        ...designTokens.borderRadius,
      },
      transitionDuration: {
        ...designTokens.animations.duration,
      },
      transitionTimingFunction: {
        ...designTokens.animations.easing,
      },
      zIndex: Object.fromEntries(
        Object.entries(designTokens.zIndex).map(([key, value]) => [key, String(value)])
      ),
      screens: {
        xs: '475px',
        // Tailwind defaults: sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
      },
      fontSize: {
        // Fluid typography scale - mobile-first approach
        'fluid-xs': 'clamp(0.625rem, 0.5rem + 0.3125vw, 0.75rem)', // 10px - 12px
        'fluid-sm': 'clamp(0.75rem, 0.625rem + 0.3125vw, 0.875rem)', // 12px - 14px
        'fluid-base': 'clamp(0.875rem, 0.75rem + 0.3125vw, 1rem)', // 14px - 16px
        'fluid-lg': 'clamp(1rem, 0.875rem + 0.3125vw, 1.125rem)', // 16px - 18px
        'fluid-xl': 'clamp(1.125rem, 1rem + 0.3125vw, 1.25rem)', // 18px - 20px
        'fluid-2xl': 'clamp(1.25rem, 1.125rem + 0.3125vw, 1.5rem)', // 20px - 24px
        'fluid-3xl': 'clamp(1.5rem, 1.25rem + 0.625vw, 2rem)', // 24px - 32px
        'fluid-4xl': 'clamp(1.875rem, 1.5rem + 0.9375vw, 2.5rem)', // 30px - 40px
      },
      spacing: {
        // 4px base spacing unit system
        '0.5': '0.125rem', // 2px
        '1': '0.25rem', // 4px
        '1.5': '0.375rem', // 6px
        '2': '0.5rem', // 8px
        '2.5': '0.625rem', // 10px
        '3': '0.75rem', // 12px
        '3.5': '0.875rem', // 14px
        '4': '1rem', // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem', // 24px
        '7': '1.75rem', // 28px
        '8': '2rem', // 32px
        '9': '2.25rem', // 36px
        '10': '2.5rem', // 40px
        '11': '2.75rem', // 44px
        '12': '3rem', // 48px
        '14': '3.5rem', // 56px
        '16': '4rem', // 64px
        '20': '5rem', // 80px
        '24': '6rem', // 96px
      },
    },
  },
  plugins: [],
} satisfies Config;
