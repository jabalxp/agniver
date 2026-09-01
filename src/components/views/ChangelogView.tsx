'use client';

import { motion } from 'framer-motion';
import { GitCommit, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { ViewLayout } from '@/components/views/ViewLayout';

export function ChangelogView() {
  return (
    <ViewLayout title="Histórico de Atualizações" subtitle="Acompanhe todas as novidades e melhorias do Agniver.">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-8"
      >
        {/* v3.2.0 - UI/UX & Utility Complete Edition */}
        <div className="relative pl-8 border-l-2 border-primary">
          <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary rounded-full border-4 border-background flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" />
          </div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-extrabold text-primary px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
              v3.2.0 - Edição Definitiva
            </span>
            <span className="text-xs font-semibold text-foreground/50">Atual</span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground mb-2">
            Heatmap Interativo, Linha do Tempo, Estatísticas & Backup Completo
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-foreground/80 leading-relaxed">
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>Heatmap Anual 53 Semanas:</strong> Calendário com mapa de calor clicável, modal detalhado de aniversariantes do dia e tooltips informativos.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>Linha do Tempo Cronológica:</strong> Nova visão vertical conectada agrupada por mês com marcadores de contagem regressiva.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>Painel de Estatísticas & Signos:</strong> Gráficos nativos de distribuição mensal, zodíaco e médias etárias.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>Central de Importação & Exportação:</strong> Importador CSV/JSON com detecção de duplicatas e exportação para Excel, JSON e contatos vCard (.vcf).
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>Mural de Presentes com Wishlist:</strong> Gestão de itens com preços, links de lojas, status de compra e sugestões categorizadas.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>Sistema de Notificações Toast & Web:</strong> Alertas flutuantes com auto-dismiss e agendamento de lembretes no navegador.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-4 h-4 shrink-0 text-primary mt-0.5" />
              <strong>5 Temas Dinâmicos:</strong> Branco Clássico, Escuro Noturno, Sakura Floral, Dourado Imperial e Floresta Sereno.
            </li>
          </ul>
        </div>

        {/* v3.0.0 */}
        <div className="relative pl-8 border-l-2 border-border/80">
          <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-bold text-foreground/60 px-3 py-0.5 bg-foreground/5 rounded-full">
              v3.0.0
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground/80 mb-2">Arquitetura de Estado & Sincronização</h3>
          <ul className="space-y-1.5 text-xs text-foreground/60">
            <li className="flex items-start gap-2">
              <GitCommit className="w-3.5 h-3.5 shrink-0 text-foreground/40 mt-0.5" />
              Estrutura resiliente com suporte offline-first e persistência em localStorage.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-3.5 h-3.5 shrink-0 text-foreground/40 mt-0.5" />
              Perfil do usuário com foto, apelido e aniversário.
            </li>
          </ul>
        </div>

        {/* v2.0.0 */}
        <div className="relative pl-8 border-l-2 border-border/80">
          <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-bold text-foreground/60 px-3 py-0.5 bg-foreground/5 rounded-full">
              v2.0.0
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground/80 mb-2">A Grande Refatoração SPA</h3>
          <ul className="space-y-1.5 text-xs text-foreground/60">
            <li className="flex items-start gap-2">
              <GitCommit className="w-3.5 h-3.5 shrink-0 text-foreground/40 mt-0.5" />
              Migração completa para Single Page Application fluida com Zustand e Framer Motion.
            </li>
            <li className="flex items-start gap-2">
              <GitCommit className="w-3.5 h-3.5 shrink-0 text-foreground/40 mt-0.5" />
              Cards inteligentes com WhatsApp direto e cálculo de idade.
            </li>
          </ul>
        </div>
      </motion.div>
    </ViewLayout>
  );
}
