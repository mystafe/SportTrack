/**
 * Activity Performance Forecast Utilities
 * Predicts future performance based on historical data
 */

import { ActivityRecord } from './activityStore';
import { startOfDay, parseISO, subDays, addDays, format, eachDayOfInterval } from 'date-fns';

export interface ForecastData {
  date: string;
  predictedPoints: number;
  predictedCount: number;
  confidence: number; // 0-100
}

export interface ActivityForecast {
  activityKey: string;
  label: string;
  labelEn?: string;
  icon: string;
  historicalAverage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  forecast: ForecastData[];
  nextWeekPrediction: number;
  nextMonthPrediction: number;
}

/**
 * Simple linear regression to predict future values
 */
function linearRegression(data: number[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n < 2) {
    return { slope: 0, intercept: data[0] || 0 };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumXX += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

/**
 * Calculate moving average
 */
function movingAverage(data: number[], window: number = 7): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

/**
 * Calculate forecast for an activity
 */
export function calculateActivityForecast(
  activities: ActivityRecord[],
  activityKey: string,
  forecastDays: number = 30
): ActivityForecast | null {
  const now = new Date();
  const historicalDays = 60; // Use last 60 days for prediction
  const startDate = subDays(now, historicalDays);
  const endDate = now;

  // Filter activities for this specific activity
  const activityRecords = activities.filter(
    (a) =>
      a.activityKey === activityKey &&
      parseISO(a.performedAt) >= startDate &&
      parseISO(a.performedAt) <= endDate
  );

  if (activityRecords.length === 0) return null;

  const firstActivity = activityRecords[0];

  // Group by day
  const dailyData = new Map<string, { points: number; count: number }>();
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  dateRange.forEach((date) => {
    const key = format(date, 'yyyy-MM-dd');
    dailyData.set(key, { points: 0, count: 0 });
  });

  activityRecords.forEach((activity) => {
    const date = startOfDay(parseISO(activity.performedAt));
    const key = format(date, 'yyyy-MM-dd');
    const existing = dailyData.get(key) || { points: 0, count: 0 };
    existing.points += activity.points;
    existing.count += 1;
    dailyData.set(key, existing);
  });

  // Create arrays for regression
  const pointsData: number[] = [];
  const countData: number[] = [];

  dateRange.forEach((date) => {
    const key = format(date, 'yyyy-MM-dd');
    const data = dailyData.get(key) || { points: 0, count: 0 };
    pointsData.push(data.points);
    countData.push(data.count);
  });

  // Calculate moving averages for smoothing
  const smoothedPoints = movingAverage(pointsData, 7);
  const smoothedCount = movingAverage(countData, 7);

  // Calculate linear regression
  const pointsRegression = linearRegression(smoothedPoints);
  const countRegression = linearRegression(smoothedCount);

  // Determine trend
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (pointsRegression.slope > 0.1) {
    trend = 'increasing';
  } else if (pointsRegression.slope < -0.1) {
    trend = 'decreasing';
  }

  // Calculate historical average
  const historicalAverage = pointsData.reduce((sum, val) => sum + val, 0) / pointsData.length;

  // Generate forecast
  const forecast: ForecastData[] = [];
  for (let i = 1; i <= forecastDays; i++) {
    const futureDate = addDays(now, i);
    const futureIndex = dateRange.length + i - 1;

    // Predict using regression
    const predictedPoints = Math.max(
      0,
      pointsRegression.slope * futureIndex + pointsRegression.intercept
    );
    const predictedCount = Math.max(
      0,
      countRegression.slope * futureIndex + countRegression.intercept
    );

    // Calculate confidence (decreases over time)
    const confidence = Math.max(0, 100 - (i / forecastDays) * 50);

    forecast.push({
      date: format(futureDate, 'yyyy-MM-dd'),
      predictedPoints: Math.round(predictedPoints),
      predictedCount: Math.round(predictedCount),
      confidence: Math.round(confidence),
    });
  }

  // Calculate next week and month predictions
  const nextWeekPrediction = forecast.slice(0, 7).reduce((sum, f) => sum + f.predictedPoints, 0);
  const nextMonthPrediction = forecast.reduce((sum, f) => sum + f.predictedPoints, 0);

  return {
    activityKey,
    label: firstActivity.label,
    labelEn: firstActivity.labelEn,
    icon: firstActivity.icon,
    historicalAverage: Math.round(historicalAverage),
    trend,
    forecast,
    nextWeekPrediction: Math.round(nextWeekPrediction),
    nextMonthPrediction: Math.round(nextMonthPrediction),
  };
}

/**
 * Calculate forecasts for all activities
 */
export function calculateAllActivityForecasts(
  activities: ActivityRecord[],
  forecastDays: number = 30
): ActivityForecast[] {
  const activityKeys = new Set(activities.map((a) => a.activityKey));
  const forecasts: ActivityForecast[] = [];

  activityKeys.forEach((key) => {
    const forecast = calculateActivityForecast(activities, key, forecastDays);
    if (forecast) {
      forecasts.push(forecast);
    }
  });

  return forecasts.sort((a, b) => b.nextMonthPrediction - a.nextMonthPrediction);
}
