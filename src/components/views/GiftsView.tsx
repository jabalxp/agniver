'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Sparkles,
  ShoppingBag,
  BookOpen,
  Headphones,
  Compass,
  Home as HomeIcon,
  Smile,
  Tag,
} from 'lucide-react';
import { useBirthdayStore, WishlistItem } from '@/store/useBirthdayStore';
import { ViewLayout } from '@/components/views/ViewLayout';
import { toast } from '@/store/useToastStore';
import { EmptyState } from '@/components/EmptyState';

const GIFT_SUGGESTIONS = [
  {
    category: 'Tecnologia & Gadgets',
    icon: Headphones,
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
    items: [
      { title: 'Fones Bluetooth TWS', price: 180 },
      { title: 'Power Bank Rápido 10000mAh', price: 120 },
      { title: 'Lâmpada Inteligente RGB Wi-Fi', price: 75 },
      { title: 'Suporte Articulado para Celular/Tablet', price: 50 },
    ],
  },
  {
    category: 'Livros & Experiências',
    icon: BookOpen,
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    items: [
      { title: 'Livro Bestseller / Ficção', price: 65 },
      { title: 'Assinatura Kindle / Audible', price: 90 },
      { title: 'Ingresso para Show / Teatro', price: 150 },
      { title: 'Café Especial em Grãos Gourmet', price: 55 },
    ],
  },
  {
    category: 'Casa, Decoração & Bem-Estar',
    icon: HomeIcon,
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    items: [
      { title: 'Caneca Térmica Inox', price: 85 },
      { title: 'Vela Aromática com Óleos Essenciais', price: 60 },
      { title: 'Difusor de Aromas Ultrassônico', price: 110 },
      { title: 'Planta Suculenta / Vaso Decorativo', price: 45 },
    ],
  },
  {
    category: 'Momentos & Diversão',
    icon: Compass,
    color: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    items: [
      { title: 'Jogo de Tabuleiro Moderno', price: 140 },
      { title: 'Jantar ou Vale Restaurante', price: 200 },
      { title: 'Kit Drinks & Coqueteleira', price: 130 },
      { title: 'Camiseta Personalizada Temática', price: 70 },
    ],
  },
];

