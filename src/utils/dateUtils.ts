/**
 * dateUtils.ts - Funções utilitárias para cálculos de datas no Agniver
 */

export interface BirthdayStats {
  daysLeft: number;
  age: number;
  isToday: boolean;
  progress: number;
  formattedDate: string;
  zodiac: {
    name: string;
    symbol: string;
    element: string;
  };
}

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Calcula o signo do zodíaco a partir de mês e dia
 */
export function getZodiacSign(month: number, day: number): { name: string; symbol: string; element: string } {
  // month: 1 a 12
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return { name: 'Áries', symbol: '♈', element: 'Fogo' };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return { name: 'Touro', symbol: '♉', element: 'Terra' };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return { name: 'Gêmeos', symbol: '♊', element: 'Ar' };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return { name: 'Câncer', symbol: '♋', element: 'Água' };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return { name: 'Leão', symbol: '♌', element: 'Fogo' };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return { name: 'Virgem', symbol: '♍', element: 'Terra' };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return { name: 'Libra', symbol: '♎', element: 'Ar' };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return { name: 'Escorpião', symbol: '♏', element: 'Água' };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return { name: 'Sagitário', symbol: '♐', element: 'Fogo' };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return { name: 'Capricórnio', symbol: '♑', element: 'Terra' };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return { name: 'Aquário', symbol: '♒', element: 'Ar' };
  } else {
    return { name: 'Peixes', symbol: '♓', element: 'Água' };
  }
}

/**
 * Calcula todas as estatísticas de um aniversário
 */
export function calculateBirthdayStats(dateString: string): BirthdayStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const defaultZodiac = { name: 'Desconhecido', symbol: '✨', element: 'Neutro' };

  if (!dateString) {
    return {
      daysLeft: 0,
      age: 0,
      isToday: false,
      progress: 0,
      formattedDate: '',
      zodiac: defaultZodiac,
    };
  }

  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return {
      daysLeft: 0,
      age: 0,
      isToday: false,
      progress: 0,
      formattedDate: dateString,
      zodiac: defaultZodiac,
    };
  }

  const birthYear = parseInt(parts[0], 10);
  const birthMonth = parseInt(parts[1], 10) - 1;
  const birthDay = parseInt(parts[2], 10);

  const nextBirthday = new Date(today.getFullYear(), birthMonth, birthDay);
  nextBirthday.setHours(0, 0, 0, 0);

  if (nextBirthday.getTime() < today.getTime()) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = nextBirthday.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const isToday = diffDays === 0 || diffDays === 365 || diffDays === 366;
  const targetYear = nextBirthday.getFullYear();
  const age = targetYear - birthYear;

  const progress = isToday ? 100 : Math.min(100, Math.max(0, ((365 - diffDays) / 365) * 100));

  const formattedDate = `${String(birthDay).padStart(2, '0')}/${String(birthMonth + 1).padStart(2, '0')}/${birthYear}`;
  const zodiac = getZodiacSign(birthMonth + 1, birthDay);

  return {
    daysLeft: isToday ? 0 : diffDays,
    age: Math.max(0, age),
    isToday,
    progress,
    formattedDate,
    zodiac,
  };
}

/**
 * Retorna a lista de 365/366 dias do ano atual com metadados para o Heatmap
 */
export function getYearHeatmapDays(year: number = new Date().getFullYear()) {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const days = [];

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(year, 0, i + 1);
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const monthDayStr = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    days.push({
      date,
      dayOfYear: i + 1,
      month,
      day,
      dayOfWeek,
      monthDayStr,
      isoDate: date.toISOString().split('T')[0],
    });
  }

  return days;
}

/**
 * Formata data para exibição por extenso (ex: "25 de Dezembro")
 */
export function formatDateExtended(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date + 'T00:00:00') : date;
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
}

