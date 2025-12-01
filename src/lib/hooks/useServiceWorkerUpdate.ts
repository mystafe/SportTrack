/**
 * Service Worker Update Hook
 * Detects when a new service worker is available and prompts for update
 */

import { useState, useEffect } from 'react';

export interface ServiceWorkerUpdate {
  updateAvailable: boolean;
  updateServiceWorker: () => void;
  skipUpdate: () => void;
}

export function useServiceWorkerUpdate(): ServiceWorkerUpdate {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (!reg) return;

        setRegistration(reg);

        // Check for updates every 60 seconds
        const interval = setInterval(async () => {
          try {
            await reg.update();
          } catch (error) {
            console.error('Service worker update check failed:', error);
          }
        }, 60000);

        // Listen for service worker updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed and waiting
              setUpdateAvailable(true);
            }
          });
        });

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    checkForUpdates();

    // Also listen for controller change (when update is activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setUpdateAvailable(false);
      // Reload page to use new service worker
      window.location.reload();
    });
  }, []);

  const updateServiceWorker = async () => {
    if (!registration || !registration.waiting) return;

    // Tell the waiting service worker to skip waiting and activate
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    setUpdateAvailable(false);
  };

  const skipUpdate = () => {
    setUpdateAvailable(false);
    // Store skip preference (optional - could persist in localStorage)
  };

  return {
    updateAvailable,
    updateServiceWorker,
    skipUpdate,
  };
}
