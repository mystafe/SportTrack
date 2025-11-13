'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: 'navigation' | 'actions' | 'general';
}

const KeyboardShortcutsContext = createContext<{
  showHelp: () => void;
} | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  return context;
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isMobile) return; // Don't enable shortcuts on mobile

    const shortcuts: Shortcut[] = [
      {
        key: 'g h',
        description: lang === 'tr' ? 'Ana sayfaya git' : 'Go to Home',
        action: () => router.push('/'),
        category: 'navigation'
      },
      {
        key: 'g a',
        description: lang === 'tr' ? 'Aktiviteler sayfasına git' : 'Go to Activities',
        action: () => router.push('/activities'),
        category: 'navigation'
      },
      {
        key: 'g s',
        description: lang === 'tr' ? 'İstatistikler sayfasına git' : 'Go to Statistics',
        action: () => router.push('/stats'),
        category: 'navigation'
      },
      {
        key: 'g c',
        description: lang === 'tr' ? 'Zorluklar sayfasına git' : 'Go to Challenges',
        action: () => router.push('/challenges'),
        category: 'navigation'
      },
      {
        key: 'g t',
        description: lang === 'tr' ? 'Başarımlar sayfasına git' : 'Go to Achievements',
        action: () => router.push('/achievements'),
        category: 'navigation'
      },
      {
        key: 'a',
        description: lang === 'tr' ? 'Yeni aktivite ekle' : 'Add new activity',
        action: () => router.push('/add'),
        category: 'actions'
      },
      {
        key: '?',
        description: lang === 'tr' ? 'Kısayolları göster/gizle' : 'Show/hide shortcuts',
        action: () => setShowHelp(prev => !prev),
        category: 'general'
      },
      {
        key: 'Esc',
        description: lang === 'tr' ? 'Dialog\'ları kapat' : 'Close dialogs',
        action: () => {
          // Close any open dialogs by pressing Escape
          const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
          document.dispatchEvent(event);
        },
        category: 'general'
      }
    ];

    let currentKeys: string[] = [];
    let timeoutId: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        (target as HTMLInputElement).type === 'date' ||
        (target as HTMLInputElement).type === 'time'
      ) {
        return;
      }

      // Handle Escape key
      if (e.key === 'Escape') {
        const shortcut = shortcuts.find(s => s.key === 'Esc');
        if (shortcut) {
          shortcut.action();
        }
        return;
      }

      // Handle ? key
      if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const shortcut = shortcuts.find(s => s.key === '?');
        if (shortcut) {
          shortcut.action();
        }
        return;
      }

      // Handle 'g' prefix for navigation (like GitHub)
      if (e.key === 'g' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        currentKeys.push('g');
        timeoutId = setTimeout(() => {
          currentKeys = [];
        }, 1000);
        return;
      }

      // Handle second key after 'g'
      if (currentKeys.includes('g') && e.key.length === 1) {
        e.preventDefault();
        const key = `${currentKeys[0]} ${e.key}`;
        const shortcut = shortcuts.find(s => s.key === key);
        if (shortcut) {
          shortcut.action();
        }
        currentKeys = [];
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        return;
      }

      // Handle single key shortcuts
      if (e.key.length === 1 && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const shortcut = shortcuts.find(s => s.key === e.key && s.key.length === 1);
        if (shortcut) {
          e.preventDefault();
          shortcut.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router, lang, isMobile]);

  // Provide context for other components to trigger help
  const contextValue = {
    showHelp: () => setShowHelp(true)
  };

  if (isMobile) {
    return null;
  }

  if (!showHelp) {
    return (
      <KeyboardShortcutsContext.Provider value={contextValue}>
        {null}
      </KeyboardShortcutsContext.Provider>
    );
  }

  const shortcutsByCategory = {
    navigation: [
      { key: 'g h', description: lang === 'tr' ? 'Ana sayfaya git' : 'Go to Home' },
      { key: 'g a', description: lang === 'tr' ? 'Aktiviteler sayfasına git' : 'Go to Activities' },
      { key: 'g s', description: lang === 'tr' ? 'İstatistikler sayfasına git' : 'Go to Statistics' },
      { key: 'g c', description: lang === 'tr' ? 'Zorluklar sayfasına git' : 'Go to Challenges' },
      { key: 'g t', description: lang === 'tr' ? 'Başarımlar sayfasına git' : 'Go to Achievements' }
    ],
    actions: [
      { key: 'a', description: lang === 'tr' ? 'Yeni aktivite ekle' : 'Add new activity' }
    ],
    general: [
      { key: '?', description: lang === 'tr' ? 'Kısayolları göster/gizle' : 'Show/hide shortcuts' },
      { key: 'Esc', description: lang === 'tr' ? 'Dialog\'ları kapat' : 'Close dialogs' }
    ]
  };

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setShowHelp(false)}
      >
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 max-w-2xl w-full mx-4 p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lang === 'tr' ? '⌨️ Klavye Kısayolları' : '⌨️ Keyboard Shortcuts'}
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none transition-colors"
            aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
              {lang === 'tr' ? 'Navigasyon' : 'Navigation'}
            </h3>
            <div className="space-y-2">
              {shortcutsByCategory.navigation.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
              {lang === 'tr' ? 'Aksiyonlar' : 'Actions'}
            </h3>
            <div className="space-y-2">
              {shortcutsByCategory.actions.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
              {lang === 'tr' ? 'Genel' : 'General'}
            </h3>
            <div className="space-y-2">
              {shortcutsByCategory.general.map((shortcut) => (
                <div key={shortcut.key} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{shortcut.description}</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {lang === 'tr' 
              ? 'Kısayolları görmek için her zaman ? tuşuna basabilirsiniz' 
              : 'Press ? anytime to see shortcuts'}
          </p>
        </div>
      </div>
    </div>
    </KeyboardShortcutsContext.Provider>
  );
}

