'use client';

import { ReactNode } from 'react';
import { Calendar, Home, Settings, UserPlus, Gift, Palette, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBirthdayStore, ViewType } from '@/store/useBirthdayStore';

interface NavItem {
  view: ViewType;
  icon: any;
  label: string;
  isFab?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { view: 'menu', icon: Home, label: 'Início' },
  { view: 'calendar', icon: Calendar, label: 'Calendário' },
  { view: 'add', icon: UserPlus, label: 'Novo', isFab: true },
  { view: 'gifts', icon: Gift, label: 'Presentes' },
  { view: 'settings', icon: Settings, label: 'Ajustes' },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { activeView, setActiveView, theme, setTheme } = useBirthdayStore();

  const handleThemeToggle = () => {
    const themes: ('light' | 'dark' | 'sakura' | 'golden' | 'forest')[] = [
      'light',
      'dark',
      'sakura',
      'golden',
      'forest',
    ];
    const currentIndex = themes.indexOf(theme as any);
    setTheme(themes[(currentIndex + 1) % themes.length]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 hover:w-64 transition-all duration-300 border-r border-border bg-card/50 backdrop-blur-md z-50 group">
        <div className="flex flex-col h-full py-8 px-4 gap-8">
          <div
            onClick={() => setActiveView('menu')}
            className="flex items-center justify-center md:justify-start px-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
              <Gift className="text-white w-5 h-5" />
            </div>
            <span className="ml-4 font-bold text-xl opacity-0 group-hover:opacity-100 whitespace-nowrap overflow-hidden transition-opacity">
              Agniver
            </span>
          </div>

          <nav className="flex-1 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view)}
                  className={`flex items-center gap-4 px-3 py-3 rounded-2xl transition-all relative w-full text-left ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5 font-medium'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-2xl z-0"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 shrink-0 z-10 ${item.isFab ? 'text-primary' : ''}`} />
                  <span className="text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 z-10 transition-opacity">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleThemeToggle}
            className="flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-foreground/5 transition-colors text-foreground/60 hover:text-foreground text-left"
          >
            <Palette className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity capitalize truncate">
              Tema: {theme}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative scroll-smooth">
        {/* Year Progress Bar */}
        <div className="sticky top-0 z-40 w-full h-1 bg-secondary">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{
              width: `${
                ((new Date().valueOf() - new Date(new Date().getFullYear(), 0, 1).valueOf()) /
                  (1000 * 60 * 60 * 24 * 365)) *
                100
              }%`,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>

        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">{children}</div>
      </main>

      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-full px-6 py-4 flex items-center justify-between shadow-2xl shadow-primary/10">
          {NAV_ITEMS.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className="relative p-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active"
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.isFab ? (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-tr from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-background text-white">
                    <item.icon className="w-6 h-6" />
                  </div>
                ) : (
                  <item.icon
                    className={`w-6 h-6 relative z-10 ${
                      isActive ? 'text-primary' : 'text-foreground/50'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
