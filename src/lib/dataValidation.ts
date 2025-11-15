/**
 * Data Validation Service
 * Validates data integrity for activities, settings, badges, and challenges
 */

import type { ActivityRecord } from '@/lib/activityStore';
import type { UserSettings } from '@/lib/settingsStore';
import type { Badge } from '@/lib/badges';
import type { Challenge } from '@/lib/challenges';

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * Validate an activity record
 */
export function validateActivity(activity: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Required fields
  if (!activity.id || typeof activity.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'Activity ID is required and must be a string',
      value: activity.id,
    });
  }

  if (!activity.activityKey || typeof activity.activityKey !== 'string') {
    errors.push({
      field: 'activityKey',
      message: 'Activity key is required and must be a string',
      value: activity.activityKey,
    });
  }

  if (typeof activity.amount !== 'number' || isNaN(activity.amount)) {
    errors.push({
      field: 'amount',
      message: 'Amount is required and must be a number',
      value: activity.amount,
    });
  } else if (activity.amount < 0) {
    warnings.push({
      field: 'amount',
      message: 'Amount is negative',
      value: activity.amount,
    });
  }

  if (typeof activity.points !== 'number' || isNaN(activity.points)) {
    errors.push({
      field: 'points',
      message: 'Points is required and must be a number',
      value: activity.points,
    });
  } else if (activity.points < 0) {
    warnings.push({
      field: 'points',
      message: 'Points is negative',
      value: activity.points,
    });
  }

  // Date validation
  if (!activity.performedAt || typeof activity.performedAt !== 'string') {
    errors.push({
      field: 'performedAt',
      message: 'Performed date is required and must be a string',
      value: activity.performedAt,
    });
  } else {
    try {
      const date = new Date(activity.performedAt);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'performedAt',
          message: 'Invalid date format',
          value: activity.performedAt,
        });
      } else {
        // Check for future dates
        if (date > new Date()) {
          warnings.push({
            field: 'performedAt',
            message: 'Date is in the future',
            value: activity.performedAt,
          });
        }
        // Check for very old dates (more than 10 years ago)
        const tenYearsAgo = new Date();
        tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
        if (date < tenYearsAgo) {
          warnings.push({
            field: 'performedAt',
            message: 'Date is very old (more than 10 years)',
            value: activity.performedAt,
          });
        }
      }
    } catch (error) {
      errors.push({
        field: 'performedAt',
        message: 'Failed to parse date',
        value: activity.performedAt,
      });
    }
  }

  // Optional fields validation
  if (
    activity.multiplier !== undefined &&
    (typeof activity.multiplier !== 'number' || activity.multiplier <= 0)
  ) {
    warnings.push({
      field: 'multiplier',
      message: 'Multiplier should be a positive number',
      value: activity.multiplier,
    });
  }

  if (
    activity.duration !== undefined &&
    (typeof activity.duration !== 'number' || activity.duration < 0)
  ) {
    warnings.push({
      field: 'duration',
      message: 'Duration should be a non-negative number',
      value: activity.duration,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate user settings
 */
export function validateSettings(settings: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!settings || typeof settings !== 'object') {
    errors.push({
      field: 'settings',
      message: 'Settings must be an object',
      value: settings,
    });
    return { isValid: false, errors, warnings };
  }

  // Name validation
  if (settings.name !== undefined && typeof settings.name !== 'string') {
    errors.push({
      field: 'name',
      message: 'Name must be a string',
      value: settings.name,
    });
  } else if (settings.name && settings.name.trim().length === 0) {
    warnings.push({
      field: 'name',
      message: 'Name is empty',
      value: settings.name,
    });
  }

  // Daily target validation
  if (settings.dailyTarget !== undefined) {
    if (typeof settings.dailyTarget !== 'number' || isNaN(settings.dailyTarget)) {
      errors.push({
        field: 'dailyTarget',
        message: 'Daily target must be a number',
        value: settings.dailyTarget,
      });
    } else if (settings.dailyTarget < 0) {
      warnings.push({
        field: 'dailyTarget',
        message: 'Daily target is negative',
        value: settings.dailyTarget,
      });
    } else if (settings.dailyTarget > 1000000) {
      warnings.push({
        field: 'dailyTarget',
        message: 'Daily target is very high (more than 1,000,000)',
        value: settings.dailyTarget,
      });
    }
  }

  // Custom activities validation
  if (settings.customActivities !== undefined) {
    if (!Array.isArray(settings.customActivities)) {
      errors.push({
        field: 'customActivities',
        message: 'Custom activities must be an array',
        value: settings.customActivities,
      });
    } else {
      settings.customActivities.forEach((activity: any, index: number) => {
        if (!activity.id || typeof activity.id !== 'string') {
          errors.push({
            field: `customActivities[${index}].id`,
            message: 'Custom activity ID is required',
            value: activity.id,
          });
        }
        if (!activity.label || typeof activity.label !== 'string') {
          errors.push({
            field: `customActivities[${index}].label`,
            message: 'Custom activity label is required',
            value: activity.label,
          });
        }
        if (typeof activity.multiplier !== 'number' || activity.multiplier <= 0) {
          errors.push({
            field: `customActivities[${index}].multiplier`,
            message: 'Custom activity multiplier must be a positive number',
            value: activity.multiplier,
          });
        }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a badge
 */
export function validateBadge(badge: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!badge.id || typeof badge.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'Badge ID is required and must be a string',
      value: badge.id,
    });
  }

  if (badge.unlockedAt !== undefined) {
    try {
      const date = new Date(badge.unlockedAt);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'unlockedAt',
          message: 'Invalid unlock date format',
          value: badge.unlockedAt,
        });
      } else if (date > new Date()) {
        warnings.push({
          field: 'unlockedAt',
          message: 'Unlock date is in the future',
          value: badge.unlockedAt,
        });
      }
    } catch (error) {
      errors.push({
        field: 'unlockedAt',
        message: 'Failed to parse unlock date',
        value: badge.unlockedAt,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a challenge
 */
export function validateChallenge(challenge: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  if (!challenge.id || typeof challenge.id !== 'string') {
    errors.push({
      field: 'id',
      message: 'Challenge ID is required and must be a string',
      value: challenge.id,
    });
  }

  if (typeof challenge.target !== 'number' || isNaN(challenge.target) || challenge.target <= 0) {
    errors.push({
      field: 'target',
      message: 'Challenge target must be a positive number',
      value: challenge.target,
    });
  }

  // Date validation
  if (!challenge.startDate || typeof challenge.startDate !== 'string') {
    errors.push({
      field: 'startDate',
      message: 'Start date is required and must be a string',
      value: challenge.startDate,
    });
  } else {
    try {
      const date = new Date(challenge.startDate);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'startDate',
          message: 'Invalid start date format',
          value: challenge.startDate,
        });
      }
    } catch (error) {
      errors.push({
        field: 'startDate',
        message: 'Failed to parse start date',
        value: challenge.startDate,
      });
    }
  }

  if (challenge.endDate !== undefined && challenge.endDate !== null) {
    if (typeof challenge.endDate !== 'string') {
      errors.push({
        field: 'endDate',
        message: 'End date must be a string',
        value: challenge.endDate,
      });
    } else {
      try {
        const startDate = challenge.startDate ? new Date(challenge.startDate) : null;
        const endDate = new Date(challenge.endDate);
        if (isNaN(endDate.getTime())) {
          errors.push({
            field: 'endDate',
            message: 'Invalid end date format',
            value: challenge.endDate,
          });
        } else if (startDate && endDate < startDate) {
          warnings.push({
            field: 'endDate',
            message: 'End date is before start date',
            value: challenge.endDate,
          });
        }
      } catch (error) {
        errors.push({
          field: 'endDate',
          message: 'Failed to parse end date',
          value: challenge.endDate,
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate an array of activities and return valid ones
 */
export function validateActivities(activities: any[]): {
  valid: ActivityRecord[];
  invalid: Array<{ activity: any; errors: ValidationError[] }>;
  warnings: Array<{ activity: any; warnings: ValidationError[] }>;
} {
  const valid: ActivityRecord[] = [];
  const invalid: Array<{ activity: any; errors: ValidationError[] }> = [];
  const warnings: Array<{ activity: any; warnings: ValidationError[] }> = [];

  activities.forEach((activity) => {
    const result = validateActivity(activity);
    if (result.isValid) {
      valid.push(activity as ActivityRecord);
      if (result.warnings.length > 0) {
        warnings.push({ activity, warnings: result.warnings });
      }
    } else {
      invalid.push({ activity, errors: result.errors });
    }
  });

  return { valid, invalid, warnings };
}

/**
 * Detect duplicate activities (same ID or same date + activity + amount)
 */
export function detectDuplicates(activities: ActivityRecord[]): {
  duplicates: Array<{ activity: ActivityRecord; reason: string }>;
  unique: ActivityRecord[];
} {
  const seen = new Map<string, ActivityRecord>();
  const duplicates: Array<{ activity: ActivityRecord; reason: string }> = [];
  const unique: ActivityRecord[] = [];

  activities.forEach((activity) => {
    // Check for duplicate IDs
    if (seen.has(activity.id)) {
      duplicates.push({
        activity,
        reason: `Duplicate ID: ${activity.id}`,
      });
      return;
    }

    // Check for duplicate date + activity + amount
    const date = new Date(activity.performedAt);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const duplicateKey = `${dateKey}-${activity.activityKey}-${activity.amount}`;

    // Check if we've seen this combination before
    let isDuplicate = false;
    for (const [id, seenActivity] of seen.entries()) {
      const seenDate = new Date(seenActivity.performedAt);
      const seenDateKey = seenDate.toISOString().split('T')[0];
      const seenDuplicateKey = `${seenDateKey}-${seenActivity.activityKey}-${seenActivity.amount}`;

      if (duplicateKey === seenDuplicateKey && activity.id !== seenActivity.id) {
        duplicates.push({
          activity,
          reason: `Duplicate entry: Same date (${dateKey}), activity (${activity.activityKey}), and amount (${activity.amount})`,
        });
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seen.set(activity.id, activity);
      unique.push(activity);
    }
  });

  return { duplicates, unique };
}

/**
 * Clean and normalize activities (remove duplicates, validate, fix common issues)
 */
export function cleanActivities(activities: ActivityRecord[]): {
  cleaned: ActivityRecord[];
  removed: Array<{ activity: ActivityRecord; reason: string }>;
  warnings: Array<{ activity: ActivityRecord; warning: string }>;
} {
  const removed: Array<{ activity: ActivityRecord; reason: string }> = [];
  const warnings: Array<{ activity: ActivityRecord; warning: string }> = [];

  // Step 1: Validate activities
  const { valid, invalid, warnings: validationWarnings } = validateActivities(activities);

  // Add invalid activities to removed list
  invalid.forEach(({ activity, errors }) => {
    removed.push({
      activity,
      reason: `Validation failed: ${errors.map((e) => e.message).join(', ')}`,
    });
  });

  // Add validation warnings
  validationWarnings.forEach(({ activity, warnings: ws }) => {
    ws.forEach((w) => {
      warnings.push({
        activity,
        warning: w.message,
      });
    });
  });

  // Step 2: Detect and remove duplicates
  const { duplicates, unique } = detectDuplicates(valid);

  // Add duplicates to removed list
  duplicates.forEach(({ activity, reason }) => {
    removed.push({ activity, reason });
  });

  // Step 3: Sort by date (newest first)
  const cleaned = unique.sort((a, b) => {
    const dateA = new Date(a.performedAt).getTime();
    const dateB = new Date(b.performedAt).getTime();
    return dateB - dateA;
  });

  return { cleaned, removed, warnings };
}
