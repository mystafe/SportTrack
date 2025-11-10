export type ActivityKey = string;

export type ActivityDefinition = {
  key: ActivityKey;
  label: string;
  icon: string;
  multiplier: number;
  unit: string;
  defaultAmount: number;
  description?: string;
  isCustom?: boolean;
};

export const BASE_ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
  {
    key: 'WALKING',
    label: 'Yürüme',
    icon: '🚶‍♂️',
    multiplier: 1,
    unit: 'adım',
    defaultAmount: 1000,
    description: 'Adım sayınızı girin'
  },
  {
    key: 'STAIRS',
    label: 'Merdiven Çıkma',
    icon: '🧗',
    multiplier: 20,
    unit: 'basamak',
    defaultAmount: 50,
    description: 'Çıktığınız toplam basamak sayısı'
  },
  {
    key: 'SIT_UP',
    label: 'Mekik',
    icon: '🪢',
    multiplier: 10,
    unit: 'tekrar',
    defaultAmount: 20
  },
  {
    key: 'PUSH_UP',
    label: 'Şınav',
    icon: '🧎‍♂️',
    multiplier: 20,
    unit: 'tekrar',
    defaultAmount: 20
  },
  {
    key: 'WEIGHT_LIFTING',
    label: 'Ağırlık Çalışması',
    icon: '🏋️',
    multiplier: 1,
    unit: 'dakika',
    defaultAmount: 30,
    description: 'Toplam süreyi dakika olarak girin'
  }
];

export const BASE_ACTIVITY_MAP: Record<string, ActivityDefinition> = Object.fromEntries(
  BASE_ACTIVITY_DEFINITIONS.map((def) => [def.key, def])
);

export const DEFAULT_DAILY_TARGET = 10_000;

