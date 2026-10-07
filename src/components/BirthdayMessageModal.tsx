'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MessageCircle,
  Copy,
  Check,
  Share2,
  Sparkles,
  Heart,
  Smile,
  Briefcase,
  Zap,
  Star,
  Plus,
  Trash2,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Birthday, useBirthdayStore, CustomMessageTemplate } from '@/store/useBirthdayStore';
import { calculateBirthdayStats } from '@/utils/dateUtils';
import { toast } from '@/store/useToastStore';

interface BirthdayMessageModalProps {
  birthday: Birthday | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BirthdayMessageModal({ birthday, isOpen, onClose }: BirthdayMessageModalProps) {
  const { customTemplates, addCustomTemplate, removeCustomTemplate, toggleFavoriteTemplate } = useBirthdayStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('carinhoso');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('t-carinhoso');
  const [useNickname, setUseNickname] = useState<boolean>(true);
  const [includeAge, setIncludeAge] = useState<boolean>(true);
  const [includeInterests, setIncludeInterests] = useState<boolean>(true);
  const [includeMemories, setIncludeMemories] = useState<boolean>(true);

  const [messageText, setMessageText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSavingNewTemplate, setIsSavingNewTemplate] = useState<boolean>(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState<string>('');

  const stats = birthday ? calculateBirthdayStats(birthday.date) : null;

  // Função para montar a mensagem com base no template e nas opções selecionadas
  const buildMessage = (templateContent: string, b: Birthday, s: ReturnType<typeof calculateBirthdayStats>): string => {
    const displayName = (useNickname && b.nickname?.trim()) ? b.nickname.trim() : b.name.split(' ')[0];
    let text = templateContent;

    text = text.replace(/\{nome\}/g, displayName);
    text = text.replace(/\{idade\}/g, includeAge ? `${s.age}` : '');

    // Se o usuário selecionou incluir interesses e houver cadastrado
    if (includeInterests && b.interests && b.interests.length > 0) {
      const interestsStr = b.interests.slice(0, 3).join(', ');
      text += ` Que este ano venha repleto de muito(a) ${interestsStr}!`;
    }

    // Se o usuário selecionou incluir lembrança compartilhada
    if (includeMemories && b.memories && b.memories.trim()) {
      text += ` Jamais vou esquecer de quando ${b.memories.trim()}. Boas lembranças!`;
    }

    return text.trim();
  };

  // Atualizar o texto sempre que mudar template, aniversário ou opções
  useEffect(() => {
    if (!birthday || !stats) return;

    const currentTemplate = customTemplates.find((t) => t.id === selectedTemplateId) || customTemplates[0];
    if (currentTemplate) {
      const generated = buildMessage(currentTemplate.content, birthday, stats);
      setMessageText(generated);
    }
  }, [birthday, selectedTemplateId, useNickname, includeAge, includeInterests, includeMemories, customTemplates]);

  if (!isOpen || !birthday || !stats) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      toast.success('Mensagem copiada para a área de transferência! 📋');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Erro ao copiar texto.');
    }
  };

