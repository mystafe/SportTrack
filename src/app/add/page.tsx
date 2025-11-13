'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { useI18n } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

export default function AddActivityPage() {
  const { t } = useI18n();
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${isMobile ? 'title-entrance' : ''}`}>
          <span className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>➕</span>
          <span className="text-gray-950 dark:text-white">{t('actions.addActivity')}</span>
        </h1>
      </div>
      
      <div className={`${isMobile ? 'rounded-lg p-3' : 'rounded-xl p-4 sm:p-6'} border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 shadow-md hover:shadow-xl transition-shadow duration-300`}>
        <ActivityForm
          onCreated={() => {
            // Redirect to activities page after successful creation
            setTimeout(() => {
              router.push('/activities');
            }, 500);
          }}
        />
      </div>
    </div>
  );
}

