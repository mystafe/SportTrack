'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
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
    localStorage.setItem('theme', next);
    applyTheme(next);
  }

  return (
    <div className="inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-1">
      <button
        type="button"
        className={`px-2 py-1 text-xs rounded ${theme === 'light' ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200'}`}
        onClick={() => update('light')}
        aria-pressed={theme === 'light'}
      >
        ☀️
      </button>
      <button
        type="button"
        className={`px-2 py-1 text-xs rounded ${theme === 'system' ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200'}`}
        onClick={() => update('system')}
        aria-pressed={theme === 'system'}
      >
        🖥️
      </button>
      <button
        type="button"
        className={`px-2 py-1 text-xs rounded ${theme === 'dark' ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200'}`}
        onClick={() => update('dark')}
        aria-pressed={theme === 'dark'}
      >
        🌙
      </button>
    </div>
  );
}


