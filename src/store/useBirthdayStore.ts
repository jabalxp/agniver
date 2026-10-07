import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

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
  nickname?: string;
  interests?: string[];
  memories?: string;
  color: string;
  notes: string;
  photo?: string;
  isFavorite?: boolean;
  tags?: string[];
  wishlist?: WishlistItem[];
  createdAt: string;
}

export interface CustomMessageTemplate {
  id: string;
  title: string;
  category: 'carinhoso' | 'divertido' | 'formal' | 'curto' | 'emocionante' | 'custom';
  content: string;
  isFavorite?: boolean;
}

export interface UserProfile {
  name: string;
  birthDate: string;
  photoURL?: string | null;
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

export interface UserInfo {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface BirthdayState {
  birthdays: Birthday[];
  isLoadingBirthdays: boolean;
  theme: ThemeType;
  activeView: ViewType;
  editingId: string | null;
  user: UserInfo | null;
  userProfile: UserProfile | null;
  customTemplates: CustomMessageTemplate[];

  // Actions
  setTheme: (theme: ThemeType) => void;
  setActiveView: (view: ViewType) => void;
  setEditingId: (id: string | null) => void;
  setUser: (user: UserInfo | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfilePhoto: (photoURL: string | null) => void;
  initUserSync: (uid: string) => () => void;

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

  // Template Actions
  addCustomTemplate: (template: Omit<CustomMessageTemplate, 'id'>) => void;
  removeCustomTemplate: (id: string) => void;
  toggleFavoriteTemplate: (id: string) => void;
}

const DEFAULT_TEMPLATES: CustomMessageTemplate[] = [
  {
    id: 't-carinhoso',
    title: 'Carinhoso & Amigo',
    category: 'carinhoso',
    content: 'Feliz aniversário, {nome}! 🎂 Que a vida te presenteie com muita saúde, paz e momentos especiais. É um privilégio ter você por perto! Aproveite muito seu dia!',
    isFavorite: true,
  },
  {
    id: 't-divertido',
    title: 'Divertido & Espontâneo',
    category: 'divertido',
    content: 'Parabéns pelos seus {idade} anos, {nome}! 🥳 Mais um ano acumulando histórias, sabedoria e juventude acumulada. A comemoração é por sua conta!',
    isFavorite: true,
  },
  {
    id: 't-formal',
    title: 'Formal & Profissional',
    category: 'formal',
    content: 'Prezado(a) {nome}, desejo um feliz aniversário! Que seu novo ciclo venha acompanhado de muitas realizações pessoais e profissionais com grande sucesso.',
    isFavorite: false,
  },
  {
    id: 't-curto',
    title: 'Curto & Direto',
    category: 'curto',
    content: 'Parabéns, {nome}! Muita saúde, alegria e sucesso no seu dia e no novo ano que começa. Grande abraço! 🎉',
    isFavorite: false,
  },
  {
    id: 't-emocionante',
    title: 'Emocionante & Profundo',
    category: 'emocionante',
    content: '{nome}, hoje celebramos a sua existência! Sou imensamente grato(a) por sua amizade e por todas as memórias que compartilhamos. Que seu coração se encha de alegria hoje e sempre! ❤️',
    isFavorite: true,
  },
];

export const useBirthdayStore = create<BirthdayState>()(
  persist(
    (set, get) => ({
      birthdays: [],
      isLoadingBirthdays: false,
      theme: 'dark',
      activeView: 'menu',
      editingId: null,
      user: null,
      userProfile: null,
      customTemplates: DEFAULT_TEMPLATES,

      setTheme: (theme) => set({ theme }),
      setActiveView: (activeView) => set({ activeView }),
      setEditingId: (editingId) => set({ editingId }),
      setUser: (user) => {
        if (!user) {
          set({ user: null, userProfile: null, birthdays: [] });
        } else {
          set({ user });
        }
      },
      setUserProfile: (userProfile) => set({ userProfile }),
      updateUserProfilePhoto: (photoURL) =>
        set((state) => ({
          user: state.user ? { ...state.user, photoURL } : null,
          userProfile: state.userProfile ? { ...state.userProfile, photoURL } : null,
        })),

      initUserSync: (uid: string) => {
        if (!db || !db.app || !uid) {
          return () => {};
        }

        set({ isLoadingBirthdays: true });

        const birthdaysRef = collection(db, 'users', uid, 'birthdays');
        const unsubBirthdays = onSnapshot(
          birthdaysRef,
          (snapshot) => {
            const list: Birthday[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data();
              list.push({
                id: docSnap.id,
                name: data.name || '',
                date: data.date || '',
                phone: data.phone || '',
                nickname: data.nickname || '',
                interests: data.interests || [],
                memories: data.memories || '',
                color: data.color || '#3b82f6',
                notes: data.notes || '',
                photo: data.photo || '',
                isFavorite: data.isFavorite ?? false,
                tags: data.tags || [],
                wishlist: data.wishlist || [],
                createdAt: data.createdAt || new Date().toISOString(),
              });
            });
            set({ birthdays: list, isLoadingBirthdays: false });
          },
          (err) => {
            console.error('Erro na sincronização de aniversários:', err);
            set({ isLoadingBirthdays: false });
          }
        );

        const userDocRef = doc(db, 'users', uid);
        const unsubProfile = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              set({
                userProfile: {
                  name: data.name || '',
                  birthDate: data.birthDate || '',
                  photoURL: data.photoURL ?? null,
                },
              });
            }
          },
          (err) => {
            console.warn('Erro ao carregar perfil do Firestore:', err);
          }
        );

        return () => {
          unsubBirthdays();
          unsubProfile();
        };
      },

