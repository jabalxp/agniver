import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Gift,
  Settings,
  Users,
  CalendarPlus,
  List,
  LogOut,
  LogIn,
  Clock,
  BarChart3,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { calculateBirthdayStats } from '@/utils/dateUtils';
import { toast } from '@/store/useToastStore';
import { UserAvatar } from '@/components/UserAvatar';
import { CalendarSyncModal } from '@/components/CalendarSyncModal';
import { YearInReviewModal } from '@/components/YearInReviewModal';

export function MainMenu() {
  const { setActiveView, user, userProfile, setUser, birthdays } = useBirthdayStore();
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [isYearReviewOpen, setIsYearReviewOpen] = useState(false);

  const handleLogout = async () => {
    try {
      if (auth && auth.app) {
        await signOut(auth);
      }
    } catch (error) {
      console.warn('Logout local:', error);
    } finally {
      setUser(null);
      toast.info('Você saiu da sua conta.');
    }
  };

  const getFirstName = (name: string | null | undefined) => {
    if (!name) return 'Visitante';
    return name.split(' ')[0];
  };

  const getInitial = (name: string | null | undefined) => {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  };

  // Contar quem faz aniversário hoje ou nos próximos 7 dias
  const urgentCount = birthdays.filter((b) => {
    const stats = calculateBirthdayStats(b.date);
    return stats.daysLeft <= 7;
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md w-full mx-auto bg-card/80 backdrop-blur-xl border border-border rounded-[3rem] p-8 shadow-2xl flex flex-col items-center text-center my-6 relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Profile / Header Bar */}
      <div className="w-full flex items-center justify-between mb-6 pb-5 border-b border-border/50">
        <button
          onClick={() => setActiveView('profile')}
          className="flex items-center gap-3 text-left transition-all hover:opacity-80 group cursor-pointer"
        >
          <UserAvatar
            src={user?.photoURL || userProfile?.photoURL}
            name={userProfile?.name || user?.displayName || user?.email}
            size="md"
            className="group-hover:scale-105 transition-transform shadow-inner border-primary/30"
          />
          <div className="min-w-0">
            <p className="text-[10px] text-foreground/40 font-extrabold uppercase tracking-widest">
              Meu Perfil
            </p>
            <p className="text-base font-extrabold text-foreground truncate">
              {userProfile?.name?.split(' ')[0] || getFirstName(user?.displayName || user?.email)}
            </p>
          </div>
        </button>

        {user ? (
          <button
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-foreground/5 hover:bg-rose-500/10 text-foreground/40 hover:text-rose-500 transition-all"
            title="Sair da conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setActiveView('auth')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
          >
            <LogIn className="w-3.5 h-3.5" /> Entrar
          </button>
        )}
      </div>

      {/* Hero Badge */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        className="text-6xl mb-3 cursor-pointer select-none"
      >
        🎂
      </motion.div>

      <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
        Agniver
      </h1>
      <p className="text-foreground/60 mb-6 font-medium text-xs max-w-xs leading-relaxed">
        Nunca mais esqueça uma data especial. Lembretes inteligentes e ideias de presentes.
      </p>

      {/* Summary Quick Banner */}
      {urgentCount > 0 && (
        <div
          onClick={() => setActiveView('dashboard')}
          className="w-full mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between text-xs cursor-pointer hover:bg-amber-500/15 transition-colors"
        >
          <div className="flex items-center gap-2 text-amber-500 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{urgentCount} aniversário(s) nesta semana!</span>
          </div>
          <span className="text-amber-500 font-extrabold text-xs">Ver →</span>
        </div>
      )}

      {/* Action Buttons Grid */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => setActiveView('add')}
          className="w-full flex items-center justify-center gap-3 bg-[#10b981] hover:bg-[#059669] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-emerald-500/20"
        >
          <CalendarPlus className="w-5 h-5" /> Agendar Aniversário
        </button>

        <button
          onClick={() => setActiveView('dashboard')}
          className="w-full flex items-center justify-center gap-3 bg-[#f59e0b] hover:bg-[#d97706] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-500/20"
        >
          <Users className="w-5 h-5" /> Meus Contatos ({birthdays.length})
        </button>

        <button
          onClick={() => setActiveView('calendar')}
          className="w-full flex items-center justify-center gap-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-purple-500/20"
        >
          <CalendarDays className="w-5 h-5" /> Calendário & Heatmap
        </button>

        <button
          onClick={() => setActiveView('timeline')}
          className="w-full flex items-center justify-center gap-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/20"
        >
          <Clock className="w-5 h-5" /> Linha do Tempo
        </button>

        <button
          onClick={() => setActiveView('gifts')}
          className="w-full flex items-center justify-center gap-3 bg-[#ec4899] hover:bg-[#db2777] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-pink-500/20"
        >
          <Gift className="w-5 h-5" /> Mural de Presentes & Wishlist
        </button>

        <button
          onClick={() => setActiveView('stats')}
          className="w-full flex items-center justify-center gap-3 bg-[#06b6d4] hover:bg-[#0891b2] text-white py-3.5 px-6 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-cyan-500/20"
        >
          <BarChart3 className="w-5 h-5" /> Estatísticas & Signos
        </button>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setIsCalendarSyncOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 py-3 px-3 rounded-2xl font-bold text-xs transition-all border border-blue-500/20"
            title="Sincronizar com Google Agenda e Apple Calendar"
          >
            <Calendar className="w-4 h-4" /> Sincronizar Agenda
          </button>

          <button
            onClick={() => setIsYearReviewOpen(true)}
            className="flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 py-3 px-3 rounded-2xl font-bold text-xs transition-all border border-purple-500/20"
            title="Ver retrospectiva anual das celebrações"
          >
            <Sparkles className="w-4 h-4" /> Retrospectiva
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveView('changelog')}
            className="flex items-center justify-center gap-2 bg-foreground/5 hover:bg-foreground/10 text-foreground/80 py-3 px-4 rounded-2xl font-bold text-xs transition-all border border-border/60"
          >
            <List className="w-4 h-4 text-primary" /> Changelog
          </button>

          <button
            onClick={() => setActiveView('settings')}
            className="flex items-center justify-center gap-2 bg-foreground/5 hover:bg-foreground/10 text-foreground/80 py-3 px-4 rounded-2xl font-bold text-xs transition-all border border-border/60"
          >
            <Settings className="w-4 h-4 text-primary" /> Ajustes
          </button>
        </div>
      </div>

      {/* Modais de Ação Rápida */}
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
    </motion.div>
  );
}
