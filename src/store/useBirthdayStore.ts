import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export interface WishlistItem {
  id: string;
  title: string;
  price?: number;
  url?: string;
  status: 'wished' | 'purchased' | 'delivered';
}

export interface Birthday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  phone?: string;
  color: string;
  notes: string;
  isFavorite?: boolean;
  tags?: string[];
  wishlist?: WishlistItem[];
  createdAt: string;
}

export interface UserProfile {
  name: string;
  birthDate: string;
}

export type ThemeType = 'light' | 'dark' | 'sakura' | 'golden' | 'forest';

export type ViewType =
  | 'menu'
  | 'dashboard'
  | 'add'
  | 'edit'
  | 'calendar'
  | 'gifts'
  | 'settings'
  | 'changelog'
  | 'auth'
  | 'profile'
  | 'onboarding'
  | 'timeline'
  | 'stats';

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
  addBirthday: (birthday: Omit<Birthday, 'id' | 'createdAt'>) => Promise<void>;
  removeBirthday: (id: string) => Promise<void>;
  updateBirthday: (id: string, birthday: Partial<Birthday>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  importBirthdays: (items: Array<Omit<Birthday, 'id' | 'createdAt'>>) => Promise<void>;
  clearAllBirthdays: () => Promise<void>;
  
  // Wishlist Actions
  addWishlistItem: (birthdayId: string, item: Omit<WishlistItem, 'id'>) => Promise<void>;
  updateWishlistItem: (birthdayId: string, itemId: string, item: Partial<WishlistItem>) => Promise<void>;
  removeWishlistItem: (birthdayId: string, itemId: string) => Promise<void>;

  // View & Theme Actions
  setTheme: (theme: ThemeType) => void;
  setActiveView: (view: ViewType) => void;
  setEditingId: (id: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setBirthdays: (birthdays: Birthday[]) => void;
  setLoading: (loading: boolean) => void;
}

const INITIAL_BIRTHDAYS: Birthday[] = [
  {
    id: 'bday-1',
    name: 'Ana Paula Silva',
    date: '1996-03-15',
    phone: '11988887777',
    color: '#ec4899',
    notes: 'Adora café especial e livros de ficção científica.',
    isFavorite: true,
    tags: ['Amigos', 'VIP'],
    wishlist: [
      { id: 'w1', title: 'Prensa Francesa de Inox', price: 120, status: 'wished' },
      { id: 'w2', title: 'Livro Duna - Edição Especial', price: 85, status: 'purchased' }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bday-2',
    name: 'Lucas Oliveira',
    date: '1992-06-28',
    phone: '21977776666',
    color: '#3b82f6',
    notes: 'Pratica corrida e ciclismo. Fã de gadgets de tecnologia.',
    isFavorite: false,
    tags: ['Trabalho'],
    wishlist: [
      { id: 'w3', title: 'Meias de Compressão DryFit', price: 60, status: 'wished' }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bday-3',
    name: 'Mariana Costa',
    date: '1998-12-25',
    phone: '31966665555',
    color: '#f59e0b',
    notes: 'Aniversário no Natal! Não esquecer de dar presente duplo.',
    isFavorite: true,
    tags: ['Família', 'VIP'],
    wishlist: [
      { id: 'w4', title: 'Fones Bluetooth com Cancelamento de Ruído', price: 299, status: 'wished' }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bday-4',
    name: 'Gabriel Santos',
    date: '1995-09-10',
    phone: '41955554444',
    color: '#10b981',
    notes: 'Coleciona vinis de rock clássico e jogos de tabuleiro.',
    isFavorite: false,
    tags: ['Amigos'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'bday-5',
    name: 'Beatriz Lima',
    date: '2001-11-04',
    phone: '51944443333',
    color: '#8b5cf6',
    notes: 'Gosta de arte, aquarela e plantas para apartamento.',
    isFavorite: false,
    tags: ['Família'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
];

export const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set, get) => ({
      birthdays: INITIAL_BIRTHDAYS,
      theme: 'dark',
      activeView: 'menu',
      editingId: null,
      user: null,
      userProfile: null,
      loading: false,

      addBirthday: async (birthday) => {
        const { user } = get();
        const newBirthday: Birthday = {
          ...birthday,
          id: crypto.randomUUID(),
          isFavorite: birthday.isFavorite ?? false,
          tags: birthday.tags ?? [],
          wishlist: birthday.wishlist ?? [],
          createdAt: new Date().toISOString(),
        };

        if (user) {
          try {
            await addDoc(collection(db, 'users', user.uid, 'birthdays'), newBirthday);
          } catch (e) {
            console.warn('Fallback para local storage:', e);
          }
        }

        set((state) => ({
          birthdays: [newBirthday, ...state.birthdays],
        }));
      },

      removeBirthday: async (id) => {
        const { user } = get();
        if (user) {
          try {
            await deleteDoc(doc(db, 'users', user.uid, 'birthdays', id));
          } catch (e) {
            console.warn('Fallback para local storage:', e);
          }
        }
        set((state) => ({
          birthdays: state.birthdays.filter((b) => b.id !== id),
        }));
      },

      updateBirthday: async (id, updatedBirthday) => {
        const { user } = get();
        if (user) {
          try {
            await updateDoc(doc(db, 'users', user.uid, 'birthdays', id), updatedBirthday);
          } catch (e) {
            console.warn('Fallback para local storage:', e);
          }
        }
        set((state) => ({
          birthdays: state.birthdays.map((b) => (b.id === id ? { ...b, ...updatedBirthday } : b)),
        }));
      },

      toggleFavorite: async (id) => {
        const { user, birthdays } = get();
        const birthday = birthdays.find((b) => b.id === id);
        if (!birthday) return;

        const newFav = !birthday.isFavorite;
        if (user) {
          try {
            await updateDoc(doc(db, 'users', user.uid, 'birthdays', id), { isFavorite: newFav });
          } catch (e) {
            console.warn('Fallback para local storage:', e);
          }
        }
        set((state) => ({
          birthdays: state.birthdays.map((b) => (b.id === id ? { ...b, isFavorite: newFav } : b)),
        }));
      },

      importBirthdays: async (items) => {
        const { user, birthdays } = get();
        const newBirthdays: Birthday[] = items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
          isFavorite: item.isFavorite ?? false,
          tags: item.tags ?? [],
          wishlist: item.wishlist ?? [],
          createdAt: new Date().toISOString(),
        }));

        if (user) {
          for (const b of newBirthdays) {
            try {
              await addDoc(collection(db, 'users', user.uid, 'birthdays'), b);
            } catch (e) {
              console.warn(e);
            }
          }
        }

        set({
          birthdays: [...newBirthdays, ...birthdays],
        });
      },

      clearAllBirthdays: async () => {
        set({ birthdays: [] });
      },

      addWishlistItem: async (birthdayId, item) => {
        const { birthdays, updateBirthday } = get();
        const target = birthdays.find((b) => b.id === birthdayId);
        if (!target) return;

        const newItem: WishlistItem = {
          ...item,
          id: crypto.randomUUID(),
        };

        const updatedList = [...(target.wishlist || []), newItem];
        await updateBirthday(birthdayId, { wishlist: updatedList });
      },

      updateWishlistItem: async (birthdayId, itemId, updatedFields) => {
        const { birthdays, updateBirthday } = get();
        const target = birthdays.find((b) => b.id === birthdayId);
        if (!target) return;

        const updatedList = (target.wishlist || []).map((w) =>
          w.id === itemId ? { ...w, ...updatedFields } : w
        );
        await updateBirthday(birthdayId, { wishlist: updatedList });
      },

      removeWishlistItem: async (birthdayId, itemId) => {
        const { birthdays, updateBirthday } = get();
        const target = birthdays.find((b) => b.id === birthdayId);
        if (!target) return;

        const updatedList = (target.wishlist || []).filter((w) => w.id !== itemId);
        await updateBirthday(birthdayId, { wishlist: updatedList });
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
      name: 'agniver-storage',
      partialize: (state) => ({
        theme: state.theme,
        birthdays: state.birthdays,
        userProfile: state.userProfile,
      }),
    }
  )
);