export function GiftsView() {
  const { birthdays, addWishlistItem, updateWishlistItem, removeWishlistItem, updateBirthday, setActiveView } =
    useBirthdayStore();

  const [selectedId, setSelectedId] = useState<string | null>(birthdays[0]?.id || null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');

  const selectedBirthday = birthdays.find((b) => b.id === selectedId);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !newItemTitle.trim()) return;

    const priceNum = newItemPrice ? parseFloat(newItemPrice.replace(',', '.')) : undefined;

    await addWishlistItem(selectedId, {
      title: newItemTitle.trim(),
      price: priceNum,
      url: newItemUrl.trim() || undefined,
      status: 'wished',
    });

    toast.success(`"${newItemTitle}" adicionado à lista de ${selectedBirthday?.name}! 🎁`);
    setNewItemTitle('');
    setNewItemPrice('');
    setNewItemUrl('');
  };

  const handleQuickAdd = async (item: { title: string; price: number }) => {
    if (!selectedId) return;

    await addWishlistItem(selectedId, {
      title: item.title,
      price: item.price,
      status: 'wished',
    });

    toast.success(`"${item.title}" sugerido para ${selectedBirthday?.name}! ✨`);
  };

  const handleToggleStatus = async (item: WishlistItem) => {
    if (!selectedId) return;
    const nextStatus: WishlistItem['status'] =
      item.status === 'wished' ? 'purchased' : item.status === 'purchased' ? 'delivered' : 'wished';

    await updateWishlistItem(selectedId, item.id, { status: nextStatus });
  };

  const calculateBudget = () => {
    if (!selectedBirthday || !selectedBirthday.wishlist) return { total: 0, purchased: 0 };
    const total = selectedBirthday.wishlist.reduce((acc, curr) => acc + (curr.price || 0), 0);
    const purchased = selectedBirthday.wishlist
      .filter((i) => i.status !== 'wished')
      .reduce((acc, curr) => acc + (curr.price || 0), 0);
    return { total, purchased };
  };

  const budget = calculateBudget();

  if (birthdays.length === 0) {
    return (
      <ViewLayout
        title="Mural de Presentes"
        subtitle="Gerencie listas de desejos e ideias inteligentes de presentes."
      >
        <EmptyState
          type="no-gifts"
          title="Nenhum amigo cadastrado"
          description="Cadastre seus amigos para começar a planejar e anotar presentes perfeitos."
          actionText="Cadastrar Amigo"
          onAction={() => setActiveView('add')}
        />
      </ViewLayout>
    );
  }

  return (
    <ViewLayout
      title="Mural de Presentes & Wishlist"
      subtitle="Anote desejos, rastreie compras e encontre sugestões inteligentes."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Friend Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground/50">Selecione o Amigo</h3>
            <span className="text-xs font-semibold text-primary">{birthdays.length} contatos</span>
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {birthdays.map((b) => {
              const itemCount = (b.wishlist || []).length;
              const isSelected = selectedId === b.id;

              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between border text-left ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary shadow-sm ring-1 ring-primary/40'
                      : 'bg-card/40 border-border/70 hover:bg-card/70 text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0"
                      style={{ backgroundColor: b.color || 'var(--color-primary)' }}
                    >
                      {b.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-sm truncate">{b.name}</p>
                      <p className="text-[11px] text-foreground/50">
                        {itemCount === 0 ? 'Nenhum item na lista' : `${itemCount} presente(s) anotado(s)`}
                      </p>
                    </div>
                  </div>

                  {itemCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/20 text-primary shrink-0">
                      {itemCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Friend Wishlist & Suggestions */}
        <div className="lg:col-span-8 space-y-6">
          {selectedBirthday ? (
            <div className="space-y-6">
              {/* Header Card for Selected Friend */}
              <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 text-2xl"
                      style={{ backgroundColor: selectedBirthday.color || 'var(--color-primary)' }}
                    >
                      🎁
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-foreground">{selectedBirthday.name}</h2>
                      <p className="text-xs text-foreground/60 mt-0.5">
                        Gerencie a lista de presentes e o orçamento estimado.
                      </p>
                    </div>
                  </div>

                  {/* Budget Counter */}
                  <div className="bg-foreground/5 border border-border/60 rounded-2xl px-5 py-3 text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-foreground/50 block">Orçamento Estimado</span>
                    <span className="text-xl font-extrabold text-foreground">
                      R$ {budget.total.toFixed(2)}
                    </span>
                    {budget.purchased > 0 && (
                      <span className="text-[11px] text-emerald-500 block font-semibold">
                        ✓ R$ {budget.purchased.toFixed(2)} já comprado
                      </span>
                    )}
                  </div>
                </div>

                {/* Free Notes Area */}
                <div className="mt-6 pt-4 border-t border-border/40">
                  <label className="text-xs font-bold text-foreground/70 uppercase mb-2 block flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-primary" /> Anotações Livres de Gostos e Dicas:
                  </label>
                  <textarea
                    value={selectedBirthday.notes || ''}
                    onChange={(e) => updateBirthday(selectedBirthday.id, { notes: e.target.value })}
                    placeholder="Ex: Não gosta de chocolate branco; Tamanho de camiseta: M; Ama café e livros de história."
                    className="w-full p-3.5 bg-background/50 border border-border rounded-2xl text-xs font-medium focus:ring-2 focus:ring-primary/50 outline-none resize-y min-h-[60px]"
                  />
                </div>
              </div>

              {/* Add New Wishlist Item Form */}
              <form
                onSubmit={handleAddItem}
                className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Adicionar Item à Wishlist
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nome do presente (ex: Fone de Ouvido JBL)"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    className="sm:col-span-6 px-4 py-2.5 bg-background/50 border border-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/50"
                  />

                  <input
                    type="text"
                    placeholder="Preço (R$)"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="sm:col-span-3 px-4 py-2.5 bg-background/50 border border-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/50"
                  />

                  <input
                    type="url"
                    placeholder="Link da loja (opcional)"
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    className="sm:col-span-3 px-4 py-2.5 bg-background/50 border border-border rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Salvar Presente
                  </button>
                </div>
              </form>

              {/* Wishlist Items List */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-foreground/80 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary" /> Lista de Desejos ({selectedBirthday.wishlist?.length || 0})
                </h3>

                {(!selectedBirthday.wishlist || selectedBirthday.wishlist.length === 0) ? (
                  <div className="p-8 border-2 border-dashed border-border/70 rounded-3xl text-center text-xs text-foreground/50">
                    Nenhum item na lista ainda. Use o formulário acima ou as sugestões abaixo para adicionar!
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedBirthday.wishlist.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          item.status === 'purchased'
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : item.status === 'delivered'
                            ? 'bg-purple-500/10 border-purple-500/30 line-through opacity-75'
                            : 'bg-card/50 border-border/70'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleStatus(item)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              item.status === 'purchased'
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                                : item.status === 'delivered'
                                ? 'bg-purple-500 text-white border-purple-600 shadow-sm'
                                : 'border-border bg-foreground/5 text-foreground/30 hover:border-primary'
                            }`}
                            title="Alterar status (Desejado -> Comprado -> Entregue)"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>

                          <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground truncate">{item.title}</p>
                            <div className="flex items-center gap-2 text-xs text-foreground/60 mt-0.5">
                              {item.price && <span className="font-semibold">R$ {item.price.toFixed(2)}</span>}
                              {item.price && <span>•</span>}
                              <span className="capitalize font-medium">
                                {item.status === 'wished'
                                  ? 'Desejado 💭'
                                  : item.status === 'purchased'
                                  ? 'Comprado 🛍️'
                                  : 'Entregue 🎁'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-foreground/50 hover:text-primary rounded-xl hover:bg-foreground/5 transition-colors"
                              title="Abrir link do produto"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => removeWishlistItem(selectedBirthday.id, item.id)}
                            className="p-2 text-foreground/40 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
                            title="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Categorized Gift Suggestions Catalog */}
              <div className="space-y-4 pt-6 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Sugestões Rápidas de Presentes
                  </h3>
                  <span className="text-xs text-foreground/50">Clique em + para adicionar à lista</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {GIFT_SUGGESTIONS.map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <div
                        key={cat.category}
                        className="bg-card/40 border border-border rounded-3xl p-5 space-y-3"
                      >
                        <div className="flex items-center gap-2 font-bold text-xs">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${cat.color}`}>
                            <CatIcon className="w-4 h-4" />
                          </div>
                          <span className="text-foreground">{cat.category}</span>
                        </div>

                        <div className="space-y-2">
                          {cat.items.map((it) => (
                            <div
                              key={it.title}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-background/50 border border-border/40 text-xs hover:border-primary/50 transition-all"
                            >
                              <div className="min-w-0 pr-2">
                                <p className="font-semibold text-foreground truncate">{it.title}</p>
                                <p className="text-[11px] text-foreground/50">~R$ {it.price.toFixed(2)}</p>
                              </div>
                              <button
                                onClick={() => handleQuickAdd(it)}
                                className="p-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-all active:scale-95 shrink-0"
                                title="Adicionar à Wishlist"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ViewLayout>
  );
}
