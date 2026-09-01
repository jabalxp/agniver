/**
 * exporters.ts - Exportadores de dados do Agniver em JSON, CSV e vCard 3.0
 */

import { Birthday } from '@/store/useBirthdayStore';

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(birthdays: Birthday[]) {
  const data = JSON.stringify(birthdays, null, 2);
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(data, `agniver-backup-${dateStr}.json`, 'application/json');
}

export function exportToCSV(birthdays: Birthday[]) {
  const headers = ['Nome', 'Data de Nascimento', 'Celular', 'Notas', 'Tags', 'Favorito'];
  const rows = birthdays.map((b) => {
    const escape = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    return [
      escape(b.name),
      escape(b.date),
      escape(b.phone || ''),
      escape(b.notes || ''),
      escape((b.tags || []).join(';')),
      b.isFavorite ? 'Sim' : 'Não',
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(csvContent, `agniver-aniversarios-${dateStr}.csv`, 'text/csv');
}

export function exportToVCard(birthdays: Birthday[]) {
  const vcards = birthdays.map((b) => {
    const vcardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${b.name}`,
      `N:${b.name};;;;`,
      b.phone ? `TEL;TYPE=CELL:${b.phone}` : null,
      b.date ? `BDAY:${b.date.replace(/-/g, '')}` : null,
      b.notes ? `NOTE:${b.notes.replace(/\n/g, '\\n')}` : null,
      (b.tags && b.tags.length > 0) ? `CATEGORIES:${b.tags.join(',')}` : null,
      'END:VCARD',
    ].filter(Boolean);

    return vcardLines.join('\r\n');
  });

  const vcardContent = vcards.join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadFile(vcardContent, `agniver-contatos-${dateStr}.vcf`, 'text/vcard');
}

