'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Upload,
  Trash2,
  Shield,
  BellRing,
  Smartphone,
  Palette,
  CheckCircle2,
  Tag,
  Plus,
  RefreshCw,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useBirthdayStore, ThemeType } from '@/store/useBirthdayStore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { exportToJSON } from '@/utils/exporters';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  sendNotification,
  NotificationSettings,
} from '@/utils/notificationScheduler';
import { toast } from '@/store/useToastStore';
import { ImportExportModal } from '@/components/ImportExportModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CalendarSyncModal } from '@/components/CalendarSyncModal';
import { YearInReviewModal } from '@/components/YearInReviewModal';

export function SettingsView() {
  const { birthdays, theme, setTheme, clearAllBirthdays } = useBirthdayStore();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [isYearReviewOpen, setIsYearReviewOpen] = useState(false);

  // Status de permissão de notificação do navegador
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Sincronizar preferências de notificação
  const handleToggleNotification = (key: keyof NotificationSettings) => {
    const updated = {
      ...notificationSettings,
      [key]: !notificationSettings[key],
    };
    setNotificationSettings(updated);
    saveNotificationSettings(updated);
    toast.success('Preferências de notificação salvas!');
  };

  const handleHourChange = (hour: number) => {
    const updated = {
      ...notificationSettings,
      preferredHour: hour,
    };
    setNotificationSettings(updated);
    saveNotificationSettings(updated);
    toast.success(`Horário preferencial alterado para ${hour}:00!`);
  };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionStatus(Notification.permission);
    }

    if (granted) {
      sendNotification(
        '🔔 Lembrete do Agniver',
        'As notificações web estão ativadas e funcionando com sucesso!'
      );
      toast.success('Notificação de teste enviada!');
    } else {
      toast.error('Permissão de notificações não foi concedida no navegador.');
    }
  };

  const handleClearAll = async () => {
    await clearAllBirthdays();
    toast.success('Todos os dados foram apagados.');
    setIsClearDialogOpen(false);
  };

  const THEMES: { id: ThemeType; name: string; icon: string; previewClass: string }[] = [
    { id: 'light', name: 'Branco Clássico', icon: '☀️', previewClass: 'bg-white text-slate-900 border-slate-200' },
    { id: 'dark', name: 'Escuro Noturno', icon: '🌙', previewClass: 'bg-slate-900 text-slate-100 border-slate-700' },
    { id: 'sakura', name: 'Sakura Floral', icon: '🌸', previewClass: 'bg-[#fff5f7] text-[#704252] border-[#fbcfe8]' },
    { id: 'golden', name: 'Dourado Imperial', icon: '✨', previewClass: 'bg-[#0a0a05] text-[#fbbf24] border-[#fbbf24]/30' },
    { id: 'forest', name: 'Floresta Sereno', icon: '🌲', previewClass: 'bg-[#06150a] text-[#dcfce7] border-[#22c55e]/30' },
  ];

  return (
    <ViewLayout title="Configurações & Recursos" subtitle="Personalize temas, lembretes inteligentes, sincronização e privacidade.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Themes & Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 md:col-span-2 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Personalização & Temas</h2>
              <p className="text-xs text-foreground/60">Escolha o visual que melhor combina com seu estilo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {THEMES.map((t) => {
              const isSelected = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    toast.success(`Tema "${t.name}" aplicado! ✨`);
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all flex flex-col items-center justify-between text-center gap-3 ${
                    t.previewClass
                  } ${
                    isSelected
                      ? 'ring-4 ring-primary/40 shadow-xl scale-[1.03] border-primary'
                      : 'hover:scale-[1.01] hover:shadow-md'
                  }`}
                >
                  <span className="text-3xl">{t.icon}</span>
                  <div>
                    <span className="font-extrabold text-sm block">{t.name}</span>
                    <span className="text-[10px] opacity-75">
                      {isSelected ? '✓ Selecionado' : 'Clique para testar'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Section 2: Notifications & Reminders (Aprimorado com Clareza e Diagnóstico) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl">
                <BellRing className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Lembretes Claros & Confiáveis</h2>
                <p className="text-xs text-foreground/60">Controle quando e como o navegador te avisará.</p>
              </div>
            </div>

            {/* Diagnóstico da Permissão do Navegador */}
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              permissionStatus === 'granted'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : permissionStatus === 'denied'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                {permissionStatus === 'granted' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                {permissionStatus === 'denied' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                {permissionStatus === 'default' && <Info className="w-4 h-4 text-amber-500" />}
                <span>
                  {permissionStatus === 'granted' && 'Notificações Ativadas no Navegador'}
                  {permissionStatus === 'denied' && 'Notificações Bloqueadas no Navegador'}
                  {permissionStatus === 'default' && 'Permissão Pendente no Navegador'}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {permissionStatus === 'granted' && 'O navegador está autorizado a exibir alertas quando você abrir o Agniver.'}
                {permissionStatus === 'denied' && 'Para reativar, clique no ícone de cadeado 🔒 na barra de endereços do seu navegador e marque Notificações como "Permitir".'}
                {permissionStatus === 'default' && 'Clique no botão abaixo para autorizar os lembretes web.'}
              </p>
            </div>

            {/* Seletor de Horário Preferencial */}
            <div className="flex items-center justify-between p-3.5 bg-background/50 border border-border rounded-2xl gap-3">
              <div className="min-w-0 pr-2">
                <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-primary" /> Horário preferencial
                </p>
                <p className="text-[11px] text-foreground/50">Momento do dia para receber os avisos</p>
              </div>

              <select
                value={notificationSettings.preferredHour || 9}
                onChange={(e) => handleHourChange(parseInt(e.target.value, 10))}
                className="bg-card text-foreground text-xs font-bold px-3 py-2 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value={8}>08:00 da manhã</option>
                <option value={9}>09:00 da manhã</option>
                <option value={10}>10:00 da manhã</option>
                <option value={12}>12:00 (Meio-dia)</option>
                <option value={18}>18:00 (Fim de tarde)</option>
              </select>
            </div>

            {/* Opções de Antecedência */}
            <div className="space-y-2.5 pt-1">
              {[
                { key: 'notifyToday', label: 'No dia do aniversário', desc: 'Notificação logo pela manhã no dia especial' },
                { key: 'notify1DayBefore', label: '1 dia antes (Véspera)', desc: 'Tempo para preparar mensagem ou ligação' },
                { key: 'notify7DaysBefore', label: '7 dias antes (1 semana)', desc: 'Ideal para escolher presentes com calma' },
                { key: 'notify30DaysBefore', label: '30 dias antes (1 mês)', desc: 'Ideal para viagens e festas especiais' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3.5 bg-background/50 border border-border rounded-2xl gap-3"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-sm text-foreground">{item.label}</p>
                    <p className="text-[11px] text-foreground/50">{item.desc}</p>
                  </div>

                  <button
                    onClick={() => handleToggleNotification(item.key as any)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                      (notificationSettings as any)[item.key] ? 'bg-primary' : 'bg-foreground/20'
                    }`}
                    aria-label={`Alternar notificação: ${item.label}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                        (notificationSettings as any)[item.key] ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Transparência sobre funcionamento técnico */}
            <p className="text-[11px] text-foreground/50 leading-relaxed bg-foreground/5 p-3 rounded-xl border border-border/40">
              <Info className="w-3.5 h-3.5 text-primary inline mr-1" />
              <strong>Transparência:</strong> As notificações web são disparadas localmente pelo navegador. Para alarmes no celular mesmo com a tela bloqueada, utilize a sincronização com Google ou Apple Calendar.
            </p>
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full py-3.5 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-amber-500/20"
          >
            <Smartphone className="w-4 h-4" /> Disparar Notificação de Teste
          </button>
        </motion.div>

        {/* Section 3: Sincronização & Ferramentas Avançadas */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Agenda & Retrospectiva</h2>
                <p className="text-xs text-foreground/60">Integre ao seu dia a dia e celebre com privacidade.</p>
              </div>
            </div>

            <p className="text-xs text-foreground/70 leading-relaxed bg-foreground/5 p-3.5 rounded-2xl border border-border/50">
              <Sparkles className="w-4 h-4 text-primary inline mr-1" />
              Você possui <strong>{birthdays.length} aniversários</strong> cadastrados. Escolha como integrá-los à sua rotina.
            </p>

            <div className="space-y-2.5">
              {/* Botão Sincronizar Calendário (.ics) */}
              <button
                onClick={() => setIsCalendarSyncOpen(true)}
                className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Sincronizar com Google / Apple Calendar</h4>
                    <p className="text-[11px] text-foreground/50">Alarmes nativos no celular e arquivo .ics</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
              </button>

              {/* Botão Resumo Anual Pessoal */}
              <button
                onClick={() => setIsYearReviewOpen(true)}
                className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Resumo Anual Pessoal</h4>
                    <p className="text-[11px] text-foreground/50">Retrospectiva privada das suas datas especiais</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-primary transition-colors" />
              </button>

              {/* Backup JSON */}
              <button
                onClick={() => {
                  exportToJSON(birthdays);
                  toast.success('Backup JSON baixado com sucesso!');
                }}
                className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Backup Rápido (JSON)</h4>
                    <p className="text-[11px] text-foreground/50">Exportar cópia de segurança em 1 clique</p>
                  </div>
                </div>
              </button>

              {/* Central de Importação */}
              <button
                onClick={() => setIsImportExportOpen(true)}
                className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Central de Importação CSV / Planilha</h4>
                    <p className="text-[11px] text-foreground/50">Importe contatos e backups externos</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Destructive Clear */}
          <button
            onClick={() => setIsClearDialogOpen(true)}
            className="w-full py-3 px-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Apagar Todos os Dados
          </button>
        </motion.div>
      </div>

      {/* Modais */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />

      <CalendarSyncModal
        birthdays={birthdays}
        isOpen={isCalendarSyncOpen}
        onClose={() => setIsCalendarSyncOpen(false)}
      />

      <YearInReviewModal
        birthdays={birthdays}
        isOpen={isYearReviewOpen}
        onClose={() => setIsYearReviewOpen(false)}
      />

      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearAll}
        title="Apagar Todos os Dados?"
        message="Essa ação apagará todos os contatos e aniversários salvos na sua conta e no seu dispositivo. Recomendamos exportar um backup antes."
        confirmText="Apagar Tudo"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </ViewLayout>
  );
}
