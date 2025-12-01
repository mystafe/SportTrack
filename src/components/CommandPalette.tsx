'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { useActivities } from '@/lib/activityStore';
import { getActivityLabel } from '@/lib/activityUtils';
import { format, parseISO } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createPortal } from 'react-dom';

export interface Command {
  id: string;
  label: string;
  labelEn?: string;
  icon?: string;
  keywords?: string[];
  action: () => void;
  category: 'navigation' | 'actions' | 'settings' | 'general' | 'activities';
  metadata?: {
    activityId?: string;
    date?: string;
    points?: number;
  };
}

interface CommandPaletteProps {
  commands?: Command[];
  open?: boolean;
  onClose?: () => void;
}

/**
 * CommandPalette Component
 *
 * A command palette (Cmd/Ctrl+K) for quick actions and navigation.
 * Inspired by VS Code, GitHub, and other modern applications.
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   commands={[
 *     {
 *       id: 'add-activity',
 *       label: 'Yeni Aktivite Ekle',
 *       action: () => router.push('/add'),
 *       category: 'actions',
 *     },
 *   ]}
 * />
 * ```
 */
export function CommandPalette({
  commands = [],
  open: controlledOpen,
  onClose,
}: CommandPaletteProps) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();
  const { activities } = useActivities();
  const [open, setOpen] = useState(controlledOpen ?? false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const defaultCommands: Command[] = useMemo(
    () => [
      {
        id: 'home',
        label: 'Ana Sayfa',
        labelEn: 'Home',
        icon: '🏠',
        keywords: ['home', 'ana', 'sayfa'],
        action: () => router.push('/'),
        category: 'navigation',
      },
      {
        id: 'activities',
        label: 'Aktiviteler',
        labelEn: 'Activities',
        icon: '📝',
        keywords: ['activities', 'aktiviteler', 'egzersiz'],
        action: () => router.push('/activities'),
        category: 'navigation',
      },
      {
        id: 'stats',
        label: 'İstatistikler',
        labelEn: 'Statistics',
        icon: '📊',
        keywords: ['stats', 'statistics', 'istatistikler'],
        action: () => router.push('/stats'),
        category: 'navigation',
      },
      {
        id: 'challenges',
        label: 'Zorluklar',
        labelEn: 'Challenges',
        icon: '🎯',
        keywords: ['challenges', 'zorluklar', 'hedefler'],
        action: () => router.push('/challenges'),
        category: 'navigation',
      },
      {
        id: 'achievements',
        label: 'Başarımlar',
        labelEn: 'Achievements',
        icon: '🏆',
        keywords: ['achievements', 'başarımlar'],
        action: () => router.push('/achievements'),
        category: 'navigation',
      },
      {
        id: 'add-activity',
        label: 'Yeni Aktivite Ekle',
        labelEn: 'Add Activity',
        icon: '➕',
        keywords: ['add', 'new', 'yeni', 'ekle', 'activity', 'aktivite'],
        action: () => router.push('/add'),
        category: 'actions',
      },
      {
        id: 'settings',
        label: 'Ayarlar',
        labelEn: 'Settings',
        icon: '⚙️',
        keywords: ['settings', 'ayarlar', 'preferences'],
        action: () => {
          const event = new CustomEvent('open-settings');
          window.dispatchEvent(event);
        },
        category: 'settings',
      },
    ],
    [router]
  );

  // Activity search commands
  const activityCommands = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    const matched = activities
      .filter((activity) => {
        const label = getActivityLabel(activity, lang);
        const labelMatch = label.toLowerCase().includes(query);
        const noteMatch = activity.note?.toLowerCase().includes(query);
        return labelMatch || noteMatch;
      })
      .slice(0, 5) // Limit to 5 results
      .map((activity) => ({
        id: `activity-${activity.id}`,
        label: `${getActivityLabel(activity, lang)} - ${format(parseISO(activity.performedAt), 'dd MMM yyyy', { locale: lang === 'tr' ? tr : enUS })}`,
        labelEn: `${getActivityLabel(activity, 'en')} - ${format(parseISO(activity.performedAt), 'dd MMM yyyy', { locale: enUS })}`,
        icon: activity.icon,
        keywords: [getActivityLabel(activity, lang), activity.note].filter(
          (kw): kw is string => typeof kw === 'string' && kw.length > 0
        ),
        action: () => {
          router.push(`/activities`);
          // Scroll to activity (would need to implement scroll-to-element)
        },
        category: 'activities' as const,
        metadata: {
          activityId: activity.id,
          date: activity.performedAt,
          points: activity.points,
        },
      }));

    return matched;
  }, [activities, searchQuery, lang, router]);

  const allCommands = useMemo(
    () => [...defaultCommands, ...activityCommands, ...commands],
    [defaultCommands, activityCommands, commands]
  );

  const filteredCommands = useMemo(() => {
    if (!searchQuery.trim()) return allCommands;

    const query = searchQuery.toLowerCase();
    return allCommands.filter((cmd) => {
      const label = lang === 'tr' ? cmd.label : cmd.labelEn || cmd.label;
      const labelMatch = label.toLowerCase().includes(query);
      const keywordMatch = cmd.keywords?.some((kw) => kw?.toLowerCase().includes(query));
      return labelMatch || keywordMatch;
    });
  }, [allCommands, searchQuery, lang]);

  const isOpen = controlledOpen !== undefined ? controlledOpen : open;

  useEffect(() => {
    if (isMobile) return; // Don't enable on mobile

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !e.shiftKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
        return;
      }

      // Arrow keys navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          return;
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          filteredCommands[selectedIndex].action();
          handleClose();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
    setSelectedIndex(0);
    onClose?.();
  };

  const handleCommandClick = (command: Command) => {
    command.action();
    handleClose();
  };

  if (isMobile || !isOpen) return null;

  const categoryLabels: Record<Command['category'], string> = {
    navigation: lang === 'tr' ? 'Navigasyon' : 'Navigation',
    actions: lang === 'tr' ? 'İşlemler' : 'Actions',
    settings: lang === 'tr' ? 'Ayarlar' : 'Settings',
    general: lang === 'tr' ? 'Genel' : 'General',
    activities: lang === 'tr' ? 'Aktiviteler' : 'Activities',
  };

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = [];
      }
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  return createPortal(
    <div
      className="fixed inset-0 z-[10001] flex items-start justify-center pt-[20vh] px-4 bg-black/40 dark:bg-black/60 backdrop-blur-md"
      onClick={handleClose}
    >
      <div className="w-full max-w-2xl animate-fade-in-scale" onClick={(e) => e.stopPropagation()}>
        <Card
          variant="elevated"
          size="lg"
          className="glass-effect card-3d shadow-2xl hover:scale-[1.01] transition-all duration-300"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Input
              ref={inputRef}
              type="text"
              placeholder={lang === 'tr' ? 'Komut ara...' : 'Search commands...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↑↓</kbd>{' '}
                {lang === 'tr' ? 'navigate' : 'navigate'}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  Enter
                </kbd>{' '}
                {lang === 'tr' ? 'seç' : 'select'}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  Esc
                </kbd>{' '}
                {lang === 'tr' ? 'kapat' : 'close'}
              </span>
            </div>
          </div>
          <div
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto p-2"
            role="listbox"
            aria-label={lang === 'tr' ? 'Komutlar' : 'Commands'}
          >
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {lang === 'tr' ? 'Komut bulunamadı' : 'No commands found'}
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category} className="mb-4">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {categoryLabels[category as Command['category']]}
                  </div>
                  {cmds.map((cmd, index) => {
                    const globalIndex = filteredCommands.indexOf(cmd);
                    const isSelected = globalIndex === selectedIndex;
                    const label = lang === 'tr' ? cmd.label : cmd.labelEn || cmd.label;

                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        onClick={() => handleCommandClick(cmd)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg
                          text-left transition-colors
                          ${isSelected ? 'bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-light' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100'}
                        `}
                        role="option"
                        aria-selected={isSelected}
                      >
                        {cmd.icon && <span className="text-xl">{cmd.icon}</span>}
                        <span className="flex-1 font-medium">{label}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>,
    document.body
  );
}
