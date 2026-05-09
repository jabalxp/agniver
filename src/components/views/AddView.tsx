'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, AlignLeft, Palette, Save, Phone } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { ViewLayout } from '@/components/views/ViewLayout'

const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export function AddView() {
  const { addBirthday, setActiveView } = useBirthdayStore()
  const [formData, setFormData] = useState({
    name: '', date: '', phone: '', color: PRESET_COLORS[0], notes: ''
  })

  const todayStr = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.date > todayStr) {
      alert('A data de nascimento não pode ser no futuro, General!')
      return
    }
    await addBirthday(formData)
    setActiveView('menu')
  }

  return (
    <ViewLayout title="Adicionar Aniversário" subtitle="Cadastre um novo amigo para nunca mais esquecer.">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 space-y-6 shadow-xl w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Nome Completo
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Celular (WhatsApp)
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Ex: 11999999999"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Data de Nascimento
          </label>
          <input
            required
            type="date"
            max={todayStr}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-primary" /> Ideias de Presente / Notas
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none min-h-[100px] resize-y"
            placeholder="Gosta de livros de ficção, coleciona canecas..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" /> Cor de Identificação
          </label>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-full transition-transform ${formData.color === color ? 'scale-125 ring-2 ring-offset-2 ring-foreground/20' : 'hover:scale-110'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold py-4 rounded-xl transition-all active:scale-[0.98]"
          >
            <Save className="w-5 h-5" />
            Salvar Aniversário
          </button>
        </div>
      </motion.form>
    </ViewLayout>
  )
}
