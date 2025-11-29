'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Sayfa değiştiğinde scroll'u en üste al (performans için instant)
    // requestAnimationFrame kullanarak DOM'un hazır olmasını bekle
    const rafId = requestAnimationFrame(() => {
      // Scroll'u en üste al (instant behavior for performance)
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Main elementine odaklan (accessibility için)
      const mainElement = document.getElementById('main-content');
      if (mainElement) {
        mainElement.focus({ preventScroll: true });
      }
    });

    return () => cancelAnimationFrame(rafId);
  }, [pathname]);

  return null;
}
