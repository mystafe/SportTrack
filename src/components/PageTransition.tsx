'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isExiting, setIsExiting] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Exit animation
    setIsExiting(true);
    setIsTransitioning(true);

    const exitTimer = setTimeout(() => {
      setIsExiting(false);
      setDisplayChildren(children);
    }, 150); // Exit duration

    const enterTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300); // Total transition duration

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(enterTimer);
    };
  }, [pathname, children]);

  return (
    <div
      className={`page-transition-wrapper ${
        isTransitioning
          ? isExiting
            ? 'page-transition-out opacity-0 scale-95'
            : 'page-transition-in opacity-100 scale-100'
          : 'opacity-100 scale-100'
      } ${isMobile ? 'mobile-transition' : ''} transition-all duration-300 ease-out`}
    >
      {displayChildren}
    </div>
  );
}
