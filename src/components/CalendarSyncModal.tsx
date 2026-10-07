'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Download,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Info,
  Clock,
  Bell,
  Sparkles,
} from 'lucide-react';
import { Birthday } from '@/store/useBirthdayStore';
import { downloadICS } from '@/utils/calendarExporter';
import { toast } from '@/store/useToastStore';

interface CalendarSyncModalProps {
  birthdays: Birthday[];
  isOpen: boolean;
  onClose: () => void;
}

export function CalendarSyncModal({ birthdays, isOpen, onClose }: CalendarSyncModalProps) {
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    downloadICS(birthdays);
    setDownloaded(true);
    toast.success('Arquivo de calendário (.ics) baixado com sucesso!');
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
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-foreground">
                  Sincronização de Calendário
                </h3>
                <p className="text-xs text-foreground/50">
                  Google Agenda, Apple Calendar (iPhone) e Outlook
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-foreground/40 hover:text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Destaque do benefício */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <Sparkles className="w-4 h-4" /> Notificações nativas no seu celular
            </div>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Ao adicionar os aniversários ao seu calendário pessoal, você recebe lembretes nativos do sistema operacional, mesmo com a tela do celular bloqueada e sem precisar estar com o navegador aberto.
            </p>
          </div>

          {/* Botão de Download do arquivo .ics */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              className="w-full py-4 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg shadow-primary/25 flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" />
              Baixar Calendário Completo ({birthdays.length} aniversários .ics)
            </button>
            <p className="text-[11px] text-center text-foreground/50">
              Arquivo padrão iCalendar RFC 5545 com repetição anual automática e alarmes às 09:00.
            </p>
          </div>

          {/* Guias Rápidos de Importação */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" /> Como importar no seu app favorito:
            </h4>

            {/* Apple Calendar (iPhone / Mac) */}
            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1.5 text-xs">
              <div className="font-bold text-foreground flex items-center gap-2">
                <span>🍏</span> Apple Calendar (iPhone / iPad / Mac)
              </div>
              <p className="text-foreground/70 text-[11px] leading-relaxed">
                1. No iPhone, toque no arquivo <strong>.ics</strong> baixado.<br />
                2. Toque em <strong>"Adicionar Todos"</strong> para salvar na sua agenda nativa.
              </p>
            </div>

            {/* Google Calendar */}
            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1.5 text-xs">
              <div className="font-bold text-foreground flex items-center gap-2">
                <span>📅</span> Google Agenda (Android e Computador)
              </div>
              <p className="text-foreground/70 text-[11px] leading-relaxed">
                1. Acesse <strong>calendar.google.com</strong> no navegador.<br />
                2. Clique no ícone de <strong>Configurações ⚙️ &gt; Importar e Exportar</strong>.<br />
                3. Selecione o arquivo <strong>aniversarios-agniver.ics</strong> e confirme.
              </p>
            </div>

            {/* Outlook */}
            <div className="p-3.5 bg-background/50 border border-border/60 rounded-2xl space-y-1.5 text-xs">
              <div className="font-bold text-foreground flex items-center gap-2">
                <span>📬</span> Microsoft Outlook
              </div>
              <p className="text-foreground/70 text-[11px] leading-relaxed">
                Abra o arquivo .ics ou vá em <strong>Adicionar Calendário &gt; Do arquivo</strong> no Outlook.
              </p>
            </div>
          </div>

          {/* Rodapé */}
          <div className="pt-2 border-t border-border/40 flex justify-end">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground font-bold text-xs transition-colors"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
