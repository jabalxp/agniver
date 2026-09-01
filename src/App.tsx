'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastContainer } from '@/components/ToastContainer';
import { checkAndTriggerReminders } from '@/utils/notificationScheduler';

// Views
import { MainMenu } from '@/components/views/MainMenu';
import { DashboardView } from '@/components/views/DashboardView';
import { AddView } from '@/components/views/AddView';
import { CalendarView } from '@/components/views/CalendarView';
import { TimelineView } from '@/components/views/TimelineView';
import { StatsView } from '@/components/views/StatsView';
import { GiftsView } from '@/components/views/GiftsView';
import { SettingsView } from '@/components/views/SettingsView';
import { ChangelogView } from '@/components/views/ChangelogView';
import { EditView } from '@/components/views/EditView';
import { AuthView } from '@/components/views/AuthView';
import { ProfileView } from '@/components/views/ProfileView';
import { OnboardingView } from '@/components/views/OnboardingView';

export default function App() {
  const { activeView, setActiveView, birthdays } = useBirthdayStore();

  // Verificar lembretes de aniversário ao abrir o aplicativo
  useEffect(() => {
    if (birthdays.length > 0) {
      checkAndTriggerReminders(birthdays);
    }
  }, [birthdays]);

  // Sincronização com o botão Voltar do navegador (History API)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setActiveView(event.state.view);
      } else {
        setActiveView('menu');
      }
    };

    window.addEventListener('popstate', handlePopState);

    if (!window.history.state) {
      window.history.replaceState({ view: 'menu' }, '', window.location.pathname);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveView]);

  // Empurrar novo estado quando a view mudar via UI
  useEffect(() => {
    if (window.history.state?.view !== activeView) {
      const url = activeView === 'menu' ? window.location.pathname : `?v=${activeView}`;
      window.history.pushState({ view: activeView }, '', url);
    }
  }, [activeView]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/30">
        {/* Fixed Toast Container */}
        <ToastContainer />

        {/* Dynamic Active View with Smooth Page Transitions */}
        <main className="flex-1 flex items-center justify-center p-3 sm:p-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full"
            >
              {activeView === 'menu' && <MainMenu />}
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'add' && <AddView />}
              {activeView === 'edit' && <EditView />}
              {activeView === 'calendar' && <CalendarView />}
              {activeView === 'timeline' && <TimelineView />}
              {activeView === 'stats' && <StatsView />}
              {activeView === 'gifts' && <GiftsView />}
              {activeView === 'changelog' && <ChangelogView />}
              {activeView === 'settings' && <SettingsView />}
              {activeView === 'auth' && <AuthView />}
              {activeView === 'profile' && <ProfileView />}
              {activeView === 'onboarding' && <OnboardingView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ThemeProvider>
  );
}

