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

  // Actions
  setTheme: (theme: ThemeType) => void;
  setActiveView: (view: ViewType) => void;
  setEditingId: (id: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;

  // CRUD
  addBirthday: (birthday: Omit<Birthday, 'id' | 'createdAt'>) => Promise<void>;
  removeBirthday: (id: string) => Promise<void>;
  updateBirthday: (id: string, updatedBirthday: Partial<Birthday>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  importBirthdays: (items: Omit<Birthday, 'id' | 'createdAt'>[]) => Promise<void>;
  clearAllBirthdays: () => Promise<void>;

  // Wishlist Actions
  addWishlistItem: (birthdayId: string, item: Omit<WishlistItem, 'id'>) => Promise<void>;
  updateWishlistItem: (birthdayId: string, itemId: string, item: Partial<WishlistItem>) => Promise<void>;
  removeWishlistItem: (birthdayId: string, itemId: string) => Promise<void>;
}

const INITIAL_MOCK_BIRTHDAYS: Birthday[] = [
  {
    id: 'mock-1',
    name: 'Ana Carolina Silva',
    date: '1998-03-15',
    phone: '(11) 98765-4321',
    color: '#ec4899',
    notes: 'Ama café especial, livros de ficção científica e suculentas.',
    isFavorite: true,
    tags: ['Amigos', 'VIP'],
    wishlist: [
      { id: 'w1', title: 'Kit Café Gourmet em Grãos', price: 65, status: 'purchased' },
      { id: 'w2', title: 'Livro Duna - Edição de Luxo', price: 90, status: 'wished' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    name: 'Lucas Eduardo Santos',
    date: '1995-03-18',
    phone: '(21) 99887-6655',
    color: '#3b82f6',
    notes: 'Gosta de jogos de tabuleiro, cerveja artesanal e fones de ouvido.',
    isFavorite: true,
    tags: ['Amigos', 'Trabalho'],
    wishlist: [
      { id: 'w3', title: 'Jogo Catan / Dixit', price: 180, status: 'wished' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-3',
    name: 'Mariana Oliveira',
    date: '2001-04-02',
    phone: '(31) 97123-8899',
    color: '#8b5cf6',
    notes: 'Fã de fotografia e posters minimalistas.',
    isFavorite: false,
    tags: ['Faculdade'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-4',
    name: 'Roberto Souza (Pai)',
    date: '1968-04-10',
    phone: '(11) 99111-2233',
    color: '#10b981',
    notes: 'Gosta de churrasco, ferramentas e camisas polo tamanho G.',
    isFavorite: true,
    tags: ['Família', 'VIP'],
    wishlist: [
      { id: 'w4', title: 'Kit Faca Artesanal de Churrasco', price: 140, status: 'delivered' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-5',
    name: 'Beatriz Costa',
    date: '2000-05-22',
    phone: '(41) 98444-5566',
    color: '#f59e0b',
    notes: 'Adora velas aromáticas e itens de papelaria.',
    isFavorite: false,
    tags: ['Amigos'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-6',
    name: 'Gabriel Martins',
    date: '1996-08-14',
    phone: '(11) 97654-3210',
    color: '#06b6d4',
    notes: 'Programador, gosta de teclados mecânicos e mousepads grandes.',
    isFavorite: false,
    tags: ['Trabalho'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-7',
    name: 'Juliana Mendes',
    date: '1992-11-05',
    phone: '(85) 99222-3344',
    color: '#f97316',
    notes: 'Gosta de vinhos secos e chocolates com alta porcentagem de cacau.',
    isFavorite: false,
    tags: ['Família'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-8',
    name: 'Fernando Rocha',
    date: '1990-12-25',
    phone: '(11) 98111-9988',
    color: '#ef4444',
    notes: 'Aniversário no Natal! Não esquecer de dar parabéns duplo.',
    isFavorite: true,
    tags: ['Amigos', 'VIP'],
    wishlist: [],
    createdAt: new Date().toISOString(),
  },
];

export const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set, get) => ({
      birthdays: INITIAL_MOCK_BIRTHDAYS,
      theme: 'dark',
      activeView: 'menu',
      editingId: null,
      user: null,
      userProfile: {
        name: 'Rafael Adriano',
        birthDate: '1995-06-15',
      },

      setTheme: (theme) => set({ theme }),
      setActiveView: (activeView) => set({ activeView }),
      setEditingId: (editingId) => set({ editingId }),
      setUser: (user) => set({ user }),
      setUserProfile: (userProfile) => set({ userProfile }),

      addBirthday: async (birthdayData) => {
        const { user } = get();
        const newBirthday: Birthday = {
          ...birthdayData,
          id: crypto.randomUUID(),
          isFavorite: birthdayData.isFavorite ?? false,
          tags: birthdayData.tags ?? [],
          wishlist: birthdayData.wishlist ?? [],
          createdAt: new Date().toISOString(),
        };

        if (user && db && db.app) {
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
        if (user && db && db.app) {
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
        if (user && db && db.app) {
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
        if (user && db && db.app) {
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

        if (user && db && db.app) {
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

      updateWishlistItem: async (birthdayId, itemId, itemChanges) => {
        const { birthdays, updateBirthday } = get();
        const target = birthdays.find((b) => b.id === birthdayId);
        if (!target || !target.wishlist) return;

        const updatedList = target.wishlist.map((item) =>
          item.id === itemId ? { ...item, ...itemChanges } : item
        );
        await updateBirthday(birthdayId, { wishlist: updatedList });
      },

      removeWishlistItem: async (birthdayId, itemId) => {
        const { birthdays, updateBirthday } = get();
        const target = birthdays.find((b) => b.id === birthdayId);
        if (!target || !target.wishlist) return;

        const updatedList = target.wishlist.filter((item) => item.id !== itemId);
        await updateBirthday(birthdayId, { wishlist: updatedList });
      },
    }),
    {
      name: 'agniver-storage',
    }
  )
);
