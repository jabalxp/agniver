'use client'

import { motion } from 'framer-motion'
import { Download, Upload, Trash2, Shield, BellRing, Smartphone, Palette } from 'lucide-react'
import { useBirthdayStore } from '@/store/useBirthdayStore'
import { ViewLayout } from '@/components/views/ViewLayout'

export function SettingsView() {
  const { birthdays, theme, setTheme } = useBirthdayStore()

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(birthdays, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
    const exportFileDefaultName = `aniversarios-backup-${new Date().toISOString().split('T')[0]}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleTestNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('🔔 Lembrete de Teste', {
            body: 'As notificações estão funcionando perfeitamente!',
            icon: '/icon.png'
          })
        } else {
          alert('Permissão para notificações negada.')
        }
      })
    } else {
      alert('Seu navegador não suporta notificações web.')
    }
  }

  return (
    <ViewLayout title="Configurações" subtitle="Personalize sua experiência e gerencie seus dados.">
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Seus Dados</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-foreground/60 text-sm mb-6">
              Todos os seus dados são salvos localmente no seu dispositivo. Você tem controle total.
            </p>
            
            <button 
              onClick={handleExportJSON}
              className="w-full flex items-center justify-between p-4 bg-background border border-border rounded-2xl hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Exportar Backup (JSON)</h3>
                  <p className="text-xs text-foreground/60">Baixe um arquivo com todos os aniversários</p>
                </div>
              </div>
            </button>

            <button className="w-full mt-8 flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-2xl transition-colors font-medium">
              <Trash2 className="w-5 h-5" />
              Apagar Todos os Dados
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <BellRing className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold">Notificações</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-background border border-border rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Notificações Push (PWA)</h3>
                <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <p className="text-xs text-foreground/60">
                Receba alertas no celular ou desktop no dia do aniversário e um dia antes.
              </p>
            </div>

            <button 
              onClick={handleTestNotification}
              className="w-full flex items-center justify-center gap-2 p-4 bg-accent/10 text-accent hover:bg-accent/20 rounded-2xl transition-colors font-medium"
            >
              <Smartphone className="w-5 h-5" />
              Testar Notificação Local
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8 md:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Aparência</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'light', name: 'Branco', icon: '☀️' },
              { id: 'dark', name: 'Escuro', icon: '🌙' },
              { id: 'sakura', name: 'Sakura', icon: '🌸' },
              { id: 'golden', name: 'Dourado', icon: '✨' },
              { id: 'forest', name: 'Floresta', icon: '🌲' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${theme === t.id ? 'border-primary bg-primary/10 shadow-md scale-105' : 'border-border bg-card hover:bg-card/80'}`}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className="font-medium text-sm">{t.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </ViewLayout>
  )
}
