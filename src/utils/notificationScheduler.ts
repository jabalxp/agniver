/**
 * notificationScheduler.ts - Gerenciador de notificações locais do navegador
 */

import { Birthday } from '@/store/useBirthdayStore';
import { calculateBirthdayStats } from '@/utils/dateUtils';

export interface NotificationSettings {
  enabled: boolean;
  notifyToday: boolean;
  notify1DayBefore: boolean;
  notify7DaysBefore: boolean;
  notify30DaysBefore: boolean;
  preferredHour: number;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  notifyToday: true,
  notify1DayBefore: true,
  notify7DaysBefore: true,
  notify30DaysBefore: false,
  preferredHour: 9,
};

const STORAGE_KEY = 'agniver-notification-settings';

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) } : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Erro ao salvar preferências de notificação:', err);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  return false;
}

export function sendNotification(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
    });
  } catch (e) {
    console.error('Erro ao disparar notificação:', e);
  }
}

export function checkAndTriggerReminders(birthdays: Birthday[]) {
  if (typeof window === 'undefined') return;

  const settings = getNotificationSettings();
  if (!settings.enabled || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const todayKey = new Date().toISOString().split('T')[0];
  const lastCheckKey = 'agniver-last-notification-check';
  const lastCheck = localStorage.getItem(lastCheckKey);

  if (lastCheck === todayKey) {
    return;
  }

  birthdays.forEach((b) => {
    const { daysLeft, isToday, age } = calculateBirthdayStats(b.date);

    if (isToday && settings.notifyToday) {
      sendNotification(
        `🎂 Aniversário Hoje!`,
        `Hoje é o aniversário de ${b.name}! Completando ${age} anos hoje. Não se esqueça de parabenizar!`
      );
    } else if (daysLeft === 1 && settings.notify1DayBefore) {
      sendNotification(
        `⏰ Aniversário Amanhã!`,
        `Amanhã ${b.name} faz ${age} anos! Prepare sua mensagem ou presente.`
      );
    } else if (daysLeft === 7 && settings.notify7DaysBefore) {
      sendNotification(
        `🎁 Aniversário em 7 dias`,
        `Faltam 7 dias para o aniversário de ${b.name} (${age} anos). Que tal checar a lista de presentes?`
      );
    } else if (daysLeft === 30 && settings.notify30DaysBefore) {
      sendNotification(
        `🗓️ Aniversário em 30 dias`,
        `Falta 1 mês para o aniversário de ${b.name}.`
      );
    }
  });

  localStorage.setItem(lastCheckKey, todayKey);
}

