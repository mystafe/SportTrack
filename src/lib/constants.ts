// Application constants
export const STORAGE_KEYS = {
  ACTIVITIES: 'sporttrack.activities.v1',
  SETTINGS: 'sporttrack.settings.v1',
  THEME: 'theme',
  LANGUAGE: 'lang',
  BADGES: 'sporttrack.badges.v1',
  NOTIFICATIONS: 'sporttrack.notifications.v1',
  LEVELS: 'sporttrack.levels.v1',
  CHALLENGES: 'sporttrack.challenges.v1',
  ONBOARDING_COMPLETED: 'sporttrack.onboarding.completed',
  APPLE_HEALTH_LAST_IMPORT: 'sporttrack.appleHealth.lastImport',
} as const;

export const TIMEOUTS = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 500,
} as const;

export const LIMITS = {
  DAILY_TARGET_MIN: 1000,
  DAILY_TARGET_MAX: 100000,
  DEFAULT_DAILY_TARGET: 10000,
} as const;

export const BREAKPOINTS = {
  XS: 475,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
  MOBILE: 767, // Legacy - use SM instead
} as const;

// Spacing scale (4px base unit)
export const SPACING = {
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
} as const;
