'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, Mail, Lock, Globe, ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { auth, googleProvider } from '@/lib/firebase'
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth'
import { ViewLayout } from '@/components/views/ViewLayout'

export function AuthView() {
  const { setActiveView, setUser } = useBirthdayStore()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL
      })
      setActiveView('menu')
    } catch (err: any) {
      setError('Falha ao entrar com Google: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password)
        const firebaseUser = result.user
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
        const firebaseUser = result.user
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: name,
          photoURL: null
        })
      }
      setActiveView('menu')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ViewLayout 
      title={isLogin ? 'Bem-vindo de Volta' : 'Criar Conta'} 
      subtitle={isLogin ? 'Entre para sincronizar seus aniversários.' : 'Comece a salvar seus momentos importantes na nuvem.'}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-2xl"
      >
        <button 
          onClick={() => setActiveView('menu')}
          className="flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors mb-6 text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
        </button>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5 text-[#4285F4]" />}
            Continuar com Google
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] flex-1 bg-border/50"></div>
            <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">ou use seu e-mail</span>
            <div className="h-[1px] flex-1 bg-border/50"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-foreground/5 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-foreground/5 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-foreground/5 border border-border/50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                <><LogIn className="w-5 h-5" /> Entrar</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Criar Minha Conta</>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-foreground/60 mt-6">
            {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-primary font-bold hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </p>
        </div>
      </motion.div>
    </ViewLayout>
  )
}
