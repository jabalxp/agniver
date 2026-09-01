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
    if (theme !== 'light') {
      root.classList.add(theme)
    }
  }, [theme, mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
