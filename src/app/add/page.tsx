'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { ManageActivitiesDialog } from '@/components/ManageActivitiesDialog';
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
        <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold flex items-center gap-2`}>
          <span>➕</span>
          <span>{t('actions.addActivity')}</span>
        </h1>
        <ManageActivitiesDialog />
      </div>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-6 shadow-card">
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

