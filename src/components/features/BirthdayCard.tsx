'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Gift,
  Clock,
  Star,
  MessageCircle,
  Edit2,
  Trash2,
  Phone,
  Sparkles,
} from 'lucide-react';
import { type Birthday, useBirthdayStore } from '@/store/useBirthdayStore';
import { calculateBirthdayStats } from '@/utils/dateUtils';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from '@/store/useToastStore';

interface BirthdayCardProps {
  birthday: Birthday;
  onClick?: () => void;
}

export function BirthdayCard({ birthday, onClick }: BirthdayCardProps) {
  const { toggleFavorite, setEditingId, setActiveView, removeBirthday } = useBirthdayStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { daysLeft, age, isToday, progress, formattedDate, zodiac } = calculateBirthdayStats(birthday.date);
  const isUrgent = daysLeft <= 7 && !isToday;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const messages = [
      `Parabéns pelos seus ${age} anos, ${birthday.name}! 🎉 Desejo muita felicidade e sucesso!`,
      `Feliz aniversário, ${birthday.name}! Que seus ${age} anos sejam repletos de bênçãos e alegrias! 🎂`,
      `Grande dia! Parabéns pelo seu aniversário, ${birthday.name}! Aproveite muito seu dia! 🎈`,
      `Hoje é dia de festa! Parabéns pelos ${age} anos, ${birthday.name}! 🥳`,
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const phoneStr = birthday.phone ? birthday.phone.replace(/\D/g, '') : '';
    const url = phoneStr
      ? `https://wa.me/${phoneStr}?text=${encodeURIComponent(randomMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(randomMsg)}`;
    window.open(url, '_blank');
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(birthday.id);
    toast.success(
      birthday.isFavorite
        ? `${birthday.name} removido dos favoritos.`
        : `${birthday.name} marcado como favorito! ⭐`
    );
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(birthday.id);
    setActiveView('edit');
  };

  const handleOpenGifts = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(birthday.id);
    setActiveView('gifts');
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await removeBirthday(birthday.id);
      toast.success(`${birthday.name} foi removido com sucesso.`);
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <motion.div
        onClick={onClick}
        whileHover={{ scale: 1.015, y: -3 }}
        whileTap={{ scale: 0.985 }}
        className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between min-h-[340px] ${
          isToday
            ? 'bg-gradient-to-br from-primary/20 via-card/80 to-accent/20 border-2 border-primary shadow-xl shadow-primary/20'
            : 'bg-card/40 hover:bg-card/70 border border-border/80 backdrop-blur-md shadow-lg'
        } ${birthday.isFavorite ? 'ring-2 ring-amber-400/40' : ''}`}
      >
        {/* Decorative background glow */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: birthday.color || 'var(--color-primary)' }}
        />

        {isToday && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-8 -right-8 text-primary opacity-15 pointer-events-none"
          >
            <Gift size={110} />
          </motion.div>
        )}

        <div className="relative z-10 space-y-4">
          {/* Header with Name, Star, and Age Avatar */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-extrabold text-foreground truncate">{birthday.name}</h3>
                <button
                  onClick={handleToggleFavorite}
                  className={`transition-transform hover:scale-125 active:scale-90 ${
                    birthday.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-foreground/20 hover:text-amber-400'
                  }`}
                  title={birthday.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                >
                  <Star className={`w-5 h-5 ${birthday.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-foreground/60">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5 text-primary" /> {formattedDate}
                </span>
                <span>•</span>
                <span title={`${zodiac.name} (${zodiac.element})`}>
                  {zodiac.symbol} {zodiac.name}
                </span>
              </div>
            </div>

            {/* Age Badge */}
            <div
              className="w-12 h-12 shrink-0 rounded-2xl flex flex-col items-center justify-center font-extrabold text-white shadow-md border-2 border-white/20"
              style={{ backgroundColor: birthday.color || 'var(--color-primary)' }}
            >
              <span className="text-base leading-none">{age}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-80">anos</span>
            </div>
          </div>

          {/* Tags */}
          {birthday.tags && birthday.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {birthday.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-foreground/5 text-foreground/70 border border-border/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Phone and Notes Snippet */}
          <div className="space-y-2 text-xs">
            {birthday.phone && (
              <div className="flex items-center gap-2 text-foreground/60">
                <Phone className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                <span>{birthday.phone}</span>
              </div>
            )}

            {birthday.notes && (
              <div className="p-2.5 rounded-xl bg-foreground/5 border border-border/40 text-foreground/70 italic text-xs line-clamp-2">
                &ldquo;{birthday.notes}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Progress Bar, Status Badge and Action Buttons */}
        <div className="relative z-10 space-y-3 pt-4 border-t border-border/40 mt-4">
          {/* Progress Bar */}
          {!isToday && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                <span>Jornada até {age} anos</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary"
                  style={{ backgroundColor: birthday.color }}
                />
              </div>
            </div>
          )}

          {/* Status & Quick Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Days Left Badge */}
            <div
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                isToday
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : isUrgent
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse'
                  : 'bg-foreground/5 text-foreground/70 border border-border/40'
              }`}
            >
              {isToday ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> É HOJE! 🎉
                </>
              ) : isUrgent ? (
                <>
                  <Clock className="w-3.5 h-3.5" /> Faltam {daysLeft} dias!
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" /> Em {daysLeft} dias
                </>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleOpenGifts}
                className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                title="Ver/Adicionar ideias de presentes"
              >
                <Gift className="w-4 h-4" />
              </button>

              <button
                onClick={handleEdit}
                className="p-2 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                title="Editar aniversário"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteDialogOpen(true);
                }}
                className="p-2 text-foreground/50 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                title="Excluir aniversário"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20 ml-1"
                title="Enviar mensagem pelo WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Aniversário"
        message={`Deseja realmente excluir o aniversário de ${birthday.name}? Essa ação removerá o contato e sua wishlist.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </>
  );
}
