'use client';

import { useCloudSync } from '@/hooks/useCloudSync';
import { useI18n } from '@/lib/i18n';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

export function CloudSyncIndicator() {
  const { syncState, isConfigured } = useCloudSync();
  const { lang } = useI18n();
  const isMobile = useIsMobile();
  const dateLocale = lang === 'tr' ? tr : enUS;

  if (!isConfigured) {
    return null;
  }

  const getStatusColor = () => {
    switch (syncState.status) {
      case 'syncing':
        return 'text-blue-500';
      case 'synced':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'offline':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (syncState.status) {
      case 'syncing':
        return '🔄';
      case 'synced':
        return '☁️';
      case 'error':
        return '⚠️';
      case 'offline':
        return '📴';
      default:
        return '☁️';
    }
  };

  const getStatusText = () => {
    switch (syncState.status) {
      case 'syncing':
        return lang === 'tr' ? 'Senkronize ediliyor...' : 'Syncing...';
      case 'synced':
        return syncState.lastSyncAt
          ? lang === 'tr'
            ? `Son senkronizasyon: ${format(syncState.lastSyncAt, 'HH:mm', { locale: dateLocale })}`
            : `Last sync: ${format(syncState.lastSyncAt, 'HH:mm', { locale: dateLocale })}`
          : lang === 'tr'
            ? 'Senkronize edildi'
            : 'Synced';
      case 'error':
        return lang === 'tr' ? 'Senkronizasyon hatası' : 'Sync error';
      case 'offline':
        return lang === 'tr' ? 'Çevrimdışı' : 'Offline';
      default:
        return '';
    }
  };

  return (
    <div
      className={`flex items-center gap-1.5 ${isMobile ? 'text-xs' : 'text-sm'} ${getStatusColor()}`}
      title={getStatusText()}
    >
      <span className={syncState.status === 'syncing' ? 'animate-spin' : ''}>
        {getStatusIcon()}
      </span>
      {!isMobile && syncState.status === 'synced' && syncState.lastSyncAt && (
        <span className="text-gray-500 dark:text-gray-400">
          {format(syncState.lastSyncAt, 'HH:mm', { locale: dateLocale })}
        </span>
      )}
    </div>
  );
}
