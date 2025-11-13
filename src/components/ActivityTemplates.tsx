'use client';

import { useState } from 'react';
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

  const categories: Array<ActivityTemplate['category']> = ['quick', 'cardio', 'strength', 'mixed'];
  const templatesByCategory = categories.map(cat => ({
    category: cat,
    templates: ACTIVITY_TEMPLATES.filter(t => t.category === cat)
  })).filter(group => group.templates.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('templates.title')}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t('templates.subtitle')}
        </span>
      </div>

      {templatesByCategory.map(({ category, templates }) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {t(`templates.category.${category}`)}
          </h4>
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'} gap-2 sm:gap-3`}>
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateClick(template)}
                disabled={isAdding}
                className="relative flex flex-col items-start gap-2 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-brand hover:bg-brand/5 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xl">{template.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {template.name[lang]}
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      {template.description[lang]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full text-[10px] text-gray-500 dark:text-gray-400">
                  <span>{template.activities.length} {t('templates.activities')}</span>
                  <span>·</span>
                  <span>~{template.estimatedPoints} {t('templates.points')}</span>
                </div>
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

