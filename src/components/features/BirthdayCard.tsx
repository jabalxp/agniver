'use client'

import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Gift, Clock, Star, MessageCircle, Edit2 } from 'lucide-react'
import { type Birthday, useBirthdayStore } from '@/store/useBirthdayStore'

interface BirthdayCardProps {
  birthday: Birthday;
  onClick?: () => void;
}

export function BirthdayCard({ birthday, onClick }: BirthdayCardProps) {
  const { toggleFavorite, setEditingId, setActiveView } = useBirthdayStore()

  // Calcular dias restantes e progresso
  const calculateStats = (dateString: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const parts = dateString.split('-')
    if (parts.length !== 3) return { daysLeft: 0, age: 0, isToday: false, progress: 0 }

    const birthMonth = parseInt(parts[1]) - 1
    const birthDate = parseInt(parts[2])
    const birthYear = parseInt(parts[0])

    const nextBirthday = new Date(today.getFullYear(), birthMonth, birthDate)

    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1)
    }

    const diffTime = Math.abs(nextBirthday.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const age = nextBirthday.getFullYear() - birthYear
    const progress = ((365 - diffDays) / 365) * 100

    return {
      daysLeft: diffDays,
      age: age,
      isToday: diffDays === 0 || diffDays === 365,
      progress: Math.min(100, Math.max(0, progress))
    }
  }

  const { daysLeft, age, isToday, progress } = calculateStats(birthday.date)
  const isUrgent = daysLeft <= 7 && !isToday

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const messages = [
      `Parabéns pelos seus ${age} anos, ${birthday.name}! 🎉 Desejo muita felicidade!`,
      `Feliz aniversário, ${birthday.name}! Que seus ${age} anos sejam repletos de conquistas! 🎂`,
      `Grande dia! Parabéns pelo seu aniversário, ${birthday.name}! Aproveite muito seus ${age} anos! 🎈`
    ]
    const randomMsg = messages[Math.floor(Math.random() * messages.length)]
    const phoneStr = birthday.phone ? birthday.phone.replace(/\D/g, '') : ''
    const url = phoneStr
      ? `https://wa.me/${phoneStr}?text=${encodeURIComponent(randomMsg)}`
      : `https://wa.me/?text=${encodeURIComponent(randomMsg)}`
    window.open(url, '_blank')
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await toggleFavorite(birthday.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(birthday.id)
    setActiveView('edit')
  }

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden cursor-pointer rounded-3xl px-8 py-10 transition-all duration-300 flex flex-col min-h-[320px]
        ${isToday
          ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary shadow-lg shadow-primary/20'
          : 'bg-card/40 hover:bg-card/60 border border-border backdrop-blur-sm'
        }
        ${birthday.isFavorite ? 'ring-2 ring-yellow-400/50 shadow-lg shadow-yellow-400/10' : ''}
      `}
      style={{
        boxShadow: isUrgent ? '0 0 20px -5px var(--color-accent)' : undefined,
      }}
    >
      {/* Background Glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: birthday.color || 'var(--color-primary)' }}
      />

      {isToday && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 text-accent opacity-20 pointer-events-none"
        >
          <Gift size={120} />
        </motion.div>
      )}

      <div className="relative z-10 flex flex-col flex-1 justify-between gap-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold truncate">{birthday.name}</h3>
              <button
                onClick={handleToggleFavorite}
                className={`transition-colors hover:scale-110 active:scale-90 ${birthday.isFavorite ? 'text-yellow-400' : 'text-foreground/20 hover:text-yellow-400/50'}`}
              >
                <Star className="w-5 h-5 fill-current" />
              </button>
            </div>
            <div className="flex items-center text-sm text-foreground/60 gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>{birthday.date}</span>
            </div>
          </div>

          <div
            className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-md"
            style={{ backgroundColor: birthday.color || 'var(--color-primary)' }}
          >
            {age}
          </div>
        </div>

        {/* Extra Info: Phone and Notes */}
        <div className="space-y-2">
          {birthday.phone && (
            <div className="flex items-center gap-2 text-xs text-foreground/50">
              <MessageCircle className="w-3 h-3" />
              <span>{birthday.phone}</span>
            </div>
          )}
          {birthday.notes && (
            <div className="text-xs text-foreground/70 italic line-clamp-2 bg-foreground/5 p-2 rounded-lg border border-border/50">
              &quot;{birthday.notes}&quot;
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!isToday && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-foreground/40">
              <span>Jornada para os {age} anos</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary/60"
                style={{ backgroundColor: birthday.color }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full
              ${isToday ? 'bg-primary/20 text-primary' : isUrgent ? 'bg-accent/20 text-accent' : 'bg-foreground/5 text-foreground/70'}
            `}>
              {isToday ? (
                <>
                  <Gift className="w-4 h-4" />
                  <span>É HOJE! 🎉</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Faltam {daysLeft} dias</span>
                </>
              )}
            </div>

            <button
              onClick={handleEdit}
              className="p-2 text-foreground/40 hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
              title="Editar informações"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleWhatsApp}
            className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all hover:scale-110 active:scale-95 shadow-lg shadow-green-500/20"
            title="Enviar Parabéns no WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}


