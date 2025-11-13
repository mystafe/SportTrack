'use client';

import { useState, useRef } from 'react';
import { useActivities } from '@/lib/activityStore';
import { useSettings } from '@/lib/settingsStore';
import { useI18n } from '@/lib/i18n';
import { useToaster } from '@/components/Toaster';
import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { STORAGE_KEYS } from '@/lib/constants';
import { ExportDialog } from '@/components/ExportDialog';
import { AppleHealthImport } from '@/components/AppleHealthImport';

export function DataExportImport() {
  const { activities } = useActivities();
  const { settings } = useSettings();
  const { t } = useI18n();
  const { showToast } = useToaster();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  const handleExport = () => {
    try {
      const data = {
        activities,
        settings,
        exportDate: new Date().toISOString(),
        version: '0.3.4'
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sporttrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t('data.exportSuccess'), 'success');
    } catch (error) {
      console.error('Export failed:', error);
      showToast(t('data.exportFailed'), 'error');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text) as {
        activities?: ActivityRecord[];
        settings?: UserSettings;
        version?: string;
      };

      if (!data.activities || !Array.isArray(data.activities)) {
        throw new Error('Invalid file format: activities missing');
      }
      if (!data.settings) {
        throw new Error('Invalid file format: settings missing');
      }

      // Validate data structure
      const validActivities = data.activities.filter((a) => {
        return (
          a &&
          typeof a.id === 'string' &&
          typeof a.activityKey === 'string' &&
          typeof a.amount === 'number' &&
          typeof a.points === 'number' &&
          typeof a.performedAt === 'string'
        );
      });

      if (validActivities.length === 0 && data.activities.length > 0) {
        throw new Error('No valid activities found in file');
      }

      // Show confirmation dialog
      const confirmed = window.confirm(
        t('data.importConfirm', {
          activities: String(validActivities.length),
          settings: data.settings.name || 'Unknown'
        })
      );

      if (!confirmed) {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Import data
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(validActivities));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));

      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Import failed:', error);
      const message =
        error instanceof Error ? error.message : t('data.importFailed');
      showToast(message, 'error');
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowExportDialog(true)}
          className="px-2 py-1 text-[10px] sm:text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300"
          title={t('data.exportTooltip')}
          aria-label={t('data.exportTooltip')}
        >
          💾 {t('data.export')}
        </button>
      <label className="px-2 py-1 text-[10px] sm:text-xs rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-300 cursor-pointer">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          disabled={isImporting}
          className="hidden"
          aria-label={t('data.importTooltip')}
        />
        {isImporting ? '⏳' : '📥'} {t('data.import')}
      </label>
      <AppleHealthImport />
      </div>
      <ExportDialog open={showExportDialog} onClose={() => setShowExportDialog(false)} />
    </>
  );
}