      addBirthday: async (birthdayData) => {
        const { user } = get();
        const newId = crypto.randomUUID();
        const newBirthday: Birthday = {
          ...birthdayData,
          id: newId,
          nickname: birthdayData.nickname || '',
          interests: birthdayData.interests || [],
          memories: birthdayData.memories || '',
          isFavorite: birthdayData.isFavorite ?? false,
          tags: birthdayData.tags ?? [],
          wishlist: birthdayData.wishlist ?? [],
          createdAt: new Date().toISOString(),
        };

        if (user && db && db.app) {
          try {
            await setDoc(doc(db, 'users', user.uid, 'birthdays', newId), newBirthday);
          } catch (e) {
            console.warn('Fallback para local storage:', e);
          }
        }

        set((state) => {
          if (state.birthdays.some((b) => b.id === newId)) return state;
          return { birthdays: [newBirthday, ...state.birthdays] };
        });
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
            await setDoc(doc(db, 'users', user.uid, 'birthdays', id), updatedBirthday, { merge: true });
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
            await setDoc(doc(db, 'users', user.uid, 'birthdays', id), { isFavorite: newFav }, { merge: true });
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
          nickname: item.nickname || '',
          interests: item.interests || [],
          memories: item.memories || '',
          isFavorite: item.isFavorite ?? false,
          tags: item.tags ?? [],
          wishlist: item.wishlist ?? [],
          createdAt: new Date().toISOString(),
        }));

        if (user && db && db.app) {
          for (const b of newBirthdays) {
            try {
              await setDoc(doc(db, 'users', user.uid, 'birthdays', b.id), b);
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
        const { user, birthdays } = get();
        if (user && db && db.app) {
          for (const b of birthdays) {
            try {
              await deleteDoc(doc(db, 'users', user.uid, 'birthdays', b.id));
            } catch (e) {
              console.warn('Erro ao limpar aniversário do banco:', e);
            }
          }
        }
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

      addCustomTemplate: (template) =>
        set((state) => ({
          customTemplates: [
            ...state.customTemplates,
            { ...template, id: crypto.randomUUID() },
          ],
        })),

      removeCustomTemplate: (id) =>
        set((state) => ({
          customTemplates: state.customTemplates.filter((t) => t.id !== id),
        })),

      toggleFavoriteTemplate: (id) =>
        set((state) => ({
          customTemplates: state.customTemplates.map((t) =>
            t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
          ),
        })),
    }),
    {
      name: 'agniver-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.birthdays && Array.isArray(state.birthdays)) {
            state.birthdays = state.birthdays.filter((b) => !b.id.startsWith('mock-'));
          }
          if (state.userProfile?.name === 'Rafael Adriano') {
            state.userProfile = null;
          }
          if (!state.customTemplates || state.customTemplates.length === 0) {
            state.customTemplates = DEFAULT_TEMPLATES;
          }
        }
      },
    }
  )
);
