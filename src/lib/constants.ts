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
  MOBILE: 767,
} as const;
