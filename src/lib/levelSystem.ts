/**
 * Level System
 * XP calculation and level progression logic
 */

import { ActivityRecord } from './activityStore';

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number; // 0-1
  totalXP: number;
}

/**
 * Calculate XP required for a specific level
 * Formula: XP = 1000 * level * (level + 1) / 2
 * This creates an exponential curve: Level 1 = 1000, Level 2 = 3000, Level 3 = 6000, etc.
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(1000 * level * (level - 1) / 2);
}

/**
 * Calculate total XP required to reach a level
 */
export function getTotalXPForLevel(level: number): number {
  return getXPForLevel(level + 1);
}

/**
 * Calculate level from total XP
 */
export function getLevelFromXP(totalXP: number): number {
  if (totalXP < 1000) return 1;
  
  // Solve: totalXP = 1000 * level * (level + 1) / 2
  // level^2 + level - 2*totalXP/1000 = 0
  // Using quadratic formula
  const discriminant = 1 + (8 * totalXP) / 1000;
  const level = Math.floor((-1 + Math.sqrt(discriminant)) / 2);
  
  return Math.max(1, level);
}

/**
 * Calculate XP from activities
 * Each point earned = 1 XP
 */
export function calculateXPFromActivities(activities: ActivityRecord[]): number {
  return activities.reduce((sum, activity) => sum + activity.points, 0);
}

/**
 * Get level information from total XP
 */
export function getLevelInfo(totalXP: number): LevelInfo {
  const level = getLevelFromXP(totalXP);
  const xpForCurrentLevel = getTotalXPForLevel(level - 1);
  const xpForNextLevel = getTotalXPForLevel(level);
  const currentXP = totalXP - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const progress = xpNeeded > 0 ? currentXP / xpNeeded : 1;

  return {
    level,
    currentXP,
    xpForCurrentLevel,
    xpForNextLevel,
    progress: Math.min(1, Math.max(0, progress)),
    totalXP
  };
}

/**
 * Check if user leveled up
 */
export function checkLevelUp(oldTotalXP: number, newTotalXP: number): number | null {
  const oldLevel = getLevelFromXP(oldTotalXP);
  const newLevel = getLevelFromXP(newTotalXP);
  
  if (newLevel > oldLevel) {
    return newLevel;
  }
  
  return null;
}

/**
 * Get level title/name
 */
export function getLevelTitle(level: number, lang: 'tr' | 'en'): string {
  if (level < 5) {
    return lang === 'tr' ? 'Başlangıç' : 'Beginner';
  } else if (level < 10) {
    return lang === 'tr' ? 'Acemi' : 'Novice';
  } else if (level < 15) {
    return lang === 'tr' ? 'Deneyimli' : 'Experienced';
  } else if (level < 20) {
    return lang === 'tr' ? 'Uzman' : 'Expert';
  } else if (level < 30) {
    return lang === 'tr' ? 'Usta' : 'Master';
  } else if (level < 40) {
    return lang === 'tr' ? 'Efsane' : 'Legend';
  } else {
    return lang === 'tr' ? 'Efsanevi' : 'Mythic';
  }
}

