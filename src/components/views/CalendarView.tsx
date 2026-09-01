'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBirthdayStore, Birthday } from '@/store/useBirthdayStore';
import { LayoutGrid, Grid3X3, Calendar as CalendarIcon, Sparkles, ChevronRight, Users, Gift } from 'lucide-react';
import { ViewLayout } from '@/components/views/ViewLayout';
import { HeatmapModal } from '@/components/HeatmapModal';
import { MONTH_NAMES, MONTH_NAMES_SHORT, WEEKDAYS, formatDateExtended, calculateBirthdayStats } from '@/utils/dateUtils';

export function CalendarView() {
  const { birthdays, setActiveView, setEditingId } = useBirthdayStore();
  const [view, setView] = useState<'heatmap' | 'bento'>('heatmap');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  // Gerar estrutura de 53 semanas x 7 dias para o Heatmap Anual
  const generateHeatmapWeeks = () => {
    const startDate = new Date(currentYear, 0, 1);
    const startDayOfWeek = startDate.getDay(); // 0 = Dom, 6 = Sáb
    
    // Mapear dias do ano
    const weeks: Array<Array<{
      date: Date;
      dateString: string; // YYYY-MM-DD
      monthDayStr: string; // MM-DD
      birthdays: Birthday[];
      count: number;
      isToday: boolean;
      isInYear: boolean;
    } | null>> = [];

    let currentWeek: Array<any> = [];

    // Preencher dias vazios antes do dia 1 de Janeiro
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Iterar por todos os dias do ano
    const tempDate = new Date(currentYear, 0, 1);
    while (tempDate.getFullYear() === currentYear) {
      const d = new Date(tempDate);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const monthDayStr = `${month}-${day}`;
      const dateString = `${d.getFullYear()}-${monthDayStr}`;

      const bdaysOnThisDay = birthdays.filter((b) => b.date.substring(5) === monthDayStr);

      currentWeek.push({
        date: d,
        dateString,
        monthDayStr,
        birthdays: bdaysOnThisDay,
        count: bdaysOnThisDay.length,
        isToday: dateString === todayStr,
        isInYear: true,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      tempDate.setDate(tempDate.getDate() + 1);
    }

    // Completar última semana se necessário
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const heatmapWeeks = generateHeatmapWeeks();

  const handleDayClick = (date: Date, bdays: Birthday[]) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Aniversários agrupados por mês para a Bento View
  const birthdaysByMonth = MONTH_NAMES.map((_, index) => {
    return birthdays.filter((b) => parseInt(b.date.split('-')[1], 10) - 1 === index);
  });

  // Identificar mês de início de cada semana para rótulos no topo do Heatmap
  const monthLabels: { label: string; weekIndex: number }[] = [];
  heatmapWeeks.forEach((week, weekIdx) => {
    const firstValidDay = week.find((day) => day !== null);
    if (firstValidDay && firstValidDay.date.getDate() <= 7) {
      const monthIdx = firstValidDay.date.getMonth();
      const lastLabel = monthLabels[monthLabels.length - 1];
      if (!lastLabel || lastLabel.label !== MONTH_NAMES_SHORT[monthIdx]) {
        monthLabels.push({ label: MONTH_NAMES_SHORT[monthIdx], weekIndex: weekIdx });
      }
    }
  });

  const selectedDateBirthdays = selectedDate
    ? birthdays.filter(
        (b) =>
          b.date.substring(5) ===
          `${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      )
    : [];

  return (
    <ViewLayout
      title="Calendário de Aniversários"
      subtitle="Visualize todo o ano e navegue por datas para ver quem celebra a vida."
    >
      {/* View Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex bg-card/60 border border-border p-1 rounded-2xl">
          <button
            onClick={() => setView('heatmap')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              view === 'heatmap'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <Grid3X3 className="w-4 h-4" /> Heatmap Anual
          </button>
          <button
            onClick={() => setView('bento')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              view === 'bento'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Bento Grid (Meses)
          </button>
        </div>

        {/* Quick legend for Heatmap */}
        {view === 'heatmap' && (
          <div className="flex items-center gap-2 text-xs text-foreground/60 bg-card/40 border border-border/60 px-4 py-2 rounded-xl">
            <span className="font-semibold mr-1">Frequência:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-foreground/10" title="0 aniversários" />
              <span className="w-3 h-3 rounded-sm bg-primary/30" title="1 aniversário" />
              <span className="w-3 h-3 rounded-sm bg-primary/70" title="2 aniversários" />
              <span className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_6px_var(--color-primary)]" title="3+ aniversários" />
            </div>
            <span className="text-[11px] ml-1">(Clique para ver detalhes)</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* HEATMAP VIEW */}
        {view === 'heatmap' && (
          <motion.div
            key="heatmap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 lg:p-8 shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Ano de {currentYear}
                </h3>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Cada quadrado representa um dia. Cores mais vibrantes indicam mais aniversariantes no dia.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
                53 Semanas
              </span>
            </div>

            {/* Heatmap Grid Container */}
            <div className="overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin">
              <div className="min-w-[760px]">
                {/* Month Labels Top */}
                <div className="flex mb-2 pl-8 text-xs font-bold text-foreground/50">
                  {heatmapWeeks.map((week, idx) => {
                    const match = monthLabels.find((m) => m.weekIndex === idx);
                    return (
                      <div key={idx} className="w-[14px] mr-[3px] text-[10px] text-left">
                        {match ? match.label : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Days Grid with Weekday Labels on Left */}
                <div className="flex">
                  {/* Weekdays Labels */}
                  <div className="flex flex-col justify-between pr-2 text-[10px] font-bold text-foreground/40 h-[116px] py-0.5">
                    <span>Dom</span>
                    <span>Ter</span>
                    <span>Qui</span>
                    <span>Sáb</span>
                  </div>

                  {/* 53 Weeks Columns */}
                  <div className="flex gap-[3px]">
                    {heatmapWeeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-[3px]">
                        {week.map((day, dayIdx) => {
                          if (!day) {
                            return <div key={dayIdx} className="w-[14px] h-[14px] rounded-sm opacity-0" />;
                          }

                          let colorClass = 'bg-foreground/5 hover:bg-foreground/20';
                          if (day.count === 1) {
                            colorClass = 'bg-primary/40 hover:bg-primary/60';
                          } else if (day.count === 2) {
                            colorClass = 'bg-primary/75 hover:bg-primary/90';
                          } else if (day.count >= 3) {
                            colorClass = 'bg-primary shadow-[0_0_8px_var(--color-primary)] hover:scale-125';
                          }

                          const formattedDate = formatDateExtended(day.date);
                          const namesList = day.birthdays.map((b) => b.name).join(', ');
                          const tooltipText = day.count > 0
                            ? `${formattedDate}: ${day.count} aniversário(s) (${namesList})`
                            : `${formattedDate}: Nenhum aniversário`;

                          return (
                            <button
                              key={dayIdx}
                              onClick={() => handleDayClick(day.date, day.birthdays)}
                              title={tooltipText}
                              className={`w-[14px] h-[14px] rounded-sm transition-all duration-150 transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary ${colorClass} ${
                                day.isToday ? 'ring-2 ring-accent scale-110' : ''
                              }`}
                              aria-label={tooltipText}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Heatmap Touch Guide */}
            <div className="block lg:hidden text-center text-xs text-foreground/50 bg-foreground/5 py-2 rounded-xl">
              👉 Deslize horizontalmente para navegar por todos os meses
            </div>
          </motion.div>
        )}

        {/* BENTO GRID VIEW */}
        {view === 'bento' && (
          <motion.div
            key="bento"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MONTH_NAMES.map((month, idx) => {
              const bdays = birthdaysByMonth[idx];
              const isCurrentMonth = new Date().getMonth() === idx;
              const hasMany = bdays.length >= 3;

              return (
                <div
                  key={month}
                  className={`bg-card/40 backdrop-blur-sm border rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between ${
                    isCurrentMonth
                      ? 'border-primary ring-2 ring-primary/30 bg-primary/5 shadow-lg'
                      : 'border-border hover:border-border/80 hover:bg-card/60'
                  } ${hasMany ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        {isCurrentMonth && <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                        <h3 className="text-xl font-extrabold text-foreground">{month}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-foreground/5 text-foreground/70 border border-border/50">
                        {bdays.length} {bdays.length === 1 ? 'amigo' : 'amigos'}
                      </span>
                    </div>

                    {/* Birthdays List */}
                    {bdays.length > 0 ? (
                      <div className="space-y-2.5">
                        {bdays.map((b) => {
                          const { age, isToday } = calculateBirthdayStats(b.date);
                          const dayNum = parseInt(b.date.split('-')[2], 10);

                          return (
                            <div
                              key={b.id}
                              onClick={() => {
                                setEditingId(b.id);
                                setActiveView('edit');
                              }}
                              className="group flex items-center justify-between p-3 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0"
                                  style={{ backgroundColor: b.color || 'var(--color-primary)' }}
                                >
                                  {dayNum}
                                </div>
                                <div className="truncate">
                                  <p className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                                    {b.name}
                                  </p>
                                  <p className="text-[11px] text-foreground/50">
                                    Fará {age} anos
                                  </p>
                                </div>
                              </div>

                              {isToday ? (
                                <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase animate-bounce">
                                  Hoje!
                                </span>
                              ) : (
                                <ChevronRight className="w-4 h-4 text-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-2xl text-foreground/40 text-xs">
                        <Users className="w-5 h-5 mb-1 opacity-50" />
                        <span>Nenhum aniversariante em {month}</span>
                      </div>
                    )}
                  </div>

                  {/* Add action for this month */}
                  <div className="mt-4 pt-3 border-t border-border/30 flex justify-end">
                    <button
                      onClick={() => setActiveView('add')}
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      + Adicionar em {month}
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap Modal on click */}
      <HeatmapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        birthdaysOnDate={selectedDateBirthdays}
      />
    </ViewLayout>
  );
}
