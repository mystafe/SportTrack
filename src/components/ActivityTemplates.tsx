'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { useI18n } from '@/lib/i18n';
import { useActivities } from '@/lib/activityStore';
import { useActivityDefinitions } from '@/lib/settingsStore';
import { ACTIVITY_TEMPLATES, type ActivityTemplate } from '@/lib/activityTemplates';
import { useToaster } from '@/components/Toaster';
import { useIsMobile } from '@/lib/hooks/useIsMobile';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { getActivityLabel } from '@/lib/activityUtils';

export const ActivityTemplates = memo(function ActivityTemplates() {
  const [isOpen, setIsOpen] = useState(true);
  const { t, lang } = useI18n();
  const { addActivity } = useActivities();
  const { showToast } = useToaster();
  const isMobile = useIsMobile();
  const definitions = useActivityDefinitions();
  const [selectedTemplate, setSelectedTemplate] = useState<ActivityTemplate | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleTemplateClick = useCallback((template: ActivityTemplate) => {
    setSelectedTemplate(template);
  }, []);

  const handleConfirmAdd = useCallback(async () => {
    if (!selectedTemplate || isAdding) return;

    setIsAdding(true);
    try {
      const performedAt = new Date().toISOString();
      let addedCount = 0;

      for (const templateActivity of selectedTemplate.activities) {
        const definition = definitions.find((d) => d.key === templateActivity.activityKey);
        if (!definition) continue;

        const amount = Math.round(definition.defaultAmount * templateActivity.amount);

        addActivity({
          definition,
          amount,
          performedAt,
          note: `${selectedTemplate.name[lang]} (${t('templates.template')})`,
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
  }, [selectedTemplate, isAdding, definitions, addActivity, showToast, t, lang]);

  const handleCancel = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  // Get unique categories from templates
  const categories = useMemo(() => {
    const uniqueCategories = new Set<ActivityTemplate['category']>();
    ACTIVITY_TEMPLATES.forEach((t) => uniqueCategories.add(t.category));
    return Array.from(uniqueCategories);
  }, []);

  const templatesByCategory = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        templates: ACTIVITY_TEMPLATES.filter((t) => t.category === cat),
      }))
      .filter((group) => group.templates.length > 0);
  }, [categories]);

  const renderHeader = () => {
    return (
      <button
        type="button"
        className="flex w-full items-center justify-between text-xs font-bold text-gray-900 dark:text-white mb-2 transition-all duration-200 hover:text-brand"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="activity-templates"
      >
        <span className="font-bold">{t('templates.title')}</span>
        <span
          className="ml-2 text-base font-bold transition-transform duration-300 ease-in-out text-brand dark:text-brand-light"
          aria-hidden
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        >
          ▼
        </span>
      </button>
    );
  };

  return (
    <div className="card-entrance rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 p-3 shadow-md hover:shadow-xl transition-shadow duration-300">
      {renderHeader()}
      {isOpen && (
        <div id="activity-templates" className={isMobile ? 'space-y-2' : 'space-y-3'}>
          {templatesByCategory.map(({ category, templates }) => (
            <div key={category} className={isMobile ? 'space-y-1.5' : 'space-y-2'}>
              <h4
                className={`${isMobile ? 'text-[8px]' : 'text-[9px] sm:text-[10px]'} font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5`}
              >
                <span
                  className={`inline-block w-0.5 ${isMobile ? 'h-2.5' : 'h-3'} bg-brand rounded-full`}
                ></span>
                {t(`templates.category.${category}`)}
              </h4>
              <div
                className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} ${isMobile ? 'gap-1.5' : 'gap-2 sm:gap-3'}`}
              >
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleTemplateClick(template)}
                    disabled={isAdding}
                    className={`stagger-item template-card-enhanced ${isMobile ? 'touch-feedback mobile-press mobile-card-lift fade-in-scale-mobile' : 'ripple-effect magnetic-hover tilt-3d'} relative flex flex-col items-start ${isMobile ? 'gap-2 p-2.5 rounded-lg min-h-[100px]' : 'gap-3 p-4 rounded-xl min-h-[120px]'} border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 hover:border-brand dark:hover:border-brand/60 hover:bg-gradient-to-br hover:from-brand/5 hover:via-brand/3 hover:to-brand/5 dark:hover:from-brand/10 dark:hover:via-brand/8 dark:hover:to-brand/10 hover:shadow-xl hover:shadow-brand/20 dark:hover:shadow-brand/30 transition-all duration-300 scale-on-interact disabled:opacity-50 disabled:cursor-not-allowed group gpu-accelerated`}
                    aria-label={t('templates.selectTemplate', { template: template.name[lang] })}
                    aria-busy={isAdding}
                    aria-disabled={isAdding}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!isAdding) {
                          handleTemplateClick(template);
                        }
                      }
                    }}
                  >
                    <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3'} w-full`}>
                      <div
                        className={`${isMobile ? 'text-2xl' : 'text-3xl sm:text-4xl'} transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        {template.icon}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div
                          className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-gray-950 dark:text-white ${isMobile ? 'mb-0.5' : 'mb-1'} group-hover:text-brand transition-colors`}
                        >
                          {template.name[lang]}
                        </div>
                        <div
                          className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 font-semibold ${isMobile ? 'leading-tight' : 'leading-relaxed'}`}
                        >
                          {template.description[lang]}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${isMobile ? 'gap-2' : 'gap-3'} w-full ${isMobile ? 'pt-1.5' : 'pt-2'} border-t border-gray-300 dark:border-gray-600`}
                    >
                      <div
                        className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'} ${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-200 font-semibold`}
                      >
                        <span className="font-bold">{template.activities.length}</span>
                        <span>{t('templates.activities')}</span>
                      </div>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <div
                        className={`flex items-center ${isMobile ? 'gap-1' : 'gap-1.5'} ${isMobile ? 'text-xs' : 'text-sm'}`}
                      >
                        <span className="font-bold text-brand">~{template.estimatedPoints}</span>
                        <span className="text-gray-600 dark:text-gray-400 font-semibold">
                          {t('templates.points')}
                        </span>
                      </div>
                    </div>
                    {isAdding && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-xl ">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-brand border-t-transparent"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!selectedTemplate}
        title={t('templates.confirmTitle')}
        message={
          selectedTemplate
            ? t('templates.confirmMessage', {
                template: selectedTemplate.name[lang],
                count: String(selectedTemplate.activities.length),
                activities: selectedTemplate.activities
                  .map((a) => {
                    const def = definitions.find((d) => d.key === a.activityKey);
                    return def ? getActivityLabel(def, lang) : '';
                  })
                  .filter(Boolean)
                  .join(', '),
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
});
