import { Mood } from '@/lib/settingsStore';

export type MotivationalMessage = {
  tr: string;
  en: string;
  emoji: string;
};

type MessageSet = {
  funny: MotivationalMessage[];
  serious: MotivationalMessage[];
  motivational: MotivationalMessage[];
};

const messagesByMood: Record<Exclude<Mood, null>, MessageSet> = {
  happy: {
    funny: [
      {
        tr: 'Mutluluğun zirvesindesin! Şimdi bu enerjiyi spora çevir ve dünyayı fethet! 🌍💪',
        en: 'You\'re at the peak of happiness! Now channel this energy into sports and conquer the world! 🌍💪',
        emoji: '🌍'
      },
      {
        tr: 'Mutlu musun? Harika! Şimdi mutluluğunu hareketle taçlandır. Koş, zıpla, dans et! 🎉',
        en: 'Are you happy? Great! Now crown your happiness with movement. Run, jump, dance! 🎉',
        emoji: '🎉'
      },
      {
        tr: 'Mutluluk hormonları salgılıyorsun, şimdi endorfinleri de ekle! Spor yap, çifte mutluluk kazan! 🎊',
        en: 'You\'re releasing happiness hormones, now add endorphins too! Exercise, get double happiness! 🎊',
        emoji: '🎊'
      },
      {
        tr: 'Mutlu bir gün geçiriyorsun! Bu güzel günü bir aktiviteyle taçlandırmak ister misin? 👑',
        en: 'You\'re having a happy day! Would you like to crown this beautiful day with an activity? 👑',
        emoji: '👑'
      },
      {
        tr: 'Mutluluk bulaşıcıdır ama spor yapmak daha bulaşıcıdır! Hadi başlayalım! 🦠💪',
        en: 'Happiness is contagious but exercising is even more contagious! Let\'s start! 🦠💪',
        emoji: '🦠'
      }
    ],
    serious: [
      {
        tr: 'Mutluluğunuzu korumak için düzenli fiziksel aktivite önemlidir. Bugün hedefinize ulaşmak için bir adım atın.',
        en: 'Regular physical activity is important to maintain your happiness. Take a step today to reach your goal.',
        emoji: '📊'
      },
      {
        tr: 'Pozitif ruh hali, fiziksel aktiviteyle desteklendiğinde daha kalıcı olur. Bugünkü hedefinize odaklanın.',
        en: 'A positive mood becomes more lasting when supported by physical activity. Focus on today\'s goal.',
        emoji: '🎯'
      },
      {
        tr: 'Mutluluk ve sağlık birbirini tamamlar. Bugünkü aktivitelerinizle bu dengeyi koruyun.',
        en: 'Happiness and health complement each other. Maintain this balance with today\'s activities.',
        emoji: '⚖️'
      }
    ],
    motivational: [
      {
        tr: 'Mutlu bir ruh haliyle başladığın bu günü, hedefini tamamlayarak taçlandır!',
        en: 'Crown this day you started with a happy mood by completing your goal!',
        emoji: '✨'
      },
      {
        tr: 'Mutluluğun enerjisini kullanarak bugünkü hedefine ulaş!',
        en: 'Reach today\'s goal using the energy of your happiness!',
        emoji: '⚡'
      },
      {
        tr: 'Mutlu olduğun bu anı, sağlıklı bir aktiviteyle daha da güzelleştir!',
        en: 'Make this moment of happiness even more beautiful with a healthy activity!',
        emoji: '💎'
      }
    ]
  },
  cheerful: {
    funny: [
      {
        tr: 'Neşeli misin? Mükemmel! Şimdi bu neşeyi hareket enerjisine çevir ve zıpla zıpla zıpla! 🦘',
        en: 'Are you cheerful? Perfect! Now convert this cheerfulness into movement energy and jump jump jump! 🦘',
        emoji: '🦘'
      },
      {
        tr: 'Neşeli bir ruh halindesin! Bu enerjiyi kullanarak bugünkü hedefini bir çırpıda tamamla! 🚀',
        en: 'You\'re in a cheerful mood! Use this energy to complete today\'s goal in one go! 🚀',
        emoji: '🚀'
      },
      {
        tr: 'Neşen bulaşıcı! Şimdi bu neşeyi spor yaparak çoğalt ve herkese yay! 🎈',
        en: 'Your cheerfulness is contagious! Now multiply this cheerfulness by exercising and spread it to everyone! 🎈',
        emoji: '🎈'
      },
      {
        tr: 'Neşeli bir gün! Bu güzel günü bir aktiviteyle daha da güzelleştir. Hadi başla! 🌈',
        en: 'A cheerful day! Make this beautiful day even more beautiful with an activity. Let\'s start! 🌈',
        emoji: '🌈'
      },
      {
        tr: 'Neşeli ruh halin var! Şimdi bu neşeyi fiziksel aktiviteye dönüştür ve çifte kazan! 🎪',
        en: 'You have a cheerful mood! Now convert this cheerfulness into physical activity and double win! 🎪',
        emoji: '🎪'
      },
      {
        tr: 'Neşeli misin? Harika! Şimdi bu neşeyi kullanarak hedefini tamamla ve daha da neşeli ol! 🎭',
        en: 'Are you cheerful? Great! Now use this cheerfulness to complete your goal and be even more cheerful! 🎭',
        emoji: '🎭'
      }
    ],
    serious: [
      {
        tr: 'Neşeli bir ruh hali, fiziksel aktivite için mükemmel bir başlangıç noktasıdır. Bugünkü hedefinize odaklanın.',
        en: 'A cheerful mood is an excellent starting point for physical activity. Focus on today\'s goal.',
        emoji: '📈'
      },
      {
        tr: 'Pozitif enerjinizi fiziksel aktiviteye yönlendirerek hem ruhsal hem fiziksel sağlığınızı destekleyin.',
        en: 'Direct your positive energy to physical activity to support both your mental and physical health.',
        emoji: '🧘'
      }
    ],
    motivational: [
      {
        tr: 'Neşeli ruh halinle bugünkü hedefini tamamla ve bu güzel günü taçlandır!',
        en: 'Complete today\'s goal with your cheerful mood and crown this beautiful day!',
        emoji: '👑'
      },
      {
        tr: 'Neşenin gücünü kullanarak bugünkü aktivitelerini tamamla!',
        en: 'Complete today\'s activities using the power of your cheerfulness!',
        emoji: '💪'
      },
      {
        tr: 'Neşeli bir gün geçiriyorsun! Bu güzel günü bir aktiviteyle daha da güzelleştir!',
        en: 'You\'re having a cheerful day! Make this beautiful day even more beautiful with an activity!',
        emoji: '🌟'
      }
    ]
  },
  sad: {
    funny: [
      {
        tr: 'Üzgün müsün? Tamam, anlıyorum. Ama biliyor musun? Spor yapmak üzüntüyü kovmanın en eğlenceli yolu! Hadi, bir şeyler yapalım! 🎪',
        en: 'Are you sad? Okay, I understand. But you know what? Exercise is the funniest way to chase away sadness! Come on, let\'s do something! 🎪',
        emoji: '🎪'
      },
      {
        tr: 'Üzgün hissediyorsun ama endorfinler üzüntüyü yener! Hadi biraz hareket edelim, belki gülümsersin! 😊',
        en: 'You feel sad but endorphins beat sadness! Let\'s move a bit, maybe you\'ll smile! 😊',
        emoji: '😊'
      },
      {
        tr: 'Üzüntü geçicidir ama spor yapmanın verdiği mutluluk kalıcıdır! Hadi başlayalım! 🎈',
        en: 'Sadness is temporary but the happiness from exercising is lasting! Let\'s start! 🎈',
        emoji: '🎈'
      },
      {
        tr: 'Üzgün müsün? Tamam, ama şunu bil: Spor yapmak üzüntüyü kovmanın en iyi yoludur! Hadi deneyelim! 🦸',
        en: 'Are you sad? Okay, but know this: Exercise is the best way to chase away sadness! Let\'s try! 🦸',
        emoji: '🦸'
      },
      {
        tr: 'Üzüntü bir duygudur ama spor yapmak bir çözümdür! Hadi biraz hareket edelim! 🏃',
        en: 'Sadness is an emotion but exercise is a solution! Let\'s move a bit! 🏃',
        emoji: '🏃'
      }
    ],
    serious: [
      {
        tr: 'Üzgün hissettiğinizde fiziksel aktivite, ruh halinizi iyileştirmenin bilimsel olarak kanıtlanmış bir yoludur. Bugün küçük bir adım atın.',
        en: 'When you feel sad, physical activity is a scientifically proven way to improve your mood. Take a small step today.',
        emoji: '🔬'
      },
      {
        tr: 'Düzenli egzersiz, depresyon ve üzüntü belirtilerini azaltmada etkilidir. Bugünkü hedefinize odaklanın.',
        en: 'Regular exercise is effective in reducing symptoms of depression and sadness. Focus on today\'s goal.',
        emoji: '📊'
      },
      {
        tr: 'Fiziksel aktivite, beyinde mutluluk hormonlarının salınımını artırır. Bugün bir aktivite yapmayı düşünün.',
        en: 'Physical activity increases the release of happiness hormones in the brain. Consider doing an activity today.',
        emoji: '🧠'
      }
    ],
    motivational: [
      {
        tr: 'Üzüntü geçicidir ama sen güçlüsün. Bugünkü hedefine ulaşarak kendini güçlendir!',
        en: 'Sadness is temporary but you are strong. Strengthen yourself by reaching today\'s goal!',
        emoji: '💪'
      },
      {
        tr: 'Her zor gün, seni daha güçlü yapar. Bugünkü aktivitelerinle bu gücü artır!',
        en: 'Every difficult day makes you stronger. Increase this strength with today\'s activities!',
        emoji: '🌟'
      },
      {
        tr: 'Üzüntü seni durduramaz. Bugünkü hedefine ulaş ve kendini gururlandır!',
        en: 'Sadness cannot stop you. Reach today\'s goal and make yourself proud!',
        emoji: '🏆'
      },
      {
        tr: 'Zor günler geçer ama senin gücün kalıcıdır. Bugünkü hedefini tamamla!',
        en: 'Difficult days pass but your strength is lasting. Complete today\'s goal!',
        emoji: '⚡'
      }
    ]
  },
  unhappy: {
    funny: [
      {
        tr: 'Mutsuz musun? Tamam, anlıyorum. Ama şunu bil: Spor yapmak mutsuzluğu kovmanın en eğlenceli yolu! Hadi deneyelim! 🎭',
        en: 'Are you unhappy? Okay, I understand. But know this: Exercise is the funniest way to chase away unhappiness! Let\'s try! 🎭',
        emoji: '🎭'
      },
      {
        tr: 'Mutsuz hissediyorsun ama endorfinler mutsuzluğu yener! Hadi biraz hareket edelim! 🎪',
        en: 'You feel unhappy but endorphins beat unhappiness! Let\'s move a bit! 🎪',
        emoji: '🎪'
      },
      {
        tr: 'Mutsuzluk geçicidir ama spor yapmanın verdiği mutluluk kalıcıdır! Hadi başlayalım! 🎈',
        en: 'Unhappiness is temporary but the happiness from exercising is lasting! Let\'s start! 🎈',
        emoji: '🎈'
      },
      {
        tr: 'Mutsuz musun? Tamam, ama şunu bil: Spor yapmak mutsuzluğu kovmanın en iyi yoludur! Hadi deneyelim! 🦸',
        en: 'Are you unhappy? Okay, but know this: Exercise is the best way to chase away unhappiness! Let\'s try! 🦸',
        emoji: '🦸'
      },
      {
        tr: 'Mutsuzluk bir duygudur ama spor yapmak bir çözümdür! Hadi biraz hareket edelim! 🏃',
        en: 'Unhappiness is an emotion but exercise is a solution! Let\'s move a bit! 🏃',
        emoji: '🏃'
      }
    ],
    serious: [
      {
        tr: 'Mutsuz hissettiğinizde fiziksel aktivite, ruh halinizi iyileştirmenin bilimsel olarak kanıtlanmış bir yoludur. Bugün küçük bir adım atın.',
        en: 'When you feel unhappy, physical activity is a scientifically proven way to improve your mood. Take a small step today.',
        emoji: '🔬'
      },
      {
        tr: 'Düzenli egzersiz, olumsuz duyguları yönetmede etkilidir. Bugünkü hedefinize odaklanın.',
        en: 'Regular exercise is effective in managing negative emotions. Focus on today\'s goal.',
        emoji: '📊'
      },
      {
        tr: 'Fiziksel aktivite, beyinde mutluluk hormonlarının salınımını artırır. Bugün bir aktivite yapmayı düşünün.',
        en: 'Physical activity increases the release of happiness hormones in the brain. Consider doing an activity today.',
        emoji: '🧠'
      }
    ],
    motivational: [
      {
        tr: 'Mutsuzluk geçicidir ama sen güçlüsün. Bugünkü hedefine ulaşarak kendini güçlendir!',
        en: 'Unhappiness is temporary but you are strong. Strengthen yourself by reaching today\'s goal!',
        emoji: '💪'
      },
      {
        tr: 'Her zor gün, seni daha güçlü yapar. Bugünkü aktivitelerinle bu gücü artır!',
        en: 'Every difficult day makes you stronger. Increase this strength with today\'s activities!',
        emoji: '🌟'
      },
      {
        tr: 'Mutsuzluk seni durduramaz. Bugünkü hedefine ulaş ve kendini gururlandır!',
        en: 'Unhappiness cannot stop you. Reach today\'s goal and make yourself proud!',
        emoji: '🏆'
      },
      {
        tr: 'Zor günler geçer ama senin gücün kalıcıdır. Bugünkü hedefini tamamla!',
        en: 'Difficult days pass but your strength is lasting. Complete today\'s goal!',
        emoji: '⚡'
      }
    ]
  },
  tired: {
    funny: [
      {
        tr: 'Yorgun musun? Anladım, ama şunu bil: Bazen yorgunluk sadece hareketsizlikten kaynaklanır! Hadi biraz hareket edelim, belki enerjin gelir! ⚡',
        en: 'Are you tired? I understand, but know this: Sometimes tiredness comes from just being inactive! Let\'s move a bit, maybe your energy will come! ⚡',
        emoji: '⚡'
      },
      {
        tr: 'Yorgun hissediyorsun ama hafif bir aktivite enerji verebilir! Denemeye değer, değil mi? 🎯',
        en: 'You feel tired but a light activity can give energy! Worth a try, right? 🎯',
        emoji: '🎯'
      },
      {
        tr: 'Yorgun musun? Tamam, ama şunu bil: Bazen en iyi dinlenme aktif dinlenmedir! Hadi hafif bir şeyler yapalım! 🧘',
        en: 'Are you tired? Okay, but know this: Sometimes the best rest is active rest! Let\'s do something light! 🧘',
        emoji: '🧘'
      },
      {
        tr: 'Yorgunluk geçicidir ama spor yapmanın verdiği enerji kalıcıdır! Hadi başlayalım! 🚀',
        en: 'Tiredness is temporary but the energy from exercising is lasting! Let\'s start! 🚀',
        emoji: '🚀'
      },
      {
        tr: 'Yorgun musun? Tamam, ama şunu bil: Hafif bir aktivite yorgunluğu kovabilir! Hadi deneyelim! 🎪',
        en: 'Are you tired? Okay, but know this: A light activity can chase away tiredness! Let\'s try! 🎪',
        emoji: '🎪'
      },
      {
        tr: 'Yorgunluk bir duygudur ama spor yapmak bir çözümdür! Hadi biraz hareket edelim! 🏃',
        en: 'Tiredness is an emotion but exercise is a solution! Let\'s move a bit! 🏃',
        emoji: '🏃'
      }
    ],
    serious: [
      {
        tr: 'Yorgun hissettiğinizde hafif fiziksel aktivite, enerji seviyenizi artırabilir. Bugün küçük bir adım atmayı düşünün.',
        en: 'When you feel tired, light physical activity can increase your energy level. Consider taking a small step today.',
        emoji: '🔋'
      },
      {
        tr: 'Kronik yorgunluk durumunda, doktorunuza danışın. Hafif aktiviteler enerji seviyenizi destekleyebilir.',
        en: 'In case of chronic fatigue, consult your doctor. Light activities can support your energy level.',
        emoji: '🏥'
      },
      {
        tr: 'Düzenli hafif egzersiz, yorgunluk belirtilerini azaltmada etkilidir. Bugünkü hedefinize odaklanın.',
        en: 'Regular light exercise is effective in reducing fatigue symptoms. Focus on today\'s goal.',
        emoji: '📊'
      }
    ],
    motivational: [
      {
        tr: 'Yorgunluk geçicidir ama sen güçlüsün. Bugünkü hedefine ulaşarak kendini güçlendir!',
        en: 'Tiredness is temporary but you are strong. Strengthen yourself by reaching today\'s goal!',
        emoji: '💪'
      },
      {
        tr: 'Her zor gün, seni daha güçlü yapar. Bugünkü aktivitelerinle bu gücü artır!',
        en: 'Every difficult day makes you stronger. Increase this strength with today\'s activities!',
        emoji: '🌟'
      },
      {
        tr: 'Yorgunluk seni durduramaz. Bugünkü hedefine ulaş ve kendini gururlandır!',
        en: 'Tiredness cannot stop you. Reach today\'s goal and make yourself proud!',
        emoji: '🏆'
      },
      {
        tr: 'Zor günler geçer ama senin gücün kalıcıdır. Bugünkü hedefini tamamla!',
        en: 'Difficult days pass but your strength is lasting. Complete today\'s goal!',
        emoji: '⚡'
      }
    ]
  }
};

