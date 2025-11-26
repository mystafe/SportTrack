export type Quote = {
  tr: string;
  en: string;
  category?:
    | 'motivational'
    | 'discipline'
    | 'success'
    | 'perseverance'
    | 'fitness'
    | 'mental-health'
    | 'inspirational';
};

export type QuoteCategory = Quote['category'];

// Helper function to remove duplicates
function removeDuplicateQuotes(quotes: Quote[]): Quote[] {
  const seen = new Set<string>();
  return quotes.filter((quote) => {
    const key = `${quote.tr}|${quote.en}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export const MOTIVATIONAL_QUOTES: Quote[] = removeDuplicateQuotes([
  // Motivational Quotes
  {
    tr: 'Her adım, hedefe giden yolda bir zaferdir.',
    en: 'Every step is a victory on the path to your goal.',
    category: 'motivational',
  },
  {
    tr: 'Bugün yaptığın küçük çabalar, yarın büyük farklar yaratır.',
    en: "Today's small efforts create tomorrow's big differences.",
    category: 'motivational',
  },
  {
    tr: 'Spor yapmak sadece vücudu değil, ruhu da güçlendirir.',
    en: 'Exercise strengthens not just the body, but the soul.',
    category: 'motivational',
  },
  {
    tr: 'Hedefine ulaşmak için ilk adımı at: Bugün başla!',
    en: 'Take the first step toward your goal: Start today!',
    category: 'motivational',
  },
  {
    tr: 'Her gün biraz daha iyi olmak için çalış.',
    en: 'Work to be a little better every day.',
    category: 'motivational',
  },
  {
    tr: 'Vücudunun sınırlarını zorla, zihninin sınırlarını aş.',
    en: "Push your body's limits, exceed your mind's boundaries.",
    category: 'motivational',
  },
  {
    tr: 'Bugün yapmadığın egzersiz, yarın pişman olacağın seçimdir.',
    en: "The exercise you skip today is the regret you'll have tomorrow.",
    category: 'motivational',
  },
  {
    tr: 'Hedefine giden yol, her gün atılan küçük adımlarla başlar.',
    en: 'The path to your goal starts with small steps taken every day.',
    category: 'motivational',
  },
  {
    tr: 'Spor yapmak bir yaşam tarzıdır, bir görev değil.',
    en: 'Exercise is a lifestyle, not a chore.',
    category: 'motivational',
  },
  {
    tr: 'Hedefine giden yol, her gün atılan küçük adımlarla başlar.',
    en: 'The path to your goal starts with small steps taken every day.',
    category: 'motivational',
  },
  {
    tr: 'Kendini geliştirmek, en iyi yatırımdır.',
    en: 'Investing in yourself is the best investment.',
    category: 'motivational',
  },
  {
    tr: 'Hedeflerine ulaşmak için sabırlı ol.',
    en: 'Be patient in reaching your goals.',
    category: 'motivational',
  },
  {
    tr: 'Her gün biraz daha ileri git.',
    en: 'Go a little further each day.',
    category: 'motivational',
  },
  {
    tr: 'Güçlü olmak için zayıf olmak gerekir.',
    en: 'You must be weak to become strong.',
    category: 'motivational',
  },
  {
    tr: 'Kendini zorla, çünkü kimse senin için yapmayacak.',
    en: 'Push yourself, because no one else will do it for you.',
    category: 'motivational',
  },
  {
    tr: 'Bugünün işini yarına bırakma.',
    en: "Don't leave today's work for tomorrow.",
    category: 'motivational',
  },
  {
    tr: 'Hedeflerin için çalış, hayallerin için değil.',
    en: 'Work for your goals, not your dreams.',
    category: 'motivational',
  },
  {
    tr: 'Vücudun bir tapınaktır, ona saygı göster.',
    en: 'Your body is a temple, respect it.',
    category: 'motivational',
  },
  {
    tr: 'Zorlu antrenmanlar, güçlü karakterler yaratır.',
    en: 'Tough workouts build strong characters.',
    category: 'motivational',
  },
  {
    tr: 'Bugün yapmadığın şey, yarın seni geride bırakır.',
    en: "What you don't do today will leave you behind tomorrow.",
    category: 'motivational',
  },
  {
    tr: 'Her ter damlası, başarıya giden yolda bir adımdır.',
    en: 'Every drop of sweat is a step toward success.',
    category: 'motivational',
  },
  {
    tr: 'Güçlü olmak bir seçimdir, zayıf olmak değil.',
    en: 'Being strong is a choice, not being weak.',
    category: 'motivational',
  },
  {
    tr: 'Hedeflerin için mücadele et, pes etme.',
    en: 'Fight for your goals, never give up.',
    category: 'motivational',
  },
  {
    tr: 'Küçük başlangıçlar, büyük sonuçlar doğurur.',
    en: 'Small beginnings lead to great results.',
    category: 'motivational',
  },
  {
    tr: 'Her gün bir fırsattır, onu değerlendir.',
    en: 'Every day is an opportunity, make the most of it.',
    category: 'motivational',
  },
  {
    tr: 'Vücudunun sınırlarını keşfet, sonra onları aş.',
    en: "Discover your body's limits, then exceed them.",
    category: 'motivational',
  },
  {
    tr: 'Her antrenman, seni daha iyi bir versiyona dönüştürür.',
    en: 'Every workout transforms you into a better version.',
    category: 'motivational',
  },
  {
    tr: 'Güçlü olmak, zorlu günlerde ortaya çıkar.',
    en: 'Strength shows itself in tough days.',
    category: 'motivational',
  },
  {
    tr: 'Spor yapmak, kendine verdiğin bir sözdür.',
    en: 'Exercise is a promise you make to yourself.',
    category: 'motivational',
  },
  {
    tr: 'Her gün biraz daha güçlü ol.',
    en: 'Get a little stronger every day.',
    category: 'motivational',
  },
  {
    tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
    en: 'Success is when preparation meets opportunity.',
    category: 'motivational',
  },
  {
    tr: 'Her gün yeni bir başlangıç, yeni bir fırsat.',
    en: 'Every day is a new beginning, a new opportunity.',
    category: 'motivational',
  },
  // Discipline Quotes
  {
    tr: 'Disiplin, motivasyon bittiğinde devreye girer.',
    en: 'Discipline kicks in when motivation runs out.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, özgürlüğün anahtarıdır.',
    en: 'Discipline is the key to freedom.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, gelecekteki senin için bugünkü senin yapabileceği en iyi şeydir.',
    en: 'Being disciplined is the best thing you can do today for your future self.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, tutarlılık demektir.',
    en: 'Discipline means consistency.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin olmadan başarı imkansızdır.',
    en: 'Success is impossible without discipline.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, hedeflerine ulaşmanın tek yoludur.',
    en: 'Discipline is the only way to reach your goals.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli bir rutin, güçlü bir karakter yaratır.',
    en: 'A disciplined routine builds a strong character.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendine verdiğin bir sözdür.',
    en: 'Discipline is a promise you make to yourself.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, zevkleri ertelemek demektir.',
    en: 'Discipline means delaying gratification.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kolay olanı değil doğru olanı seçmektir.',
    en: 'Being disciplined means choosing what is right, not what is easy.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarıya giden en kısa yoldur.',
    en: 'Discipline is the shortest path to success.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, alışkanlıkların gücüdür.',
    en: 'Discipline is the power of habits.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli bir yaşam, özgür bir yaşamdır.',
    en: 'A disciplined life is a free life.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendini kontrol etmektir.',
    en: 'Discipline is self-control.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin olmadan hiçbir şey mümkün değildir.',
    en: 'Nothing is possible without discipline.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, bugün yapmak istemediğin şeyi yapmaktır.',
    en: 'Discipline is doing what you do not want to do today.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kendine saygıdır.',
    en: 'Being disciplined is self-respect.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, hedeflerine sadık kalmaktır.',
    en: 'Discipline is staying true to your goals.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarı için gerekli olan tek şeydir.',
    en: 'Discipline is the only thing needed for success.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli bir zihin, güçlü bir zihindir.',
    en: 'A disciplined mind is a strong mind.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendini geliştirmenin temelidir.',
    en: 'Discipline is the foundation of self-improvement.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin olmadan ilerleme olmaz.',
    en: 'There is no progress without discipline.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, tutarlı eylemlerin toplamıdır.',
    en: 'Discipline is the sum of consistent actions.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, geleceğe yatırım yapmaktır.',
    en: 'Being disciplined is investing in the future.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, karakterin gerçek göstergesidir.',
    en: 'Discipline is the true measure of character.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarılı insanların ortak özelliğidir.',
    en: 'Discipline is what successful people have in common.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendini kontrol etme sanatıdır.',
    en: 'Discipline is the art of self-control.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kendine güvenmektir.',
    en: 'Being disciplined is trusting yourself.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, hedeflerine ulaşmanın garantisidir.',
    en: 'Discipline is the guarantee of reaching your goals.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarı için gerekli olan tek beceridir.',
    en: 'Discipline is the only skill needed for success.',
    category: 'discipline',
  },
  // Success Quotes
  {
    tr: 'Başarı, küçük çabaların toplamıdır.',
    en: 'Success is the sum of small efforts.',
    category: 'success',
  },
  {
    tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
    en: 'Success is the meeting of preparation and opportunity.',
    category: 'success',
  },
  {
    tr: 'Başarı, tutarlılığın çocuğudur.',
    en: 'Success is the child of consistency.',
    category: 'success',
  },
  {
    tr: 'Başarı, küçük çabaların tekrarıdır.',
    en: 'Success is the repetition of small efforts.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak değil, ilerlemektir.',
    en: 'Success is not reaching your goals, it is progress.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendinle yarışmaktır.',
    en: 'Success is racing against yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, her gün biraz daha iyi olmaktır.',
    en: 'Success is being a little better every day.',
    category: 'success',
  },
  {
    tr: 'Başarı, pes etmemektir.',
    en: 'Success is not giving up.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine sadık kalmaktır.',
    en: 'Success is staying true to your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendine inanmaktır.',
    en: 'Success is believing in yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, zorlukların üstesinden gelmektir.',
    en: 'Success is overcoming challenges.',
    category: 'success',
  },
  {
    tr: 'Başarı, ilerleme kaydetmektir.',
    en: 'Success is making progress.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için çalışmaktır.',
    en: 'Success is working towards your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini geliştirmektir.',
    en: 'Success is improving yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, tutarlı olmaktır.',
    en: 'Success is being consistent.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için sabırlı olmaktır.',
    en: 'Success is being patient in reaching your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini zorlamaktır.',
    en: 'Success is pushing yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için mücadele etmektir.',
    en: 'Success is fighting for your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendine yatırım yapmaktır.',
    en: 'Success is investing in yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için çalışmaya devam etmektir.',
    en: 'Success is continuing to work towards your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini geliştirmeye devam etmektir.',
    en: 'Success is continuing to improve yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için sabırlı ve tutarlı olmaktır.',
    en: 'Success is being patient and consistent in reaching your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini zorlamaya devam etmektir.',
    en: 'Success is continuing to push yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için mücadele etmeye devam etmektir.',
    en: 'Success is continuing to fight for your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendine yatırım yapmaya devam etmektir.',
    en: 'Success is continuing to invest in yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için çalışmaktan vazgeçmemektir.',
    en: 'Success is not giving up on working towards your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini geliştirmekten vazgeçmemektir.',
    en: 'Success is not giving up on improving yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için sabırlı ve tutarlı olmaktan vazgeçmemektir.',
    en: 'Success is not giving up on being patient and consistent.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini zorlamaktan vazgeçmemektir.',
    en: 'Success is not giving up on pushing yourself.',
    category: 'success',
  },
  // Perseverance Quotes
  {
    tr: 'Pes etme, devam et.',
    en: "Don't give up, keep going.",
    category: 'perseverance',
  },
  {
    tr: 'Zorluklar seni durduramaz, sadece yavaşlatabilir.',
    en: "Challenges can't stop you, they can only slow you down.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü en zor anlar, en büyük dönüşümlerin başladığı andır.',
    en: "Don't give up, because the hardest moments are when the greatest transformations begin.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarıya ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to success.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü başarı, pes etmeyenlerindir.',
    en: "Don't give up, because success belongs to those who don't give up.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, hedeflerine ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to reaching your goals.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü her zorluk, seni daha güçlü yapar.',
    en: "Don't give up, because every challenge makes you stronger.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü başarı, pes etmeyenlerindir.',
    en: "Don't give up, because success belongs to those who don't give up.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, hedeflerine ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to reaching your goals.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü her zorluk, seni daha güçlü yapar.',
    en: "Don't give up, because every challenge makes you stronger.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü başarı, pes etmeyenlerindir.',
    en: "Don't give up, because success belongs to those who don't give up.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, hedeflerine ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to reaching your goals.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü her zorluk, seni daha güçlü yapar.',
    en: "Don't give up, because every challenge makes you stronger.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü başarı, pes etmeyenlerindir.',
    en: "Don't give up, because success belongs to those who don't give up.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, hedeflerine ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to reaching your goals.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü her zorluk, seni daha güçlü yapar.',
    en: "Don't give up, because every challenge makes you stronger.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  // Fitness Quotes
  {
    tr: 'Spor yapmak, kendine yapabileceğin en iyi yatırımdır.',
    en: 'Exercise is the best investment you can make in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, hayat kalitesini artırır.',
    en: 'Exercise improves your quality of life.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, zihinsel gücü de geliştirir.',
    en: 'Exercise also develops mental strength.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine verdiğin bir sözdür.',
    en: 'Exercise is a promise you make to yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, bir yaşam tarzıdır, bir görev değil.',
    en: 'Exercise is a lifestyle, not a chore.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, vücudunun sınırlarını keşfetmektir.',
    en: "Exercise is discovering your body's limits.",
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini geliştirmektir.',
    en: 'Exercise is improving yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine saygıdır.',
    en: 'Exercise is self-respect.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine yatırım yapmaktır.',
    en: 'Exercise is investing in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmektir.',
    en: 'Exercise is strengthening yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini zorlamaktır.',
    en: 'Exercise is pushing yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini geliştirmeye devam etmektir.',
    en: 'Exercise is continuing to improve yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine saygı göstermektir.',
    en: 'Exercise is showing respect to yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine yatırım yapmaya devam etmektir.',
    en: 'Exercise is continuing to invest in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmeye devam etmektir.',
    en: 'Exercise is continuing to strengthen yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini zorlamaya devam etmektir.',
    en: 'Exercise is continuing to push yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini geliştirmekten vazgeçmemektir.',
    en: 'Exercise is not giving up on improving yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine saygı göstermekten vazgeçmemektir.',
    en: 'Exercise is not giving up on showing respect to yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine yatırım yapmaktan vazgeçmemektir.',
    en: 'Exercise is not giving up on investing in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmekten vazgeçmemektir.',
    en: 'Exercise is not giving up on strengthening yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini zorlamaktan vazgeçmemektir.',
    en: 'Exercise is not giving up on pushing yourself.',
    category: 'fitness',
  },
  // Mental Health Quotes
  {
    tr: 'Zihinsel sağlık, fiziksel sağlık kadar önemlidir.',
    en: 'Mental health is as important as physical health.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, fiziksel güçten daha önemlidir.',
    en: 'Mental strength is more important than physical strength.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, başarının temelidir.',
    en: 'Mental health is the foundation of success.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, her şeyin başlangıcıdır.',
    en: 'Mental strength is the beginning of everything.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine yapabileceğin en iyi yatırımdır.',
    en: 'Mental health is the best investment you can make in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini geliştirmektir.',
    en: 'Mental strength is improving yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine saygıdır.',
    en: 'Mental health is self-respect.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendine yatırım yapmaktır.',
    en: 'Mental strength is investing in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini güçlendirmektir.',
    en: 'Mental health is strengthening yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini zorlamaktır.',
    en: 'Mental strength is pushing yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini geliştirmeye devam etmektir.',
    en: 'Mental health is continuing to improve yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendine saygı göstermektir.',
    en: 'Mental strength is showing respect to yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine yatırım yapmaya devam etmektir.',
    en: 'Mental health is continuing to invest in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini güçlendirmeye devam etmektir.',
    en: 'Mental strength is continuing to strengthen yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini zorlamaya devam etmektir.',
    en: 'Mental health is continuing to push yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini geliştirmekten vazgeçmemektir.',
    en: 'Mental strength is not giving up on improving yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine saygı göstermekten vazgeçmemektir.',
    en: 'Mental health is not giving up on showing respect to yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendine yatırım yapmaktan vazgeçmemektir.',
    en: 'Mental strength is not giving up on investing in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini güçlendirmekten vazgeçmemektir.',
    en: 'Mental health is not giving up on strengthening yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini zorlamaktan vazgeçmemektir.',
    en: 'Mental strength is not giving up on pushing yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, başarının temelidir.',
    en: 'Mental health is the foundation of success.',
    category: 'mental-health',
  },
  // Inspirational Quotes
  {
    tr: 'Her şampiyon bir zamanlar başlangıçtaydı.',
    en: 'Every champion was once a beginner.',
    category: 'inspirational',
  },
  {
    tr: 'Sınırlar sadece kafanda var.',
    en: 'Limits exist only in your mind.',
    category: 'inspirational',
  },
  {
    tr: 'Her şey imkansız görünür, ta ki yapılana kadar.',
    en: "Everything seems impossible until it's done.",
    category: 'inspirational',
  },
  {
    tr: 'Kendine inan, çünkü başka kimse yapmayacak.',
    en: 'Believe in yourself, because no one else will.',
    category: 'inspirational',
  },
  {
    tr: 'Her gün yeni bir başlangıçtır.',
    en: 'Every day is a new beginning.',
    category: 'inspirational',
  },
  {
    tr: 'Kendinle yarış, başkalarıyla değil.',
    en: 'Race against yourself, not others.',
    category: 'inspirational',
  },
  {
    tr: 'Başarısızlık, başarıya giden yolun bir parçasıdır.',
    en: 'Failure is part of the path to success.',
    category: 'inspirational',
  },
  {
    tr: 'Zor günler geçer, ama güçlü insanlar kalır.',
    en: 'Tough days pass, but strong people remain.',
    category: 'inspirational',
  },
  {
    tr: 'İlerleme mükemmellikten daha önemlidir.',
    en: 'Progress is more important than perfection.',
    category: 'inspirational',
  },
  {
    tr: 'Hedefler hayaller değil, planlardır.',
    en: 'Goals are not dreams, they are plans.',
    category: 'inspirational',
  },
  {
    tr: 'Bugün yapabileceğin en iyi şey, dün yapmadığın şeydir.',
    en: "The best thing you can do today is what you didn't do yesterday.",
    category: 'inspirational',
  },
  {
    tr: 'Her şampiyon bir zamanlar başlangıçtaydı.',
    en: 'Every champion was once a beginner.',
    category: 'inspirational',
  },
  {
    tr: 'Sınırlar sadece kafanda var.',
    en: 'Limits exist only in your mind.',
    category: 'inspirational',
  },
  {
    tr: 'Her şey imkansız görünür, ta ki yapılana kadar.',
    en: "Everything seems impossible until it's done.",
    category: 'inspirational',
  },
  {
    tr: 'Kendine inan, çünkü başka kimse yapmayacak.',
    en: 'Believe in yourself, because no one else will.',
    category: 'inspirational',
  },
  {
    tr: 'Her gün yeni bir başlangıçtır.',
    en: 'Every day is a new beginning.',
    category: 'inspirational',
  },
  {
    tr: 'Kendinle yarış, başkalarıyla değil.',
    en: 'Race against yourself, not others.',
    category: 'inspirational',
  },
  {
    tr: 'Başarısızlık, başarıya giden yolun bir parçasıdır.',
    en: 'Failure is part of the path to success.',
    category: 'inspirational',
  },
  {
    tr: 'Zor günler geçer, ama güçlü insanlar kalır.',
    en: 'Tough days pass, but strong people remain.',
    category: 'inspirational',
  },
  {
    tr: 'İlerleme mükemmellikten daha önemlidir.',
    en: 'Progress is more important than perfection.',
    category: 'inspirational',
  },
  {
    tr: 'Hedefler hayaller değil, planlardır.',
    en: 'Goals are not dreams, they are plans.',
    category: 'inspirational',
  },
  // Additional Unique Quotes
  {
    tr: 'Antrenman yapmak, kendine verdiğin en büyük hediyedir.',
    en: 'Working out is the greatest gift you give yourself.',
    category: 'fitness',
  },
  {
    tr: 'Her ter damlası, seni hedefine bir adım daha yaklaştırır.',
    en: 'Every drop of sweat brings you one step closer to your goal.',
    category: 'motivational',
  },
  {
    tr: 'Spor salonu, karakterin şekillendiği yerdir.',
    en: 'The gym is where character is shaped.',
    category: 'fitness',
  },
  {
    tr: 'Bugün yapmadığın antrenman, yarın eksik kalacak.',
    en: 'The workout you skip today will be missing tomorrow.',
    category: 'discipline',
  },
  {
    tr: 'Güç, sadece fiziksel değil, zihinseldir.',
    en: 'Strength is not just physical, it is mental.',
    category: 'mental-health',
  },
  {
    tr: 'Her set, seni daha güçlü yapar.',
    en: 'Every set makes you stronger.',
    category: 'fitness',
  },
  {
    tr: 'Antrenman, kendini keşfetme yolculuğudur.',
    en: 'Training is a journey of self-discovery.',
    category: 'inspirational',
  },
  {
    tr: 'Sınırlarını aşmak, başarının anahtarıdır.',
    en: 'Pushing your limits is the key to success.',
    category: 'success',
  },
  {
    tr: 'Her gün bir fırsat, her antrenman bir adım ileri.',
    en: 'Every day is an opportunity, every workout is a step forward.',
    category: 'motivational',
  },
  {
    tr: 'Disiplin, başarının temelidir.',
    en: 'Discipline is the foundation of success.',
    category: 'discipline',
  },
  {
    tr: 'Zorlu antrenmanlar, kolay günler yaratır.',
    en: 'Hard workouts create easy days.',
    category: 'perseverance',
  },
  {
    tr: 'Kendini zorlamak, büyümenin tek yoludur.',
    en: 'Pushing yourself is the only way to grow.',
    category: 'success',
  },
  {
    tr: 'Antrenman yapmak, kendine yatırım yapmaktır.',
    en: 'Working out is investing in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Her gün biraz daha güçlü, her gün biraz daha iyi.',
    en: 'A little stronger every day, a little better every day.',
    category: 'motivational',
  },
  {
    tr: 'Spor yapmak, kendini sevmenin bir yoludur.',
    en: 'Exercise is a way to love yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Hedeflerine ulaşmak için sabırlı ve tutarlı ol.',
    en: 'Be patient and consistent to reach your goals.',
    category: 'discipline',
  },
  {
    tr: 'Her antrenman, seni daha iyi bir versiyona dönüştürür.',
    en: 'Every workout transforms you into a better version.',
    category: 'fitness',
  },
  {
    tr: 'Başarı, küçük çabaların birikimidir.',
    en: 'Success is the accumulation of small efforts.',
    category: 'success',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmenin en iyi yoludur.',
    en: 'Exercise is the best way to strengthen yourself.',
    category: 'fitness',
  },
  {
    tr: 'Her gün bir fırsat, her antrenman bir adım ileri.',
    en: 'Every day is an opportunity, every workout is a step forward.',
    category: 'motivational',
  },
  {
    tr: 'Disiplin, başarının temelidir.',
    en: 'Discipline is the foundation of success.',
    category: 'discipline',
  },
  {
    tr: 'Zorlu antrenmanlar, kolay günler yaratır.',
    en: 'Hard workouts create easy days.',
    category: 'perseverance',
  },
  {
    tr: 'Kendini zorlamak, büyümenin tek yoludur.',
    en: 'Pushing yourself is the only way to grow.',
    category: 'success',
  },
  {
    tr: 'Antrenman yapmak, kendine yatırım yapmaktır.',
    en: 'Working out is investing in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Her gün biraz daha güçlü, her gün biraz daha iyi.',
    en: 'A little stronger every day, a little better every day.',
    category: 'motivational',
  },
  {
    tr: 'Spor yapmak, kendini sevmenin bir yoludur.',
    en: 'Exercise is a way to love yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Hedeflerine ulaşmak için sabırlı ve tutarlı ol.',
    en: 'Be patient and consistent to reach your goals.',
    category: 'discipline',
  },
  {
    tr: 'Her antrenman, seni daha iyi bir versiyona dönüştürür.',
    en: 'Every workout transforms you into a better version.',
    category: 'fitness',
  },
  {
    tr: 'Başarı, küçük çabaların birikimidir.',
    en: 'Success is the accumulation of small efforts.',
    category: 'success',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmenin en iyi yoludur.',
    en: 'Exercise is the best way to strengthen yourself.',
    category: 'fitness',
  },
  // More Unique Quotes - Motivational
  {
    tr: 'Her gün yeni bir başlangıç, yeni bir fırsat.',
    en: 'Every day is a new beginning, a new opportunity.',
    category: 'motivational',
  },
  {
    tr: 'Küçük adımlar, büyük değişiklikler yaratır.',
    en: 'Small steps create big changes.',
    category: 'motivational',
  },
  {
    tr: 'Hedeflerine ulaşmak için bugün başla.',
    en: 'Start today to reach your goals.',
    category: 'motivational',
  },
  {
    tr: 'Her gün bir fırsat, her an bir şans.',
    en: 'Every day is an opportunity, every moment is a chance.',
    category: 'motivational',
  },
  {
    tr: 'Kendini geliştirmek, en büyük başarıdır.',
    en: 'Improving yourself is the greatest success.',
    category: 'motivational',
  },
  {
    tr: 'Her gün biraz daha iyi olmak için çalış.',
    en: 'Work to be a little better every day.',
    category: 'motivational',
  },
  {
    tr: 'Hedeflerine ulaşmak için sabırlı ol.',
    en: 'Be patient in reaching your goals.',
    category: 'motivational',
  },
  {
    tr: 'Her gün biraz daha ileri git.',
    en: 'Go a little further each day.',
    category: 'motivational',
  },
  {
    tr: 'Kendini zorla, çünkü kimse senin için yapmayacak.',
    en: 'Push yourself, because no one else will do it for you.',
    category: 'motivational',
  },
  {
    tr: 'Bugünün işini yarına bırakma.',
    en: "Don't leave today's work for tomorrow.",
    category: 'motivational',
  },
  {
    tr: 'Hedeflerin için çalış, hayallerin için değil.',
    en: 'Work for your goals, not your dreams.',
    category: 'motivational',
  },
  {
    tr: 'Vücudun bir tapınaktır, ona saygı göster.',
    en: 'Your body is a temple, respect it.',
    category: 'motivational',
  },
  {
    tr: 'Zorlu antrenmanlar, güçlü karakterler yaratır.',
    en: 'Tough workouts build strong characters.',
    category: 'motivational',
  },
  {
    tr: 'Bugün yapmadığın şey, yarın seni geride bırakır.',
    en: "What you don't do today will leave you behind tomorrow.",
    category: 'motivational',
  },
  {
    tr: 'Her ter damlası, başarıya giden yolda bir adımdır.',
    en: 'Every drop of sweat is a step toward success.',
    category: 'motivational',
  },
  {
    tr: 'Güçlü olmak bir seçimdir, zayıf olmak değil.',
    en: 'Being strong is a choice, not being weak.',
    category: 'motivational',
  },
  {
    tr: 'Hedeflerin için mücadele et, pes etme.',
    en: 'Fight for your goals, never give up.',
    category: 'motivational',
  },
  {
    tr: 'Küçük başlangıçlar, büyük sonuçlar doğurur.',
    en: 'Small beginnings lead to great results.',
    category: 'motivational',
  },
  {
    tr: 'Her gün bir fırsattır, onu değerlendir.',
    en: 'Every day is an opportunity, make the most of it.',
    category: 'motivational',
  },
  {
    tr: 'Vücudunun sınırlarını keşfet, sonra onları aş.',
    en: "Discover your body's limits, then exceed them.",
    category: 'motivational',
  },
  {
    tr: 'Her antrenman, seni daha iyi bir versiyona dönüştürür.',
    en: 'Every workout transforms you into a better version.',
    category: 'motivational',
  },
  {
    tr: 'Güçlü olmak, zorlu günlerde ortaya çıkar.',
    en: 'Strength shows itself in tough days.',
    category: 'motivational',
  },
  {
    tr: 'Spor yapmak, kendine verdiğin bir sözdür.',
    en: 'Exercise is a promise you make to yourself.',
    category: 'motivational',
  },
  {
    tr: 'Her gün biraz daha güçlü ol.',
    en: 'Get a little stronger every day.',
    category: 'motivational',
  },
  {
    tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
    en: 'Success is when preparation meets opportunity.',
    category: 'motivational',
  },
  // More Discipline Quotes
  {
    tr: 'Disiplin, başarının anahtarıdır.',
    en: 'Discipline is the key to success.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kendine verdiğin bir sözdür.',
    en: 'Being disciplined is a promise you make to yourself.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, tutarlılık demektir.',
    en: 'Discipline means consistency.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin olmadan başarı imkansızdır.',
    en: 'Success is impossible without discipline.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, hedeflerine ulaşmanın tek yoludur.',
    en: 'Discipline is the only way to reach your goals.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli bir rutin, güçlü bir karakter yaratır.',
    en: 'A disciplined routine builds a strong character.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendine verdiğin bir sözdür.',
    en: 'Discipline is a promise you make to yourself.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, zevkleri ertelemek demektir.',
    en: 'Discipline means delaying gratification.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kolay olanı değil doğru olanı seçmektir.',
    en: 'Being disciplined means choosing what is right, not what is easy.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarıya giden en kısa yoldur.',
    en: 'Discipline is the shortest path to success.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, alışkanlıkların gücüdür.',
    en: 'Discipline is the power of habits.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli bir yaşam, özgür bir yaşamdır.',
    en: 'A disciplined life is a free life.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendini kontrol etmektir.',
    en: 'Discipline is self-control.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin olmadan hiçbir şey mümkün değildir.',
    en: 'Nothing is possible without discipline.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, bugün yapmak istemediğin şeyi yapmaktır.',
    en: 'Discipline is doing what you do not want to do today.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kendine saygıdır.',
    en: 'Being disciplined is self-respect.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, hedeflerine sadık kalmaktır.',
    en: 'Discipline is staying true to your goals.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarı için gerekli olan tek şeydir.',
    en: 'Discipline is the only thing needed for success.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli bir zihin, güçlü bir zihindir.',
    en: 'A disciplined mind is a strong mind.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendini geliştirmenin temelidir.',
    en: 'Discipline is the foundation of self-improvement.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin olmadan ilerleme olmaz.',
    en: 'There is no progress without discipline.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, tutarlı eylemlerin toplamıdır.',
    en: 'Discipline is the sum of consistent actions.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, geleceğe yatırım yapmaktır.',
    en: 'Being disciplined is investing in the future.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, karakterin gerçek göstergesidir.',
    en: 'Discipline is the true measure of character.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarılı insanların ortak özelliğidir.',
    en: 'Discipline is what successful people have in common.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, kendini kontrol etme sanatıdır.',
    en: 'Discipline is the art of self-control.',
    category: 'discipline',
  },
  {
    tr: 'Disiplinli olmak, kendine güvenmektir.',
    en: 'Being disciplined is trusting yourself.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, hedeflerine ulaşmanın garantisidir.',
    en: 'Discipline is the guarantee of reaching your goals.',
    category: 'discipline',
  },
  {
    tr: 'Disiplin, başarı için gerekli olan tek beceridir.',
    en: 'Discipline is the only skill needed for success.',
    category: 'discipline',
  },
  // More Success Quotes
  {
    tr: 'Başarı, küçük çabaların toplamıdır.',
    en: 'Success is the sum of small efforts.',
    category: 'success',
  },
  {
    tr: 'Başarı, hazırlık ve fırsatın buluşmasıdır.',
    en: 'Success is the meeting of preparation and opportunity.',
    category: 'success',
  },
  {
    tr: 'Başarı, tutarlılığın çocuğudur.',
    en: 'Success is the child of consistency.',
    category: 'success',
  },
  {
    tr: 'Başarı, küçük çabaların tekrarıdır.',
    en: 'Success is the repetition of small efforts.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak değil, ilerlemektir.',
    en: 'Success is not reaching your goals, it is progress.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendinle yarışmaktır.',
    en: 'Success is racing against yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, her gün biraz daha iyi olmaktır.',
    en: 'Success is being a little better every day.',
    category: 'success',
  },
  {
    tr: 'Başarı, pes etmemektir.',
    en: 'Success is not giving up.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine sadık kalmaktır.',
    en: 'Success is staying true to your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendine inanmaktır.',
    en: 'Success is believing in yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, zorlukların üstesinden gelmektir.',
    en: 'Success is overcoming challenges.',
    category: 'success',
  },
  {
    tr: 'Başarı, ilerleme kaydetmektir.',
    en: 'Success is making progress.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için çalışmaktır.',
    en: 'Success is working towards your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini geliştirmektir.',
    en: 'Success is improving yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, tutarlı olmaktır.',
    en: 'Success is being consistent.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için sabırlı olmaktır.',
    en: 'Success is being patient in reaching your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini zorlamaktır.',
    en: 'Success is pushing yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için mücadele etmektir.',
    en: 'Success is fighting for your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendine yatırım yapmaktır.',
    en: 'Success is investing in yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için çalışmaya devam etmektir.',
    en: 'Success is continuing to work towards your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini geliştirmeye devam etmektir.',
    en: 'Success is continuing to improve yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için sabırlı ve tutarlı olmaktır.',
    en: 'Success is being patient and consistent in reaching your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini zorlamaya devam etmektir.',
    en: 'Success is continuing to push yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için mücadele etmeye devam etmektir.',
    en: 'Success is continuing to fight for your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendine yatırım yapmaya devam etmektir.',
    en: 'Success is continuing to invest in yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için çalışmaktan vazgeçmemektir.',
    en: 'Success is not giving up on working towards your goals.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini geliştirmekten vazgeçmemektir.',
    en: 'Success is not giving up on improving yourself.',
    category: 'success',
  },
  {
    tr: 'Başarı, hedeflerine ulaşmak için sabırlı ve tutarlı olmaktan vazgeçmemektir.',
    en: 'Success is not giving up on being patient and consistent.',
    category: 'success',
  },
  {
    tr: 'Başarı, kendini zorlamaktan vazgeçmemektir.',
    en: 'Success is not giving up on pushing yourself.',
    category: 'success',
  },
  // More Perseverance Quotes
  {
    tr: 'Pes etme, devam et.',
    en: "Don't give up, keep going.",
    category: 'perseverance',
  },
  {
    tr: 'Zorluklar seni durduramaz, sadece yavaşlatabilir.',
    en: "Challenges can't stop you, they can only slow you down.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarısızlığın garantisidir.',
    en: 'Giving up is the guarantee of failure.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü en zor anlar, en büyük dönüşümlerin başladığı andır.',
    en: "Don't give up, because the hardest moments are when the greatest transformations begin.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, başarıya ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to success.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü başarı, pes etmeyenlerindir.',
    en: "Don't give up, because success belongs to those who don't give up.",
    category: 'perseverance',
  },
  {
    tr: 'Pes etmek, hedeflerine ulaşmanın tek engelidir.',
    en: 'Giving up is the only obstacle to reaching your goals.',
    category: 'perseverance',
  },
  {
    tr: 'Pes etme, çünkü her zorluk, seni daha güçlü yapar.',
    en: "Don't give up, because every challenge makes you stronger.",
    category: 'perseverance',
  },
  // More Fitness Quotes
  {
    tr: 'Spor yapmak, kendine yapabileceğin en iyi yatırımdır.',
    en: 'Exercise is the best investment you can make in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, hayat kalitesini artırır.',
    en: 'Exercise improves your quality of life.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, zihinsel gücü de geliştirir.',
    en: 'Exercise also develops mental strength.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine verdiğin bir sözdür.',
    en: 'Exercise is a promise you make to yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, bir yaşam tarzıdır, bir görev değil.',
    en: 'Exercise is a lifestyle, not a chore.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, vücudunun sınırlarını keşfetmektir.',
    en: "Exercise is discovering your body's limits.",
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini geliştirmektir.',
    en: 'Exercise is improving yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine saygıdır.',
    en: 'Exercise is self-respect.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine yatırım yapmaktır.',
    en: 'Exercise is investing in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmektir.',
    en: 'Exercise is strengthening yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini zorlamaktır.',
    en: 'Exercise is pushing yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini geliştirmeye devam etmektir.',
    en: 'Exercise is continuing to improve yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine saygı göstermektir.',
    en: 'Exercise is showing respect to yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine yatırım yapmaya devam etmektir.',
    en: 'Exercise is continuing to invest in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmeye devam etmektir.',
    en: 'Exercise is continuing to strengthen yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini zorlamaya devam etmektir.',
    en: 'Exercise is continuing to push yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini geliştirmekten vazgeçmemektir.',
    en: 'Exercise is not giving up on improving yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine saygı göstermekten vazgeçmemektir.',
    en: 'Exercise is not giving up on showing respect to yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendine yatırım yapmaktan vazgeçmemektir.',
    en: 'Exercise is not giving up on investing in yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini güçlendirmekten vazgeçmemektir.',
    en: 'Exercise is not giving up on strengthening yourself.',
    category: 'fitness',
  },
  {
    tr: 'Spor yapmak, kendini zorlamaktan vazgeçmemektir.',
    en: 'Exercise is not giving up on pushing yourself.',
    category: 'fitness',
  },
  // More Mental Health Quotes
  {
    tr: 'Zihinsel sağlık, fiziksel sağlık kadar önemlidir.',
    en: 'Mental health is as important as physical health.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, fiziksel güçten daha önemlidir.',
    en: 'Mental strength is more important than physical strength.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, başarının temelidir.',
    en: 'Mental health is the foundation of success.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, her şeyin başlangıcıdır.',
    en: 'Mental strength is the beginning of everything.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine yapabileceğin en iyi yatırımdır.',
    en: 'Mental health is the best investment you can make in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini geliştirmektir.',
    en: 'Mental strength is improving yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine saygıdır.',
    en: 'Mental health is self-respect.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendine yatırım yapmaktır.',
    en: 'Mental strength is investing in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini güçlendirmektir.',
    en: 'Mental health is strengthening yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini zorlamaktır.',
    en: 'Mental strength is pushing yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini geliştirmeye devam etmektir.',
    en: 'Mental health is continuing to improve yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendine saygı göstermektir.',
    en: 'Mental strength is showing respect to yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine yatırım yapmaya devam etmektir.',
    en: 'Mental health is continuing to invest in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini güçlendirmeye devam etmektir.',
    en: 'Mental strength is continuing to strengthen yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini zorlamaya devam etmektir.',
    en: 'Mental health is continuing to push yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini geliştirmekten vazgeçmemektir.',
    en: 'Mental strength is not giving up on improving yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendine saygı göstermekten vazgeçmemektir.',
    en: 'Mental health is not giving up on showing respect to yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendine yatırım yapmaktan vazgeçmemektir.',
    en: 'Mental strength is not giving up on investing in yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, kendini güçlendirmekten vazgeçmemektir.',
    en: 'Mental health is not giving up on strengthening yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel güç, kendini zorlamaktan vazgeçmemektir.',
    en: 'Mental strength is not giving up on pushing yourself.',
    category: 'mental-health',
  },
  {
    tr: 'Zihinsel sağlık, başarının temelidir.',
    en: 'Mental health is the foundation of success.',
    category: 'mental-health',
  },
  // More Inspirational Quotes
  {
    tr: 'Her şampiyon bir zamanlar başlangıçtaydı.',
    en: 'Every champion was once a beginner.',
    category: 'inspirational',
  },
  {
    tr: 'Sınırlar sadece kafanda var.',
    en: 'Limits exist only in your mind.',
    category: 'inspirational',
  },
  {
    tr: 'Her şey imkansız görünür, ta ki yapılana kadar.',
    en: "Everything seems impossible until it's done.",
    category: 'inspirational',
  },
  {
    tr: 'Kendine inan, çünkü başka kimse yapmayacak.',
    en: 'Believe in yourself, because no one else will.',
    category: 'inspirational',
  },
  {
    tr: 'Her gün yeni bir başlangıçtır.',
    en: 'Every day is a new beginning.',
    category: 'inspirational',
  },
  {
    tr: 'Kendinle yarış, başkalarıyla değil.',
    en: 'Race against yourself, not others.',
    category: 'inspirational',
  },
  {
    tr: 'Başarısızlık, başarıya giden yolun bir parçasıdır.',
    en: 'Failure is part of the path to success.',
    category: 'inspirational',
  },
  {
    tr: 'Zor günler geçer, ama güçlü insanlar kalır.',
    en: 'Tough days pass, but strong people remain.',
    category: 'inspirational',
  },
  {
    tr: 'İlerleme mükemmellikten daha önemlidir.',
    en: 'Progress is more important than perfection.',
    category: 'inspirational',
  },
  {
    tr: 'Hedefler hayaller değil, planlardır.',
    en: 'Goals are not dreams, they are plans.',
    category: 'inspirational',
  },
  {
    tr: 'Bugün yapabileceğin en iyi şey, dün yapmadığın şeydir.',
    en: "The best thing you can do today is what you didn't do yesterday.",
    category: 'inspirational',
  },
]);

export function getRandomQuote(category?: QuoteCategory): Quote {
  if (category) {
    const categoryQuotes = MOTIVATIONAL_QUOTES.filter((q) => q.category === category);
    if (categoryQuotes.length > 0) {
      return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
    }
  }
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export function getQuotesByCategory(category: QuoteCategory): Quote[] {
  return MOTIVATIONAL_QUOTES.filter((q) => q.category === category);
}

export function getAllCategories(): QuoteCategory[] {
  return [
    'motivational',
    'discipline',
    'success',
    'perseverance',
    'fitness',
    'mental-health',
    'inspirational',
  ];
}
