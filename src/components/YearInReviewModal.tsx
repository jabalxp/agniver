'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Calendar,
  Gift,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Birthday } from '@/store/useBirthdayStore';
import { calculateBirthdayStats, MONTH_NAMES } from '@/utils/dateUtils';
import { toast } from '@/store/useToastStore';

interface YearInReviewModalProps {
  birthdays: Birthday[];
  isOpen: boolean;
  onClose: () => void;
}

export function YearInReviewModal({ birthdays, isOpen, onClose }: YearInReviewModalProps) {
  const [copied, setCopied] = useState(false);
  const currentYear = new Date().getFullYear();

  if (!isOpen) return null;

  // Cálculos do resumo com base nos dados do usuário
  const totalBirthdays = birthdays.length;

  // Mês com mais aniversários
  const monthCounts = new Array(12).fill(0);
  birthdays.forEach((b) => {
    const parts = b.date.split('-');
    if (parts.length === 3) {
      const m = parseInt(parts[1], 10) - 1;
      if (m >= 0 && m < 12) monthCounts[m]++;
    }
  });

  let maxMonthIndex = 0;
  let maxMonthCount = 0;
  monthCounts.forEach((count, idx) => {
    if (count > maxMonthCount) {
      maxMonthCount = count;
      maxMonthIndex = idx;
    }
  });

  const busiestMonthName = totalBirthdays > 0 ? MONTH_NAMES[maxMonthIndex] : 'Nenhum';

  // Contatos favoritos / VIP
  const favoriteCount = birthdays.filter((b) => b.isFavorite).length;

  // Contatos com wishlist
  const withWishlistCount = birthdays.filter((b) => b.wishlist && b.wishlist.length > 0).length;

  // Média de idade
  const totalAges = birthdays.reduce((acc, b) => acc + calculateBirthdayStats(b.date).age, 0);
  const avgAge = totalBirthdays > 0 ? Math.round(totalAges / totalBirthdays) : 0;

  // Próximo aniversário
  const sortedByProximity = [...birthdays].sort((a, b) => {
    const statA = calculateBirthdayStats(a.date);
    const statB = calculateBirthdayStats(b.date);
    return statA.daysLeft - statB.daysLeft;
  });
  const nextBirthday = sortedByProximity[0];
  const nextStats = nextBirthday ? calculateBirthdayStats(nextBirthday.date) : null;

  // Texto formatado para exportação
  const generateSummaryText = (): string => {
    return [
      `🎉 Resumo Anual do Agniver - ${currentYear}`,
      `---------------------------------------`,
      `🎂 Total de aniversários gerenciados: ${totalBirthdays}`,
      `🌟 Mês mais festivo: ${busiestMonthName} (${maxMonthCount} comemorações)`,
      `⭐ Contatos favoritos: ${favoriteCount}`,
      `🎁 Amigos com lista de presentes: ${withWishlistCount}`,
      `👥 Média de idade do grupo: ${avgAge} anos`,
      nextBirthday ? `🗓️ Próximo aniversário: ${nextBirthday.name} em ${nextStats?.daysLeft} dias` : '',
      `---------------------------------------`,
      `Gerado de forma 100% privada pelo Agniver.`,
    ].filter(Boolean).join('\n');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateSummaryText());
      setCopied(true);
      toast.success('Resumo copiado com sucesso! 📋');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Erro ao copiar resumo.');
    }
  };

  const handleDownload = () => {
    const text = generateSummaryText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resumo-anual-agniver-${currentYear}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Arquivo de resumo baixado!');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                  Resumo Anual Pessoal {currentYear}
                </h3>
                <p className="text-xs text-foreground/50">
                  Uma retrospectiva dos momentos e comemorações que você acompanha
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-foreground/40 hover:text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cards de Métricas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/40 block">
                Total Cadastrado
              </span>
              <p className="text-2xl font-black text-primary">{totalBirthdays}</p>
              <p className="text-[10px] text-foreground/50">pessoas especiais</p>
            </div>

            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/40 block">
                Mês Mais Festivo
              </span>
              <p className="text-base font-extrabold text-foreground truncate">{busiestMonthName}</p>
              <p className="text-[10px] text-foreground/50">{maxMonthCount} aniversários</p>
            </div>

            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/40 block">
                Idade Média
              </span>
              <p className="text-2xl font-black text-emerald-500">{avgAge} <span className="text-xs font-normal">anos</span></p>
              <p className="text-[10px] text-foreground/50">entre os contatos</p>
            </div>

            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/40 block">
                Favoritos VIP
              </span>
              <p className="text-2xl font-black text-amber-500">{favoriteCount}</p>
              <p className="text-[10px] text-foreground/50">com destaque ⭐</p>
            </div>

            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1 sm:col-span-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-foreground/40 block">
                Ideias de Presentes
              </span>
              <p className="text-base font-extrabold text-foreground">
                {withWishlistCount} amigos com lista
              </p>
              <p className="text-[10px] text-foreground/50">ajudando a planejar presentes com antecedência</p>
            </div>
          </div>

          {/* Destaque do Próximo Aniversário */}
          {nextBirthday && nextStats && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Próxima Celebração
                </span>
                <p className="text-sm font-bold text-foreground">
                  {nextBirthday.name} fará {nextStats.age} anos
                </p>
                <p className="text-xs text-foreground/60">
                  Data: {nextStats.formattedDate} • {nextStats.isToday ? 'É HOJE! 🎉' : `Faltam ${nextStats.daysLeft} dias`}
                </p>
              </div>
              <span className="text-2xl">{nextStats.zodiac.symbol}</span>
            </div>
          )}

          {/* Nota de Privacidade e Transparência */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Totalmente privado:</strong> Este resumo é calculado estritamente a partir dos contatos salvos no seu Agniver. Ele nunca é publicado ou compartilhado sem a sua autorização direta.
            </p>
          </div>

          {/* Rodapé com Ações */}
          <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-border text-foreground/70 hover:bg-foreground/5 font-bold text-xs"
            >
              Fechar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar Texto'}
              </button>

              <button
                onClick={handleDownload}
                className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-md shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Baixar Resumo (.txt)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
