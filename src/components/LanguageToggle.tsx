'use client';

import { useI18n, Language } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const options: Array<{ code: Language; label: string }> = [
    { code: 'tr', label: 'TR' },
    { code: 'en', label: 'EN' },
  ];

  return (
    <div className="inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-card p-0.5">
      {options.map((opt) => (
        <Button
          key={opt.code}
          type="button"
          variant={lang === opt.code ? 'primary' : 'ghost'}
          size="sm"
          className="px-1 py-0.5 text-[8px] sm:text-[9px] min-h-[22px] hover:scale-110 active:scale-95"
          onClick={() => setLang(opt.code)}
          aria-pressed={lang === opt.code}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
