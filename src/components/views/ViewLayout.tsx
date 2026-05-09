'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'

export function ViewLayout({ children, title, subtitle, hideBackButton = false }: { children: React.ReactNode, title: string, subtitle?: string, hideBackButton?: boolean }) {
  const { setActiveView } = useBirthdayStore()

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto w-full p-4 md:p-8"
    >
      <header className="mb-8 flex items-center gap-4">
        {!hideBackButton && (
          <button 
            onClick={() => setActiveView('menu')}
            className="p-3 bg-card/50 hover:bg-card border border-border rounded-full transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="text-foreground/60 mt-1">{subtitle}</p>}
        </div>
      </header>
      {children}
    </motion.div>
  )
}