  const handleWhatsApp = () => {
    const phoneDigits = birthday.phone ? birthday.phone.replace(/\D/g, '') : '';
    const encoded = encodeURIComponent(messageText);
    const url = phoneDigits
      ? `https://wa.me/${phoneDigits}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
    toast.success('Abrindo WhatsApp com a sua mensagem pronta!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Parabéns ${birthday.name}!`,
          text: messageText,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleSaveAsTemplate = () => {
    if (!newTemplateTitle.trim() || !messageText.trim()) {
      toast.error('Preencha um título para salvar seu modelo.');
      return;
    }

    addCustomTemplate({
      title: newTemplateTitle.trim(),
      category: 'custom',
      content: messageText,
      isFavorite: true,
    });

    toast.success('Novo modelo personalizado salvo com sucesso! ⭐');
    setIsSavingNewTemplate(false);
    setNewTemplateTitle('');
  };

  const CATEGORIES = [
    { id: 'carinhoso', label: 'Carinhoso', icon: Heart, color: 'text-rose-500 bg-rose-500/10' },
    { id: 'divertido', label: 'Divertido', icon: Smile, color: 'text-amber-500 bg-amber-500/10' },
    { id: 'formal', label: 'Formal', icon: Briefcase, color: 'text-blue-500 bg-blue-500/10' },
    { id: 'curto', label: 'Curto', icon: Zap, color: 'text-emerald-500 bg-emerald-500/10' },
    { id: 'emocionante', label: 'Emocionante', icon: Sparkles, color: 'text-purple-500 bg-purple-500/10' },
    { id: 'custom', label: 'Meus Modelos', icon: Star, color: 'text-yellow-500 bg-yellow-500/10' },
  ];

  const visibleTemplates = customTemplates.filter((t) =>
    selectedCategory === 'custom' ? true : t.category === selectedCategory
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-foreground flex items-center gap-2">
                  Preparar Mensagem de Parabéns
                </h3>
                <p className="text-xs text-foreground/50">
                  Para {birthday.name} • Completando {stats.age} anos ({stats.formattedDate})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-foreground/40 hover:text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Painel de Contexto do Contato */}
            <div className="bg-foreground/5 border border-border/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Contexto Privado do Amigo
                </span>
                <span className="text-[10px] text-foreground/40">
                  Apenas você vê estes detalhes
                </span>
              </div>

              {/* Informações disponíveis para incluir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {birthday.nickname && (
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-background/50 border border-border/40 cursor-pointer hover:bg-background/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={useNickname}
                      onChange={(e) => setUseNickname(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-foreground/80 font-medium truncate">
                      Usar apelido: <strong>"{birthday.nickname}"</strong>
                    </span>
                  </label>
                )}

                <label className="flex items-center gap-2 p-2 rounded-xl bg-background/50 border border-border/40 cursor-pointer hover:bg-background/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={includeAge}
                    onChange={(e) => setIncludeAge(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-4 h-4"
                  />
                  <span className="text-foreground/80 font-medium">
                    Mencionar idade: <strong>{stats.age} anos</strong>
                  </span>
                </label>

                {birthday.interests && birthday.interests.length > 0 && (
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-background/50 border border-border/40 cursor-pointer hover:bg-background/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeInterests}
                      onChange={(e) => setIncludeInterests(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-foreground/80 font-medium truncate">
                      Interesses: <strong>{birthday.interests.slice(0, 2).join(', ')}</strong>
                    </span>
                  </label>
                )}

                {birthday.memories && (
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-background/50 border border-border/40 cursor-pointer hover:bg-background/80 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeMemories}
                      onChange={(e) => setIncludeMemories(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-foreground/80 font-medium truncate">
                      Mencionar lembrança compartilhada
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Categorias de Tom / Estilo */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                Escolha o Tom da Mensagem
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const isSelected = selectedCategory === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c.id);
                        const firstMatching = customTemplates.find((t) => c.id === 'custom' || t.category === c.id);
                        if (firstMatching) {
                          setSelectedTemplateId(firstMatching.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/70'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lista de Modelos Disponíveis no Tom Selecionado */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider">
                  Modelos Sugeridos
                </span>
                <button
                  type="button"
                  onClick={() => setIsSavingNewTemplate(!isSavingNewTemplate)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Salvar modelo atual
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {visibleTemplates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-border/60 bg-card/60 hover:bg-foreground/5'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-bold text-foreground truncate">
                            {tpl.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-foreground/60 line-clamp-2 leading-relaxed">
                          {tpl.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteTemplate(tpl.id);
                          }}
                          className="p-1 text-foreground/30 hover:text-amber-500 transition-colors"
                          title="Favoritar"
                        >
                          <Star className={`w-3.5 h-3.5 ${tpl.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                        {tpl.category === 'custom' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomTemplate(tpl.id);
                              toast.info('Modelo removido.');
                            }}
                            className="p-1 text-foreground/30 hover:text-rose-500 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulário para salvar novo modelo */}
            {isSavingNewTemplate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 bg-background/60 border border-primary/30 rounded-2xl space-y-2"
              >
                <label className="text-xs font-bold text-foreground/80">Título do seu modelo:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTemplateTitle}
                    onChange={(e) => setNewTemplateTitle(e.target.value)}
                    placeholder="Ex: Mensagem carinhosa de família..."
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={handleSaveAsTemplate}
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:opacity-90"
                  >
                    Salvar
                  </button>
                </div>
              </motion.div>
            )}

            {/* Editor de Texto do Rascunho */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> Rascunho da Mensagem (Edite à vontade)
                </label>
                <span className="text-[11px] text-foreground/40 font-medium">
                  {messageText.length} caracteres
                </span>
              </div>

              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full p-4 bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/40 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed outline-none transition-all resize-y min-h-[110px]"
                placeholder="Escreva sua mensagem personalizada aqui..."
              />
            </div>

            {/* Garantia de Privacidade e Transparência */}
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Envio sob o seu controle total:</strong> O Agniver nunca dispara mensagens automáticas. Você sempre revisa e confirma o envio manualmente.
              </span>
            </div>
          </div>

          {/* Rodapé com Ações de Envio */}
          <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-border text-foreground/70 hover:bg-foreground/5 font-bold text-xs transition-colors"
            >
              Fechar
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-4 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground font-bold text-xs transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado!' : 'Copiar Texto'}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground font-bold text-xs transition-all flex items-center gap-1.5"
                title="Compartilhar por outros apps"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>

              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Abrir no WhatsApp
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
