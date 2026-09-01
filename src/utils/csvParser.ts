/**
 * csvParser.ts - Parser e validador de arquivos CSV e JSON para importação de aniversários
 */

import { Birthday } from '@/store/useBirthdayStore';

export interface ParsedBirthdayRow {
  name: string;
  date: string; // YYYY-MM-DD
  phone?: string;
  notes?: string;
  tags?: string[];
  color?: string;
  isValid: boolean;
  error?: string;
  isDuplicate?: boolean;
}

export function normalizeDateInput(rawDate: string): string | null {
  if (!rawDate) return null;
  const clean = rawDate.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  // DD/MM/YYYY ou DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmyMatch) {
    const day = dmyMatch[1].padStart(2, '0');
    const month = dmyMatch[2].padStart(2, '0');
    const year = dmyMatch[3];
    return `${year}-${month}-${day}`;
  }

  // DD/MM (assume ano 2000)
  const dmMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})$/);
  if (dmMatch) {
    const day = dmMatch[1].padStart(2, '0');
    const month = dmMatch[2].padStart(2, '0');
    return `2000-${month}-${day}`;
  }

  return null;
}

export function parseCSV(csvText: string, existingBirthdays: Birthday[] = []): ParsedBirthdayRow[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  const results: ParsedBirthdayRow[] = [];
  const firstLine = lines[0].toLowerCase();
  
  const hasHeader = firstLine.includes('nome') || firstLine.includes('name') || firstLine.includes('data') || firstLine.includes('date');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  let nameIndex = 0;
  let dateIndex = 1;
  let phoneIndex = 2;
  let notesIndex = 3;
  let tagsIndex = 4;

  if (hasHeader) {
    const headerCols = lines[0].split(/[,;]/).map((h) => h.trim().toLowerCase());
    headerCols.forEach((col, idx) => {
      if (col.includes('nome') || col.includes('name')) nameIndex = idx;
      if (col.includes('data') || col.includes('date') || col.includes('nascimento') || col.includes('aniversario') || col.includes('birthday')) dateIndex = idx;
      if (col.includes('fone') || col.includes('tel') || col.includes('phone') || col.includes('cel') || col.includes('whats')) phoneIndex = idx;
      if (col.includes('nota') || col.includes('note') || col.includes('presente') || col.includes('gift')) notesIndex = idx;
      if (col.includes('tag') || col.includes('cat') || col.includes('grupo')) tagsIndex = idx;
    });
  }

  for (const line of dataLines) {
    const separator = line.includes(';') ? ';' : ',';
    const cols = line.split(separator).map((c) => c.replace(/^["']|["']$/g, '').trim());

    const rawName = cols[nameIndex] || '';
    const rawDate = cols[dateIndex] || '';
    const rawPhone = cols[phoneIndex] || '';
    const rawNotes = cols[notesIndex] || '';
    const rawTags = cols[tagsIndex] ? cols[tagsIndex].split(/[\/|]/).map((t) => t.trim()).filter(Boolean) : [];

    const normalizedDate = normalizeDateInput(rawDate);

    if (!rawName) {
      results.push({
        name: 'Linha sem nome',
        date: rawDate,
        isValid: false,
        error: 'Nome ausente',
      });
      continue;
    }

    if (!normalizedDate) {
      results.push({
        name: rawName,
        date: rawDate,
        phone: rawPhone,
        notes: rawNotes,
        tags: rawTags,
        isValid: false,
        error: 'Formato de data inválido',
      });
      continue;
    }

    const isDuplicate = existingBirthdays.some(
      (b) => b.name.toLowerCase() === rawName.toLowerCase() && b.date === normalizedDate
    );

    results.push({
      name: rawName,
      date: normalizedDate,
      phone: rawPhone,
      notes: rawNotes,
      tags: rawTags,
      color: '#3b82f6',
      isValid: true,
      isDuplicate,
    });
  }

  return results;
}

