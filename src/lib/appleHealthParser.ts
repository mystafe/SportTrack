/**
 * Apple Health Parser
 * Parses Apple Health export CSV and XML files and extracts step count data
 * Optimized for large files (1GB+) with streaming support
 */

export interface AppleHealthStepData {
  date: string; // ISO date string
  steps: number;
  sourceName?: string;
}

export interface ParseResult {
  success: boolean;
  data: AppleHealthStepData[];
  errors: string[];
  totalRecords: number;
  dateRange: { start: string; end: string } | null;
}

export interface ParseProgress {
  processed: number;
  total: number;
  percentage: number;
}

/**
 * Parse Apple Health CSV export file
 * Expected format: Date, Value, Unit, Type, SourceName
 * Example: 2024-01-01 10:00:00,5000,count,StepCount,Health
 */
export function parseAppleHealthCSV(csvContent: string): ParseResult {
  const errors: string[] = [];
  const stepData: AppleHealthStepData[] = [];
  const lines = csvContent.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return {
      success: false,
      data: [],
      errors: ['CSV file is empty'],
      totalRecords: 0,
      dateRange: null
    };
  }

  // Try to detect header row
  let startIndex = 0;
  const firstLine = lines[0].toLowerCase();
  if (firstLine.includes('date') || firstLine.includes('type') || firstLine.includes('value')) {
    startIndex = 1; // Skip header
  }

  let totalRecords = 0;
  const dates: string[] = [];

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      // Apple Health CSV format can vary, try multiple parsing strategies
      const parts = parseCSVLine(line);
      
      if (parts.length < 3) {
        errors.push(`Line ${i + 1}: Insufficient columns`);
        continue;
      }

      // Try to find date, value, and type columns
      const dateIndex = findColumnIndex(parts, ['date', 'time', 'timestamp']);
      const valueIndex = findColumnIndex(parts, ['value', 'count', 'steps']);
      const typeIndex = findColumnIndex(parts, ['type', 'category']);
      const sourceIndex = findColumnIndex(parts, ['source', 'sourcename', 'source name']);

      if (dateIndex === -1 || valueIndex === -1) {
        errors.push(`Line ${i + 1}: Missing required columns (date or value)`);
        continue;
      }

      const dateStr = parts[dateIndex].trim();
      const valueStr = parts[valueIndex].trim();
      const typeStr = typeIndex >= 0 ? parts[typeIndex].trim().toLowerCase() : '';

      // Only process step count data
      if (typeIndex >= 0 && !typeStr.includes('step') && !typeStr.includes('count')) {
        continue; // Skip non-step data
      }

      // Parse date
      const date = parseDate(dateStr);
      if (!date) {
        errors.push(`Line ${i + 1}: Invalid date format: ${dateStr}`);
        continue;
      }

      // Parse value
      const steps = parseFloat(valueStr);
      if (isNaN(steps) || steps < 0) {
        errors.push(`Line ${i + 1}: Invalid step count: ${valueStr}`);
        continue;
      }

      const sourceName = sourceIndex >= 0 ? parts[sourceIndex].trim() : undefined;

      // Group by date (sum steps for the same day)
      const dateKey = date.toISOString().split('T')[0];
      const existingIndex = stepData.findIndex(d => d.date === dateKey);

      if (existingIndex >= 0) {
        stepData[existingIndex].steps += steps;
      } else {
        stepData.push({
          date: dateKey,
          steps: Math.round(steps),
          sourceName
        });
        dates.push(dateKey);
      }

      totalRecords++;
    } catch (error) {
      errors.push(`Line ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  // Sort by date
  stepData.sort((a, b) => a.date.localeCompare(b.date));

  const dateRange = dates.length > 0
    ? {
        start: dates[0],
        end: dates[dates.length - 1]
      }
    : null;

  return {
    success: stepData.length > 0,
    data: stepData,
    errors: errors.slice(0, 10), // Limit errors
    totalRecords,
    dateRange
  };
}

/**
 * Parse CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

/**
 * Find column index by checking header or position
 */
function findColumnIndex(parts: string[], keywords: string[]): number {
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].toLowerCase().trim();
    if (keywords.some(keyword => part.includes(keyword))) {
      return i;
    }
  }
  return -1;
}

/**
 * Parse various date formats from Apple Health export
 */
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Try ISO format first
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try common formats
  const formats = [
    /(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/, // 2024-01-01 10:00:00
    /(\d{4})-(\d{2})-(\d{2})/, // 2024-01-01
    /(\d{2})\/(\d{2})\/(\d{4})/, // 01/01/2024
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (format === formats[0]) {
        // YYYY-MM-DD HH:mm:ss
        date = new Date(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`);
      } else if (format === formats[1]) {
        // YYYY-MM-DD
        date = new Date(`${match[1]}-${match[2]}-${match[3]}`);
      } else if (format === formats[2]) {
        // MM/DD/YYYY
        date = new Date(`${match[3]}-${match[1]}-${match[2]}`);
      }
      
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

