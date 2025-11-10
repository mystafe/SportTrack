'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'tr' | 'en';

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  'nav.activities': { tr: 'Aktiviteler', en: 'Activities' },
  'header.overviewTitle': { tr: 'Genel Bakış', en: 'Overview' },
  'header.overviewSubtitle': {
    tr: 'Günlük 10.000 puan hedefine ne kadar yakın olduğunu takip et.',
    en: 'Track your progress toward the 10,000 daily points goal.'
  },
  'actions.addActivity': { tr: 'Aktivite Ekle', en: 'Add Activity' },

  'form.selectActivity': { tr: 'Aktivite Seç', en: 'Select Activity' },
  'form.datetime': { tr: 'Tarih & Saat', en: 'Date & Time' },
  'form.amount': { tr: 'Miktar', en: 'Amount' },
  'form.multiplier': { tr: 'Çarpan', en: 'Multiplier' },
  'form.points': { tr: 'Kazandırdığı Puan', en: 'Points Earned' },
  'form.noteOptional': { tr: 'Not (opsiyonel)', en: 'Note (optional)' },
  'form.notePlaceholder': { tr: 'Nasıl hissettirdi?', en: 'How did it feel?' },
  'form.add': { tr: 'Aktiviteyi Ekle', en: 'Add Activity' },
  'form.save': { tr: 'Değişiklikleri Kaydet', en: 'Save Changes' },
  'form.cancel': { tr: 'Vazgeç', en: 'Cancel' },

  'list.newActivity': { tr: 'Yeni Aktivite', en: 'New Activity' },
  'list.records': { tr: 'Kayıtlar', en: 'Records' },
  'list.loading': { tr: 'Yükleniyor...', en: 'Loading...' },
  'list.empty': { tr: 'Henüz aktivite yok.', en: 'No activities yet.' },
  'list.delete': { tr: 'Sil', en: 'Delete' },
  'list.deleteConfirm': {
    tr: 'Silmek istediğine emin misin?',
    en: 'Are you sure you want to delete?'
  },
  'list.edit': { tr: 'Düzenle', en: 'Edit' },
  'list.editingTitle': { tr: 'Aktiviteyi Düzenle', en: 'Edit Activity' },
  'list.pointsUnit': { tr: 'puan', en: 'pts' },

  'stats.todayPoints': { tr: 'Bugünkü Puan', en: 'Today’s Points' },
  'stats.totalPoints': { tr: 'Toplam Kazanılan Puan', en: 'Total Points Earned' },
  'stats.totalActivities': {
    tr: 'Toplam {count} aktivite kaydı',
    en: '{count} total activities'
  },
  'stats.streak': { tr: 'Hedef Tutma Serisi', en: 'Goal Streak' },
  'stats.streakDesc': {
    tr: 'Günlük 10.000 puan serisi',
    en: 'Daily 10,000 points streak'
  },
  'stats.breakdownToday': { tr: 'Bugünkü Dağılım', en: 'Today’s Breakdown' },
  'stats.noActivityToday': {
    tr: 'Bugün henüz aktivite eklenmedi.',
    en: 'No activity added today.'
  },
  'stats.lastSeven': { tr: 'Son 7 Gün', en: 'Last 7 Days' },
  'stats.noData': { tr: 'Henüz veri yok.', en: 'No data yet.' },
  'stats.target': { tr: 'Hedef', en: 'Target' },

  'footer.byName': { tr: 'Mustafa Evleksiz', en: 'Mustafa Evleksiz' }
};

type I18nContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('tr');

  useEffect(() => {
    const saved = (typeof window !== 'undefined'
      ? localStorage.getItem('lang')
      : null) as Language | null;
    if (saved === 'tr' || saved === 'en') {
      setLang(saved);
      return;
    }
    const device = typeof window !== 'undefined' ? navigator.language : 'tr';
    setLang(device.toLowerCase().startsWith('tr') ? 'tr' : 'en');
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const t: I18nContextValue['t'] = (key, params) => {
      const record = translations[key as string];
      const template = record ? record[lang] : (key as string);
      if (!params) return template;
      return Object.keys(params).reduce((acc, k) => {
        return acc.replace(`{${k}}`, String(params[k]));
      }, template);
    };
    const setter = (l: Language) => {
      setLang(l);
      if (typeof window !== 'undefined') {
        localStorage.setItem('lang', l);
      }
    };
    return { lang, setLang: setter, t };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}


