'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  User,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Grid3X3,
  BellRing,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { toast } from '@/store/useToastStore';

const TOUR_STEPS = [
  {
    step: 1,
    title: 'Bem-vindo ao Agniver!',
    subtitle: 'O seu companheiro inteligente para nunca mais esquecer aniversários importantes.',
    icon: Sparkles,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    description:
      'Organize datas de nascimento de familiares, amigos e colegas de trabalho em uma interface moderna, rápida e totalmente funcional.',
  },
  {
    step: 2,
    title: 'Heatmap & Calendário Visual',
    subtitle: 'Acompanhe todo o ano em um relance.',
    icon: Grid3X3,
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-400',
    description:
      'Navegue pelo mapa de calor anual de 53 semanas. Clique em qualquer dia para ver quem faz aniversário, idade exata e dicas de presentes.',
  },
  {
    step: 3,
    title: 'Lembretes & WhatsApp Direto',
    subtitle: 'Parabenize com mensagens personalizadas em 1 clique.',
    icon: BellRing,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    description:
      'Receba alertas com 30 dias, 7 dias, 1 dia antes e no próprio dia. Abra o WhatsApp direto com votos gerados automaticamente!',
  },
  {
    step: 4,
    title: 'Mural de Presentes & Wishlist',
    subtitle: 'Surpreenda com os presentes que seus amigos realmente querem.',
    icon: Gift,
    color: 'from-pink-500/20 to-rose-500/20 text-pink-400',
    description:
      'Cadastre listas de desejos com preços, links de compra e status. Explore sugestões categorizadas de presentes.',
  },
  {
    step: 5,
    title: 'Personalize Seu Perfil',
    subtitle: 'Conte-nos sobre você para comemorarmos seu dia também!',
    icon: User,
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    description: 'Preencha seu nome e data de aniversário para completar o setup inicial.',
  },
];

export function OnboardingView() {
  const { user, userProfile, setUserProfile, setActiveView } = useBirthdayStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState(userProfile?.name || user?.displayName || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birthDate || '');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleFinish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (name) {
      setUserProfile({
        name,
        birthDate: birthDate || '2000-01-01',
      });
    }

    toast.success('Setup concluído! Aproveite o Agniver! 🚀');
    setActiveView('menu');
  };

  const currentTour = TOUR_STEPS[currentStep];
  const StepIcon = currentTour.icon;

  return (
    <ViewLayout title="" subtitle="" hideBackButton={true}>
      <div className="max-w-xl mx-auto my-4">
        {/* Step Indicators */}
        <div className="flex items-center justify-between gap-2 mb-6 px-2">
          {TOUR_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                idx === currentStep
                  ? 'bg-primary'
                  : idx < currentStep
                  ? 'bg-primary/50'
                  : 'bg-foreground/10'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -25 }}
          transition={{ duration: 0.3 }}
          className="bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Header Icon */}
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${currentTour.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}
            >
              <StepIcon className="w-10 h-10" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 block mb-1">
              Passo {currentStep + 1} de {TOUR_STEPS.length}
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight mb-2">
              {currentTour.title}
            </h2>
            <p className="text-xs md:text-sm text-foreground/60 max-w-sm mx-auto leading-relaxed">
              {currentTour.subtitle}
            </p>
          </div>

          {/* Description or Form Step */}
          {currentStep < 4 ? (
            <div className="bg-foreground/5 p-6 rounded-2xl border border-border/40 text-center text-sm text-foreground/80 leading-relaxed mb-8">
              {currentTour.description}
            </div>
          ) : (
            <form onSubmit={handleFinish} className="space-y-4 mb-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5 ml-1">
                  <User className="w-3.5 h-3.5 text-primary" /> Como devemos te chamar?
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Seu nome ou apelido"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5 ml-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> Seu Aniversário (Opcional)
                </label>
                <input
                  type="date"
                  max={todayStr}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </form>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40 gap-3">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-3 rounded-2xl border border-border text-foreground/70 hover:bg-foreground/5 font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish()}
                className="text-xs font-semibold text-foreground/40 hover:text-foreground transition-colors px-2"
              >
                Pular Tour
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs transition-all hover:opacity-90 shadow-md shadow-primary/20 flex items-center gap-2 active:scale-95 ml-auto"
              >
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFinish()}
                className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/25 flex items-center gap-2 active:scale-95 ml-auto"
              >
                <CheckCircle2 className="w-4 h-4" /> Concluir e Começar
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </ViewLayout>
  );
}
