'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBirthdayStore, Birthday } from '@/store/useBirthdayStore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { calculateBirthdayStats, MONTH_NAMES } from '@/utils/dateUtils';
import {
  Clock,
  Gift,
  MessageCircle,
  Star,
  Sparkles,
  Search,
} from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { searchBirthdays } from '@/utils/searchEngine';

export function TimelineView() {
  const { birthdays, setActiveView, setEditingId } = useBirthdayStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(birthdays.flatMap((b) => b.tags || [])));

  let filtered = searchBirthdays(birthdays, searchQuery);
  if (onlyFavorites) {
    filtered = filtered.filter((b) => b.isFavorite);
  }
  if (selectedTag) {
    filtered = filtered.filter((b) => (b.tags || []).includes(selectedTag));
  }

  const sorted = [...filtered].sort((a, b) => {
    const statA = calculateBirthdayStats(a.date);
    const statB = calculateBirthdayStats(b.date);
    return statA.daysLeft - statB.daysLeft;
  });

  const groupedByMonth: { [key: string]: Birthday[] } = {};
  sorted.forEach((b) => {
    const parts = b.date.split('-');
    const monthIdx = parseInt(parts[1], 10) - 1;
    const monthName = MONTH_NAMES[monthIdx];
    if (!groupedByMonth[monthName]) {
      groupedByMonth[monthName] = [];
    }
    groupedByMonth[monthName].push(b);
  });

  const handleWhatsApp = (b: Birthday) => {
    const { age } = calculateBirthdayStats(b.date);
    const msg = `Parabéns pelos seus ${age} anos, ${b.name}! 🎉 Desejo muitas felicidades!`;
    const phoneStr = b.phone ? b.phone.replace(/\D/g, '') : '';
    const url = phoneStr
      ? `https://wa.me/${phoneStr}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <ViewLayout
      title="Linha do Tempo"
      subtitle="Acompanhe a sequência cronológica dos próximos aniversários ao longo do ano."
    >
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input
              type="text"
              placeholder="Filtrar por nome, notas ou celular..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card/60 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm placeholder:text-foreground/40 font-medium"
            />
          </div>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-3 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              onlyFavorites
                ? 'bg-amber-400/20 border-amber-400 text-amber-500 shadow-md'
                : 'bg-card/60 border-border text-foreground/70 hover:bg-card'
            }`}
            title="Apenas favoritos"
          >
            <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Favoritos</span>
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                selectedTag === null
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card/50 border-border/70 text-foreground/60 hover:text-foreground'
              }`}
            >
              Todas as tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card/50 border-border/70 text-foreground/60 hover:text-foreground'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          type={searchQuery || onlyFavorites || selectedTag ? 'no-search-results' : 'no-birthdays'}
          onAction={() => {
            if (searchQuery || onlyFavorites || selectedTag) {
              setSearchQuery('');
              setOnlyFavorites(false);
              setSelectedTag(null);
            } else {
              setActiveView('add');
            }
          }}
        />
      ) : (
        <div className="relative pl-6 md:pl-10 space-y-12">
          <div className="absolute left-[17px] md:left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

          {Object.entries(groupedByMonth).map(([monthName, list]) => (
            <div key={monthName} className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-sm shadow-lg shadow-primary/30 z-10 -ml-[18px] md:-ml-[18px]">
                  {monthName.substring(0, 3)}
                </div>
                <h3 className="text-xl font-extrabold text-foreground tracking-tight">{monthName}</h3>
              </div>

              <div className="space-y-4 pl-2">
                {list.map((b) => {
                  const { daysLeft, age, isToday, zodiac } = calculateBirthdayStats(b.date);
                  const isUrgent = daysLeft <= 7 && !isToday;

                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`relative rounded-3xl p-5 md:p-6 border backdrop-blur-md transition-all hover:scale-[1.01] ${
                        isToday
                          ? 'bg-gradient-to-r from-primary/20 via-card to-accent/20 border-primary ring-2 ring-primary/40 shadow-xl'
                          : 'bg-card/40 border-border/80 hover:bg-card/70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                        <div className="flex items-start gap-4 min-w-0 flex-1">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white shadow-md shrink-0 border-2 border-white/20"
                            style={{ backgroundColor: b.color || 'var(--color-primary)' }}
                          >
                            {parseInt(b.date.split('-')[2], 10)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-lg font-bold text-foreground truncate">{b.name}</h4>
                              {b.isFavorite && <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />}
                              {isToday && (
                                <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase animate-pulse flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Hoje!
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-foreground/60 mt-0.5 flex items-center gap-2">
                              <span>Completará <strong>{age} anos</strong></span>
                              <span>•</span>
                              <span>{zodiac.symbol} {zodiac.name}</span>
                            </p>

                            {b.notes && (
                              <p className="text-xs text-foreground/70 italic mt-2 bg-foreground/5 p-2 rounded-xl border border-border/40 line-clamp-1">
                                &ldquo;{b.notes}&rdquo;
                              </p>
                            )}

                            {b.tags && b.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {b.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-foreground/5 border border-border/50 text-foreground/60"
                                  >
                                    #{t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-center sm:self-auto shrink-0">
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                              isToday
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : isUrgent
                                ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                                : 'bg-foreground/5 text-foreground/70 border border-border/40'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isToday ? 'Hoje!' : `Faltam ${daysLeft} dias`}</span>
                          </div>

                          <button
                            onClick={() => {
                              setEditingId(b.id);
                              setActiveView('gifts');
                            }}
                            className="p-2.5 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-foreground/70 transition-colors"
                            title="Ver presentes"
                          >
                            <Gift className="w-4 h-4 text-primary" />
                          </button>

                          <button
                            onClick={() => handleWhatsApp(b)}
                            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </ViewLayout>
  );
}

