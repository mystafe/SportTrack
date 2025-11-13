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
    <div className={`fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 dark:from-brand/20 dark:via-brand/10 dark:to-brand/20 border-t-2 border-brand/30 dark:border-brand/40 ${isMobile ? 'py-2 px-3' : 'py-3 px-4'} overflow-hidden safe-bottom`}>
      <div className={`quote-ticker-container ${isMobile ? 'text-xs' : 'text-sm'} text-gray-900 dark:text-white font-medium italic text-center whitespace-nowrap ${isGlowing ? 'quote-ticker-glow' : ''}`}>
        <div className="animate-scroll-left">
          {lang === 'tr' ? quote.tr : quote.en}
        </div>
      </div>
    </div>
  );
}

