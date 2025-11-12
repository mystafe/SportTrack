export type Quote = {
  tr: string;
  en: string;
};

export const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    tr: 'Her adım, hedefe giden yolda bir zaferdir.',
    en: 'Every step is a victory on the path to your goal.'
  },
  {
    tr: 'Bugün yaptığın küçük çabalar, yarın büyük farklar yaratır.',
    en: 'Today\'s small efforts create tomorrow\'s big differences.'
  },
  {
    tr: 'Spor yapmak sadece vücudu değil, ruhu da güçlendirir.',
    en: 'Exercise strengthens not just the body, but the soul.'
  },
  {
    tr: 'Hedefine ulaşmak için ilk adımı at: Bugün başla!',
    en: 'Take the first step toward your goal: Start today!'
  },
  {
    tr: 'Her gün biraz daha iyi olmak için çalış.',
    en: 'Work to be a little better every day.'
  },
  {
    tr: 'Başarı, küçük çabaların toplamıdır.',
    en: 'Success is the sum of small efforts.'
  },
  {
    tr: 'Vücudunun sınırlarını zorla, zihninin sınırlarını aş.',
    en: 'Push your body\'s limits, exceed your mind\'s boundaries.'
  },
  {
    tr: 'Bugün yapmadığın egzersiz, yarın pişman olacağın seçimdir.',
    en: 'The exercise you skip today is the regret you\'ll have tomorrow.'
  },
  {
    tr: 'Hedefine giden yol, her gün atılan küçük adımlarla başlar.',
    en: 'The path to your goal starts with small steps taken every day.'
  },
  {
    tr: 'Spor yapmak bir yaşam tarzıdır, bir görev değil.',
    en: 'Exercise is a lifestyle, not a chore.'
  },
  {
    tr: 'Disiplin, motivasyon bittiğinde devreye girer.',
    en: 'Discipline kicks in when motivation runs out.'
  },
  {
    tr: 'Zor günler geçer, ama güçlü insanlar kalır.',
    en: 'Tough days pass, but strong people remain.'
  },
  {
    tr: 'Başarısızlık, başarıya giden yolun bir parçasıdır.',
    en: 'Failure is part of the path to success.'
  },
  {
    tr: 'Kendinle yarış, başkalarıyla değil.',
    en: 'Race against yourself, not others.'
  },
  {
    tr: 'Her şampiyon bir zamanlar başlangıçtaydı.',
    en: 'Every champion was once a beginner.'
  },
  {
    tr: 'Sınırlar sadece kafanda var.',
    en: 'Limits exist only in your mind.'
  },
  {
    tr: 'Bugün yapabileceğin en iyi şey, dün yapmadığın şeydir.',
    en: 'The best thing you can do today is what you didn\'t do yesterday.'
  },
  {
    tr: 'Hedefler hayaller değil, planlardır.',
    en: 'Goals are not dreams, they are plans.'
  },
  {
    tr: 'İlerleme mükemmellikten daha önemlidir.',
    en: 'Progress is more important than perfection.'
  },
  {
    tr: 'Kendine inan, çünkü başka kimse yapmayacak.',
    en: 'Believe in yourself, because no one else will.'
  },
  {
    tr: 'Her gün yeni bir başlangıçtır.',
    en: 'Every day is a new beginning.'
  },
  {
    tr: 'Zorluklar seni durduramaz, sadece yavaşlatabilir.',
    en: 'Challenges can\'t stop you, they can only slow you down.'
  },
  {
    tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
    en: 'Success is the meeting of preparation and opportunity.'
  },
  {
    tr: 'Kendini geliştirmek, en iyi yatırımdır.',
    en: 'Investing in yourself is the best investment.'
  },
  {
    tr: 'Hedeflerine ulaşmak için sabırlı ol.',
    en: 'Be patient in reaching your goals.'
  },
  {
    tr: 'Her gün biraz daha ileri git.',
    en: 'Go a little further each day.'
  },
  {
    tr: 'Güçlü olmak için zayıf olmak gerekir.',
    en: 'You must be weak to become strong.'
  },
  {
    tr: 'Başarı, küçük çabaların tekrarıdır.',
    en: 'Success is the repetition of small efforts.'
  },
  {
    tr: 'Kendini zorla, çünkü kimse senin için yapmayacak.',
    en: 'Push yourself, because no one else will do it for you.'
  },
  {
    tr: 'Her şey imkansız görünür, ta ki yapılana kadar.',
    en: 'Everything seems impossible until it\'s done.'
  },
  {
    tr: 'Bugünün işini yarına bırakma.',
    en: 'Don\'t leave today\'s work for tomorrow.'
  },
  {
    tr: 'Hedeflerin için çalış, hayallerin için değil.',
    en: 'Work for your goals, not your dreams.'
  },
  {
    tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
    en: 'Success is the meeting of preparation and opportunity.'
  },
  {
    tr: 'Kendini geliştirmek, en iyi yatırımdır.',
    en: 'Investing in yourself is the best investment.'
  },
  {
    tr: 'Her gün biraz daha ileri git.',
    en: 'Go a little further each day.'
  },
  {
    tr: 'Güçlü olmak için zayıf olmak gerekir.',
    en: 'You must be weak to become strong.'
  },
  {
    tr: 'Başarı, küçük çabaların tekrarıdır.',
    en: 'Success is the repetition of small efforts.'
  },
  {
    tr: 'Kendini zorla, çünkü kimse senin için yapmayacak.',
    en: 'Push yourself, because no one else will do it for you.'
  },
  {
    tr: 'Her şey imkansız görünür, ta ki yapılana kadar.',
    en: 'Everything seems impossible until it\'s done.'
  },
  {
    tr: 'Bugünün işini yarına bırakma.',
    en: 'Don\'t leave today\'s work for tomorrow.'
  },
  {
    tr: 'Hedeflerin için çalış, hayallerin için değil.',
    en: 'Work for your goals, not your dreams.'
  }
];

export function getRandomQuote(): Quote {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
