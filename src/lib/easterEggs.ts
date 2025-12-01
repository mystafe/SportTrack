/**
 * Easter Eggs & Hidden Features
 * Fun surprises and unlockable content
 */

export type EasterEggType =
  | 'konami'
  | 'secret-combo'
  | 'achievement-milestone'
  | 'special-date'
  | 'perfect-day';

interface EasterEgg {
  id: string;
  type: EasterEggType;
  name: { tr: string; en: string };
  description: { tr: string; en: string };
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

const STORAGE_KEY = 'sporttrack.easterEggs';

/**
 * Konami Code detection
 */
export function detectKonamiCode(sequence: string[]): boolean {
  const konamiCode = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  if (sequence.length < konamiCode.length) return false;

  const recentSequence = sequence.slice(-konamiCode.length);
  return recentSequence.every((key, index) => key === konamiCode[index]);
}

/**
 * Secret combo detection (tap logo 10 times)
 */
export function detectSecretCombo(tapCount: number): boolean {
  return tapCount >= 10;
}

/**
 * Check for special dates
 */
export function checkSpecialDate(date: Date): EasterEggType | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // New Year
  if (month === 1 && day === 1) return 'special-date';
  // Valentine's Day
  if (month === 2 && day === 14) return 'special-date';
  // April Fools
  if (month === 4 && day === 1) return 'special-date';
  // Christmas
  if (month === 12 && day === 25) return 'special-date';
  // User's birthday (if set)
  // This would need to be checked against user settings

  return null;
}

/**
 * Get Easter Eggs from storage
 */
export function getEasterEggs(): EasterEgg[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored).map((egg: any) => ({
        ...egg,
        unlockedAt: egg.unlockedAt ? new Date(egg.unlockedAt) : undefined,
      }));
    }
  } catch (error) {
    console.debug('Failed to load easter eggs:', error);
  }

  return [];
}

/**
 * Unlock an Easter Egg
 */
export function unlockEasterEgg(eggId: string, type: EasterEggType): void {
  if (typeof window === 'undefined') return;

  const eggs = getEasterEggs();
  const existingEgg = eggs.find((e) => e.id === eggId);

  if (existingEgg && existingEgg.unlocked) return;

  const newEgg: EasterEgg = {
    id: eggId,
    type,
    name: getEasterEggName(type),
    description: getEasterEggDescription(type),
    icon: getEasterEggIcon(type),
    unlocked: true,
    unlockedAt: new Date(),
  };

  if (existingEgg) {
    Object.assign(existingEgg, newEgg);
  } else {
    eggs.push(newEgg);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(eggs));
  } catch (error) {
    console.debug('Failed to save easter egg:', error);
  }
}

function getEasterEggName(type: EasterEggType): { tr: string; en: string } {
  const names: Record<EasterEggType, { tr: string; en: string }> = {
    konami: { tr: 'Konami Kodu', en: 'Konami Code' },
    'secret-combo': { tr: 'Gizli Kombinasyon', en: 'Secret Combo' },
    'achievement-milestone': { tr: 'Başarı Taşı', en: 'Achievement Milestone' },
    'special-date': { tr: 'Özel Gün', en: 'Special Date' },
    'perfect-day': { tr: 'Mükemmel Gün', en: 'Perfect Day' },
  };
  return names[type];
}

function getEasterEggDescription(type: EasterEggType): { tr: string; en: string } {
  const descriptions: Record<EasterEggType, { tr: string; en: string }> = {
    konami: {
      tr: 'Konami kodunu buldun! 🎮',
      en: 'You found the Konami code! 🎮',
    },
    'secret-combo': {
      tr: 'Gizli kombinasyonu keşfettin! 🔓',
      en: 'You discovered the secret combo! 🔓',
    },
    'achievement-milestone': {
      tr: 'Özel bir başarıya ulaştın! 🏆',
      en: 'You reached a special achievement! 🏆',
    },
    'special-date': {
      tr: 'Özel bir günde aktivite yaptın! 🎉',
      en: 'You did activity on a special date! 🎉',
    },
    'perfect-day': {
      tr: 'Mükemmel bir gün geçirdin! ✨',
      en: 'You had a perfect day! ✨',
    },
  };
  return descriptions[type];
}

function getEasterEggIcon(type: EasterEggType): string {
  const icons: Record<EasterEggType, string> = {
    konami: '🎮',
    'secret-combo': '🔓',
    'achievement-milestone': '🏆',
    'special-date': '🎉',
    'perfect-day': '✨',
  };
  return icons[type];
}
