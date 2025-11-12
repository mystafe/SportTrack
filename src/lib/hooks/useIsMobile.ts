import { useEffect, useState } from 'react';
import { BREAKPOINTS } from '@/lib/constants';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia(`(max-width: ${BREAKPOINTS.MOBILE}px)`);
    setIsMobile(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', handleChange);
      return () => query.removeEventListener('change', handleChange);
    }

    query.addListener(handleChange);
    return () => query.removeListener(handleChange);
  }, []);

  return isMobile;
}

