'use client';

import { Modal } from '@/components/Modal';
import { Birthday, useBirthdayStore } from '@/store/useBirthdayStore';
import { calculateBirthdayStats, formatDateExtended, getZodiacSign } from '@/utils/dateUtils';
import { MessageCircle, Gift, Plus, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface HeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  birthdaysOnDate: Birthday[];
}

export function HeatmapModal({
  isOpen,
  onClose,
  selectedDate,
  birthdaysOnDate,
}: HeatmapModalProps) {
  const { setActiveView } = useBirthdayStore();

  if (!selectedDate) return null;

  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const zodiac = getZodiacSign(month, day);
  const formattedTitleDate = formatDateExtended(selectedDate);

  const handleOpenGifts = () => {
    onClose();
    setActiveView('gifts');
  };

  const handleAddNew = () => {
    onClose();
    setActiveView('add');
  };

  const handleWhatsApp = (b: Birthday) => {
    const { age } = calculateBirthdayStats(b.date);
    const messages = [
      `Parabéns pelos seus ${age} anos, ${b.name}! 🎉 Desejo muitas felicidades e realizações!`,
      `Feliz aniversário, ${b.name}! Que seus ${age} anos tragam muitas alegrias! 🎂`,
      `Grande dia! Parabéns pelo seu aniversário, ${b.name}! 🎈`,
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    const phoneStr = b.phone ? b.phone.replace(/\D/g, '') : '';
    const url = phoneStr
      ? `https://wa.me/${phoneStr}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎂</span>
          <div>
            <h2 className="text-2xl font-extrabold">{formattedTitleDate}</h2>
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground/60 mt-0.5">
              <span>
                {zodiac.symbol} {zodiac.name} ({zodiac.element})
              </span>
              <span>•</span>
              <span>
                {birthdaysOnDate.length === 0
                  ? 'Nenhum aniversário'
                  : birthdaysOnDate.length === 1
                  ? '1 aniversário registrado'
                  : `${birthdaysOnDate.length} aniversários registrados`}
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {birthdaysOnDate.length === 0 ? (
          <div className="text-center py-8 px-4 bg-foreground/5 rounded-2xl border border-dashed border-border/70">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Nenhum aniversariante neste dia</h3>
            <p className="text-sm text-foreground/60 max-w-xs mx-auto mb-5">
              Você não tem nenhum amigo cadastrado para o dia {formattedTitleDate}.
            </p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Cadastrar Aniversariante
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {birthdaysOnDate.map((b) => {
              const { age, formattedDate, isToday } = calculateBirthdayStats(b.date);

              return (
                <div
                  key={b.id}
                  className="bg-card/70 border border-border/80 rounded-2xl p-4 transition-all hover:bg-card/90 shadow-sm relative overflow-hidden group"
                >
                  <div
                    className="absolute top-0 left-0 bottom-0 w-1.5"
                    style={{ backgroundColor: b.color || 'var(--color-primary)' }}
                  />

                  <div className="flex items-start justify-between gap-3 ml-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg truncate">{b.name}</h4>
                        {isToday && (
                          <span className="bg-primary/20 text-primary text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Hoje!
                          </span>
                        )}
                        {b.isFavorite && (
                          <span className="text-amber-400 text-xs">⭐ VIP</span>
                        )}
                      </div>

                      <p className="text-sm text-foreground/70 font-medium mt-0.5">
                        🎉 Completa <strong className="text-foreground">{age} anos</strong> ({formattedDate})
                      </p>

                      {b.notes && (
                        <p className="text-xs text-foreground/60 italic mt-2 line-clamp-2 bg-foreground/5 p-2 rounded-lg border border-border/40">
                          &ldquo;{b.notes}&rdquo;
                        </p>
                      )}

                      {b.tags && b.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {b.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold px-2 py-0.5 bg-foreground/5 rounded-md border border-border/40 text-foreground/70"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleWhatsApp(b)}
                        className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20"
                        title="Enviar parabéns pelo WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-3">
          <button
            onClick={handleOpenGifts}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-foreground/5 hover:bg-foreground/10 text-xs font-bold transition-colors"
          >
            <Gift className="w-4 h-4 text-primary" /> Ideias de Presentes
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold transition-all hover:opacity-90 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" /> Adicionar Outro
          </button>
        </div>
      </div>
    </Modal>
  );
}

