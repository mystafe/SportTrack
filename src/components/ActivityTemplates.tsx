'use client';

import { useState, useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { ACTIVITY_TEMPLATES, type ActivityTemplate } from '@/lib/activityTemplates';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getActivityLabel } from '@/lib/activityUtils';

export function ActivityTemplates() {
  const { t, lang } = useI18n();
  const { addActivity } = useActivities();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const definitions = useActivityDefinitions();
  const [selectedTemplate, setSelectedTemplate] = useState<ActivityTemplate | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleTemplateClick = (template: ActivityTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirmAdd = async () => {
    if (!selectedTemplate || isAdding) return;

    setIsAdding(true);
    try {
      const performedAt = new Date().toISOString();
      let addedCount = 0;

      for (const templateActivity of selectedTemplate.activities) {
        const definition = definitions.find(d => d.key === templateActivity.activityKey);
        if (!definition) continue;

        const amount = Math.round(definition.defaultAmount * templateActivity.amount);
        
        addActivity({
          definition,
          amount,
          performedAt,
          note: `${selectedTemplate.name[lang]} (${t('templates.template')})`
        });
        addedCount++;
      }

      showToast(
        `${selectedTemplate.icon} ${selectedTemplate.name[lang]} ${t('templates.added')}`,
        'success'
      );
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Failed to add template activities:', error);
      showToast(t('templates.failed'), 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setSelectedTemplate(null);
  };

  // Get unique categories from templates
  const categories = useMemo(() => {
    const uniqueCategories = new Set<ActivityTemplate['category']>();
    ACTIVITY_TEMPLATES.forEach(t => uniqueCategories.add(t.category));
    return Array.from(uniqueCategories);
  }, []);
  
  const templatesByCategory = useMemo(() => {
    return categories.map(cat => ({
      category: cat,
      templates: ACTIVITY_TEMPLATES.filter(t => t.category === cat)
    })).filter(group => group.templates.length > 0);
  }, [categories]);

  return (
    <div className={isMobile ? 'space-y-3' : 'space-y-4'}>
      <div className="flex items-center justify-between">
        <h3 className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg'} font-semibold text-gray-900 dark:text-white`}>
          {t('templates.title')}
        </h3>
        <span className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} text-gray-500 dark:text-gray-400`}>
          {t('templates.subtitle')}
        </span>
      </div>

      {templatesByCategory.map(({ category, templates }) => (
        <div key={category} className={isMobile ? 'space-y-2' : 'space-y-3'}>
          <h4 className={`${isMobile ? 'text-[9px]' : 'text-[10px] sm:text-xs'} font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2`}>
            <span className={`inline-block w-1 ${isMobile ? 'h-3' : 'h-4'} bg-brand rounded-full`}></span>
            {t(`templates.category.${category}`)}
          </h4>
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} ${isMobile ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateClick(template)}
                disabled={isAdding}
                className={`stagger-item template-card-enhanced ripple-effect magnetic-hover tilt-3d relative flex flex-col items-start ${isMobile ? 'gap-2 p-2.5 rounded-lg' : 'gap-3 p-4 rounded-xl'} border-2 border-gray-200 dark:border-gray-700/50 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm hover:border-brand dark:hover:border-brand/60 hover:shadow-lg hover:shadow-brand/20 dark:hover:shadow-brand/30 transition-all duration-300 scale-on-interact disabled:opacity-50 disabled:cursor-not-allowed group gpu-accelerated`}
              >
                <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'} w-full`}>
                  <div className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'} transform group-hover:scale-110 transition-transform duration-300`}>
                    {template.icon}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} font-semibold text-gray-900 dark:text-white ${isMobile ? 'mb-0.5' : 'mb-1'} group-hover:text-brand transition-colors`}>
                      {template.name[lang]}
                    </div>
                    <div className={`${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} text-gray-600 dark:text-gray-400 ${isMobile ? 'leading-tight' : 'leading-relaxed'}`}>
                      {template.description[lang]}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'} w-full ${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-200 dark:border-gray-700/50`}>
                  <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'} ${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 dark:text-gray-400`}>
                    <span className="font-medium">{template.activities.length}</span>
                    <span>{t('templates.activities')}</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'} ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                    <span className="font-semibold text-brand">~{template.estimatedPoints}</span>
                    <span className="text-gray-600 dark:text-gray-400">{t('templates.points')}</span>
                  </div>
                </div>
                {isAdding && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-3 border-brand border-t-transparent"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <ConfirmDialog
        open={!!selectedTemplate}
        title={t('templates.confirmTitle')}
        message={
          selectedTemplate
            ? t('templates.confirmMessage', {
                template: selectedTemplate.name[lang],
                count: String(selectedTemplate.activities.length),
                activities: selectedTemplate.activities
                  .map(a => {
                    const def = definitions.find(d => d.key === a.activityKey);
                    return def ? getActivityLabel(def, lang) : '';
                  })
                  .filter(Boolean)
                  .join(', ')
              })
            : ''
        }
        variant="default"
        confirmLabel={t('templates.confirmAdd')}
        cancelLabel={t('form.cancel')}
        onConfirm={handleConfirmAdd}
        onCancel={handleCancel}
      />
    </div>
  );
}

