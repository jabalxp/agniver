'use client'

import { motion } from 'framer-motion'
import { FileText, GitCommit, CheckCircle2 } from 'lucide-react'
import { ViewLayout } from '@/components/views/ViewLayout'

export function ChangelogView() {
  return (
    <ViewLayout title="Changelog" subtitle="Acompanhe as últimas atualizações do sistema.">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/40 backdrop-blur-sm border border-border rounded-3xl p-6 md:p-8"
      >
        <div className="space-y-8">

          {/* v3.0.0 */}
          <div className="relative pl-8 border-l-2 border-primary/30">
            <div className="absolute -left-[11px] top-1 w-5 h-5 bg-primary rounded-full border-4 border-background flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">v3.0.0</span>
              <span className="text-sm text-foreground/60">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2">A Era da Nuvem (Firebase)</h3>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-primary/50 mt-0.5" /> <strong>Banco de Dados Real:</strong> Integração com Cloud Firestore. Seus dados agora estão seguros na nuvem e vinculados à sua conta.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-primary/50 mt-0.5" /> <strong>Sistema de Contas:</strong> Autenticação via Google e Email/Senha para proteger suas informações.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-primary/50 mt-0.5" /> <strong>Perfil do Usuário:</strong> Nova interface de perfil no menu com foto, nome resumido e botão de LogOut.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-primary/50 mt-0.5" /> <strong>Sincronização Atômica:</strong> Edições e adições são refletidas instantaneamente em todos os seus dispositivos.</li>
            </ul>
          </div>

          {/* v2.1.2 */}
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v2.1.2</span>
              <span className="text-sm text-foreground/40">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Cards Inteligentes e Visibilidade</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Conteúdo Expandido:</strong> Cards agora exibem diretamente o número de telefone e um snippet das notas/ideias de presente.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Layout Imponente:</strong> Cards redimensionados verticalmente com distribuição equilibrada de informações (Space-Between).</li>
            </ul>
          </div>
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v2.1.1</span>
              <span className="text-sm text-foreground/40">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Gestão Completa e Integração</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Campo de Celular:</strong> Adicionada a possibilidade de cadastrar o número de telefone (WhatsApp) dos contatos.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Edição de Contatos:</strong> Novo sistema de edição que permite alterar qualquer informação de um aniversário já cadastrado.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>WhatsApp Inteligente:</strong> O botão de WhatsApp agora identifica automaticamente o número cadastrado para abrir a conversa direta.</li>
            </ul>
          </div>

          {/* v2.1.0 */}
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v2.1.0</span>
              <span className="text-sm text-foreground/40">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Evolução de Contatos e Navegação</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Favoritos (VIP):</strong> Marque contatos importantes com uma estrela para que fiquem no topo da lista.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Barra de Progresso:</strong> Visualize o caminho percorrido até o próximo aniversário de cada amigo.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Integração WhatsApp:</strong> Envie parabéns instantâneos com mensagens geradas aleatoriamente.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Segurança de Dados:</strong> Bloqueio automático de registros com datas de nascimento futuras.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> <strong>Navegação SPA:</strong> Suporte completo ao botão "Voltar" do navegador e celular.</li>
            </ul>
          </div>

          {/* v2.0.2 */}
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v2.0.2</span>
              <span className="text-sm text-foreground/40">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Ajuste de Interface (UI)</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Ajuste nos Cartões de Contatos (mais finos e justos, evitando cortes de texto em nomes grandes).</li>
            </ul>
          </div>

          {/* v2.0.1 */}
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v2.0.1</span>
              <span className="text-sm text-foreground/40">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Personalização de Estilo</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Adicionados novos temas interativos (Branco, Escuro, Sakura, Dourado e Floresta) na página de Configurações.</li>
            </ul>
          </div>

          {/* v2.0.0 */}
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v2.0.0</span>
              <span className="text-sm text-foreground/40">Hoje</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">A Grande Refatoração (Next.js)</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Migração completa para Next.js App Router.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Implementação da nova arquitetura SPA (Single Page Application).</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Novo gerenciador de estado ultra-rápido (Zustand).</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Visões de Calendário avançadas: Bento Grid e Heatmap Anual.</li>
            </ul>
          </div>

          {/* v1.0.0 */}
          <div className="relative pl-8 border-l-2 border-border">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v1.0.0</span>
              <span className="text-sm text-foreground/40">Versão Original</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Lançamento Inicial</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Sistema base em HTML, CSS e JS.</li>
              <li className="flex items-start gap-2"><GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" /> Agendamento e listagem de aniversários com persistência local.</li>
            </ul>
          </div>

          {/* v0.0.1 */}
          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 bg-border rounded-full border-4 border-background" />
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-bold text-foreground/60 px-3 py-1 bg-foreground/5 rounded-full">v0.0.1</span>
              <span className="text-sm text-foreground/40">O Começo</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground/70">Uma Nova Changelog</h3>
            <ul className="space-y-2 text-foreground/60">
              <li className="flex items-start gap-2">
                <GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" />
                A changelog antiga foi substituída, pois agora o site está respirando &quot;Novos ares&quot;.
              </li>
              <li className="flex items-start gap-2">
                <GitCommit className="w-5 h-5 shrink-0 text-foreground/30 mt-0.5" />
                Recomeço dos registros de atualizações do sistema.
              </li>
            </ul>
          </div>

        </div>
      </motion.div>
    </ViewLayout>
  )
}