const defaultMessages: MessageSet = {
  funny: [
    {
      tr: 'Hadi başlayalım! Bugün henüz aktivite yok ama bu değişebilir! 🚀',
      en: 'Let\'s get started! No activities today yet but this can change! 🚀',
      emoji: '🚀'
    },
    {
      tr: 'Yan gelip yatma zamanı değil! Hadi biraz hareket edelim! 💪',
      en: 'It\'s not time to lie down! Let\'s move a bit! 💪',
      emoji: '💪'
    },
    {
      tr: 'Hedefin altındasın ama bu bir sorun değil, bir fırsat! Hadi başla! 🎯',
      en: 'You\'re below your goal but this is not a problem, it\'s an opportunity! Let\'s start! 🎯',
      emoji: '🎯'
    }
  ],
  serious: [
    {
      tr: 'Bugün henüz aktivite kaydetmediniz. Günlük hedefinize ulaşmak için bir aktivite eklemeyi düşünün.',
      en: 'You haven\'t logged any activities today. Consider adding an activity to reach your daily goal.',
      emoji: '📊'
    }
  ],
  motivational: [
    {
      tr: 'Her yolculuk tek bir adımla başlar. Bugün ilk adımı at!',
      en: 'Every journey begins with a single step. Take the first step today!',
      emoji: '👣'
    }
  ]
};

