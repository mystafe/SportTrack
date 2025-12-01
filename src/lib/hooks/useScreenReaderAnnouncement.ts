/**
 * Screen Reader Announcement Hook
 * Announces dynamic content changes to screen readers
 */

import { useEffect, useRef } from 'react';

export function useScreenReaderAnnouncement(
  message: string | null,
  priority: 'polite' | 'assertive' = 'polite'
) {
  const announcementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!message) return;

    // Create or get announcement element
    let announcement = announcementRef.current;
    if (!announcement) {
      announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      document.body.appendChild(announcement);
      announcementRef.current = announcement;
    }

    // Update message
    announcement.textContent = message;

    // Clear message after a delay
    const timeout = setTimeout(() => {
      if (announcement) {
        announcement.textContent = '';
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [message, priority]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
        announcementRef.current = null;
      }
    };
  }, []);
}
