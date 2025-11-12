import { ActivityDefinition } from './activityConfig';
import { Language } from './i18n';

export function getActivityLabel(
  definition: ActivityDefinition | { label: string; labelEn?: string },
  lang: Language
): string {
  if (lang === 'en' && definition.labelEn) {
    return definition.labelEn;
  }
  return definition.label;
}

export function getActivityUnit(
  definition: ActivityDefinition | { unit: string; unitEn?: string },
  lang: Language
): string {
  if (lang === 'en' && definition.unitEn) {
    return definition.unitEn;
  }
  return definition.unit;
}

export function getActivityDescription(
  definition: ActivityDefinition | { description?: string; descriptionEn?: string },
  lang: Language
): string | undefined {
  if (lang === 'en' && definition.descriptionEn) {
    return definition.descriptionEn;
  }
  return definition.description;
}

