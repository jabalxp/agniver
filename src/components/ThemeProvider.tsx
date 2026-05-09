'use client'

import { useEffect, useState } from 'react'
import { useBirthdayStore } from '@/store/useBirthdayStore'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const theme = useBirthdayStore((state) => state.theme)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    
    // Lista de todas as classes de temas possíveis
    const themeClasses = ['dark', 'sakura', 'golden', 'forest', 'retro', 'minimalist', 'glassmorphism']
    
    // Remove todas as classes de temas antigos
    root.classList.remove(...themeClasses)
    
    // Adiciona a classe do tema atual se não for light (que é o padrão)
    if (theme !== 'light' && theme !== 'glassmorphism') {
      root.classList.add(theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <div className={`min-h-screen ${theme === 'glassmorphism' ? 'bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-indigo-950' : 'bg-background'}`}>
      {children}
    </div>
  )
}
