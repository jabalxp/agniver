'use client';

import { useBirthdayStore } from '@/store/useBirthdayStore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { calculateBirthdayStats, MONTH_NAMES, MONTH_NAMES_SHORT, getZodiacSign } from '@/utils/dateUtils';
import {
  Users,
  Sparkles,
  Calendar,
  Award,
  TrendingUp,
  Star,
  Zap,
  BarChart3,
  PieChart,
  Crown,
  Flame,
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

export function StatsView() {
  const { birthdays, setActiveView } = useBirthdayStore();

  if (birthdays.length === 0) {
    return (
      <ViewLayout
        title="Painel de Estatísticas"
        subtitle="Métricas, gráficos e curiosidades sobre seus amigos e contatos."
      >
        <EmptyState
          type="no-birthdays"
          onAction={() => setActiveView('add')}
        />
      </ViewLayout>
    );
  }

  // 1. Distribuição por Mês
  const monthCounts = Array(12).fill(0);
  birthdays.forEach((b) => {
    const parts = b.date.split('-');
    const m = parseInt(parts[1], 10) - 1;
    if (m >= 0 && m < 12) monthCounts[m]++;
  });

  const maxMonthCount = Math.max(...monthCounts, 1);
  const busiestMonthIndex = monthCounts.indexOf(Math.max(...monthCounts));
  const busiestMonthName = MONTH_NAMES[busiestMonthIndex];

  // 2. Próximo Aniversário Mais Próximo
  const statsList = birthdays.map((b) => ({
    birthday: b,
    stats: calculateBirthdayStats(b.date),
  }));

  statsList.sort((a, b) => a.stats.daysLeft - b.stats.daysLeft);
  const nextUp = statsList[0];

  // 3. Pessoa Mais Jovem e Mais Experiente
  const sortedByBirthDate = [...birthdays].sort((a, b) => a.date.localeCompare(b.date));
  const oldestPerson = sortedByBirthDate[0];
  const youngestPerson = sortedByBirthDate[sortedByBirthDate.length - 1];

  const oldestStats = calculateBirthdayStats(oldestPerson.date);
  const youngestStats = calculateBirthdayStats(youngestPerson.date);

  // 4. Média de Idade
  const totalAges = statsList.reduce((acc, curr) => acc + curr.stats.age, 0);
  const averageAge = Math.round(totalAges / birthdays.length);

  // 5. Signos do Zodíaco
  const zodiacCounts: { [key: string]: { count: number; symbol: string; element: string } } = {};
  birthdays.forEach((b) => {
    const parts = b.date.split('-');
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const z = getZodiacSign(m, d);
    if (!zodiacCounts[z.name]) {
      zodiacCounts[z.name] = { count: 0, symbol: z.symbol, element: z.element };
    }
    zodiacCounts[z.name].count++;
  });

  const sortedZodiacs = Object.entries(zodiacCounts).sort((a, b) => b[1].count - a[1].count);
  const topZodiac = sortedZodiacs[0];

  // 6. Contagem de Favoritos
  const vipCount = birthdays.filter((b) => b.isFavorite).length;

  return (
    <ViewLayout
      title="Relatórios & Estatísticas"
      subtitle="Descubra curiosidades e insights divertidos sobre suas pessoas favoritas."
    >
      <div className="space-y-8">
        {/* Top Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Total de Amigos</span>
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-foreground">{birthdays.length}</h3>
              <p className="text-xs text-foreground/60 mt-1">
                {vipCount > 0 ? `${vipCount} marcados como VIP ⭐` : 'Cadastrados na sua base'}
              </p>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Próximo a Celebrar</span>
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground truncate">{nextUp?.birthday.name}</h3>
              <p className="text-xs text-amber-500 font-bold mt-1">
                {nextUp?.stats.isToday ? 'É HOJE! 🎉' : `Faltam ${nextUp?.stats.daysLeft} dias (${nextUp?.stats.age} anos)`}
              </p>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Mês Mais Festeiro</span>
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl">
                <Flame className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">{busiestMonthName}</h3>
              <p className="text-xs text-foreground/60 mt-1">
                {monthCounts[busiestMonthIndex]} aniversários comemorados
              </p>
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Média de Idade</span>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-foreground">{averageAge} <span className="text-base font-normal text-foreground/60">anos</span></h3>
              <p className="text-xs text-foreground/60 mt-1">Entre todos os seus contatos</p>
            </div>
          </div>
        </div>

        {/* Monthly Distribution Bar Chart */}
        <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Distribuição de Aniversários por Mês
              </h3>
              <p className="text-xs text-foreground/60 mt-0.5">
                Quantidade de aniversariantes comemorando em cada mês do ano.
              </p>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-2">
            {MONTH_NAMES_SHORT.map((monthShort, idx) => {
              const count = monthCounts[idx];
              const heightPercent = maxMonthCount > 0 ? (count / maxMonthCount) * 100 : 0;
              const isBusiest = count === maxMonthCount && count > 0;

              return (
                <div key={monthShort} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[11px] font-bold text-foreground/60 group-hover:text-primary transition-colors">
                    {count > 0 ? count : ''}
                  </span>
                  <div className="w-full max-w-[36px] bg-foreground/5 rounded-t-xl overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${Math.max(count > 0 ? 15 : 4, heightPercent)}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 group-hover:opacity-80 ${
                        isBusiest
                          ? 'bg-gradient-to-t from-primary to-accent shadow-lg shadow-primary/30'
                          : count > 0
                          ? 'bg-primary/60'
                          : 'bg-foreground/10'
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold ${isBusiest ? 'text-primary font-bold' : 'text-foreground/50'}`}>
                    {monthShort}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Curiosities & Zodiac Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-2xl">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Signos do Zodíaco</h3>
                <p className="text-xs text-foreground/60">Os signos mais comuns entre seus contatos</p>
              </div>
            </div>

            {topZodiac && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{topZodiac[1].symbol}</span>
                  <div>
                    <h4 className="font-extrabold text-base">{topZodiac[0]} é o mais frequente!</h4>
                    <p className="text-xs text-foreground/60">Elemento {topZodiac[1].element} ({topZodiac[1].count} amigos)</p>
                  </div>
                </div>
                <Crown className="w-6 h-6 text-purple-400" />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {sortedZodiacs.map(([signName, data]) => (
                <div
                  key={signName}
                  className="p-3 rounded-2xl bg-card border border-border/60 flex items-center justify-between text-xs"
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="text-base">{data.symbol}</span> {signName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-foreground/5 font-extrabold text-foreground/70">
                    {data.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Curiosidades da Sua Rede</h3>
                <p className="text-xs text-foreground/60">Destaques etários e marcos da sua lista</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-background/50 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg shrink-0">
                    👴
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">Mais Experiente</p>
                    <p className="font-bold text-sm text-foreground truncate">{oldestPerson?.name}</p>
                  </div>
                </div>
                <span className="font-extrabold text-base text-foreground shrink-0">{oldestStats.age} anos</span>
              </div>

              <div className="p-4 rounded-2xl bg-background/50 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold text-lg shrink-0">
                    👶
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">Mais Jovem</p>
                    <p className="font-bold text-sm text-foreground truncate">{youngestPerson?.name}</p>
                  </div>
                </div>
                <span className="font-extrabold text-base text-foreground shrink-0">{youngestStats.age} anos</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveView('timeline')}
                className="w-full py-3 px-4 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold transition-all"
              >
                Ver Sequência Completa na Linha do Tempo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </ViewLayout>
  );
}

