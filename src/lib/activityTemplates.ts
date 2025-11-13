/**
 * Activity Templates
 * Pre-defined combinations of activities for quick entry
 */

import { ActivityKey } from './activityConfig';

export interface ActivityTemplate {
  id: string;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  icon: string;
  activities: Array<{
    activityKey: ActivityKey;
    amount: number; // Multiplier of default amount (e.g., 1.0 = default, 2.0 = double)
  }>;
  estimatedPoints: number; // Estimated total points
  category: 'cardio' | 'strength' | 'flexibility' | 'mixed' | 'quick';
}

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  {
    id: 'morning-walk',
    name: { tr: 'Sabah Yürüyüşü', en: 'Morning Walk' },
    description: { tr: 'Güne başlamak için ideal', en: 'Perfect way to start the day' },
    icon: '🌅',
    activities: [
      { activityKey: 'WALKING', amount: 1.0 }
    ],
    estimatedPoints: 1000,
    category: 'cardio'
  },
  {
    id: 'quick-cardio',
    name: { tr: 'Hızlı Kardiyo', en: 'Quick Cardio' },
    description: { tr: 'Kısa süreli kardiyovasküler antrenman', en: 'Short cardiovascular workout' },
    icon: '⚡',
    activities: [
      { activityKey: 'RUNNING', amount: 0.5 },
      { activityKey: 'WALKING', amount: 0.5 }
    ],
    estimatedPoints: 1500,
    category: 'cardio'
  },
  {
    id: 'strength-basics',
    name: { tr: 'Temel Güç Antrenmanı', en: 'Basic Strength Training' },
    description: { tr: 'Şınav ve mekik kombinasyonu', en: 'Push-up and sit-up combination' },
    icon: '💪',
    activities: [
      { activityKey: 'PUSH_UP', amount: 1.0 },
      { activityKey: 'SIT_UP', amount: 1.0 }
    ],
    estimatedPoints: 600,
    category: 'strength'
  },
  {
    id: 'full-body',
    name: { tr: 'Tam Vücut Antrenmanı', en: 'Full Body Workout' },
    description: { tr: 'Kapsamlı antrenman kombinasyonu', en: 'Comprehensive workout combination' },
    icon: '🔥',
    activities: [
      { activityKey: 'WALKING', amount: 0.5 },
      { activityKey: 'PUSH_UP', amount: 1.0 },
      { activityKey: 'SIT_UP', amount: 1.0 },
      { activityKey: 'WEIGHT_LIFTING', amount: 0.5 }
    ],
    estimatedPoints: 2000,
    category: 'mixed'
  },
  {
    id: 'swim-session',
    name: { tr: 'Yüzme Seansı', en: 'Swimming Session' },
    description: { tr: 'Yüzme antrenmanı', en: 'Swimming workout' },
    icon: '🏊',
    activities: [
      { activityKey: 'SWIMMING', amount: 1.0 }
    ],
    estimatedPoints: 100,
    category: 'cardio'
  },
  {
    id: 'stair-climbing',
    name: { tr: 'Merdiven Çıkma', en: 'Stair Climbing' },
    description: { tr: 'Merdiven çıkma antrenmanı', en: 'Stair climbing workout' },
    icon: '🪜',
    activities: [
      { activityKey: 'STAIRS', amount: 1.0 }
    ],
    estimatedPoints: 1000,
    category: 'cardio'
  },
  {
    id: 'quick-strength',
    name: { tr: 'Hızlı Güç', en: 'Quick Strength' },
    description: { tr: 'Hızlı güç antrenmanı', en: 'Quick strength workout' },
    icon: '⚡💪',
    activities: [
      { activityKey: 'PUSH_UP', amount: 0.5 },
      { activityKey: 'SIT_UP', amount: 0.5 }
    ],
    estimatedPoints: 300,
    category: 'quick'
  },
  {
    id: 'cardio-plus',
    name: { tr: 'Kardiyo Plus', en: 'Cardio Plus' },
    description: { tr: 'Yoğun kardiyovasküler antrenman', en: 'Intense cardiovascular workout' },
    icon: '🏃💨',
    activities: [
      { activityKey: 'RUNNING', amount: 1.0 },
      { activityKey: 'WALKING', amount: 1.0 }
    ],
    estimatedPoints: 2500,
    category: 'cardio'
  },
  {
    id: 'weight-training',
    name: { tr: 'Ağırlık Antrenmanı', en: 'Weight Training' },
    description: { tr: 'Ağırlık çalışması', en: 'Weight lifting session' },
    icon: '🏋️',
    activities: [
      { activityKey: 'WEIGHT_LIFTING', amount: 1.0 }
    ],
    estimatedPoints: 300,
    category: 'strength'
  },
  {
    id: 'active-day',
    name: { tr: 'Aktif Gün', en: 'Active Day' },
    description: { tr: 'Günlük aktivite kombinasyonu', en: 'Daily activity combination' },
    icon: '🌟',
    activities: [
      { activityKey: 'WALKING', amount: 2.0 },
      { activityKey: 'STAIRS', amount: 0.5 }
    ],
    estimatedPoints: 3000,
    category: 'mixed'
  }
];

export function getTemplatesByCategory(category?: ActivityTemplate['category']): ActivityTemplate[] {
  if (!category) return ACTIVITY_TEMPLATES;
  return ACTIVITY_TEMPLATES.filter(t => t.category === category);
}

