/**
 * searchEngine.ts - Motor de busca inteligente sem sensibilidade a acentos e maiúsculas
 */

import { Birthday } from '@/store/useBirthdayStore';

export function normalizeString(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function searchBirthdays(birthdays: Birthday[], query: string): Birthday[] {
  const cleanQuery = normalizeString(query);
  if (!cleanQuery) return birthdays;

  return birthdays.filter((b) => {
    const nameMatch = normalizeString(b.name).includes(cleanQuery);
    const notesMatch = normalizeString(b.notes || '').includes(cleanQuery);
    const phoneMatch = (b.phone || '').replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''));
    const tagMatch = (b.tags || []).some((tag) => normalizeString(tag).includes(cleanQuery));

    return nameMatch || notesMatch || (cleanQuery.length > 3 && phoneMatch) || tagMatch;
  });
}

