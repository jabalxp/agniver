'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, AlignLeft, Palette, Save, Phone, Tag, Plus, X, ArrowLeft, Camera, Trash2, Sparkles } from 'lucide-react';
import { useBirthdayStore } from '@/store/useBirthdayStore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { toast } from '@/store/useToastStore';
import { DateInput } from '@/components/DateInput';

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

const SUGGESTED_TAGS = ['Família', 'Amigos', 'Trabalho', 'VIP', 'Faculdade', 'Vizinhos'];

export function AddView() {
  const { addBirthday, setActiveView } = useBirthdayStore();
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    date: '',
    phone: '',
    color: PRESET_COLORS[0],
    notes: '',
    memories: '',
    photo: '',
  });
  const [tags, setTags] = useState<string[]>(['Amigos']);
  const [customTagInput, setCustomTagInput] = useState('');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 250;
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
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setFormData((prev) => ({ ...prev, photo: compressed }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddTag = (tagToAdd: string) => {
    const clean = tagToAdd.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setCustomTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) {
      toast.error('Por favor, informe uma data de nascimento válida!');
      return;
    }
    if (formData.date < '1910-01-01') {
      toast.error('O ano mínimo permitido é 1910!');
      return;
    }
    if (formData.date > todayStr) {
      toast.error('A data de nascimento não pode ser no futuro!');
      return;
    }
    await addBirthday({
      ...formData,
      tags,
      isFavorite: tags.includes('VIP'),
    });
    toast.success(`🎉 Aniversário de ${formData.name} agendado com sucesso!`);
    setActiveView('dashboard');
  };

  return (
    <ViewLayout title="Novo Aniversário" subtitle="Cadastre amigos e familiares para receber lembretes automáticos.">
      <div className="mb-4">
        <button
          onClick={() => setActiveView('menu')}
          className="inline-flex items-center gap-2 text-xs font-bold text-foreground/50 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Menu
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-xl w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Nome Completo *
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm font-medium outline-none transition-all"
              placeholder="Ex: Clara Mendes"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Apelido Carinhoso (Opcional)
            </label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm font-medium outline-none transition-all"
              placeholder="Ex: Clarinha, Mãe, Beto..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Celular (WhatsApp)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm font-medium outline-none transition-all"
              placeholder="Ex: (11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Data de Nascimento *
            </label>
            <DateInput
              required
              value={formData.date}
              onChange={(date) => setFormData({ ...formData, date })}
            />
          </div>
        </div>

          {/* Tags Manager */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Categorias & Tags
            </label>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/30 text-xs font-bold flex items-center gap-1.5"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(customTagInput);
                  }
                }}
                placeholder="Digitar nova tag e pressionar Enter..."
                className="flex-1 px-3 py-2 bg-background/50 border border-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => handleAddTag(customTagInput)}
                className="p-2 bg-foreground/10 hover:bg-primary hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] text-foreground/40 mr-1">Sugestões:</span>
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleAddTag(st)}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/60 transition-colors"
                >
                  +{st}
                </button>
              ))}
            </div>
          </div>

        {/* Foto do Amigo */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" /> Foto do Aniversariante (Opcional)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-background/30 p-3.5 rounded-2xl border border-border/50">
            {formData.photo ? (
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/40 shrink-0">
                <img
                  src={formData.photo}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                  className="absolute inset-0 bg-black/60 text-rose-400 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity font-bold text-[10px]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-foreground/30 shrink-0">
                <Camera className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 w-full space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-bold transition-all">
                  Escolher Imagem
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {formData.photo && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, photo: '' }))}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition-all"
                  >
                    Remover
                  </button>
                )}
              </div>
              <input
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                placeholder="Ou cole a URL da imagem (https://...)"
                className="w-full px-3 py-2 bg-background/50 border border-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-primary" /> Dicas de Presente & Anotações
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm font-medium outline-none transition-all min-h-[85px] resize-y"
            placeholder="Ex: Gosta de café especial, coleciona canecas, tamanho de calçado 41..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Lembrança ou Momento Marcante (Privado e Opcional)
          </label>
          <textarea
            value={formData.memories}
            onChange={(e) => setFormData({ ...formData, memories: e.target.value })}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-2xl focus:ring-2 focus:ring-primary/50 focus:border-transparent text-sm font-medium outline-none transition-all min-h-[75px] resize-y"
            placeholder="Ex: Viajamos juntos em 2023, sempre me incentiva nos estudos... (usado para te inspirar nas mensagens de parabéns)"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" /> Cor de Identificação do Amigo
          </label>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-9 h-9 rounded-full transition-transform ${
                  formData.color === color
                    ? 'scale-125 ring-2 ring-offset-2 ring-primary'
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveView('dashboard')}
            className="py-3.5 px-6 rounded-2xl border border-border text-foreground/70 hover:bg-foreground/5 font-bold text-sm transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-3.5 px-8 rounded-2xl bg-primary text-primary-foreground font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/25 active:scale-95 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Salvar Aniversário
          </button>
        </div>
      </motion.form>
    </ViewLayout>
  );
}
