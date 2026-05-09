'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { LayoutGrid, Grid3X3 } from 'lucide-react'
import { ViewLayout } from '@/components/views/ViewLayout'

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export function CalendarView() {
  const { birthdays } = useBirthdayStore()
  const [view, setView] = useState<'bento' | 'heatmap'>('bento')

  const birthdaysByMonth = MONTHS.map((_, index) => {
    return birthdays.filter(b => parseInt(b.date.split('-')[1]) - 1 === index)
  })

  const generateHeatmap = () => {
    const daysInYear = 365
    const boxes = []
    for (let i = 0; i < daysInYear; i++) {
      const date = new Date(new Date().getFullYear(), 0, i + 1)
      const dateString = date.toISOString().split('T')[0].substring(5)
      const bdaysOnThisDay = birthdays.filter(b => b.date.substring(5) === dateString)
      boxes.push({ date, count: bdaysOnThisDay.length, birthdays: bdaysOnThisDay })
    }
    return boxes
  }

  const heatmapData = generateHeatmap()

  return (
    <ViewLayout title="Calendário Visual" subtitle="A jornada do ano em aniversários.">
      <div className="flex bg-card/50 border border-border p-1 rounded-2xl w-fit mb-8">
        <button
          onClick={() => setView('bento')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${view === 'bento' ? 'bg-primary text-white shadow-md' : 'hover:bg-foreground/5'}`}
        >
          <LayoutGrid className="w-4 h-4" /> Bento Grid
        </button>
        <button
          onClick={() => setView('heatmap')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${view === 'heatmap' ? 'bg-primary text-white shadow-md' : 'hover:bg-foreground/5'}`}
        >
          <Grid3X3 className="w-4 h-4" /> Heatmap
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'bento' && (
          <motion.div
            key="bento"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {MONTHS.map((month, idx) => {
              const bdays = birthdaysByMonth[idx]
              const isCurrentMonth = new Date().getMonth() === idx
              const spanClass = bdays.length >= 3 ? 'md:col-span-2 md:row-span-2' : bdays.length === 2 ? 'md:col-span-2' : 'col-span-1'

              return (
                <div key={month} className={`bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 transition-all hover:bg-card/60 ${spanClass} ${isCurrentMonth ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {isCurrentMonth && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                      {month}
                    </h3>
                    <span className="bg-foreground/5 px-3 py-1 rounded-full text-sm font-medium">{bdays.length}</span>
                  </div>
                  
                  {bdays.length > 0 ? (
                    <div className="space-y-3">
                      {bdays.map(b => (
                        <div key={b.id} className="flex items-center justify-between bg-background/50 p-3 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: b.color || 'var(--color-primary)' }}>
                              {parseInt(b.date.split('-')[2])}
                            </div>
                            <span className="font-semibold">{b.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-2xl opacity-50">
                      <span className="text-sm">Nenhum evento</span>
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}

        {view === 'heatmap' && (
          <motion.div
            key="heatmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-8 overflow-x-auto"
          >
            <div className="min-w-[800px]">
              <h3 className="text-lg font-bold mb-6">Frequência Anual</h3>
              <div className="flex flex-wrap gap-[4px] content-start">
                {heatmapData.map((day, i) => {
                  let colorClass = 'bg-foreground/5'
                  if (day.count === 1) colorClass = 'bg-primary/40'
                  if (day.count === 2) colorClass = 'bg-primary/70'
                  if (day.count >= 3) colorClass = 'bg-primary shadow-[0_0_10px_var(--color-primary)]'
                  return <div key={i} title={`${day.date.toLocaleDateString()}: ${day.count} aniversários`} className={`w-[14px] h-[14px] rounded-sm transition-all hover:scale-125 cursor-help ${colorClass}`} />
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ViewLayout>
  )
}
