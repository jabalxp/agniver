'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBirthdayStore, Birthday } from '@/store/useBirthdayStore'
import { MainMenu } from '@/components/views/MainMenu'
import { DashboardView } from '@/components/views/DashboardView'
import { AddView } from '@/components/views/AddView'
import { CalendarView } from '@/components/views/CalendarView'
import { GiftsView } from '@/components/views/GiftsView'
import { SettingsView } from '@/components/views/SettingsView'
import { ChangelogView } from '@/components/views/ChangelogView'
import { EditView } from '@/components/views/EditView'
import { AuthView } from '@/components/views/AuthView'
import { ProfileView } from '@/components/views/ProfileView'
import { OnboardingView } from '@/components/views/OnboardingView'

import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, onSnapshot, orderBy, doc } from 'firebase/firestore'

export default function Home() {
  const { 
    activeView, setActiveView, setUser, setBirthdays, setLoading, 
    setUserProfile, user, userProfile, loading 
  } = useBirthdayStore()

  // Sincronização Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      } else {
        setUser(null)
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [setUser, setUserProfile, setLoading])

  // Sincronização Perfil do Usuário
  useEffect(() => {
    if (!user) return

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile
        setUserProfile(profile)
        // Se estivermos no onboarding e o perfil agora existe, vamos para o menu
        if (activeView === 'onboarding') {
          setActiveView('menu')
        }
      } else {
        setUserProfile(null)
        // Primeiro login/registro -> Redirecionar para onboarding
        if (activeView !== 'onboarding') {
          setActiveView('onboarding')
        }
      }
    })

    return () => unsubscribe()
  }, [user, activeView, setActiveView, setUserProfile])

  // Sincronização Firestore Birthdays
  useEffect(() => {
    if (!user) return

    setLoading(true)
    const q = query(
      collection(db, 'users', user.uid, 'birthdays'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const birthdays: Birthday[] = []
      snapshot.forEach((doc) => {
        birthdays.push({ id: doc.id, ...doc.data() } as Birthday)
      })
      setBirthdays(birthdays)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, setBirthdays, setLoading])

  // Sincronização com o botão Voltar do navegador (History API)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setActiveView(event.state.view)
      } else {
        setActiveView('menu')
      }
    }

    window.addEventListener('popstate', handlePopState)
    
    // Inicializar o estado inicial se não houver
    if (!window.history.state) {
      window.history.replaceState({ view: 'menu' }, '', '/')
    }

    return () => window.removeEventListener('popstate', handlePopState)
  }, [setActiveView])

  // Empurrar novo estado quando a view mudar via UI (apenas se for diferente do estado atual do history)
  useEffect(() => {
    if (window.history.state?.view !== activeView) {
      const url = activeView === 'menu' ? '/' : `?v=${activeView}`
      window.history.pushState({ view: activeView }, '', url)
    }
  }, [activeView])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          🎂
        </motion.div>
        <div className="flex items-center gap-2 text-foreground/40 font-bold uppercase tracking-widest text-xs">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          Carregando Agniver...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {activeView === 'menu' && <MainMenu key="menu" />}
        {activeView === 'dashboard' && <DashboardView key="dashboard" />}
        {activeView === 'add' && <AddView key="add" />}
        {activeView === 'edit' && <EditView key="edit" />}
        {activeView === 'calendar' && <CalendarView key="calendar" />}
        {activeView === 'gifts' && <GiftsView key="gifts" />}
        {activeView === 'changelog' && <ChangelogView key="changelog" />}
        {activeView === 'settings' && <SettingsView key="settings" />}
        {activeView === 'auth' && <AuthView key="auth" />}
        {activeView === 'profile' && <ProfileView key="profile" />}
        {activeView === 'onboarding' && <OnboardingView key="onboarding" />}
      </AnimatePresence>
    </div>
  )
}
