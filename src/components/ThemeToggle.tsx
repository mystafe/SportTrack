'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme('system');
    }
  }, []);

  function applyTheme(next: Theme) {
    const root = document.documentElement;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = next === 'dark' || (next === 'system' && systemPrefersDark);
    root.classList.toggle('dark', isDark);
  }

  function update(next: Theme) {
    setTheme(next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    applyTheme(next);
  }

  return (
    <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5 sm:p-1">
      <button
        type="button"
        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 ${theme === 'light' ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        onClick={() => update('light')}
        aria-pressed={theme === 'light'}
        title="Light"
      >
        ☀️
      </button>
      <button
        type="button"
        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 ${theme === 'system' ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        onClick={() => update('system')}
        aria-pressed={theme === 'system'}
        title="System"
      >
        🖥️
      </button>
      <button
        type="button"
        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-all duration-200 hover:scale-110 active:scale-95 ${theme === 'dark' ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        onClick={() => update('dark')}
        aria-pressed={theme === 'dark'}
        title="Dark"
      >
        🌙
      </button>
    </div>
  );
}
