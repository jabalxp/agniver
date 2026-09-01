'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Gift, SearchX, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type?: 'no-birthdays' | 'no-search-results' | 'no-gifts' | 'custom';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function EmptyState({
  type = 'no-birthdays',
  title,
  description,
  actionText,
  onAction,
  icon,
}: EmptyStateProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'no-search-results':
        return {
          title: 'Nenhum resultado encontrado',
          description: 'Tente buscar com outro nome, tag ou verifique se há erros de digitação.',
          icon: <SearchX className="w-10 h-10 text-primary" />,
          actionText: 'Limpar Filtros',
        };
      case 'no-gifts':
        return {
          title: 'Nenhuma ideia anotada ainda',
          description: 'Adicione sugestões e anotações para surpreender seus amigos no dia certo.',
          icon: <Gift className="w-10 h-10 text-primary" />,
          actionText: 'Adicionar Ideia',
        };
      case 'no-birthdays':
      default:
        return {
          title: 'Sua lista está vazia',
          description: 'Cadastre os aniversários dos seus amigos e familiares para nunca mais esquecer!',
          icon: <Sparkles className="w-10 h-10 text-primary" />,
          actionText: 'Adicionar Primeiro Aniversário',
        };
    }
  };

  const defaults = getDefaultContent();
  const finalTitle = title || defaults.title;
  const finalDescription = description || defaults.description;
  const finalActionText = actionText || defaults.actionText;
  const finalIcon = icon || defaults.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-border/80 rounded-[2.5rem] bg-card/30 backdrop-blur-sm my-6"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-5 border border-primary/20 shadow-inner">
        {finalIcon}
      </div>

      <h3 className="text-2xl font-extrabold text-foreground mb-2">{finalTitle}</h3>
      <p className="text-foreground/60 max-w-md text-sm mb-8 leading-relaxed">
        {finalDescription}
      </p>

      {onAction && finalActionText && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          {finalActionText}
        </button>
      )}
    </motion.div>
  );
}

