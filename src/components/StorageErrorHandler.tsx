'use client';

import { useEffect } from 'react';
import { useActivities } from '@/lib/activityStore';
import { useToaster } from '@/components/Toaster';
import { useI18n } from '@/lib/i18n';

export function StorageErrorHandler() {
  const activities = useActivities();
  const { showToast } = useToaster();
  const { t } = useI18n();

  useEffect(() => {
    if (!activities.storageError) return;
    
    let message = '';
    switch (activities.storageError) {
      case 'parse':
        message = t('errors.storageParseFailed');
        break;
      case 'quota':
        message = t('errors.storageQuotaExceeded');
        break;
      case 'save':
        message = t('errors.storageSaveFailed');
        break;
    }
    
    if (message) {
      showToast(message, 'error');
      activities.clearStorageError();
    }
  }, [activities.storageError, showToast, t, activities]);

  return null;
}

