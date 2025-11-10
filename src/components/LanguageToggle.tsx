'use client';

import { useI18n, Language } from '@/lib/i18n';

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const options: Array<{ code: Language; label: string }> = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' }
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5 sm:p-1">
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          className={`px-1.5 py-0.5 sm:px-2 sm:py-1 text-[10px] sm:text-xs rounded transition-colors ${lang === opt.code ? 'bg-brand text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setLang(opt.code)}
          aria-pressed={lang === opt.code}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}


