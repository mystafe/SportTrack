export type ActivityKey = string;

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
  isCustom?: boolean;
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
    description: 'Adım sayınızı girin'
  },
  {
    key: 'STAIRS',
    label: 'Merdiven Çıkma',
    labelEn: 'Stairs',
    icon: '🧗',
    multiplier: 20,
    unit: 'basamak',
    unitEn: 'steps',
    defaultAmount: 50,
    description: 'Çıktığınız toplam basamak sayısı'
  },
  {
    key: 'SIT_UP',
    label: 'Mekik',
    labelEn: 'Sit-up',
    icon: '🆎',
    multiplier: 10,
    unit: 'tekrar',
    unitEn: 'reps',
    defaultAmount: 20
  },
  {
    key: 'PUSH_UP',
    label: 'Şınav',
    labelEn: 'Push-up',
    icon: '💪',
    multiplier: 20,
    unit: 'tekrar',
    unitEn: 'reps',
    defaultAmount: 20
  },
  {
    key: 'WEIGHT_LIFTING',
    label: 'Ağırlık Çalışması',
    labelEn: 'Weight Lifting',
    icon: '🏋️',
    multiplier: 1,
    unit: 'dakika',
    unitEn: 'minutes',
    defaultAmount: 30,
    description: 'Toplam süreyi dakika olarak girin'
  }
];

export const BASE_ACTIVITY_MAP: Record<string, ActivityDefinition> = Object.fromEntries(
  BASE_ACTIVITY_DEFINITIONS.map((def) => [def.key, def])
);

export const DEFAULT_DAILY_TARGET = 10_000;

