'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Save, ArrowLeft, Loader2, Camera, Trash2, Link as LinkIcon } from 'lucide-react';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { toast } from '@/store/useToastStore';
import { UserAvatar } from '@/components/UserAvatar';
import { DateInput } from '@/components/DateInput';

export function ProfileView() {
  const { user, userProfile, setUserProfile, updateUserProfilePhoto, setActiveView } = useBirthdayStore();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [photoInputUrl, setPhotoInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBirthDate(userProfile.birthDate);
      setPhotoURL(userProfile.photoURL ?? user?.photoURL ?? null);
    } else if (user) {
      setName(user.displayName || '');
      setPhotoURL(user.photoURL || null);
    }
  }, [userProfile, user]);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar para tamanho ideal de avatar (máx 300x300)
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPhotoURL(compressedDataUrl);
          toast.success('Foto carregada com sucesso! Clique em "Salvar Alterações".');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const cleanUrl = photoInputUrl.trim();
    if (cleanUrl) {
      setPhotoURL(cleanUrl);
      setShowUrlInput(false);
      setPhotoInputUrl('');
      toast.success('Link de foto aplicado! Clique em "Salvar Alterações".');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoURL(null);
    toast.info('Foto removida. Clique em "Salvar Alterações" para confirmar.');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (birthDate && birthDate < '1910-01-01') {
      toast.error('A data de nascimento não pode ser anterior ao ano de 1910!');
      return;
    }
    if (birthDate && birthDate > todayStr) {
      toast.error('A data de nascimento não pode ser no futuro!');
      return;
    }

    setLoading(true);
    try {
      // 1. Atualizar no Firebase Auth se estiver logado
      if (auth && auth.currentUser) {
        try {
          await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL,
          });
        } catch (authErr) {
          console.warn('Erro ao atualizar auth profile:', authErr);
        }
      }

      // 2. Atualizar no Firestore
      if (user && db && db.app) {
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              name,
              birthDate,
              photoURL: photoURL || null,
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Fallback para armazenamento local:', e);
        }
      }

      // 3. Atualizar no Zustand Store
      setUserProfile({
        name,
        birthDate,
        photoURL: photoURL || null,
      });
      updateUserProfilePhoto(photoURL || null);

      toast.success('Perfil e foto atualizados com sucesso! ✨');
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
      subtitle="Gerencie sua foto, informações pessoais e data de aniversário."
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
          {/* Header com Avatar e ações de Foto */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-border/40 text-center sm:text-left">
            <div className="relative group">
              <UserAvatar
                src={photoURL}
                name={name || user?.displayName || userProfile?.name}
                size="xl"
                className="shadow-lg border-primary/40 ring-4 ring-primary/10"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer font-bold text-[10px]"
                title="Clique para trocar de foto"
              >
                <Camera className="w-5 h-5 mb-1" />
                Trocar Foto
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-foreground truncate">
                {userProfile?.name || name || 'Usuário'}
              </h2>
              <p className="text-foreground/40 text-xs font-medium truncate mb-3">
                {user?.email || 'Armazenamento Local'}
              </p>

              {/* Controles da Foto */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Camera className="w-3.5 h-3.5" /> Escolher Foto
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-1.5 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground/70 border border-border/50 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Usar Link
                </button>

                {photoURL && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold text-xs flex items-center gap-1.5 transition-all"
                    title="Remover foto atual"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover
                  </button>
                )}
              </div>

              {/* Input opcional de URL */}
              {showUrlInput && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="url"
                    value={photoInputUrl}
                    onChange={(e) => setPhotoInputUrl(e.target.value)}
                    placeholder="Cole a URL da imagem (https://...)"
                    className="flex-1 px-3 py-1.5 text-xs bg-background/60 border border-border rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Aplicar
                  </button>
                </div>
              )}
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
              <DateInput
                value={birthDate}
                onChange={(newDate) => setBirthDate(newDate)}
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
