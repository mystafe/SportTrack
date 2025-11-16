'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';

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
    <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5">
      <Button
        type="button"
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="sm"
        className="px-1 py-0.5 text-base min-h-[22px] hover:scale-110 active:scale-95"
        onClick={() => update('light')}
        aria-pressed={theme === 'light'}
        title="Light"
      >
        ☀️
      </Button>
      <Button
        type="button"
        variant={theme === 'system' ? 'primary' : 'ghost'}
        size="sm"
        className="px-1 py-0.5 text-base min-h-[22px] hover:scale-110 active:scale-95"
        onClick={() => update('system')}
        aria-pressed={theme === 'system'}
        title="System"
      >
        🖥️
      </Button>
      <Button
        type="button"
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="sm"
        className="px-1 py-0.5 text-base min-h-[22px] hover:scale-110 active:scale-95"
        onClick={() => update('dark')}
        aria-pressed={theme === 'dark'}
        title="Dark"
      >
        🌙
      </Button>
    </div>
  );
}