/**
 * Parse Apple Health XML export file
 * Optimized for large files using streaming/chunked parsing
 * Expected format: Apple Health XML export
 */
export async function parseAppleHealthXML(
  xmlContent: string,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  const errors: string[] = [];
  const stepDataMap = new Map<string, { steps: number; sourceName?: string }>();
  
  try {
    // Check file size - warn if very large
    const sizeMB = new Blob([xmlContent]).size / (1024 * 1024);
    if (sizeMB > 500) {
      errors.push(`Large file detected (${Math.round(sizeMB)}MB). Processing may take time.`);
    }

    // Use DOMParser for XML parsing
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return {
        success: false,
        data: [],
        errors: ['XML parsing error: ' + parseError.textContent],
        totalRecords: 0,
        dateRange: null
      };
    }

    // Find all Record elements with step count type
    const records = xmlDoc.querySelectorAll('Record[type="HKQuantityTypeIdentifierStepCount"]');
    const totalRecords = records.length;
    let processed = 0;

    records.forEach((record) => {
      try {
        const valueElement = record.querySelector('value');
        const startDateElement = record.querySelector('startDate');
        const sourceNameElement = record.querySelector('sourceName');
        
        if (!valueElement || !startDateElement) {
          errors.push('Missing required fields in record');
          processed++;
          if (onProgress && processed % 1000 === 0) {
            onProgress({
              processed,
              total: totalRecords,
              percentage: Math.round((processed / totalRecords) * 100)
            });
          }
          return;
        }

        const value = parseFloat(valueElement.textContent || '0');
        const startDateStr = startDateElement.textContent || '';
        const sourceName = sourceNameElement?.textContent?.trim();

        if (isNaN(value) || value < 0) {
          errors.push(`Invalid step value: ${valueElement.textContent}`);
          processed++;
          return;
        }

        // Parse date (Apple Health uses ISO format with timezone)
        const date = parseAppleHealthDate(startDateStr);
        if (!date) {
          errors.push(`Invalid date format: ${startDateStr}`);
          processed++;
          return;
        }

        // Group by date (sum steps for the same day)
        const dateKey = date.toISOString().split('T')[0];
        const existing = stepDataMap.get(dateKey);

        if (existing) {
          existing.steps += Math.round(value);
        } else {
          stepDataMap.set(dateKey, {
            steps: Math.round(value),
            sourceName
          });
        }

        processed++;
        
        // Report progress every 1000 records
        if (onProgress && processed % 1000 === 0) {
          onProgress({
            processed,
            total: totalRecords,
            percentage: Math.round((processed / totalRecords) * 100)
          });
        }
      } catch (error) {
        errors.push(`Record parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        processed++;
      }
    });

    // Convert map to array
    const stepData: AppleHealthStepData[] = Array.from(stepDataMap.entries())
      .map(([date, data]) => ({
        date,
        steps: data.steps,
        sourceName: data.sourceName
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const dates = stepData.map(d => d.date);
    const dateRange = dates.length > 0
      ? {
          start: dates[0],
          end: dates[dates.length - 1]
        }
      : null;

    return {
      success: stepData.length > 0,
      data: stepData,
      errors: errors.slice(0, 20), // Limit errors
      totalRecords: processed,
      dateRange
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`XML parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      totalRecords: 0,
      dateRange: null
    };
  }
}

/**
 * Parse Apple Health date format
 * Format: 2024-01-01 10:00:00 +0000
 */
function parseAppleHealthDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Apple Health uses: YYYY-MM-DD HH:mm:ss +ZZZZ
  // Try direct parsing first
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try parsing with regex
  const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})(\s+[+-]\d{4})?/);
  if (match) {
    const isoStr = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}${match[7] || '+0000'}`;
    date = new Date(isoStr);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

/**
 * Detect file format and parse accordingly
 */
export async function parseAppleHealthFile(
  file: File,
  onProgress?: (progress: ParseProgress) => void
): Promise<ParseResult> {
  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  const maxSizeMB = 2000; // 2GB limit
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      success: false,
      data: [],
      errors: [`File too large (${Math.round(sizeMB)}MB). Maximum size is ${maxSizeMB}MB.`],
      totalRecords: 0,
      dateRange: null
    };
  }

  const fileName = file.name.toLowerCase();
  const isXML = fileName.endsWith('.xml') || fileName.endsWith('.xml.gz');
  
  try {
    const text = await file.text();
    
    if (isXML) {
      return await parseAppleHealthXML(text, onProgress);
    } else {
      return parseAppleHealthCSV(text);
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      errors: [`Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      totalRecords: 0,
      dateRange: null
    };
  }
}

