/**
 * Activity-Specific Badges System
 * Tracks and awards badges for specific activities
 */

import { ActivityRecord } from './activityStore';
import { ActivityKey } from './activityConfig';

export interface ActivityBadge {
  id: string; // Format: activity_{activityKey}_{milestone}
  activityKey: ActivityKey;
  activityLabel: string;
  activityLabelEn?: string;
  activityIcon: string;
  milestone: number; // Number of times performed
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export type ActivityBadgeMilestone = 10 | 25 | 50 | 100 | 250 | 500 | 1000 | 2500 | 5000;

const MILESTONE_RARITY: Record<ActivityBadgeMilestone, ActivityBadge['rarity']> = {
  10: 'common',
  25: 'common',
  50: 'rare',
  100: 'rare',
  250: 'epic',
  500: 'epic',
  1000: 'legendary',
  2500: 'legendary',
  5000: 'legendary',
};

const MILESTONE_ICONS: Record<ActivityBadgeMilestone, string> = {
  10: '🥉',
  25: '🥈',
  50: '🥇',
  100: '🏅',
  250: '🏆',
  500: '💎',
  1000: '👑',
  2500: '🌟',
  5000: '⭐',
};

/**
 * Generate activity badge ID
 */
export function getActivityBadgeId(
  activityKey: ActivityKey,
  milestone: ActivityBadgeMilestone
): string {
  return `activity_${activityKey}_${milestone}`;
}

/**
 * Check if user has reached a milestone for an activity
 */
export function checkActivityMilestone(
  activityKey: ActivityKey,
  activities: ActivityRecord[],
  milestone: ActivityBadgeMilestone
): boolean {
  const count = activities.filter((a) => a.activityKey === activityKey).length;
  return count >= milestone;
}

/**
 * Get all activity badges for a specific activity
 */
export function getActivityBadges(
  activityKey: ActivityKey,
  activityLabel: string,
  activityLabelEn: string | undefined,
  activityIcon: string,
  activities: ActivityRecord[]
): ActivityBadge[] {
  const milestones: ActivityBadgeMilestone[] = [10, 25, 50, 100, 250, 500, 1000, 2500, 5000];
  const count = activities.filter((a) => a.activityKey === activityKey).length;

  return milestones.map((milestone) => {
    const isUnlocked = count >= milestone;
    const badgeId = getActivityBadgeId(activityKey, milestone);

    return {
      id: badgeId,
      activityKey,
      activityLabel,
      activityLabelEn,
      activityIcon,
      milestone,
      name: {
        tr: `${activityLabel} Ustası - ${milestone}`,
        en: `${activityLabelEn || activityLabel} Master - ${milestone}`,
      },
      description: {
        tr: `${activityLabel} aktivitesini ${milestone} kez tamamla`,
        en: `Complete ${activityLabelEn || activityLabel} activity ${milestone} times`,
      },
      icon: MILESTONE_ICONS[milestone],
      rarity: MILESTONE_RARITY[milestone],
      unlockedAt: isUnlocked ? new Date() : undefined,
    };
  });
}

/**
 * Get all activity badges for all activities
 */
export function getAllActivityBadges(activities: ActivityRecord[]): ActivityBadge[] {
  const activityMap = new Map<ActivityKey, { label: string; labelEn?: string; icon: string }>();

  // Collect unique activities
  activities.forEach((activity) => {
    if (!activityMap.has(activity.activityKey)) {
      activityMap.set(activity.activityKey, {
        label: activity.label,
        labelEn: activity.labelEn,
        icon: activity.icon,
      });
    }
  });

  const allBadges: ActivityBadge[] = [];

  activityMap.forEach((activityInfo, activityKey) => {
    const activityBadges = getActivityBadges(
      activityKey,
      activityInfo.label,
      activityInfo.labelEn,
      activityInfo.icon,
      activities
    );
    allBadges.push(...activityBadges);
  });

  return allBadges;
}

/**
 * Get unlocked activity badges
 */
export function getUnlockedActivityBadges(activities: ActivityRecord[]): ActivityBadge[] {
  const allBadges = getAllActivityBadges(activities);
  return allBadges.filter((badge) => badge.unlockedAt !== undefined);
}

/**
 * Get activity badges grouped by activity
 */
export function getActivityBadgesByActivity(
  activities: ActivityRecord[]
): Map<ActivityKey, ActivityBadge[]> {
  const badges = getAllActivityBadges(activities);
  const grouped = new Map<ActivityKey, ActivityBadge[]>();

  badges.forEach((badge) => {
    if (!grouped.has(badge.activityKey)) {
      grouped.set(badge.activityKey, []);
    }
    grouped.get(badge.activityKey)!.push(badge);
  });

  return grouped;
}
