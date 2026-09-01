'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Gift,
  LayoutGrid,
  Table as TableIcon,
  Clock,
  Star,
  Sparkles,
  ArrowUpDown,
  Upload,
  X,
  Phone,
  Edit2,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import { useBirthdayStore, Birthday } from '@/store/useBirthdayStore';
import { BirthdayCard } from '@/components/features/BirthdayCard';
import { ViewLayout } from '@/components/views/ViewLayout';
import { EmptyState } from '@/components/EmptyState';
import { calculateBirthdayStats, formatDateExtended } from '@/utils/dateUtils';
import { searchBirthdays } from '@/utils/searchEngine';
import { ImportExportModal } from '@/components/ImportExportModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from '@/store/useToastStore';

export function DashboardView() {
  const { birthdays, setActiveView, setEditingId, removeBirthday, toggleFavorite } = useBirthdayStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState<'all' | '30days' | 'month' | 'quarter'>('all');
  const [sortBy, setSortBy] = useState<'proximity' | 'name' | 'date' | 'age'>('proximity');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Birthday | null>(null);

  // Coletar tags existentes
  const allTags = Array.from(new Set(birthdays.flatMap((b) => b.tags || [])));

  // 1. Filtrar por busca (nome, notas, fone, tags)
  let filtered = searchBirthdays(birthdays, searchQuery);

  // 2. Filtrar por período
  if (period !== 'all') {
    filtered = filtered.filter((b) => {
      const stats = calculateBirthdayStats(b.date);
      if (period === '30days') return stats.daysLeft <= 30;
      if (period === 'month') {
        const bMonth = parseInt(b.date.split('-')[1], 10) - 1;
        return bMonth === new Date().getMonth();
      }
      if (period === 'quarter') return stats.daysLeft <= 90;
      return true;
    });
  }

  // 3. Filtrar por tag
  if (selectedTag) {
    filtered = filtered.filter((b) => (b.tags || []).includes(selectedTag));
  }

  // 4. Ordenar
  const sorted = [...filtered].sort((a, b) => {
    // Favoritos sempre no topo se for por proximidade
    if (sortBy === 'proximity') {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      const statA = calculateBirthdayStats(a.date);
      const statB = calculateBirthdayStats(b.date);
      return statA.daysLeft - statB.daysLeft;
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'date') {
      return a.date.substring(5).localeCompare(b.date.substring(5));
    }
    if (sortBy === 'age') {
      const statA = calculateBirthdayStats(a.date);
      const statB = calculateBirthdayStats(b.date);
      return statB.age - statA.age;
    }
    return 0;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await removeBirthday(deleteTarget.id);
      toast.success(`${deleteTarget.name} foi removido com sucesso.`);
    } catch (err: any) {
      toast.error('Erro ao excluir: ' + err.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleWhatsApp = (b: Birthday) => {
    const { age } = calculateBirthdayStats(b.date);
    const msg = `Parabéns pelos seus ${age} anos, ${b.name}! 🎉 Desejo muitas felicidades!`;
    const phoneStr = b.phone ? b.phone.replace(/\D/g, '') : '';
    const url = phoneStr
      ? `https://wa.me/${phoneStr}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <ViewLayout
      title="Meus Contatos"
      subtitle={`Gerenciando ${birthdays.length} aniversariantes cadastrados.`}
    >
      {/* Action Header & Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Buscar por amigo, tag, notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-card/50 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all placeholder:text-foreground/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Buttons: Import/Export and Add New */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsImportExportOpen(true)}
              className="px-4 py-3.5 bg-card/50 border border-border rounded-2xl hover:bg-card text-foreground/70 hover:text-foreground text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
              title="Importar ou exportar contatos"
            >
              <Upload className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Backup / Importar</span>
            </button>

            <button
              onClick={() => setActiveView('add')}
              className="px-5 py-3.5 bg-primary text-primary-foreground rounded-2xl hover:opacity-90 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md shadow-primary/20 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Aniversário</span>
            </button>
          </div>
        </div>

        {/* Filters and View Mode Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Period Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'Todos' },
              { id: '30days', label: 'Próximos 30 dias' },
              { id: 'month', label: 'Este Mês' },
              { id: 'quarter', label: 'Trimestre' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  period === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-card/40 border border-border/60 text-foreground/60 hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 bg-card/40 border border-border px-3 py-1.5 rounded-xl">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent outline-none cursor-pointer font-bold"
              >
                <option value="proximity" className="bg-card text-foreground">Proximidade</option>
                <option value="name" className="bg-card text-foreground">Nome (A-Z)</option>
                <option value="date" className="bg-card text-foreground">Data (Mês/Dia)</option>
                <option value="age" className="bg-card text-foreground">Maior Idade</option>
              </select>
            </div>

            {/* View Mode Toggle (Cards vs Table) */}
            <div className="flex bg-card/60 border border-border p-1 rounded-xl">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'cards' ? 'bg-primary text-white shadow-sm' : 'text-foreground/40 hover:text-foreground'
                }`}
                title="Modo Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table' ? 'bg-primary text-white shadow-sm' : 'text-foreground/40 hover:text-foreground'
                }`}
                title="Modo Tabela"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tag Filters Row */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-xs text-foreground/40 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Tags:
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg transition-all border ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card/40 border-border/60 text-foreground/60 hover:text-foreground'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {sorted.length === 0 ? (
        <EmptyState
          type={searchQuery || period !== 'all' || selectedTag ? 'no-search-results' : 'no-birthdays'}
          onAction={() => {
            if (searchQuery || period !== 'all' || selectedTag) {
              setSearchQuery('');
              setPeriod('all');
              setSelectedTag(null);
            } else {
              setActiveView('add');
            }
          }}
        />
      ) : viewMode === 'cards' ? (
        /* Cards View */
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
          <AnimatePresence mode="popLayout">
            {sorted.map((birthday) => (
              <motion.div
                key={birthday.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              >
                <BirthdayCard birthday={birthday} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Table View */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-md border border-border rounded-3xl overflow-hidden shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-card border-b border-border text-foreground/70 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Amigo</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Idade</th>
                  <th className="p-4">Próximo em</th>
                  <th className="p-4">Celular</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {sorted.map((b) => {
                  const { daysLeft, age, isToday, formattedDate, zodiac } = calculateBirthdayStats(b.date);

                  return (
                    <tr key={b.id} className="hover:bg-foreground/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm shrink-0"
                            style={{ backgroundColor: b.color || 'var(--color-primary)' }}
                          >
                            {b.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">{b.name}</span>
                              {b.isFavorite && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                            </div>
                            <span className="text-[11px] text-foreground/50">
                              {zodiac.symbol} {zodiac.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-medium text-foreground/80">{formattedDate}</td>

                      <td className="p-4 font-bold text-foreground">{age} anos</td>

                      <td className="p-4">
                        {isToday ? (
                          <span className="px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-extrabold text-[11px] animate-pulse">
                            É Hoje! 🎉
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-foreground/70">
                            {daysLeft} dias
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-foreground/60 text-xs">
                        {b.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-primary/70" /> {b.phone}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleWhatsApp(b)}
                            className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-sm"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setEditingId(b.id);
                              setActiveView('edit');
                            }}
                            className="p-2 text-foreground/50 hover:text-primary rounded-xl hover:bg-primary/10 transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setDeleteTarget(b)}
                            className="p-2 text-foreground/50 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Aniversário"
        message={`Deseja realmente remover ${deleteTarget?.name}?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </ViewLayout>
  );
}
