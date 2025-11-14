'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150); // Half of transition duration

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`page-transition-wrapper ${isTransitioning ? 'page-transition-out' : 'page-transition-in'} ${isMobile ? 'mobile-transition' : ''}`}
    >
      {displayChildren}
    </div>
  );
}
