'use client';

import { ActivityForm } from '@/components/ActivityForm';
import { useI18n } from '@/lib/i18n';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';

export default function AddActivityPage() {
  const { t } = useI18n();
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${isMobile ? 'title-entrance' : ''}`}
        >
          <span className={`text-2xl sm:text-3xl ${isMobile ? 'emoji-celebrate' : 'emoji-bounce'}`}>
            𓂃🪶
          </span>
          <span className="text-gray-950 dark:text-white">{t('actions.addActivity')}</span>
        </h1>
      </div>

      <Card
        variant="default"
        size="md"
        hoverable
        className={isMobile ? 'rounded-lg' : 'rounded-xl'}
      >
        <ActivityForm
          onCreated={() => {
            // Redirect to activities page after successful creation
            setTimeout(() => {
              router.push('/activities');
            }, 500);
          }}
        />
      </Card>
    </div>
  );
}
