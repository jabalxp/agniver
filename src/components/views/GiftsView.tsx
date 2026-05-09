'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Save, User } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { ViewLayout } from '@/components/views/ViewLayout'

export function GiftsView() {
  const { birthdays, updateBirthday } = useBirthdayStore()
  const [selectedId, setSelectedId] = useState<string | null>(birthdays[0]?.id || null)

  const selectedBirthday = birthdays.find(b => b.id === selectedId)

  return (
    <ViewLayout title="Mural de Presentes" subtitle="Anote ideias geniais para o presente perfeito.">
      {birthdays.length === 0 ? (
        <div className="p-10 border border-border rounded-3xl bg-card/50 text-center">
          <Gift className="w-10 h-10 mx-auto text-foreground/40 mb-4" />
          <p className="text-foreground/60">Adicione aniversários para gerenciar ideias de presentes.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {birthdays.map(b => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 border ${selectedId === b.id ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-card border-border hover:bg-card/80'}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: b.color || 'var(--color-primary)' }}>
                  <User className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="font-bold truncate">{b.name}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {selectedBirthday && (
                <motion.div
                  key={selectedBirthday.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 lg:p-10"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: selectedBirthday.color || 'var(--color-primary)' }}>
                      <Gift className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedBirthday.name}</h2>
                      <p className="text-foreground/60">Anote os gostos e dicas sutis.</p>
                    </div>
                  </div>

                  <textarea
                    value={selectedBirthday.notes}
                    onChange={(e) => updateBirthday(selectedBirthday.id, { notes: e.target.value })}
                    placeholder="Ex: Mencionou em março que adoraria ganhar um fone sem fio. Tamanho de camisa: M."
                    className="w-full h-64 p-6 bg-background/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none leading-relaxed"
                  />
                  
                  <div className="mt-4 flex justify-end">
                    <span className="flex items-center gap-2 text-sm text-foreground/50">
                      <Save className="w-4 h-4" /> Salvo automaticamente
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </ViewLayout>
  )
}
