export type ActivityKey =
  | 'WALKING'
  | 'STAIRS'
  | 'SIT_UP'
  | 'PUSH_UP'
  | 'WEIGHT_LIFTING';

type ActivityDefinition = {
  key: ActivityKey;
  label: string;
  icon: string;
  multiplier: number;
  unit: string;
  defaultAmount: number;
  description?: string;
};

export const ACTIVITY_DEFINITIONS: Record<ActivityKey, ActivityDefinition> = {
  WALKING: {
    key: 'WALKING',
    label: 'Yürüme',
    icon: '🚶‍♂️',
    multiplier: 1,
    unit: 'adım',
    defaultAmount: 1000,
    description: 'Adım sayınızı girin'
  },
  STAIRS: {
    key: 'STAIRS',
    label: 'Merdiven Çıkma',
    icon: '🧗',
    multiplier: 20,
    unit: 'basamak',
    defaultAmount: 50,
    description: 'Çıktığınız toplam basamak sayısı'
  },
  SIT_UP: {
    key: 'SIT_UP',
    label: 'Mekik',
    icon: '💪',
    multiplier: 10,
    unit: 'tekrar',
    defaultAmount: 20
  },
  PUSH_UP: {
    key: 'PUSH_UP',
    label: 'Şınav',
    icon: '🤸',
    multiplier: 20,
    unit: 'tekrar',
    defaultAmount: 20
  },
  WEIGHT_LIFTING: {
    key: 'WEIGHT_LIFTING',
    label: 'Ağırlık Çalışması',
    icon: '🏋️',
    multiplier: 1,
    unit: 'dakika',
    defaultAmount: 30,
    description: 'Toplam süreyi dakika olarak girin'
  }
};

export const DAILY_TARGET_POINTS = 10_000;

export function calculatePoints(activityKey: ActivityKey, amount: number) {
  const def = ACTIVITY_DEFINITIONS[activityKey];
  return Math.max(0, Math.round(amount * def.multiplier));
}

export function listActivities() {
  return Object.values(ACTIVITY_DEFINITIONS);
}

