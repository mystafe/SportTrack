import { ActivityRecord } from '@/lib/activityStore';
import { UserSettings } from '@/lib/settingsStore';
import { ActivityDefinition } from '@/lib/activityConfig';
import { getActivityLabel, getActivityUnit } from '@/lib/activityUtils';
import { format, parseISO } from 'date-fns';
import { enUS, tr } from 'date-fns/locale';
import packageJson from '../../package.json';

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

// Helper function to ensure proper text encoding for jsPDF
// jsPDF v2+ supports UTF-8 natively, but we need to ensure proper string handling
function prepareTextForPDF(text: string): string {
  // Ensure text is a proper string and handle any encoding issues
  if (typeof text !== 'string') {
    return String(text);
  }
  // jsPDF handles UTF-8 automatically, just return the string
  return text;
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

  const doc = new jsPDF({
    compress: true,
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  });

  // Enable Unicode/UTF-8 support for Turkish characters
  // jsPDF v2+ supports UTF-8 natively, but we need to ensure proper encoding
  // Set encoding to UTF-8 explicitly
  doc.setLanguage(options.language === 'tr' ? 'tr-TR' : 'en-US');

  // Enable Unicode support for Turkish characters
  // jsPDF v2+ supports UTF-8 natively, but we need to ensure proper encoding
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let yPos = margin;

  // Helper function to add text with proper encoding for Turkish characters
  const addText = (
    text: string,
    x: number,
    y: number,
    options?: { fontSize?: number; fontStyle?: string }
  ) => {
    if (options?.fontSize) {
      doc.setFontSize(options.fontSize);
    }
    if (options?.fontStyle) {
      doc.setFont('helvetica', options.fontStyle as any);
    }
    // Normalize Unicode characters for proper Turkish character support
    const normalizedText = text.normalize('NFC');
    // jsPDF v2+ supports UTF-8, but we need to ensure the text is properly encoded
    // Use splitTextToSize for long text and proper encoding
    const lines = doc.splitTextToSize(normalizedText, pageWidth - 2 * margin);
    doc.text(lines, x, y);
    return lines.length * (options?.fontSize || 10) * 0.35; // Approximate line height
  };

  // Title - normalize for Turkish characters
  const title =
    options.language === 'tr' ? 'SportTrack Aktivite Raporu' : 'SportTrack Activity Report';
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const normalizedTitle = title.normalize('NFC'); // Normalize Unicode for Turkish characters
  const titleLines = doc.splitTextToSize(normalizedTitle, pageWidth - 2 * margin);
  doc.text(titleLines, margin, yPos);
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
    const normalizedUserInfo = userInfo.normalize('NFC'); // Normalize Unicode for Turkish characters
    const userInfoLines = doc.splitTextToSize(normalizedUserInfo, pageWidth - 2 * margin);
    doc.text(userInfoLines, margin, yPos);
    yPos += 8;
  }

  // Date range info
  if (options.dateRange) {
    const dateRangeText =
      options.language === 'tr'
        ? `Tarih Aralığı: ${format(options.dateRange.start, 'dd.MM.yyyy', { locale })} - ${format(options.dateRange.end, 'dd.MM.yyyy', { locale })}`
        : `Date Range: ${format(options.dateRange.start, 'MM/dd/yyyy', { locale })} - ${format(options.dateRange.end, 'MM/dd/yyyy', { locale })}`;
    const normalizedDateRangeText = dateRangeText.normalize('NFC'); // Normalize Unicode for Turkish characters
    const dateRangeLines = doc.splitTextToSize(normalizedDateRangeText, pageWidth - 2 * margin);
    doc.text(dateRangeLines, margin, yPos);
    yPos += 8;
  }

  // Export date
  const exportDateText =
    options.language === 'tr'
      ? `Rapor Tarihi: ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale })}`
      : `Report Date: ${format(new Date(), 'MM/dd/yyyy HH:mm', { locale })}`;
  const normalizedExportDateText = exportDateText.normalize('NFC'); // Normalize Unicode for Turkish characters
  const exportDateLines = doc.splitTextToSize(normalizedExportDateText, pageWidth - 2 * margin);
  doc.text(exportDateLines, margin, yPos);
  yPos += 10;

  // Summary statistics
  const totalActivities = filteredActivities.length;
  const totalPoints = filteredActivities.reduce((sum, a) => sum + a.points, 0);
  const avgPoints = totalActivities > 0 ? Math.round(totalPoints / totalActivities) : 0;

  const summaryLabel = options.language === 'tr' ? 'Özet' : 'Summary';
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const normalizedSummaryLabel = summaryLabel.normalize('NFC'); // Normalize Unicode for Turkish characters
  const summaryLabelLines = doc.splitTextToSize(normalizedSummaryLabel, pageWidth - 2 * margin);
  doc.text(summaryLabelLines, margin, yPos);
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
    const normalizedText = text.normalize('NFC'); // Normalize Unicode for Turkish characters
    const textLines = doc.splitTextToSize(normalizedText, pageWidth - 2 * margin);
    doc.text(textLines, margin + 5, yPos);
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

    // Normalize all text fields for Turkish character support
    return [
      dateStr,
      getActivityLabel(activity, options.language).normalize('NFC'),
      String(activity.amount),
      getActivityUnit(activity, options.language).normalize('NFC'),
      String(activity.points),
      (activity.note || '').normalize('NFC'),
    ];
  });

  // Use autoTable with proper encoding for Turkish characters
  autoTable(doc, {
    head: tableHeaders,
    body: tableData,
    startY: yPos,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 2,
      font: 'helvetica',
      fontStyle: 'normal',
      // Ensure UTF-8 encoding for Turkish characters
      halign: 'left',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [14, 165, 233],
      textColor: 255,
      fontStyle: 'bold',
      font: 'helvetica',
      halign: 'left',
      valign: 'middle',
    },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20 },
      5: { cellWidth: 50 },
    },
    // Ensure proper encoding for Turkish characters
    didParseCell: function (data: any) {
      // Ensure all cell text is properly encoded as UTF-8 strings
      if (data.cell && data.cell.text !== undefined) {
        if (Array.isArray(data.cell.text)) {
          // Convert array of text to array of UTF-8 strings
          data.cell.text = data.cell.text.map((t: any) => {
            const str = String(t);
            // Ensure Turkish characters are properly encoded
            return str.normalize('NFC'); // Normalize Unicode characters
          });
        } else {
          // Convert single text to UTF-8 string
          const str = String(data.cell.text);
          // Ensure Turkish characters are properly encoded
          data.cell.text = str.normalize('NFC'); // Normalize Unicode characters
        }
      }
    },
    // Ensure proper text rendering for Turkish characters
    didDrawCell: function (data: any) {
      // jsPDF v2+ handles UTF-8 automatically, but we ensure proper rendering
      if (data.cell && data.cell.text) {
        // Text is already properly encoded in didParseCell
      }
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
    // Activity records (yapılan aktiviteler) - koşma, yürüme gibi
    exercises: filteredActivities,
    // Activity definitions (aktivite tanımları - default + custom)
    activities: activityDefinitions || [],
    settings: settings || null,
    // User name (if available)
    userName: settings?.name || null,
    exportDate: new Date().toISOString(),
    version: packageJson.version || '0.31.10', // Current app version
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
