'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Save, ArrowLeft, Loader2, UserCircle } from 'lucide-react';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { toast } from '@/store/useToastStore';

export function ProfileView() {
  const { user, userProfile, setUserProfile, setActiveView } = useBirthdayStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBirthDate(userProfile.birthDate);
    } else if (user) {
      setName(user.displayName || '');
    }
  }, [userProfile, user]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            name,
            birthDate,
          });
        } catch (e) {
          console.warn('Fallback para armazenamento local:', e);
        }
      }

      setUserProfile({
        name,
        birthDate,
      });

      toast.success('Perfil atualizado com sucesso! ✨');
      setActiveView('menu');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ViewLayout
      title="Seu Perfil"
      subtitle="Gerencie suas informações pessoais e data de nascimento."
      hideBackButton={true}
    >
      <div className="max-w-xl mx-auto my-4">
        <button
          onClick={() => setActiveView('menu')}
          className="inline-flex items-center gap-2 text-foreground/50 hover:text-primary transition-colors mb-6 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
        </button>

        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleUpdate}
          className="bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6"
        >
          <div className="flex items-center gap-5 pb-4 border-b border-border/40">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0 shadow-md">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-extrabold text-foreground truncate">{userProfile?.name || name || 'Usuário'}</h2>
              <p className="text-foreground/40 text-xs font-medium truncate">{user?.email || 'Armazenamento Local'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5 ml-1">
                <User className="w-3.5 h-3.5 text-primary" /> Nome de Exibição
              </label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5 ml-1">
                <Calendar className="w-3.5 h-3.5 text-primary" /> Sua Data de Nascimento
              </label>
              <input
                required
                type="date"
                max={todayStr}
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border/40">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </ViewLayout>
  );
}
