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

export function SettingsView() {
  const { birthdays, theme, setTheme, clearAllBirthdays } = useBirthdayStore();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [newCustomTag, setNewCustomTag] = useState('');

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

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
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
    toast.success('Todos os dados locais foram apagados.');
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
    <ViewLayout title="Configurações" subtitle="Personalize temas, lembretes inteligentes e gerencie backups locais.">
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

        {/* Section 2: Notifications & Reminders */}
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
                <h2 className="text-2xl font-bold">Lembretes & Alertas</h2>
                <p className="text-xs text-foreground/60">Controle quando o navegador deve te avisar.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { key: 'notifyToday', label: 'No dia do aniversário', desc: 'Notificação logo pela manhã no dia da festa' },
                { key: 'notify1DayBefore', label: '1 dia antes', desc: 'Aviso de véspera para preparar os parabéns' },
                { key: 'notify7DaysBefore', label: '7 dias antes (1 semana)', desc: 'Tempo hábil para escolher um presente' },
                { key: 'notify30DaysBefore', label: '30 dias antes (1 mês)', desc: 'Ideal para aniversários especiais e viagens' },
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
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-amber-500/20"
          >
            <Smartphone className="w-4 h-4" /> Disparar Notificação de Teste
          </button>
        </motion.div>

        {/* Section 3: Data & Backup Management */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Armazenamento Local</h2>
                <p className="text-xs text-foreground/60">Seus dados residem seguramente no seu dispositivo.</p>
              </div>
            </div>

            <p className="text-xs text-foreground/70 leading-relaxed bg-foreground/5 p-3.5 rounded-2xl border border-border/50">
              <Info className="w-4 h-4 text-primary inline mr-1" />
              Você possui <strong>{birthdays.length} aniversários</strong> salvos localmente. Exporte backups regulares para nunca perder seus contatos.
            </p>

            <div className="space-y-2.5">
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
                    <h4 className="font-bold text-sm">Download Rápido (JSON)</h4>
                    <p className="text-[11px] text-foreground/50">Exportar backup com 1 clique</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setIsImportExportOpen(true)}
                className="w-full p-4 rounded-2xl border border-border bg-background/50 hover:border-primary transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Central de Importação & CSV</h4>
                    <p className="text-[11px] text-foreground/50">Importe planilhas ou vCard</p>
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
            <Trash2 className="w-4 h-4" /> Apagar Todos os Dados Locais
          </button>
        </motion.div>
      </div>

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />

      {/* Clear All Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={handleClearAll}
        title="Apagar Todos os Dados?"
        message="Essa ação apagará todos os contatos e aniversários salvos no seu navegador. Recomendamos exportar um backup antes."
        confirmText="Apagar Tudo"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </ViewLayout>
  );
}
