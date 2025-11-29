'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Sayfa değiştiğinde main elementine odaklan
    // Küçük bir gecikme ekleyerek DOM'un hazır olmasını ve geçiş animasyonlarının bitmesini bekle
    const timer = setTimeout(() => {
      const mainElement = document.getElementById('main-content');
      if (mainElement) {
        // preventScroll: true -> Odaklanırken tarayıcının otomatik scroll yapmasını engelle
        mainElement.focus({ preventScroll: true });

        // Scroll'u en üste al
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
