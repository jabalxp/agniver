'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { db } from '@/lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { ViewLayout } from '@/components/views/ViewLayout'

export function OnboardingView() {
  const { user, setActiveView } = useBirthdayStore()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(user?.displayName || '')
  const [birthDate, setBirthDate] = useState('')

  const todayStr = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        birthDate,
        createdAt: new Date().toISOString()
      })
      // O listener no page.tsx vai detectar a mudança e redirecionar
    } catch (error) {
      console.error('Erro ao salvar perfil:', error)
      alert('Erro ao salvar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ViewLayout 
      title="Bem-vindo ao Agniver" 
      subtitle="Vamos personalizar sua experiência antes de começar."
      hideBackButton={true}
    >
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative element */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center mb-10">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Quase lá!</h2>
            <p className="text-foreground/60">Conte-nos um pouco sobre você para que possamos celebrar seu dia também.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 ml-1 text-foreground/70">
                <User className="w-4 h-4 text-primary" /> Como devemos te chamar?
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-foreground/5 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-lg"
                placeholder="Seu nome ou apelido"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 ml-1 text-foreground/70">
                <Calendar className="w-4 h-4 text-primary" /> Quando é o seu aniversário?
              </label>
              <input
                required
                type="date"
                max={todayStr}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-6 py-4 bg-foreground/5 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium text-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !birthDate || !name}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100 mt-8"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Começar a Usar <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </ViewLayout>
  )
}
