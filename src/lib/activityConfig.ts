export type ActivityKey = string;

export type ActivityCategory = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';

export type ActivityDefinition = {
  key: ActivityKey;
  label: string;
  labelEn?: string;
  icon: string;
  multiplier: number;
  unit: string;
  unitEn?: string;
  defaultAmount: number;
  description?: string;
  descriptionEn?: string;
  isCustom?: boolean;
  category?: ActivityCategory;
};

export const BASE_ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
  {
    key: 'WALKING',
    label: 'Yürüme',
    labelEn: 'Walking',
    icon: '🚶‍♂️',
    multiplier: 1,
    unit: 'adım',
    unitEn: 'steps',
    defaultAmount: 1000,
    description: 'Adım sayınızı girin',
    descriptionEn: 'Enter your step count',
    category: 'cardio',
  },
  {
    key: 'RUNNING',
    label: 'Koşma',
    labelEn: 'Running',
    icon: '🏃',
    multiplier: 2,
    unit: 'adım',
    unitEn: 'steps',
    defaultAmount: 500,
    description: 'Koşu adım sayınızı girin',
    descriptionEn: 'Enter your running step count',
    category: 'cardio',
  },
  {
    key: 'SWIMMING',
    label: 'Yüzme',
    labelEn: 'Swimming',
    icon: '🏊',
    multiplier: 5,
    unit: 'dakika',
    unitEn: 'minutes',
    defaultAmount: 20,
    description: 'Yüzme süresini dakika olarak girin',
    descriptionEn: 'Enter swimming duration in minutes',
    category: 'cardio',
  },
  {
    key: 'PUSH_UP',
    label: 'Şınav',
    labelEn: 'Push-up',
    icon: '💪',
    multiplier: 20,
    unit: 'tekrar',
    unitEn: 'reps',
    defaultAmount: 20,
    description: 'Tamamlanan şınav tekrar sayısı',
    descriptionEn: 'Number of push-up repetitions completed',
    category: 'strength',
  },
  {
    key: 'SIT_UP',
    label: 'Mekik',
    labelEn: 'Sit-up',
    icon: '🆎',
    multiplier: 10,
    unit: 'tekrar',
    unitEn: 'reps',
    defaultAmount: 20,
    description: 'Tamamlanan mekik tekrar sayısı',
    descriptionEn: 'Number of sit-up repetitions completed',
    category: 'strength',
  },
  {
    key: 'WEIGHT_LIFTING',
    label: 'Ağırlık Çalışması',
    labelEn: 'Weight Lifting',
    icon: '🏋️',
    multiplier: 15,
    unit: 'dakika',
    unitEn: 'minutes',
    defaultAmount: 30,
    description: 'Toplam süreyi dakika olarak girin',
    descriptionEn: 'Enter total duration in minutes',
    category: 'strength',
  },
  {
    key: 'STAIRS',
    label: 'Merdiven Çıkma',
    labelEn: 'Stairs',
    icon: '🪜',
    multiplier: 20,
    unit: 'basamak',
    unitEn: 'steps',
    defaultAmount: 50,
    description: 'Çıktığınız toplam basamak sayısı',
    descriptionEn: 'Total number of steps climbed',
    category: 'cardio',
  },
];

export const BASE_ACTIVITY_MAP: Record<string, ActivityDefinition> = Object.fromEntries(
  BASE_ACTIVITY_DEFINITIONS.map((def) => [def.key, def])
);

import { LIMITS } from '@/lib/constants';

export const DEFAULT_DAILY_TARGET = LIMITS.DEFAULT_DAILY_TARGET;
