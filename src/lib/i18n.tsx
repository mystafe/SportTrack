'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'tr' | 'en';

type Translations = Record<string, Record<Language, string>>;

const translations: Translations = {
  'nav.activities': { tr: 'Aktiviteler', en: 'Activities' },
  'header.overviewTitle': { tr: 'Genel Bakış', en: 'Overview' },
  'header.overviewSubtitle': {
    tr: 'Günlük puan hedefin doğrultusunda ilerlemeni takip et.',
    en: 'Keep track of your progress toward your daily points goal.'
  },
  'header.greeting': { tr: 'Merhaba, {name}!', en: 'Hello, {name}!' },
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
  'list.deleteDisabled': {
    tr: 'Geçmiş tarihli aktiviteleri silemezsin.',
    en: 'You cannot delete activities logged on previous days.'
  },
  'list.edit': { tr: 'Düzenle', en: 'Edit' },
  'list.editingTitle': { tr: 'Aktiviteyi Düzenle', en: 'Edit Activity' },
  'list.pointsUnit': { tr: 'puan', en: 'pts' },

  'activities.custom.manageButton': { tr: 'Aktiviteleri Özelleştir', en: 'Manage Activities' },
  'activities.custom.title': { tr: 'Aktivite Listesini Özelleştir', en: 'Customize Activities' },
  'activities.custom.subtitle': {
    tr: 'Standart aktivitelerin yanı sıra kendine özel aktiviteler ekleyebilir, düzenleyebilir veya kaldırabilirsin.',
    en: 'Add, edit or remove personalised activities alongside the defaults.'
  },
  'activities.custom.fields.label': { tr: 'Aktivite adı', en: 'Activity name' },
  'activities.custom.fields.icon': { tr: 'Emoji/Sembol', en: 'Emoji / icon' },
  'activities.custom.fields.unit': { tr: 'Birim', en: 'Unit' },
  'activities.custom.fields.multiplier': { tr: 'Çarpan', en: 'Multiplier' },
  'activities.custom.fields.defaultAmount': { tr: 'Varsayılan miktar', en: 'Default amount' },
  'activities.custom.fields.description': { tr: 'Açıklama', en: 'Description' },
  'activities.custom.placeholders.label': { tr: 'Örn. Yüzme', en: 'e.g. Swimming' },
  'activities.custom.placeholders.unit': { tr: 'Örn. dakika', en: 'e.g. minutes' },
  'activities.custom.placeholders.description': {
    tr: 'Kısa bir açıklama (opsiyonel)',
    en: 'Optional short description'
  },
  'activities.custom.errors.label': { tr: 'Aktivite adı gerekli.', en: 'Activity name is required.' },
  'activities.custom.errors.icon': { tr: 'Emoji alanı boş olamaz.', en: 'Emoji cannot be empty.' },
  'activities.custom.errors.unit': { tr: 'Birim alanı boş olamaz.', en: 'Unit cannot be empty.' },
  'activities.custom.errors.multiplier': {
    tr: 'Çarpan pozitif bir sayı olmalı.',
    en: 'Multiplier must be a positive number.'
  },
  'activities.custom.errors.defaultAmount': {
    tr: 'Varsayılan miktar pozitif bir tam sayı olmalı.',
    en: 'Default amount must be a positive integer.'
  },
  'activities.custom.errors.duplicate': {
    tr: 'Bu isimle başka bir aktivite zaten var.',
    en: 'Another activity already uses this identifier.'
  },
  'activities.custom.errors.inUse': {
    tr: 'Bu aktivite geçmiş kayıtlarda kullanıldığı için silinemez.',
    en: 'This activity already has records and cannot be removed.'
  },
  'activities.custom.add': { tr: 'Aktiviteyi Ekle', en: 'Add Activity' },
  'activities.custom.save': { tr: 'Aktiviteyi Kaydet', en: 'Save Activity' },
  'activities.custom.customList': { tr: 'Senin Aktivitelerin', en: 'Your Activities' },
  'activities.custom.baseList': { tr: 'Hazır Aktiviteler', en: 'Default Activities' },
  'activities.custom.empty': {
    tr: 'Henüz özel aktivite eklemedin.',
    en: 'You have not added any custom activities yet.'
  },
  'activities.custom.edit': { tr: 'Düzenle', en: 'Edit' },
  'activities.custom.remove': { tr: 'Sil', en: 'Remove' },
  'activities.custom.confirmDelete': {
    tr: 'Bu aktiviteyi silmek istediğine emin misin?',
    en: 'Are you sure you want to remove this activity?'
  },

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
  'stats.sectionToggle': {
    tr: '{section} bölümünün görünürlüğünü değiştir',
    en: 'Toggle {section} section visibility'
  },
  'stats.noData': { tr: 'Henüz veri yok.', en: 'No data yet.' },
  'stats.target': { tr: 'Hedef', en: 'Target' },
  'stats.highlightsTitle': { tr: 'İstatistikler', en: 'Highlights' },
  'stats.highlight.bestDay': { tr: 'En yüksek puanlı gün', en: 'Best scoring day' },
  'stats.highlight.bestDayFallback': {
    tr: 'Henüz bir gün kaydı yok.',
    en: 'No day recorded yet.'
  },
  'stats.highlight.bestActivity': {
    tr: 'En çok puan getiren aktivite',
    en: 'Top scoring activity'
  },
  'stats.highlight.bestActivityFallback': {
    tr: 'Henüz aktivite yok.',
    en: 'No activities yet.'
  },
  'stats.highlight.sessions': { tr: 'seans', en: 'sessions' },
  'stats.highlight.currentStreak': { tr: 'Aktif seri', en: 'Current streak' },
  'stats.highlight.totalActivities': {
    tr: '{count} toplam aktivite',
    en: '{count} total activities'
  },

  'settings.setProfile': { tr: 'Profil Ayarla', en: 'Set Profile' },
  'settings.title': { tr: 'Seni Tanıyalım', en: 'Tell Us About You' },
  'settings.subtitle': {
    tr: 'İsmini ve günlük puan hedefini belirle, motivasyonun artsın.',
    en: 'Set your name and daily points goal to stay motivated.'
  },
  'settings.nameLabel': { tr: 'İsmin', en: 'Your name' },
  'settings.namePlaceholder': { tr: 'Örn. Mustafa', en: 'e.g. Alex' },
  'settings.goalLabel': { tr: 'Günlük hedef (puan)', en: 'Daily goal (points)' },
  'settings.save': { tr: 'Kaydet', en: 'Save' },
  'settings.errors.nameRequired': {
    tr: 'İsim boş olamaz.',
    en: 'Name cannot be empty.'
  },
  'settings.errors.targetPositive': {
    tr: 'Hedef pozitif bir sayı olmalı.',
    en: 'Goal must be a positive number.'
  },

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


