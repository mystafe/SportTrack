'use client';

import { useServiceWorkerUpdate } from '@/lib/hooks/useServiceWorkerUpdate';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { useHapticFeedback } from '@/lib/hooks/useHapticFeedback';

export function ServiceWorkerUpdatePrompt() {
  const { updateAvailable, updateServiceWorker, skipUpdate } = useServiceWorkerUpdate();
  const { lang } = useI18n();
  const { triggerHaptic } = useHapticFeedback();

  if (!updateAvailable) return null;

  const handleUpdate = () => {
    triggerHaptic('light');
    updateServiceWorker();
  };

  const handleSkip = () => {
    triggerHaptic('light');
    skipUpdate();
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[9999] sm:left-auto sm:right-4 sm:max-w-md">
      <div className="glass-effect card-3d bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border-2 border-white/20 dark:border-gray-700/50 p-4 hover:scale-[1.02] transition-all duration-300">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🔄</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-950 dark:text-white mb-1">
              {lang === 'tr' ? 'Yeni Güncelleme Mevcut' : 'Update Available'}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {lang === 'tr'
                ? 'Uygulamanın yeni bir versiyonu mevcut. Güncellemek ister misin?'
                : 'A new version of the app is available. Would you like to update?'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSkip} className="flex-1" size="sm">
            {lang === 'tr' ? 'Daha Sonra' : 'Later'}
          </Button>
          <Button onClick={handleUpdate} className="flex-1" size="sm">
            {lang === 'tr' ? 'Güncelle' : 'Update'}
          </Button>
        </div>
      </div>
    </div>
  );
}