export function getMotivationalMessage(
  progress: number,
  hasActivities: boolean,
  mood: Mood = null
): MotivationalMessage | null {
  // No activities today
  if (!hasActivities && progress === 0) {
    const messageSet = mood ? messagesByMood[mood] : defaultMessages;
    const messages = [...messageSet.funny, ...messageSet.motivational];
    if (messages.length === 0) return null;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Get message set based on mood
  const messageSet = mood ? messagesByMood[mood] : defaultMessages;
  
  // Choose message type based on progress
  let messageType: 'funny' | 'serious' | 'motivational' = 'motivational';
  
  if (progress < 25) {
    // Very low progress - mix of funny and motivational
    messageType = Math.random() > 0.5 ? 'funny' : 'motivational';
  } else if (progress < 50) {
    // Low progress - motivational
    messageType = 'motivational';
  } else if (progress < 75) {
    // Good progress - mix
    messageType = Math.random() > 0.3 ? 'motivational' : 'funny';
  } else if (progress < 100) {
    // Almost there - motivational
    messageType = 'motivational';
  } else {
    // Goal completed - motivational
    messageType = 'motivational';
  }

  const messages = messageSet[messageType];
  if (messages.length === 0) {
    // Fallback to default messages
    const defaultSet = defaultMessages[messageType];
    if (defaultSet.length === 0) return null;
    return defaultSet[Math.floor(Math.random() * defaultSet.length)];
  }

  return messages[Math.floor(Math.random() * messages.length)];
}
