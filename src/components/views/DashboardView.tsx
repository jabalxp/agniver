'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, Gift } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { BirthdayCard } from '@/components/features/BirthdayCard'
import { ViewLayout } from '@/components/views/ViewLayout'

export function DashboardView() {
  const { birthdays, setActiveView } = useBirthdayStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBirthdays = birthdays.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedBirthdays = [...filteredBirthdays].sort((a, b) => {
    // 1. Prioridade para favoritos
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1

    // 2. Ordenação por proximidade
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const getNextBday = (dateStr: string) => {
      const parts = dateStr.split('-')
      const m = parseInt(parts[1]) - 1
      const d = parseInt(parts[2])
      const nextBday = new Date(today.getFullYear(), m, d)
      if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1)
      return nextBday.getTime()
    }
    return getNextBday(a.date) - getNextBday(b.date)
  })

  return (
    <ViewLayout title="Seus Contatos" subtitle={`Você está acompanhando ${birthdays.length} aniversários.`}>
      <div className="flex items-center gap-3 w-full mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Buscar amigo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/40"
          />
        </div>
        <button className="p-3 bg-card/50 border border-border rounded-2xl hover:bg-card transition-colors">
          <Filter className="w-5 h-5 text-foreground/70" />
        </button>
      </div>

      {sortedBirthdays.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border rounded-3xl bg-card/30"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Gift className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Nenhum aniversário encontrado</h2>
          <p className="text-foreground/60 max-w-md mb-8">
            Adicione as datas importantes para começar a receber lembretes e não esquecer de dar os parabéns.
          </p>
          <button 
            onClick={() => setActiveView('add')}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Adicionar Primeiro
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {sortedBirthdays.map((birthday) => (
              <motion.div
                key={birthday.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", bounce: 0.3 }}
              >
                <BirthdayCard birthday={birthday} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </ViewLayout>
  )
}
