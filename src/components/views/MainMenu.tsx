'use client'

import { motion } from 'framer-motion'
import { CalendarDays, Gift, Settings, AlignLeft, Users, CalendarPlus, List, LogOut, User as UserIcon, LogIn } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

export function MainMenu() {
  const { setActiveView, user, userProfile, setUser } = useBirthdayStore()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Erro ao sair:', error)
    }
  }

  const getFirstName = (name: string | null | undefined) => {
    if (!name) return 'Usuário'
    return name.split(' ')[0]
  }

  const getInitial = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md w-full mx-auto bg-card/80 backdrop-blur-xl border border-border rounded-[3rem] p-8 shadow-2xl flex flex-col items-center text-center mt-10 relative overflow-hidden"
    >
      {/* Profile Section */}
      <div className="w-full flex items-center justify-between mb-8 pb-6 border-b border-border/50">
        <button 
          onClick={() => user && setActiveView('profile')}
          className={`flex items-center gap-3 text-left transition-all ${user ? 'hover:opacity-80 group' : 'cursor-default'}`}
        >
          <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-primary/20 bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {userProfile?.name ? getInitial(userProfile.name) : getInitial(user?.displayName || user?.email)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">
              {user ? 'Meu Perfil' : 'Visitante'}
            </p>
            <p className="text-lg font-bold text-foreground truncate">
              {user ? (userProfile?.name?.split(' ')[0] || getFirstName(user.displayName || user.email)) : 'Convidado'}
            </p>
          </div>
        </button>

        {user ? (
          <button 
            onClick={handleLogout}
            className="p-3 rounded-2xl bg-foreground/5 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 transition-all group"
            title="Sair"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Sair</span>
              <LogOut className="w-5 h-5" />
            </div>
          </button>
        ) : (
          <button 
            onClick={() => setActiveView('auth')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <LogIn className="w-4 h-4" /> Entrar
          </button>
        )}
      </div>

      <div className="text-6xl mb-4">🎂</div>
      <h1 className="text-3xl font-extrabold text-foreground mb-3">
        Lembrete de <br /> Aniversários
      </h1>
      <p className="text-foreground/60 mb-8 font-medium">
        Nunca mais esqueça uma data importante! Gerencie aniversários com notificações inteligentes.
      </p>

      <div className="w-full flex flex-col gap-4">
        <button 
          onClick={() => setActiveView('add')}
          className="w-full flex items-center justify-center gap-3 bg-[#42b89e] hover:bg-[#38a58d] text-white py-4 px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <CalendarPlus className="w-5 h-5" /> Agendar Aniversário
        </button>

        <button 
          onClick={() => setActiveView('dashboard')}
          className="w-full flex items-center justify-center gap-3 bg-[#f5a623] hover:bg-[#e0961e] text-white py-4 px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <Users className="w-5 h-5" /> Meus Contatos
        </button>

        <button 
          onClick={() => setActiveView('gifts')}
          className="w-full flex items-center justify-center gap-3 bg-[#f36886] hover:bg-[#de5c78] text-white py-4 px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <Gift className="w-5 h-5" /> Ideias de Presentes
        </button>

        <button 
          onClick={() => setActiveView('changelog')}
          className="w-full flex items-center justify-center gap-3 bg-[#7861bc] hover:bg-[#6853a5] text-white py-4 px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <List className="w-5 h-5" /> Changelog
        </button>

        <button 
          onClick={() => setActiveView('settings')}
          className="w-full flex items-center justify-center gap-3 bg-[#6b8cce] hover:bg-[#5b7bbb] text-white py-4 px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <Settings className="w-5 h-5" /> Configurações
        </button>

        <button 
          onClick={() => setActiveView('calendar')}
          className="w-full flex items-center justify-center gap-3 bg-[#8b5cf6] hover:bg-[#7c4df2] text-white py-4 px-6 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          <CalendarDays className="w-5 h-5" /> Calendário Visual
        </button>
      </div>
    </motion.div>
  )
}
