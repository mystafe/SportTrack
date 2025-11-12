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
  }
];

export function getRandomQuote(): Quote {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

