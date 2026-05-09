import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '@/lib/firebase'
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'

export interface Birthday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  phone: string;
  color: string;
  notes: string;
  isFavorite?: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  birthDate: string;
}

export type ThemeType = 'light' | 'dark' | 'sakura' | 'golden' | 'forest';

export type ViewType = 'menu' | 'dashboard' | 'add' | 'edit' | 'calendar' | 'gifts' | 'settings' | 'changelog' | 'auth' | 'profile' | 'onboarding';

interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface BirthdayState {
  birthdays: Birthday[];
  theme: ThemeType;
  activeView: ViewType;
  editingId: string | null;
  user: UserInfo | null;
  userProfile: UserProfile | null;
  loading: boolean;
  
  // Actions
  addBirthday: (birthday: Omit<Birthday, 'id' | 'createdAt' | 'isFavorite'>) => Promise<void>;
  removeBirthday: (id: string) => Promise<void>;
  updateBirthday: (id: string, birthday: Partial<Birthday>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setTheme: (theme: ThemeType) => void;
  setActiveView: (view: ViewType) => void;
  setEditingId: (id: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setBirthdays: (birthdays: Birthday[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set, get) => ({
      birthdays: [],
      theme: 'light',
      activeView: 'menu',
      editingId: null,
      user: null,
      userProfile: null,
      loading: true,

      addBirthday: async (birthday) => {
        const { user } = get()
        const newBirthday = {
          ...birthday,
          isFavorite: false,
          createdAt: new Date().toISOString()
        }

        if (user) {
          await addDoc(collection(db, 'users', user.uid, 'birthdays'), newBirthday)
          // O onSnapshot no page.tsx atualizará a lista automaticamente
        } else {
          set((state) => ({
            birthdays: [...state.birthdays, { ...newBirthday, id: crypto.randomUUID() }]
          }))
        }
      },

      removeBirthday: async (id) => {
        const { user } = get()
        if (user) {
          await deleteDoc(doc(db, 'users', user.uid, 'birthdays', id))
        } else {
          set((state) => ({
            birthdays: state.birthdays.filter(b => b.id !== id)
          }))
        }
      },

      updateBirthday: async (id, updatedBirthday) => {
        const { user } = get()
        if (user) {
          await updateDoc(doc(db, 'users', user.uid, 'birthdays', id), updatedBirthday)
        } else {
          set((state) => ({
            birthdays: state.birthdays.map(b => b.id === id ? { ...b, ...updatedBirthday } : b)
          }))
        }
      },

      toggleFavorite: async (id) => {
        const { user, birthdays } = get()
        const birthday = birthdays.find(b => b.id === id)
        if (!birthday) return

        if (user) {
          await updateDoc(doc(db, 'users', user.uid, 'birthdays', id), {
            isFavorite: !birthday.isFavorite
          })
        } else {
          set((state) => ({
            birthdays: state.birthdays.map(b => b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)
          }))
        }
      },

      setTheme: (theme) => set({ theme }),
      setActiveView: (view) => set({ activeView: view }),
      setEditingId: (id) => set({ editingId: id }),
      setUser: (user) => set({ user }),
      setUserProfile: (userProfile) => set({ userProfile }),
      setBirthdays: (birthdays) => set({ birthdays }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'birthday-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        birthdays: state.user ? [] : state.birthdays 
      }),
    }
  )
)

