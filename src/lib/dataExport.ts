/**
 * Data Export Utilities
 * Export data in various formats (JSON, CSV)
 */

import { ActivityRecord } from './activityStore';
import { UserSettings } from './settingsStore';
import { Badge } from './badges';
import { Challenge } from './challenges';
import { format, parseISO } from 'date-fns';

export type ExportFormat = 'json' | 'csv';

export interface ExportOptions {
  format: ExportFormat;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeSettings?: boolean;
  includeBadges?: boolean;
  includeChallenges?: boolean;
}

export interface ExportData {
  exercises: ActivityRecord[];
  settings?: UserSettings | null;
  badges?: Badge[];
  challenges?: Challenge[];
  exportDate: string;
  version: string;
}

/**
 * Export data to JSON format
 */
export function exportToJSON(
  data: ExportData,
  options: ExportOptions = { format: 'json' }
): string {
  let exportData: ExportData = {
    ...data,
  };

  // Filter by date range if specified
  if (options.dateRange) {
    exportData = {
      ...exportData,
      exercises: data.exercises.filter((exercise) => {
        const exerciseDate = parseISO(exercise.performedAt);
        return exerciseDate >= options.dateRange!.start && exerciseDate <= options.dateRange!.end;
      }),
    };
  }

  // Remove fields based on options
  if (!options.includeSettings) {
    delete exportData.settings;
  }
  if (!options.includeBadges) {
    delete exportData.badges;
  }
  if (!options.includeChallenges) {
    delete exportData.challenges;
  }

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export activities to CSV format
 */
export function exportToCSV(
  activities: ActivityRecord[],
  options: ExportOptions = { format: 'csv' },
  lang: 'tr' | 'en' = 'en'
): string {
  // Filter by date range if specified
  let filteredActivities = activities;
  if (options.dateRange) {
    filteredActivities = activities.filter((activity) => {
      const activityDate = parseISO(activity.performedAt);
      return activityDate >= options.dateRange!.start && activityDate <= options.dateRange!.end;
    });
  }

  // CSV Headers
  const headers = [
    lang === 'tr' ? 'Tarih' : 'Date',
    lang === 'tr' ? 'Saat' : 'Time',
    lang === 'tr' ? 'Aktivite' : 'Activity',
    lang === 'tr' ? 'Miktar' : 'Amount',
    lang === 'tr' ? 'Birim' : 'Unit',
    lang === 'tr' ? 'Puan' : 'Points',
    lang === 'tr' ? 'Süre (sn)' : 'Duration (s)',
    lang === 'tr' ? 'Not' : 'Note',
  ];

  // CSV Rows
  const rows = filteredActivities.map((activity) => {
    const date = parseISO(activity.performedAt);
    return [
      format(date, 'yyyy-MM-dd'),
      format(date, 'HH:mm:ss'),
      activity.label || activity.activityKey,
      activity.amount.toString(),
      activity.unit || '',
      activity.points.toString(),
      activity.duration?.toString() || '',
      activity.note || '',
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

/**
 * Download file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with date
 */
export function generateFilename(prefix: string, exportFormat: ExportFormat): string {
  const date = format(new Date(), 'yyyy-MM-dd');
  const extension = exportFormat === 'json' ? 'json' : 'csv';
  return `${prefix}-${date}.${extension}`;
}
