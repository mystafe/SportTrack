/**
 * Analytics Utility
 *
 * Tracks user engagement and feature usage locally.
 * Privacy-friendly: All data stays on device (localStorage).
 *
 * Features:
 * - Event tracking for user actions
 * - Analytics summary generation
 * - Automatic data cleanup (30-day reset, max 1000 events)
 * - Development mode logging
 *
 * @module analytics
 */

type AnalyticsEvent =
  | 'activity_added'
  | 'activity_updated'
  | 'activity_deleted'
  | 'badge_unlocked'
  | 'challenge_completed'
  | 'goal_completed'
  | 'page_view'
  | 'feature_used'
  | 'share_action'
  | 'export_data'
  | 'import_data'
  | 'settings_changed';

interface AnalyticsData {
  events: Array<{
    event: AnalyticsEvent;
    timestamp: number;
    metadata?: Record<string, unknown>;
  }>;
  lastReset: number;
}

const STORAGE_KEY = 'sporttrack.analytics';
const MAX_EVENTS = 1000; // Keep last 1000 events
const RESET_INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days

function getAnalyticsData(): AnalyticsData {
  if (typeof window === 'undefined') {
    return { events: [], lastReset: Date.now() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AnalyticsData;
      // Reset if older than RESET_INTERVAL
      if (Date.now() - data.lastReset > RESET_INTERVAL) {
        return { events: [], lastReset: Date.now() };
      }
      return data;
    }
  } catch (error) {
    console.debug('Failed to load analytics data:', error);
  }

  return { events: [], lastReset: Date.now() };
}

function saveAnalyticsData(data: AnalyticsData): void {
  if (typeof window === 'undefined') return;

  try {
    // Keep only last MAX_EVENTS
    const events = data.events.slice(-MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, events }));
  } catch (error) {
    console.debug('Failed to save analytics data:', error);
  }
}

/**
 * Track an analytics event
 */
export function trackEvent(event: AnalyticsEvent, metadata?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const data = getAnalyticsData();
  data.events.push({
    event,
    timestamp: Date.now(),
    metadata,
  });

  saveAnalyticsData(data);

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[Analytics] ${event}`, metadata);
  }
}

/**
 * Get analytics summary
 */
export function getAnalyticsSummary(): {
  totalEvents: number;
  eventCounts: Record<AnalyticsEvent, number>;
  lastActivity: number | null;
  mostUsedFeature: AnalyticsEvent | null;
} {
  const data = getAnalyticsData();
  const eventCounts = {} as Record<AnalyticsEvent, number>;
  let lastActivity: number | null = null;

  data.events.forEach((e) => {
    eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
    if (!lastActivity || e.timestamp > lastActivity) {
      lastActivity = e.timestamp;
    }
  });

  const mostUsedFeature = Object.entries(eventCounts).reduce(
    (max, [event, count]) =>
      count > (eventCounts[max[0] as AnalyticsEvent] || 0) ? [event, count] : max,
    ['activity_added', 0] as [AnalyticsEvent, number]
  )[0] as AnalyticsEvent;

  return {
    totalEvents: data.events.length,
    eventCounts,
    lastActivity,
    mostUsedFeature,
  };
}

/**
 * Clear analytics data
 */
export function clearAnalytics(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Track page view
 */
export function trackPageView(page: string): void {
  trackEvent('page_view', { page });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature: string, metadata?: Record<string, unknown>): void {
  trackEvent('feature_used', { feature, ...metadata });
}
