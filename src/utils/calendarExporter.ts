/**
 * calendarExporter.ts - Geração de arquivos .ics (iCalendar RFC 5545)
 * e links diretos para sincronização com Google Agenda, Apple Calendar e Outlook.
 */

import { Birthday } from '@/store/useBirthdayStore';
import { calculateBirthdayStats } from '@/utils/dateUtils';

/**
 * Formata uma data no formato UTC iCalendar (YYYYMMDD)
 */
function formatICSDate(dateStr: string, targetYear: number): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const month = parts[1].padStart(2, '0');
  const day = parts[2].padStart(2, '0');
  return `${targetYear}${month}${day}`;
}

/**
 * Escapa caracteres especiais para o formato iCalendar
 */
function escapeICSText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Gera o conteúdo de um arquivo .ics completo contendo todos os aniversários recorrentes
 */
export function generateICS(birthdays: Birthday[]): string {
  const now = new Date();
  const timeStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const currentYear = now.getFullYear();

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Agniver//Lembrete de Aniversarios//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:🎂 Aniversários - Agniver',
    'X-WR-TIMEZONE:America/Sao_Paulo',
    'X-WR-CALDESC:Calendário de aniversários gerado pelo Agniver.',
  ];

  birthdays.forEach((b) => {
    const stats = calculateBirthdayStats(b.date);
    const startDate = formatICSDate(b.date, currentYear);
    if (!startDate) return;

    // Data seguinte para evento de dia inteiro
    const parts = b.date.split('-');
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const nextDay = new Date(currentYear, m - 1, d + 1);
    const endYear = nextDay.getFullYear();
    const endMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
    const endD = String(nextDay.getDate()).padStart(2, '0');
    const endDate = `${endYear}${endMonth}${endD}`;

    const uid = `birthday-${b.id}@agniver.app`;
    const summary = escapeICSText(`🎂 Aniversário de ${b.name}`);

    let descriptionParts = [
      `Aniversário de ${b.name}`,
      `Nascido(a) em: ${stats.formattedDate}`,
      `Signo: ${stats.zodiac.symbol} ${stats.zodiac.name}`,
    ];

    if (b.nickname) {
      descriptionParts.push(`Apelido: ${b.nickname}`);
    }
    if (b.phone) {
      descriptionParts.push(`WhatsApp / Tel: ${b.phone}`);
    }
    if (b.interests && b.interests.length > 0) {
      descriptionParts.push(`Interesses: ${b.interests.join(', ')}`);
    }
    if (b.notes) {
      descriptionParts.push(`Anotações & Presentes: ${b.notes}`);
    }
    descriptionParts.push('Gerenciado com amor pelo Agniver.');

    const description = escapeICSText(descriptionParts.join('\n'));

    ics.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${timeStamp}`,
      `CREATED:${timeStamp}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      'RRULE:FREQ=YEARLY',
      'TRANSP:TRANSPARENT',
      'CLASS:PUBLIC',
      // Alarme: 1 dia antes às 09:00
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeICSText(`Amanhã é aniversário de ${b.name}!`)}`,
      'END:VALARM',
      // Alarme: No próprio dia
      'BEGIN:VALARM',
      'TRIGGER:PT0M',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeICSText(`Hoje é o aniversário de ${b.name}! 🎉`)}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');
  return ics.join('\r\n');
}

/**
 * Dispara o download de um arquivo .ics no navegador
 */
export function downloadICS(birthdays: Birthday[], filename: string = 'aniversarios-agniver.ics') {
  const content = generateICS(birthdays);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Cria a URL direta para adicionar o aniversário ao Google Calendar Web
 */
export function getGoogleCalendarUrl(birthday: Birthday): string {
  const stats = calculateBirthdayStats(birthday.date);
  const currentYear = new Date().getFullYear();
  const startDate = formatICSDate(birthday.date, currentYear);

  const parts = birthday.date.split('-');
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  const nextDay = new Date(currentYear, m - 1, d + 1);
  const endYear = nextDay.getFullYear();
  const endMonth = String(nextDay.getMonth() + 1).padStart(2, '0');
  const endD = String(nextDay.getDate()).padStart(2, '0');
  const endDate = `${endYear}${endMonth}${endD}`;

  const title = `🎂 Aniversário de ${birthday.name}`;
  let details = `Aniversário de ${birthday.name} (${stats.formattedDate})\nSigno: ${stats.zodiac.symbol} ${stats.zodiac.name}\n`;
  if (birthday.nickname) details += `Apelido: ${birthday.nickname}\n`;
  if (birthday.phone) details += `Telefone: ${birthday.phone}\n`;
  if (birthday.notes) details += `Dicas de presente: ${birthday.notes}\n`;
  details += '\nLembrete gerenciado pelo Agniver';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startDate}/${endDate}`,
    details: details,
    recur: 'RRULE:FREQ=YEARLY',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
