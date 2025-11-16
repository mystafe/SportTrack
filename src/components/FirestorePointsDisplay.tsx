/**
 * Example Component: Display Firestore Points
 * Shows how to use the Firestore query hooks in a React component
 */

'use client';

import { useTotalPoints } from '@/hooks/useFirestoreQueries';
import { useTodayPoints } from '@/hooks/useFirestoreQueries';
import { usePointsStatistics } from '@/hooks/useFirestoreQueries';
import { usePointsByActivityType } from '@/hooks/useFirestoreQueries';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * Example 1: Display Total Points
 */
export function TotalPointsDisplay() {
  const { totalPoints, loading, error, refetch } = useTotalPoints();
  const { t } = useI18n();

  if (loading) {
    return <div className="text-gray-500">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Hata: {error}
        <Button variant="ghost" size="sm" onClick={refetch} className="ml-2">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <Card variant="default" size="md">
      <h3 className="text-lg font-bold mb-2">Toplam Points</h3>
      <p className="text-3xl font-bold text-brand">{totalPoints.toLocaleString()}</p>
      <Button variant="ghost" size="sm" onClick={refetch} className="mt-2">
        Yenile
      </Button>
    </Card>
  );
}

/**
 * Example 2: Display Today's Points
 */
export function TodayPointsDisplay() {
  const { todayPoints, loading, error } = useTodayPoints();
  const { t } = useI18n();

  if (loading) {
    return <div className="text-gray-500">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <Card
      variant="filled"
      size="md"
      className="bg-gradient-to-r from-brand to-brand-dark text-white"
    >
      <h3 className="text-sm font-semibold mb-1">Bugün</h3>
      <p className="text-2xl font-bold">{todayPoints.toLocaleString()} points</p>
    </Card>
  );
}

/**
 * Example 3: Display Points Statistics
 */
export function PointsStatisticsDisplay() {
  const { statistics, loading, error, refetch } = usePointsStatistics();
  const { t, lang } = useI18n();
  const isMobile = useIsMobile();

  if (loading) {
    return <div className="text-gray-500">İstatistikler yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Hata: {error}
        <Button variant="ghost" size="sm" onClick={refetch} className="ml-2">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card variant="default" size="sm">
        <h4 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Toplam' : 'Total'}
        </h4>
        <p className="text-xl font-bold">{statistics.total.toLocaleString()}</p>
      </Card>
      <Card variant="default" size="sm">
        <h4 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Bugün' : 'Today'}
        </h4>
        <p className="text-xl font-bold">{statistics.today.toLocaleString()}</p>
      </Card>
      <Card variant="default" size="sm">
        <h4 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Bu Hafta' : 'This Week'}
        </h4>
        <p className="text-xl font-bold">{statistics.thisWeek.toLocaleString()}</p>
      </Card>
      <Card variant="default" size="sm">
        <h4 className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          {lang === 'tr' ? 'Bu Ay' : 'This Month'}
        </h4>
        <p className="text-xl font-bold">{statistics.thisMonth.toLocaleString()}</p>
      </Card>
    </div>
  );
}

/**
 * Example 4: Display Points by Activity Type
 */
export function PointsByActivityTypeDisplay() {
  const { pointsByType, loading, error } = usePointsByActivityType();
  const { t, lang } = useI18n();

  if (loading) {
    return <div className="text-gray-500">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  if (pointsByType.size === 0) {
    return <div className="text-gray-500">Henüz aktivite yok</div>;
  }

  // Convert Map to Array and sort by points
  const sortedActivities = Array.from(pointsByType.entries())
    .map(([key, points]) => ({ key, points }))
    .sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold mb-4">
        {lang === 'tr' ? 'Aktivite Tipine Göre Points' : 'Points by Activity Type'}
      </h3>
      {sortedActivities.map(({ key, points }) => (
        <Card key={key} variant="default" size="sm">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{key}</span>
            <span className="text-brand font-bold">{points.toLocaleString()} points</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
