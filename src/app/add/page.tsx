'use client';

import { Suspense } from 'react';
import { ActivityForm } from '@/components/ActivityForm';
import { useI18n } from '@/lib/i18n';
import { useRouter, useSearchParams } from 'next/navigation';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { Card } from '@/components/ui/Card';

function AddActivityContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const preselectedActivityKey = searchParams.get('activity') || undefined;

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
        className={`card-entrance ${isMobile ? 'rounded-lg' : 'rounded-xl'} shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        <ActivityForm
          preselectedActivityKey={preselectedActivityKey}
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

export default function AddActivityPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 sm:space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      }
    >
      <AddActivityContent />
    </Suspense>
  );
}
