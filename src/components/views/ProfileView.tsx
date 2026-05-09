'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Save, ArrowLeft, Loader2, UserCircle } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { db } from '@/lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { ViewLayout } from '@/components/views/ViewLayout'

export function ProfileView() {
  const { user, userProfile, setActiveView } = useBirthdayStore()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name)
      setBirthDate(userProfile.birthDate)
    }
  }, [userProfile])

  const todayStr = new Date().toISOString().split('T')[0]

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setLoading(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        birthDate
      })
      alert('Perfil atualizado com sucesso, General!')
      setActiveView('menu')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert('Erro ao atualizar perfil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ViewLayout 
      title="Seu Perfil" 
      subtitle="Gerencie suas informações pessoais aqui."
      hideBackButton={true}
    >
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => setActiveView('menu')}
          className="flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors mb-8 font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
        </button>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleUpdate}
          className="bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8"
        >
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-12 h-12 text-primary" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile?.name}</h2>
              <p className="text-foreground/40 text-sm font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 ml-1 text-foreground/70">
                <User className="w-4 h-4 text-primary" /> Nome de Exibição
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-foreground/5 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 ml-1 text-foreground/70">
                <Calendar className="w-4 h-4 text-primary" /> Sua Data de Nascimento
              </label>
              <input
                required
                type="date"
                max={todayStr}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-6 py-4 bg-foreground/5 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <Save className="w-6 h-6" /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </ViewLayout>
  )
}
