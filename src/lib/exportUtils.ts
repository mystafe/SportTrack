import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { ActivityDefinition } from '@/lib/activityConfig';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';

export type ExportFormat = 'csv' | 'pdf' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  dateRange?: {
    start: Date;
    end: Date;
  };
  includeCharts?: boolean;
  language: 'tr' | 'en';
}

export function exportToCSV(
  activities: ActivityRecord[],
  settings: UserSettings | null,
  options: ExportOptions
): void {
  const locale = options.language === 'tr' ? tr : enUS;
  const dateFormat = options.language === 'tr' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy HH:mm';

  // Filter by date range if provided
  let filteredActivities = activities;
  if (options.dateRange) {
    filteredActivities = activities.filter((activity) => {
      const activityDate = parseISO(activity.performedAt);
      return activityDate >= options.dateRange!.start && activityDate <= options.dateRange!.end;
    });
  }

  // CSV Headers
  const headers =
    options.language === 'tr'
      ? ['Tarih', 'Saat', 'Aktivite', 'Miktar', 'Birim', 'Puan', 'Not']
      : ['Date', 'Time', 'Activity', 'Amount', 'Unit', 'Points', 'Note'];

  // CSV Rows
  const rows = filteredActivities.map((activity) => {
    const date = parseISO(activity.performedAt);
    const dateStr = format(date, dateFormat, { locale });
    const [datePart, timePart] = dateStr.split(' ');

    return [
      datePart,
      timePart || '',
      getActivityLabel(activity, options.language),
      String(activity.amount),
      getActivityUnit(activity, options.language),
      String(activity.points),
      activity.note || '',
    ];
  });

  // Add summary row
  const totalPoints = filteredActivities.reduce((sum, a) => sum + a.points, 0);
  const summaryLabel = options.language === 'tr' ? 'TOPLAM' : 'TOTAL';
  rows.push(['', '', '', '', '', summaryLabel, String(totalPoints)]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sporttrack-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(
  activities: ActivityRecord[],
  settings: UserSettings | null,
  options: ExportOptions
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const locale = options.language === 'tr' ? tr : enUS;
  const dateFormat = options.language === 'tr' ? 'dd.MM.yyyy HH:mm' : 'MM/dd/yyyy HH:mm';

  // Filter by date range if provided
  let filteredActivities = activities;
  if (options.dateRange) {
    filteredActivities = activities.filter((activity) => {
      const activityDate = parseISO(activity.performedAt);
      return activityDate >= options.dateRange!.start && activityDate <= options.dateRange!.end;
    });
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = margin;

  // Title
  const title =
    options.language === 'tr' ? 'SportTrack Aktivite Raporu' : 'SportTrack Activity Report';
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, yPos);
  yPos += 10;

  // User info
  if (settings) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const moodText = settings.mood
      ? options.language === 'tr'
        ? ` | Ruh Hali: ${settings.mood === 'happy' ? 'Mutlu' : settings.mood === 'cheerful' ? 'Neşeli' : settings.mood === 'sad' ? 'Üzgün' : settings.mood === 'unhappy' ? 'Mutsuz' : settings.mood === 'tired' ? 'Yorgun/Hasta' : ''}`
        : ` | Mood: ${settings.mood === 'happy' ? 'Happy' : settings.mood === 'cheerful' ? 'Cheerful' : settings.mood === 'sad' ? 'Sad' : settings.mood === 'unhappy' ? 'Unhappy' : settings.mood === 'tired' ? 'Tired/Sick' : ''}`
      : '';
    const userInfo =
      options.language === 'tr'
        ? `Kullanıcı: ${settings.name} | Günlük Hedef: ${settings.dailyTarget.toLocaleString()} puan${moodText}`
        : `User: ${settings.name} | Daily Goal: ${settings.dailyTarget.toLocaleString()} points${moodText}`;
    doc.text(userInfo, margin, yPos);
    yPos += 8;
  }

  // Date range info
  if (options.dateRange) {
    const dateRangeText =
      options.language === 'tr'
        ? `Tarih Aralığı: ${format(options.dateRange.start, 'dd.MM.yyyy', { locale })} - ${format(options.dateRange.end, 'dd.MM.yyyy', { locale })}`
        : `Date Range: ${format(options.dateRange.start, 'MM/dd/yyyy', { locale })} - ${format(options.dateRange.end, 'MM/dd/yyyy', { locale })}`;
    doc.text(dateRangeText, margin, yPos);
    yPos += 8;
  }

  // Export date
  const exportDateText =
    options.language === 'tr'
      ? `Rapor Tarihi: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale })}`
      : `Report Date: ${format(new Date(), 'MM/dd/yyyy HH:mm', { locale })}`;
  doc.text(exportDateText, margin, yPos);
  yPos += 10;

  // Summary statistics
  const totalActivities = filteredActivities.length;
  const totalPoints = filteredActivities.reduce((sum, a) => sum + a.points, 0);
  const avgPoints = totalActivities > 0 ? Math.round(totalPoints / totalActivities) : 0;

  const summaryLabel = options.language === 'tr' ? 'Özet' : 'Summary';
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(summaryLabel, margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const summaryText =
    options.language === 'tr'
      ? [
          `Toplam Aktivite: ${totalActivities}`,
          `Toplam Puan: ${totalPoints.toLocaleString()}`,
          `Ortalama Puan: ${avgPoints.toLocaleString()}`,
        ]
      : [
          `Total Activities: ${totalActivities}`,
          `Total Points: ${totalPoints.toLocaleString()}`,
          `Average Points: ${avgPoints.toLocaleString()}`,
        ];

  summaryText.forEach((text) => {
    doc.text(text, margin + 5, yPos);
    yPos += 6;
  });
  yPos += 5;

  // Activities table
  const tableHeaders =
    options.language === 'tr'
      ? [['Tarih', 'Aktivite', 'Miktar', 'Birim', 'Puan', 'Not']]
      : [['Date', 'Activity', 'Amount', 'Unit', 'Points', 'Note']];

  const tableData = filteredActivities.map((activity) => {
    const date = parseISO(activity.performedAt);
    const dateStr = format(date, dateFormat, { locale });

    return [
      dateStr,
      getActivityLabel(activity, options.language),
      String(activity.amount),
      getActivityUnit(activity, options.language),
      String(activity.points),
      activity.note || '',
    ];
  });

  autoTable(doc, {
    head: tableHeaders,
    body: tableData,
    startY: yPos,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 50 },
    },
  });

  // Save PDF
  doc.save(`sporttrack-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}

export function exportToJSON(
  activities: ActivityRecord[],
  settings: UserSettings | null,
  options: ExportOptions,
  activityDefinitions?: ActivityDefinition[]
): void {
  // Filter by date range if provided
  let filteredActivities = activities;
  if (options.dateRange) {
    filteredActivities = activities.filter((activity) => {
      const activityDate = parseISO(activity.performedAt);
      return activityDate >= options.dateRange!.start && activityDate <= options.dateRange!.end;
    });
  }

  // Prepare export data with new structure
  const exportData = {
    // Exercise records (yapılan egzersizler) - renamed from "activities" to "exercises"
    exercises: filteredActivities,
    // Activity definitions (aktivite tanımları - default + custom)
    activities: activityDefinitions || [],
    settings: settings || null,
    exportDate: new Date().toISOString(),
    version: '0.18.17', // Current app version
    dateRange: options.dateRange
      ? {
          start: options.dateRange.start.toISOString(),
          end: options.dateRange.end.toISOString(),
        }
      : null,
    summary: {
      totalExercises: filteredActivities.length,
      totalActivities: activityDefinitions?.length || 0,
      totalPoints: filteredActivities.reduce((sum, a) => sum + a.points, 0),
      averagePoints:
        filteredActivities.length > 0
          ? Math.round(
              filteredActivities.reduce((sum, a) => sum + a.points, 0) / filteredActivities.length
            )
          : 0,
    },
  };

  // Create JSON blob
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sporttrack-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
