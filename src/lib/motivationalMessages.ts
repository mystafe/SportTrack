export type MotivationalMessage = {
  tr: string;
  en: string;
  emoji: string;
};

export function getMotivationalMessage(progress: number, hasActivities: boolean): MotivationalMessage | null {
  // No activities today
  if (!hasActivities && progress === 0) {
    return {
      tr: 'Hadi başlayalım! Bugün henüz aktivite yok. 🚀',
      en: 'Let\'s get started! No activities today yet. 🚀',
      emoji: '🚀'
    };
  }

  // Very low progress (0-25%)
  if (progress < 25) {
    return {
      tr: 'Hedefin altındasın! Biraz daha çaba göster. 💪',
      en: 'You\'re below your goal! Push a little harder. 💪',
      emoji: '💪'
    };
  }

  // Low progress (25-50%)
  if (progress < 50) {
    return {
      tr: 'Yarı yoldasın! Devam et, hedefe yaklaşıyorsun. ⚡',
      en: 'Halfway there! Keep going, you\'re getting closer. ⚡',
      emoji: '⚡'
    };
  }

  // Good progress (50-75%)
  if (progress < 75) {
    return {
      tr: 'İyi gidiyorsun! Son düzlüğe geldin. 🔥',
      en: 'You\'re doing great! Almost there. 🔥',
      emoji: '🔥'
    };
  }

  // Almost there (75-99%)
  if (progress < 100) {
    return {
      tr: 'Neredeyse tamamladın! Son hamle! 🎯',
      en: 'Almost done! Final push! 🎯',
      emoji: '🎯'
    };
  }

  // Goal completed (100%+)
  if (progress >= 100) {
    return {
      tr: 'Harika! Hedefini tamamladın! 🎉',
      en: 'Awesome! You\'ve reached your goal! 🎉',
      emoji: '🎉'
    };
  }

  return null;
}

