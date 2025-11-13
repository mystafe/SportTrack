'use client';

import { useState, useEffect } from 'react';
import { getRandomQuote, type Quote } from '@/lib/quotes';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function QuoteTicker() {
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    setMounted(true);
    setQuote(getRandomQuote());
    
    const interval = setInterval(() => {
      setIsGlowing(true);
      setTimeout(() => {
        setIsGlowing(false);
        setTimeout(() => {
          setQuote(getRandomQuote());
        }, 500);
      }, 2000);
    }, 15000); // Change quote every 15 seconds
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !quote) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand/15 via-brand/10 to-brand/15 dark:from-brand/25 dark:via-brand/15 dark:to-brand/25 border-t-2 border-brand/40 dark:border-brand/50 ${isMobile ? 'py-2.5 px-3' : 'py-3.5 px-4'} overflow-hidden safe-bottom shadow-lg`}>
      <div className={`quote-ticker-container ${isMobile ? 'text-xs' : 'text-sm'} text-gray-950 dark:text-white font-bold italic text-center whitespace-nowrap ${isGlowing ? 'quote-ticker-glow' : ''} drop-shadow-sm`}>
        <div className="animate-scroll-left">
          {lang === 'tr' ? quote.tr : quote.en}
        </div>
      </div>
    </div>
  );
}

