# 🎯 AGNIVER - ROADMAP UI/UX 2026

**Status:** 📋 Planejamento
**Última atualização:** 31/08/2026
**Ambiente Atual:** Desenvolvimento Frontend (sem Firebase)

---

## ⚠️ NOTA IMPORTANTE

**Tarefas Firebase Adiadas:**
- ❌ Autenticação (Google OAuth)
- ❌ Firestore Sync
- ❌ Cloud Functions
- ❌ Security Rules
- ❌ Data Encryption (backend)

✅ **Foco atual:** Frontend UI/UX + Features de Utilidade + Local Storage Mock

---

## 📊 Análise do Projeto Atual

- **Tech Stack:** React + Vite + Tailwind CSS + Firebase (deferred)
- **Heatmap Location:** `src/components/views/CalendarView.tsx`
- **Estado Atual:** App funcional com 11 views principais
- **Design System:** Tailwind CSS com tema dinâmico (Light, Dark, Sakura, Golden, Forest)
- **Hospedagem:** Vercel + Firebase (deferred)
- **Dados:** localStorage mock (até Firebase ser integrado)

---

## 🎨 FASE 1: MELHORIA DO HEATMAP (PRIORIDADE MÁXIMA)

### ✨ 1.1 - Heatmap Interativo com Modal
**Objetivo:** Ao clicar em um quadrado do heatmap, abrir modal com nomes dos aniversariantes do dia

**Funcionalidades:**
- ✅ Adicionar estado para rastrear clique (dia selecionado)
- ✅ Criar componente Modal reutilizável
- ✅ Implementar lógica: quando clica, filtra `birthdays` e exibe lista
- ✅ Mostrar informações: Nome, Age/Data Exata, Ícone de presente
- ✅ Animação de entrada (fade + scale)
- ✅ Fechar com ESC ou botão X

**Arquivo principal:** `src/components/views/CalendarView.tsx`

**Layout do Modal:**
```
┌────────────────────────────────┐
│  🎂 25 de Dezembro      [×]    │
├────────────────────────────────┤
│                                │
│  👤 João Silva                 │
│  🎉 Faz 30 anos (25/12/1995)   │
│                                │
│  👤 Maria Santos               │
│  🎉 Faz 27 anos (25/12/1998)   │
│                                │
│  ┌──────────────────────────┐  │
│  │ 🎁 Ver ideias de presentes │ │
│  └──────────────────────────┘  │
└────────────────────────────────┘
```

**Componentes a criar:**
- `src/components/Modal.tsx` - Modal base reutilizável
- `src/components/HeatmapModal.tsx` - Modal específica para heatmap

**Estimated Time:** 2-3 horas

---

### 📍 1.2 - Melhorias Visuais do Heatmap

**Color Palette Melhorada:**
```
- 0 aniversários:  #f3f4f6 (50% opacity)   - Cinza claro
- 1 aniversário:   #93c5fd (70% opacity)   - Azul claro
- 2 aniversários:  #3b82f6 (85% opacity)   - Azul médio
- 3+ aniversários: #1d4ed8 (100% opacity)  - Azul escuro
```

**Melhorias:**
- ✅ Aumentar diferença de contraste
- ✅ Adicionar tooltips com data e contagem
- ✅ Hover effect (scale + shadow)
- ✅ Indicador de semana nas laterais

**Estimated Time:** 1 hora

---

## 📱 FASE 2: RESPONSIVIDADE E MOBILE

### 2.1 - Mobile Heatmap Redesign

**Problema Atual:** 365 quadrados em grid é difícil em mobile

**Solução:**
- ✅ Versão por semanas (52 semanas em grid 7x8)
- ✅ Quadrados maiores (touchable areas > 44px)
- ✅ Indicador visual de semana/mês
- ✅ Scroll horizontal com paginação

**Estimated Time:** 2 horas

---

### 2.2 - Dashboard Mobile Optimization

**Melhorias:**
- ✅ Menu inferior em dock (já existe)
- ✅ Filtros colapsáveis
- ✅ Modo de exibição alternativos (Cards vs Tabela)
- ✅ Bottom sheet para adicionar novo aniversário

**Estimated Time:** 1.5 horas

---

## 🎯 FASE 3: FEEDBACK VISUAL E INTERATIVIDADE

### 3.1 - Sistema de Notificações (Toasts)

**Features:**
- ✅ Toast reutilizável com tipos (success, error, warning, info)
- ✅ Auto-dismiss após 3s
- ✅ Stack vertical no canto superior direito
- ✅ Ícones de Lucide React

**Casos de uso:**
- "✅ Aniversário adicionado com sucesso!"
- "❌ Erro ao deletar. Tente novamente."
- "⚠️ Este aniversário já existe na lista"

**Componentes a criar:**
- `src/components/Toast.tsx`
- `src/components/ToastContainer.tsx`
- Context para gerenciar toasts

**Estimated Time:** 1 hora

---

### 3.2 - Confirmação de Deletar

**Features:**
- ✅ Modal de confirmação com mensagem clara
- ✅ Botões "Cancelar" e "Deletar" (com cores distintas)
- ✅ Animação de entrada
- ✅ Mensagem personalizada

**Estimated Time:** 1 hora

---

### 3.3 - Loading States & Skeleton

**Features:**
- ✅ Skeleton loader para listas
- ✅ Spinner para ações assíncronas
- ✅ Placeholder animado

**Componentes a criar:**
- `src/components/SkeletonLoader.tsx`
- `src/components/Spinner.tsx`

**Estimated Time:** 1 hora

---

## 📊 FASE 4: MELHORIAS NO DASHBOARD

### 4.1 - Filtros Avançados

**Features:**
- ✅ Filtro por período (Próximos 30 dias, Este mês, Este trimestre)
- ✅ Filtro por tags/categorias
- ✅ Ordenação (Nome, Data, Proximidade)
- ✅ Busca em tempo real
- ✅ Modo view (Cards, Tabela, Timeline)

**Arquivo:** `src/components/views/DashboardView.tsx`

**Estimated Time:** 2 horas

---

### 4.2 - Empty States

**Features:**
- ✅ Ilustração customizada
- ✅ Mensagem clara e CTA primária
- ✅ Diferentes estados (Vazio, Sem resultados, Erro)

**Componentes a criar:**
- `src/components/EmptyState.tsx`

**Estimated Time:** 1 hora

---

### 4.3 - Painel de Estatísticas

**Novo componente no Dashboard:**
- Total de aniversários
- Próximas 3 datas importantes
- Mês mais movimentado (com mini chart)
- Distribuição por estação do ano

**Cards visuais com:**
- Ícones grandes (Lucide)
- Números destacados
- Tendência (↑ ou ↓)

**Estimated Time:** 2 horas

---

## 🎨 FASE 5: ONBOARDING E ACCESSIBILITY

### 5.1 - First Time User Experience (FTUE)

**Features:**
- ✅ Animação de boas-vindas
- ✅ Tour interativo das 5 main views (5 passos)
- ✅ Tooltips contextuais
- ✅ Checklist de setup inicial
- ✅ Skip button em qualquer momento

**Arquivo:** `src/components/views/OnboardingView.tsx`

**Estimated Time:** 2-3 horas

---

### 5.2 - Melhorias de Acessibilidade

**Features:**
- ✅ Labels ARIA para heatmap
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Focus indicators visíveis
- ✅ Alt text para imagens
- ✅ Contrast ratio mínimo 4.5:1

**Estimated Time:** 1.5 horas

---

### 5.3 - Dark Mode Automático

**Features:**
- ✅ Detectar preferência do SO (`prefers-color-scheme`)
- ✅ Sincronizar com tema selecionado
- ✅ Melhorar contrast em modo escuro

**Estimated Time:** 1 hora

---

## 💾 FASE 6: BIRTHDAY CARD ENHANCEMENTS

### 6.1 - Informações Adicionais

**Arquivo:** `src/components/features/BirthdayCard.tsx`

**Novas features:**
- ✅ Contador "Faltam X dias" até próximo aniversário
- ✅ Botão rápido "💝 Ver presentes"
- ✅ Indicador visual de favorito (⭐)
- ✅ Badge de "Próximo!" se for < 7 dias
- ✅ Avatar do contato (placeholder genérico)

**Estimated Time:** 1.5 horas

---

## 🎬 FASE 7: TRANSIÇÕES E ANIMAÇÕES

### 7.1 - Page Transitions

**Features:**
- ✅ Fade + slide entre views
- ✅ Framer Motion já está implementado
- ✅ Duração: 0.3s

**Estimated Time:** 1 hora

---

### 7.2 - Micro-interactions

**Features:**
- ✅ Botões com hover effect
- ✅ Icons com animação on click
- ✅ Input focus com glow
- ✅ Expand/collapse com smooth animation

**Estimated Time:** 1.5 horas

---

## 🚀 FASE 8: PERSONALIZATION E SETTINGS

### 8.1 - Theme Preview

**Features:**
- ✅ Preview em tempo real de temas
- ✅ Mostrar cards em cada tema antes de aplicar
- ✅ Salvar preferência no Firestore

**Arquivo:** `src/components/views/SettingsView.tsx`

**Estimated Time:** 1 hora

---

### 8.2 - Custom Color Picker (Opcional)

**Features:**
- ✅ Permitir cor customizada para primary
- ✅ Gerar cores derivadas automaticamente
- ✅ Sincronizar CSS variables

**Estimated Time:** 2 horas

---

# 🎁 FASE 10: FEATURE IMPROVEMENTS & UTILIDADE (NOVO)

**Objetivo:** Adicionar funcionalidades práticas que aumentem o valor da app

## 📢 10.1 - Sistema de Lembretes & Notificações

**Problema:** Usuários querem ser lembrando de aniversários

**Features:**
1. **Notificações por Proximidade**
   - [ ] Lembrete 30 dias antes
   - [ ] Lembrete 7 dias antes
   - [ ] Lembrete 1 dia antes
   - [ ] Lembrete no dia (push notification)

2. **Tipos de Notificação**
   - [ ] Browser notification
   - [ ] Email (integrar com SendGrid)
   - [ ] SMS (integrar com Twilio - opcional)
   - [ ] WhatsApp (integrar com Twilio)

3. **Settings de Notificações**
   - [ ] Enable/disable por tipo
   - [ ] Horário preferido
   - [ ] Fuso horário
   - [ ] Tipo de lembrete (discret vs full)

**Componentes:**
- `src/hooks/useReminders.ts`
- `src/utils/notificationScheduler.ts`

**Estimated Time:** 3-4 horas

---

## 📥 10.2 - Import/Export de Contatos

**Problema:** Usuários querem importar aniversários de outras fontes

**Features:**

1. **Import (CSV, JSON, vCard)**
   - CSV: name,birthDate,email,phone
   - JSON: [{name, date, email}]
   - vCard (.vcf) - birthday field
   - Google Contacts export

2. **Export**
   - [ ] Exportar em CSV
   - [ ] Exportar em JSON
   - [ ] Exportar em vCard
   - [ ] Backup completo

3. **Validação de Import**
   - [ ] Detectar duplicatas
   - [ ] Opção: merge ou skip
   - [ ] Validar datas e emails
   - [ ] Preview antes de confirmar

**Componentes:**
- `src/components/ImportDialog.tsx`
- `src/utils/csvParser.ts`
- `src/utils/exporters.ts`

**Estimated Time:** 3-4 horas

---

## 🔍 10.3 - Busca Inteligente & Filtros Avançados

**Features:**

1. **Busca por Nome**
   - [ ] Busca em tempo real (debounce 300ms)
   - [ ] Suporte a acentuação
   - [ ] Fuzzy search (tolera typos)

2. **Filtros Avançados**
   - Data: Próximos 30 dias, este mês, trimestre, ano
   - Idade: 18-30, 30-50, 50+
   - Favoritos: apenas starred
   - Tags: filtrar por categoria
   - Zodíaco: signo do zodíaco
   - Mês: filtrar por mês de nascimento

3. **Salvar Filtros**
   - [ ] Criar filtros personalizados
   - [ ] Nomear e salvar
   - [ ] Quick access buttons

**Componentes:**
- `src/components/AdvancedFilters.tsx`
- `src/utils/searchEngine.ts`

**Estimated Time:** 2-3 horas

---

## 📊 10.4 - Relatórios & Estatísticas

**Features:**

1. **Dashboard de Estatísticas**
   - Total de contatos
   - Próximo aniversário (nome + dias)
   - Mês mais movimentado
   - Distribuição por mês (chart)
   - Distribuição por signo (chart)
   - Aniversariantes este mês
   - Contatos por faixa etária

2. **Gráficos**
   - [ ] Aniversários por mês (bar chart)
   - [ ] Distribuição etária (pie chart)
   - [ ] Comparação de meses (line chart)
   - [ ] Signos do zodíaco (donut chart)

**Libs:**
```
npm install recharts
```

**Estimated Time:** 3-4 horas

---

## 🎁 10.5 - Ideias de Presentes Inteligentes

**Features:**

1. **Sugestões por Categoria**
   - Tecnologia (fones, acessórios)
   - Livros & Educação
   - Esportes & Outdoor
   - Casa & Decoração
   - Beleza & Self-care
   - Experiências (viagens, shows)
   - Comida & Bebida
   - Humor & Gadgets

2. **Wishlist do Contato**
   - [ ] Campo para adicionar wishlist
   - [ ] Itens com preço
   - [ ] Links para comprar
   - [ ] Status: desejado, comprado, entregue

3. **Histórico de Presentes**
   - [ ] Registrar presentes já comprados
   - [ ] Evitar repetição
   - [ ] Sugerir diferentes do histórico

4. **Budget Tracker**
   - [ ] Definir orçamento
   - [ ] Rastrear gastos
   - [ ] Comparar presentes por faixa de preço

**Estimated Time:** 3-4 horas

---

## 👥 10.6 - Compartilhamento de Wishlists

**Objetivo:** Compartilhar wishlists com amigos/família

**Features:**
- [ ] Gerar link compartilhável (público/privado)
- [ ] Wishlist view anônima
- [ ] Marcar como "comprado"
- [ ] Comentários na wishlist
- [ ] QR code para compartilhamento

**Estimated Time:** 2-3 horas

---

## 🎂 10.7 - Comparação de Aniversários (Curiosidades)

**Objetivo:** Gerar insights divertidos sobre aniversários

**Features:**
- [ ] "X pessoas fazem aniversário no mesmo dia que você"
- [ ] "Pessoa mais velha: X com Y anos"
- [ ] "Pessoa mais jovem: X com Y anos"
- [ ] "Signo mais comum: Leão (5 pessoas)"
- [ ] "Mês mais movimentado: Dezembro"

**Estimated Time:** 2-3 horas

---

## ⚡ 10.8 - Modo Offline & PWA

**Objetivo:** App funcione sem internet

**Features:**
- [ ] Configurar como PWA
- [ ] Service Worker para caching
- [ ] Sincronização quando voltar online
- [ ] Indicador de status online/offline
- [ ] Dados persistem em IndexedDB

**Estimated Time:** 2-3 horas

---

## 🔐 10.9 - Backup & Restauração Local

**Objetivo:** Usuários podem fazer backup local sem Firebase

**Features:**
- [ ] Backup automático para localStorage
- [ ] Download de backup em JSON
- [ ] Restauração de backup
- [ ] Sincronização de múltiplos devices

**Estimated Time:** 2 horas

---

## 🏷️ 10.10 - Tags & Categorias de Contatos

**Objetivo:** Organizar contatos por grupos

**Features:**
- [ ] Criar tags (família, amigos, colegas, etc)
- [ ] Atribuir múltiplas tags
- [ ] Filtrar por tag
- [ ] Cores customizadas por tag
- [ ] Estatísticas por tag

**Estimated Time:** 2-3 horas

---

## 📱 10.11 - Timeline de Eventos

**Objetivo:** Visualizar timeline de aniversários próximos

**Features:**
- [ ] Timeline vertical (próximos 90 dias)
- [ ] Cada evento com foto, nome, dias faltando
- [ ] Scroll vertical
- [ ] Destacar "hoje"
- [ ] Filtrar por favoritos/tags

**Estimated Time:** 2-3 horas

---

## 📋 TABELA DE PRIORIZAÇÃO

| ID | Tarefa | Fase | Impacto | Complexidade | Tempo | Prioridade |
|---|--------|------|---------|-------------|-------|-----------|
| 1.1 | Modal do Heatmap | 1 | 🔴 Alto | 🟡 Média | 2-3h | **MÁXIMA** |
| 1.2 | Melhorias visuais Heatmap | 1 | 🟠 Alto | 🟢 Baixa | 1h | **MÁXIMA** |
| 2.1 | Mobile Heatmap | 2 | 🟠 Médio-Alto | 🔴 Alta | 2h | **ALTA** |
| 3.1 | Toast Notifications | 3 | 🟠 Médio | 🟢 Baixa | 1h | **ALTA** |
| 3.2 | Confirmação Delete | 3 | 🟢 Médio | 🟢 Baixa | 1h | **ALTA** |
| 4.1 | Filtros Dashboard | 4 | 🟠 Alto | 🟡 Média | 2h | **ALTA** |
| 10.1 | Lembretes & Notificações | 10 | 🔴 Alto | 🟡 Média | 3-4h | **ALTA** |
| 10.2 | Import/Export | 10 | 🟠 Alto | 🟡 Média | 3-4h | **ALTA** |
| 10.3 | Busca Inteligente | 10 | 🟠 Alto | 🟢 Baixa | 2-3h | **ALTA** |
| 10.4 | Relatórios & Stats | 10 | 🟠 Alto | 🟡 Média | 3-4h | **MÉDIA** |
| 3.3 | Skeleton/Loading | 3 | 🟢 Médio | 🟢 Baixa | 1h | **MÉDIA** |
| 4.2 | Empty States | 4 | 🟢 Médio | 🟢 Baixa | 1h | **MÉDIA** |
| 4.3 | Painel Estatísticas | 4 | 🟢 Médio | 🟡 Média | 2h | **MÉDIA** |
| 5.1 | Onboarding Tour | 5 | 🟢 Médio | 🟡 Média | 2-3h | **MÉDIA** |
| 5.2 | Acessibilidade | 5 | 🟢 Médio | 🟡 Média | 1.5h | **MÉDIA** |
| 10.5 | Ideias de Presentes | 10 | 🟢 Médio | 🟡 Média | 3-4h | **MÉDIA** |
| 10.10 | Tags & Categorias | 10 | 🟢 Médio | 🟢 Baixa | 2-3h | **MÉDIA** |
| 2.2 | Dashboard Mobile | 2 | 🟢 Médio | 🟢 Baixa | 1.5h | **BAIXA** |
| 6.1 | BirthdayCard Enhance | 6 | 🟢 Médio | 🟢 Baixa | 1.5h | **BAIXA** |
| 7.1 | Page Transitions | 7 | 🟢 Baixo | 🟢 Baixa | 1h | **BAIXA** |
| 7.2 | Micro-interactions | 7 | 🟢 Baixo | 🟡 Média | 1.5h | **BAIXA** |
| 5.3 | Dark Mode Auto | 5 | 🟢 Baixo | 🟢 Baixa | 1h | **BAIXA** |
| 8.1 | Theme Preview | 8 | 🟢 Baixo | 🟡 Média | 1h | **BAIXA** |
| 8.2 | Custom Color Picker | 8 | 🟡 Muito Baixo | 🟠 Média-Alta | 2h | **MUITO BAIXA** |

---

## 🎯 PLANO DE IMPLEMENTAÇÃO

### Sprint 1: MVP com Heatmap Modal (1 semana)
1. ✅ Modal do Heatmap (1.1)
2. ✅ Melhorias visuais Heatmap (1.2)
3. ✅ Toast Notifications (3.1)
4. ✅ Confirmação Delete (3.2)

**Output:** Heatmap totalmente funcional e interativo

---

### Sprint 2: Mobile & Dashboard (1-2 semanas)
1. ✅ Mobile Heatmap (2.1)
2. ✅ Filtros Dashboard (4.1)
3. ✅ Loading States (3.3)
4. ✅ Empty States (4.2)

**Output:** App responsivo em mobile com filtros avançados

---

### Sprint 3: Polish & Onboarding (1 semana)
1. ✅ Onboarding Tour (5.1)
2. ✅ Acessibilidade (5.2)
3. ✅ Painel Estatísticas (4.3)
4. ✅ BirthdayCard Enhancements (6.1)

**Output:** App completo com boa experiência para novos usuários

---

### Sprint 4: Final Polish (3-4 dias)
1. ✅ Page Transitions (7.1)
2. ✅ Micro-interactions (7.2)
3. ✅ Theme Preview (8.1)
4. ✅ Testes finais e bug fixes

**Output:** App polido e pronto para produção

---

## 📐 COMPONENTES A CRIAR/REFATORAR

### ✨ Novos Componentes

```
src/components/
├── Modal.tsx                    # Base modal reutilizável
├── HeatmapModal.tsx            # Modal para heatmap
├── Toast.tsx                   # Toast notification
├── ToastContainer.tsx          # Container de toasts
├── SkeletonLoader.tsx          # Loading skeleton
├── Spinner.tsx                 # Loading spinner
├── EmptyState.tsx              # Empty state component
├── ConfirmDialog.tsx           # Delete confirmation
└── Heatmap/
    ├── HeatmapGrid.tsx         # Grid do heatmap
    └── HeatmapLegend.tsx       # Legenda cores
```

### 🔄 Refatorar Componentes

```
src/components/views/
├── CalendarView.tsx            # Adicionar modal e melhorias
├── DashboardView.tsx           # Adicionar filtros e stats
└── OnboardingView.tsx          # Melhorar tour

src/components/features/
└── BirthdayCard.tsx            # Adicionar info extras

src/components/views/
└── SettingsView.tsx            # Theme preview
```

---

## 🔑 Design Principles

1. **Progressive Disclosure** - Ocultar opções avançadas por padrão
2. **Feedback Imediato** - Toda ação visual feedback
3. **Acessibilidade Primeiro** - WCAG 2.1 AA minimum
4. **Mobile First** - Responsive desde o início
5. **Performance** - Animações suaves (60fps)
6. **Consistência** - Design system coerente

---

## 📝 Notas de Implementação

### Dependências Já Instaladas
- ✅ React 19.2.5
- ✅ Framer Motion (Animações)
- ✅ Tailwind CSS 4.2.4
- ✅ Lucide React 1.11.0 (Ícones)

### Libs Opcionais (Considerar)
- `react-hot-toast` - Alternativa para toasts (leve, bem-testado)
- `sonner` - Modern toast library
- `react-aria` - Acessibilidade avançada
- `zustand` - Já usando para state (useBirthdayStore)

### Estrutura de Estado

```typescript
// Heatmap Modal State
interface HeatmapState {
  selectedDate: Date | null;
  isModalOpen: boolean;
  birthdaysOnDate: Birthday[];
}

// Toast State
interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: 'success' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

// Dashboard Filters
interface FilterState {
  period: 'all' | '30days' | 'month' | 'quarter';
  tags: string[];
  sortBy: 'name' | 'date' | 'proximity';
  viewMode: 'cards' | 'table' | 'timeline';
}
```

---

## ✅ Critérios de Aceitação por Fase

### Fase 1 ✓
- [ ] Heatmap responde a cliques
- [ ] Modal abre com informações corretas
- [ ] Animações suaves
- [ ] Responsivo em mobile
- [ ] Cores bem contrastadas

### Fase 2 ✓
- [ ] Grid adaptável para mobile
- [ ] Touchable areas > 44px
- [ ] Scroll funcionando

### Fase 3 ✓
- [ ] Toasts aparecem e desaparecem
- [ ] Confirmação de delete funciona
- [ ] Loading states visíveis

### Fase 4 ✓
- [ ] Filtros funcionando
- [ ] Empty states adequados
- [ ] Estatísticas atualizando

### Fase 5 ✓
- [ ] Tour executando
- [ ] Dark mode sincronizando
- [ ] Keyboard navigation funcionando

---

---

# 🔐 PHASE 9: CYBERSECURITY & SEGURANÇA (CRÍTICO)

## 🚨 ANÁLISE DE VULNERABILIDADES ATUAIS

### Riscos Identificados

```
NÍVEL CRÍTICO (🔴 Alto Risco)
├── ✗ Dados de usuários armazenados em Firebase sem criptografia client-side
├── ✗ Senhas do Google OAuth podem estar expostas em tokens
├── ✗ Sem rate limiting em APIs/Firestore
├── ✗ Sem validação rigorosa de entrada
└── ✗ Sem logging/auditoria de ações sensíveis

NÍVEL ALTO (🟠 Médio Risco)
├── ✗ Sem proteção contra CSRF/XSS
├── ✗ CORS não configurado adequadamente
├── ✗ Local storage pode ser acessado via XSS
├── ✗ Sem criptografia de dados sensíveis
└── ✗ Firestore rules podem estar permissivas

NÍVEL MÉDIO (🟡 Risco Moderado)
├── ✗ Sem proteção de brute force em login
├── ✗ Sem MFA (Multi-Factor Authentication)
├── ✗ Sem verificação de integridade de dados
└── ✗ Sem encrypt de dados em repouso
```

### Dados Sensíveis no App

```
1. Autenticação
   - Google OAuth Tokens (access_token, refresh_token, id_token)
   - User IDs
   - Email do usuário

2. Dados Pessoais (PII)
   - Nomes de contatos
   - Datas de nascimento (potencial para DoB attacks)
   - Informações de favoritos

3. Sessão
   - Tokens de session
   - Preferences do usuário
```

---

## 🛡️ FASE 9.1: AUTENTICAÇÃO & AUTORIZAÇÃO SEGURA

### 9.1.1 - Implementar Token Security

**Objetivo:** Proteger tokens de autenticação contra XSS e vazamento

**Implementações:**

1. **HTTP-Only Cookies** (melhor que localStorage)
   ```typescript
   // Frontend: Remover tokens de localStorage
   // Backend: Setar cookies com flags de segurança
   Set-Cookie: access_token=xyz; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
   ```

2. **Refresh Token Rotation**
   ```typescript
   - Access Token: 15 minutos (curta validade)
   - Refresh Token: 7 dias (armazenado em HttpOnly cookie)
   - Token revocation em logout
   ```

3. **Token Validation Flow**
   ```
   Client → Request com access_token
   Backend → Verifica assinatura (JWT)
   Backend → Valida expiração
   Backend → Checa revogação (blacklist)
   ```

**Firestore Regras:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Apenas o usuário autenticado pode ver seu documento
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      
      // Dados sensíveis não podem ser atualizados via client
      allow update: if !("tokens" in request.resource.data);
    }
    
    match /birthdays/{birthdayId} {
      allow read: if request.auth.uid == resource.data.ownerId;
      allow write: if request.auth.uid == resource.data.ownerId;
      allow delete: if request.auth.uid == resource.data.ownerId;
    }
  }
}
```

**Estimated Time:** 2-3 horas

---

### 9.1.2 - Implementar MFA (Multi-Factor Authentication)

**Opções:**
1. **TOTP (Time-based One-Time Password)** - Google Authenticator
   ```typescript
   npm install speakeasy qrcode
   ```
   
2. **Email Verification**
   ```typescript
   - Enviar código de 6 dígitos por email
   - Válido por 10 minutos
   - Max 3 tentativas
   ```

3. **SMS (Opcional com Firebase)**
   ```typescript
   // Firebase já suporta SMS MFA
   // enableMultiFactorUser()
   ```

**Estimated Time:** 2-3 horas

---

### 9.1.3 - Session Management & CSRF Protection

**Implementação:**
- ✅ CSRF Tokens em formulários
- ✅ SameSite cookies
- ✅ Token rotation a cada mudança sensível
- ✅ Logout em múltiplos dispositivos

**Estimated Time:** 1-2 horas

---

## 🔒 FASE 9.2: CRIPTOGRAFIA DE DADOS

### 9.2.1 - Criptografia em Trânsito (Transport Layer)

**Status Atual:** ✓ HTTPS já ativado (Vercel)

**Verificações:**
```
✅ HTTPS enforced
✅ TLS 1.3+
✅ HSTS headers configurados
  → max-age=63072000 (2 anos)
  → includeSubDomains
  → preload
✅ Certificate pinning (opcional)
```

**Headers de Segurança (implementar):**
```typescript
// Adicionar em next.config.ts ou headers do servidor
{
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
}
```

**Estimated Time:** 1-2 horas

---

### 9.2.2 - Criptografia em Repouso (Data at Rest)

**Dados Sensíveis a Proteger:**
```
1. Tokens em Firestore
2. Email do usuário
3. Data de nascimento (PII)
4. Nomes de contatos (menos crítico)
```

**Estratégia de Criptografia:**

#### Opção 1: End-to-End Encryption (Recomendado)
```typescript
import { encryptAES256, decryptAES256 } from '@/lib/crypto';

// Encriptar antes de enviar ao Firestore
const encryptedBirthday = {
  ...birthday,
  name: await encryptAES256(birthday.name, userMasterKey),
  date: await encryptAES256(birthday.date, userMasterKey)
};

await firestore.collection('birthdays').add(encryptedBirthday);
```

**Algoritmo:** AES-256-GCM
- **Vantagem:** Dados criptografados mesmo no Firebase
- **Desvantagem:** Impossível fazer queries no Firestore
- **Solução:** Usar índices criptografados para buscas

#### Opção 2: Field-Level Encryption (Firestore)
```typescript
// Google Cloud cliente pode fazer encryption
import { Firestore, FieldEncryption } from '@firebase/firestore-encryption';

const db = new Firestore({
  encryption: new FieldEncryption({
    fields: ['name', 'email', 'birthDate'],
    key: userMasterKey
  })
});
```

**Libs para Criptografia:**
```typescript
npm install crypto-js tweetnacl libsodium.js
// ou
npm install tweetnacl-js // Melhor (moderna)
```

**Derivação de Chave Master:**
```typescript
import { scrypt } from '@noble/hashes/scrypt';

// Derivar chave a partir da senha do usuário
const masterKey = await scrypt(
  userPassword,
  saltFromFirebase, // Salva no Firestore
  { N: 2**14, r: 8, p: 1, dkLen: 32 } // OWASP recommended
);

// Usar para todas operações de criptografia
```

**Estimated Time:** 3-4 horas

---

### 9.2.3 - Hashing de Senhas

**Implementação (Backend/Cloud Functions):**
```typescript
import * as argon2 from 'argon2';

// Quando usuário muda senha
const hash = await argon2.hash(newPassword, {
  type: argon2.argon2id,
  memoryCost: 65540, // 64 MB
  timeCost: 3,
  parallelism: 4
});

// Armazenar no Firestore (nunca no localStorage)
```

**Nunca:**
- ✗ Armazenar senhas em plain text
- ✗ Usar MD5 ou SHA1
- ✗ Enviar senhas em URLs

**Estimated Time:** 1 hora

---

## 🛡️ FASE 9.3: VALIDAÇÃO & SANITIZAÇÃO

### 9.3.1 - Input Validation (Client + Server)

**Validar:**
```typescript
// Frontend (defensive)
interface BirthdayInput {
  name: string;        // Max 100 chars, sem caracteres especiais perigosos
  email: string;       // Email válido (RFC 5322)
  birthDate: string;   // Formato YYYY-MM-DD, no passado
  phone?: string;      // Apenas números e +
  notes?: string;      // Max 500 chars
}

// Backend (autoritário)
const schema = yup.object().shape({
  name: yup.string().required().max(100).matches(/^[a-zA-Z\s\-']+$/),
  email: yup.string().email().required(),
  birthDate: yup.date().required().max(new Date()),
  phone: yup.string().optional().matches(/^\+?[0-9\s\-()]+$/)
});
```

**Libs:**
```
npm install yup zod  // Schema validation
npm install dompurify  // Sanitize HTML
npm install validator  // String validation
```

**Estimated Time:** 2 horas

---

### 9.3.2 - XSS (Cross-Site Scripting) Prevention

**Vulnerabilidade:** Injetar scripts via campos de texto
```html
<!-- Ataque -->
<input value="'; alert('XSS'); //
```

**Proteções:**
1. **Content Security Policy (CSP)**
   ```typescript
   // Headers (já mencionado acima)
   'Content-Security-Policy': "default-src 'self'; script-src 'self'"
   ```

2. **Sanitize User Input**
   ```typescript
   import DOMPurify from 'dompurify';
   
   const cleanedName = DOMPurify.sanitize(userInput.name);
   ```

3. **Encode Output**
   ```typescript
   // React já faz por padrão
   // Mas cuidado com dangerouslySetInnerHTML
   <div>{userData.name}</div> // ✓ Safe
   <div dangerouslySetInnerHTML={{__html: userData.name}} /> // ✗ Unsafe
   ```

**Estimated Time:** 1 hora

---

### 9.3.3 - SQL Injection & NoSQL Injection Prevention

**No Firestore:**
```typescript
// ✓ Safe - Firestore sanitiza
const birthdays = await firestore
  .collection('birthdays')
  .where('name', '==', userName) // Parametrizado
  .get();

// ✗ Unsafe - JavaScript eval (nunca fazer)
const birthdays = eval(`query with ${userInput}`);
```

**Estimated Time:** 0.5 horas (apenas awareness)

---

## 🚨 FASE 9.4: PROTEÇÃO CONTRA ATAQUES COMUNS

### 9.4.1 - Rate Limiting & DDoS Protection

**Implementar:**
```typescript
npm install express-rate-limit redis

// Cloud Functions com rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requisições
  message: 'Muitas requisições, tente novamente mais tarde',
  standardHeaders: true, // Retorna RateLimit headers
  legacyHeaders: false
});

app.use('/api/', limiter);
```

**Regras específicas:**
- Login: 5 tentativas / 15 minutos
- Add Birthday: 10 / hora
- Delete Birthday: 5 / hora
- Email verification: 3 / 10 minutos

**Estimated Time:** 2 horas

---

### 9.4.2 - Brute Force Protection

**Estratégia:**
```typescript
// Após 5 tentativas falhas de login
const failedAttempts = await getUserFailedAttempts(userId);

if (failedAttempts >= 5) {
  // Lock account por 15 minutos
  await lockAccount(userId, 900000); // ms
  
  // Enviar email de alerta
  await sendSecurityAlert(userEmail, {
    message: 'Tentativas suspeitas de login detectadas',
    action: 'Clique aqui para desbloquear sua conta'
  });
}
```

**Estimated Time:** 1.5 horas

---

### 9.4.3 - CSRF (Cross-Site Request Forgery) Protection

**Implementação:**
```typescript
npm install csrf express-session

// Gerar token CSRF
const csrfToken = csrf.create(secret);

// Incluir em formulário
<form method="POST">
  <input type="hidden" name="_csrf" value={csrfToken} />
</form>

// Validar no backend
app.post('/api/birthday', (req, res) => {
  if (!csrf.verify(secret, req.body._csrf)) {
    return res.status(403).json({ error: 'CSRF token inválido' });
  }
  // Processar...
});
```

**Estimated Time:** 1.5 horas

---

### 9.4.4 - Clickjacking Protection

**Headers:**
```typescript
'X-Frame-Options': 'DENY', // Não permite iframe
'Content-Security-Policy': "frame-ancestors 'none'"
```

**Estimated Time:** 0.5 horas

---

## 📊 FASE 9.5: LOGGING, AUDITORIA & MONITORAMENTO

### 9.5.1 - Security Event Logging

**Eventos a registrar:**
```typescript
interface SecurityLog {
  timestamp: Date;
  eventType: 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'DATA_ACCESS' | 'DATA_MODIFY' | 'DATA_DELETE';
  userId: string;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'FAILURE';
  details: object;
}

// Exemplos
{
  eventType: 'LOGIN',
  timestamp: new Date(),
  userId: 'user123',
  ipAddress: '192.168.1.1',
  status: 'SUCCESS'
}

{
  eventType: 'FAILED_LOGIN',
  timestamp: new Date(),
  userId: 'user123',
  ipAddress: '192.168.1.1',
  status: 'FAILURE',
  details: { reason: 'password_incorrect', attempts: 3 }
}
```

**Armazenar em Firestore:**
```typescript
await firestore.collection('audit_logs').add(log);
```

**Estimated Time:** 2 horas

---

### 9.5.2 - Anomaly Detection

**Alertas automáticos:**
- 🔴 10+ tentativas de login falhadas
- 🔴 Acesso de múltiplos países em < 1 hora
- 🟠 Bulk delete de dados
- 🟠 Alteração de email de recuperação

**Implementação:**
```typescript
// Cloud Functions com análise
export const detectAnomalies = functions.firestore
  .document('audit_logs/{logId}')
  .onCreate(async (snap) => {
    const log = snap.data();
    
    // Verificar múltiplas localizações
    const recentLogins = await getRecentLogins(log.userId, 60 * 60 * 1000);
    const uniqueCountries = new Set(recentLogins.map(l => l.country));
    
    if (uniqueCountries.size > 2) {
      // Alertar usuário
      await sendSecurityAlert(log.userId, {
        title: 'Atividade suspeita detectada',
        message: 'Sua conta foi acessada de múltiplas localizações'
      });
    }
  });
```

**Estimated Time:** 3 horas

---

### 9.5.3 - Integração com Ferramentas de Monitoring

**Ferramentas:**
```
- Google Cloud Security Command Center
- Sentry (Error tracking + Security)
- LogRocket (Session replay + security insights)
```

**Implementação (Sentry):**
```typescript
npm install @sentry/react @sentry/tracing

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  integrations: [new Sentry.Replay({ maskAllText: true })]
});

// Capturar erros sensíveis
Sentry.captureException(error, {
  tags: { security: 'high' }
});
```

**Estimated Time:** 2 horas

---

## 📋 FASE 9.6: COMPLIANCE & PRIVACIDADE

### 9.6.1 - GDPR Compliance

**Requisitos:**
- ✅ Direito à portabilidade (export dados em JSON)
- ✅ Direito de esquecimento (deletar todos dados)
- ✅ Consentimento explícito para cookies/tracking
- ✅ Política de privacidade clara
- ✅ Data Processing Agreement (DPA)

**Implementação:**
```typescript
// 1. Adicionar Privacy Policy
// /src/pages/privacy.tsx

// 2. Export dados do usuário
const exportUserData = async (userId: string) => {
  const userDoc = await firestore.collection('users').doc(userId).get();
  const birthdays = await firestore.collection('birthdays')
    .where('ownerId', '==', userId)
    .get();
  
  return {
    user: userDoc.data(),
    birthdays: birthdays.docs.map(d => d.data())
  };
};

// 3. Deletar all user data (right to be forgotten)
const deleteUserAllData = async (userId: string) => {
  // Deletar documento do usuário
  await firestore.collection('users').doc(userId).delete();
  
  // Deletar todos aniversários
  const snapshots = await firestore.collection('birthdays')
    .where('ownerId', '==', userId)
    .get();
  
  for (const doc of snapshots.docs) {
    await doc.ref.delete();
  }
  
  // Deletar logs de auditoria
  await firestore.collection('audit_logs')
    .where('userId', '==', userId)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => doc.ref.delete());
    });
};
```

**Estimated Time:** 2-3 horas

---

### 9.6.2 - LGPD Compliance (Brasil)

**Requisitos específicos:**
- ✅ Aviso de coleta de dados (banner)
- ✅ Consentimento de 18+ (ou responsável)
- ✅ Direito de portabilidade
- ✅ Direito de acesso
- ✅ Direito de correção
- ✅ Right to erasure

**Implementação:**
```typescript
// Adicionar cookie banner
<CookieConsent
  location="bottom"
  buttonText="Aceitar"
  text="Usamos cookies para melhorar sua experiência"
  onAccept={() => {
    localStorage.setItem('cookieConsent', 'accepted');
    trackEvent('cookie_accepted');
  }}
/>
```

**Estimated Time:** 1-2 horas

---

### 9.6.3 - Data Retention Policy

**Política sugerida:**
```
Active User Data:
  - Dados pessoais: Manter enquanto usuário ativo
  - Audit logs: 1 ano
  - Backups: 30 dias
  - Deleted accounts: Purge imediato

Inactive User (> 2 anos):
  - Enviar email de aviso
  - Deletar após 30 dias de inatividade
  - Antes: Dar opção de "ativar" conta

Compliance:
  - GDPR: Máximo 3 anos
  - LGPD: Máximo 3 anos
```

**Estimated Time:** 1 hora

---

## 🔧 FASE 9.7: FERRAMENTAS & LIBS DE SEGURANÇA

### Dependências a Instalar

```bash
# Criptografia
npm install tweetnacl-js crypto-js argon2

# Validação
npm install yup zod validator

# Sanitização
npm install dompurify

# Rate Limiting
npm install express-rate-limit

# CSRF Protection
npm install csrf

# Monitoring
npm install @sentry/react @sentry/tracing

# Security Headers
npm install helmet

# Auditoria
npm install winston  # Logging

# Firebase Security
npm install @firebase/app @firebase/auth @firebase/firestore
```

**Estimated Time (instalação):** 0.5 horas

---

## 🎯 TABELA DE PRIORIZAÇÃO - SEGURANÇA

| ID | Tarefa | Impacto | Complexidade | Tempo | Prioridade |
|----|--------|---------|-------------|-------|-----------|
| 9.1.1 | HTTP-Only Cookies & Token Security | 🔴 Crítico | 🟡 Média | 2-3h | **CRÍTICA** |
| 9.3.1 | Input Validation | 🔴 Crítico | 🟢 Baixa | 2h | **CRÍTICA** |
| 9.2.2 | Criptografia End-to-End | 🔴 Crítico | 🔴 Alta | 3-4h | **CRÍTICA** |
| 9.4.1 | Rate Limiting | 🔴 Crítico | 🟡 Média | 2h | **CRÍTICA** |
| 9.2.1 | Security Headers | 🟠 Alto | 🟢 Baixa | 1-2h | **ALTA** |
| 9.4.2 | Brute Force Protection | 🟠 Alto | 🟢 Baixa | 1.5h | **ALTA** |
| 9.5.1 | Security Logging | 🟠 Alto | 🟡 Média | 2h | **ALTA** |
| 9.3.2 | XSS Prevention | 🟠 Alto | 🟢 Baixa | 1h | **ALTA** |
| 9.1.2 | MFA Implementation | 🟠 Alto | 🟡 Média | 2-3h | **MÉDIA** |
| 9.4.3 | CSRF Protection | 🟡 Médio | 🟡 Média | 1.5h | **MÉDIA** |
| 9.6.1 | GDPR Compliance | 🟡 Médio | 🟡 Média | 2-3h | **MÉDIA** |
| 9.6.2 | LGPD Compliance | 🟡 Médio | 🟡 Média | 1-2h | **MÉDIA** |
| 9.5.2 | Anomaly Detection | 🟡 Médio | 🔴 Alta | 3h | **BAIXA** |
| 9.5.3 | Monitoring Integration | 🟡 Médio | 🟡 Média | 2h | **BAIXA** |
| 9.2.3 | Password Hashing | 🟢 Baixo | 🟢 Baixa | 1h | **BAIXA** |
| 9.4.4 | Clickjacking Protection | 🟡 Médio | 🟢 Muito Baixa | 0.5h | **MUITO BAIXA** |
| 9.6.3 | Data Retention Policy | 🟢 Baixo | 🟢 Baixa | 1h | **MUITO BAIXA** |

---

## 🛡️ PLANO DE IMPLEMENTAÇÃO - SEGURANÇA

### Sprint Segurança 1: Foundation (1-2 semanas)
**Implementar camada base de segurança**

1. ✅ **9.1.1** - HTTP-Only Cookies & Token Security (2-3h)
2. ✅ **9.2.1** - Security Headers (1-2h)
3. ✅ **9.3.1** - Input Validation (2h)
4. ✅ **9.4.1** - Rate Limiting (2h)

**Total:** ~8-9 horas
**Output:** App protegido contra ataques básicos

---

### Sprint Segurança 2: Encryption & Protection (2 semanas)
**Criptografia e proteção de dados**

1. ✅ **9.2.2** - Criptografia End-to-End (3-4h)
2. ✅ **9.3.2** - XSS Prevention (1h)
3. ✅ **9.4.2** - Brute Force Protection (1.5h)
4. ✅ **9.4.3** - CSRF Protection (1.5h)

**Total:** ~7.5-8 horas
**Output:** Dados criptografados e protegidos

---

### Sprint Segurança 3: Monitoring & Compliance (2 semanas)
**Auditoria, compliance e monitoramento**

1. ✅ **9.5.1** - Security Logging (2h)
2. ✅ **9.6.1** - GDPR Compliance (2-3h)
3. ✅ **9.6.2** - LGPD Compliance (1-2h)
4. ✅ **9.5.3** - Monitoring Integration (2h)

**Total:** ~7-9 horas
**Output:** App auditada e compliant

---

### Sprint Segurança 4: Advanced Features (2 semanas)
**Features avançadas de segurança**

1. ✅ **9.1.2** - MFA Implementation (2-3h)
2. ✅ **9.5.2** - Anomaly Detection (3h)
3. ✅ Testes de penetração
4. ✅ Security audit final

**Total:** ~8-9 horas
**Output:** App enterprise-ready

---

## ⚠️ VULNERABILIDADES OWASP TOP 10

**Como Agniver é protegido (ou será):**

```
1. ✗ Injection
   → Firestore parametriza queries
   → Input validation em todos campos

2. ✗ Broken Authentication
   → OAuth Google (já robusto)
   → Será: HTTP-Only cookies + token rotation

3. ✗ Sensitive Data Exposure
   → HTTPS (já habilitado)
   → Será: Criptografia end-to-end

4. ✗ XML External Entities (XXE)
   → Não aplicável (React não processa XML)

5. ✗ Broken Access Control
   → Firestore rules (será: melhor configuração)
   → User ID validation em todas requisições

6. ✗ Security Misconfiguration
   → Será: Security headers implementados
   → CORS configurado restritamente

7. ✗ XSS (Cross-Site Scripting)
   → React sanitiza por padrão
   → Será: DOMPurify integrado

8. ✗ Insecure Deserialization
   → Não aplicável (usando JSON)

9. ✗ Using Components with Known Vulnerabilities
   → Será: npm audit regular
   → Dependabot habilitado

10. ✗ Insufficient Logging & Monitoring
    → Será: Sentry + Custom audit logs
```

---

## 🔍 CHECKLIST DE SEGURANÇA PRÉ-PRODUÇÃO

```
Autenticação & Autorização:
- [ ] Google OAuth corretamente integrado
- [ ] Tokens com expiração configurada
- [ ] HTTP-Only cookies implementados
- [ ] Refresh token rotation ativado
- [ ] Logout limpa todos tokens

Criptografia:
- [ ] HTTPS forçado
- [ ] Security headers configurados
- [ ] Dados sensíveis criptografados (E2E)
- [ ] Senhas hashadas com Argon2
- [ ] Chaves armazenadas seguramente

Validação & Sanitização:
- [ ] Input validation em todos campos
- [ ] Output encoding
- [ ] XSS prevention ativado
- [ ] CSRF tokens funcionando
- [ ] Rate limiting ativado

Firestore:
- [ ] Rules restritivas (deny by default)
- [ ] Índices de segurança
- [ ] Backup habilitado
- [ ] Audit logging ativado

Monitoramento:
- [ ] Sentry ou similar ativado
- [ ] Security logs em Firestore
- [ ] Anomaly detection configurado
- [ ] Alertas para atividades suspeitas

Compliance:
- [ ] GDPR: Privacidade + export/delete
- [ ] LGPD: Consentimento + retenção
- [ ] Cookie banner ativado
- [ ] Política de privacidade disponível

Infrastructure:
- [ ] DDoS protection (Cloudflare/Vercel)
- [ ] WAF (Web Application Firewall)
- [ ] Backup e disaster recovery
- [ ] Logs centrados e imutáveis

Testes:
- [ ] Penetration testing realizado
- [ ] Security audit passado
- [ ] SAST (Static analysis) executado
- [ ] Dependencies auditadas (npm audit)
```

---

## 🚀 Próximas Ações

**Pronto para iniciar implementação?**

**⚠️ IMPORTANTE:** Todas tarefas que requerem Firebase/Backend estão marcadas como **DEFERRED** - serão implementadas em computador mais seguro.

---

## 📅 PLANO RECOMENDADO (Sem Firebase Por Enquanto)

### Sprint 1: Core Features - Heatmap & Utilidade (1-2 semanas)

**UI/UX Essencial:**
1. **1.1** - Modal do Heatmap (~2-3h) ⭐ PRIORIDADE
2. **1.2** - Melhorias visuais Heatmap (~1h)
3. **3.1** - Toast Notifications (~1h)

**Utilidade Alta:**
4. **10.1** - Lembretes & Notificações (Browser only) (~3-4h)
5. **10.2** - Import/Export CSV/JSON (~3-4h)

**Total:** ~10-14 horas

---

### Sprint 2: Melhorias Dashboard & Search (1-2 semanas)

**UI/UX:**
1. **2.1** - Mobile Heatmap (~2h)
2. **3.2** - Confirmação Delete (~1h)
3. **3.3** - Skeleton/Loading (~1h)

**Utilidade:**
4. **10.3** - Busca Inteligente & Filtros (~2-3h)
5. **10.10** - Tags & Categorias (~2-3h)

**Total:** ~8-10 horas

---

### Sprint 3: Analytics & Dados (1-2 semanas)

**Features de Utilidade:**
1. **10.4** - Relatórios & Estatísticas (~3-4h)
2. **10.7** - Curiosidades de Aniversários (~2-3h)
3. **10.11** - Timeline de Eventos (~2-3h)

**UI/UX Polish:**
4. **4.2** - Empty States (~1h)
5. **4.3** - Painel Estatísticas (~2h)

**Total:** ~10-13 horas

---

### Sprint 4: Presentes & Compartilhamento (2 semanas)

**Utilidade:**
1. **10.5** - Ideias de Presentes (~3-4h)
2. **10.6** - Compartilhamento Wishlists (~2-3h)

**UI/UX:**
3. **4.1** - Filtros Dashboard (~2h)
4. **5.1** - Onboarding Tour (~2-3h)

**Total:** ~9-12 horas

---

### Sprint 5: Offline & Backup (1-2 semanas)

**Utilidade:**
1. **10.8** - Modo Offline & PWA (~2-3h)
2. **10.9** - Backup & Restauração Local (~2h)

**UI/UX:**
3. **2.2** - Dashboard Mobile (~1.5h)
4. **5.3** - Dark Mode Automático (~1h)

**Total:** ~6.5-7.5 horas

---

### Sprint 6: Polish & Refinement (1 semana)

**UI/UX Polish:**
1. **6.1** - BirthdayCard Enhancements (~1.5h)
2. **7.1** - Page Transitions (~1h)
3. **7.2** - Micro-interactions (~1.5h)
4. **8.1** - Theme Preview (~1h)
5. **5.2** - Acessibilidade (~1.5h)

**Testes & Ajustes:**
6. Testes gerais
7. Bug fixes
8. Performance optimization

**Total:** ~8 horas + testes

---

## 🔐 FASE 9: SEGURANÇA (DEFERRED - Quando Firebase)

```
⏸️  ADIADO (implementar em computador seguro com Firebase):

├── 9.1.1 - HTTP-Only Cookies & Token Security
├── 9.1.2 - MFA Implementation
├── 9.2.2 - Criptografia End-to-End
├── 9.3.1 - Input Validation (backend)
├── 9.4.1 - Rate Limiting
├── 9.5.1 - Security Logging
├── 9.6.1 + 9.6.2 - GDPR + LGPD (backend)
└── 9.5.2 - Anomaly Detection

Nota: Validação de entrada frontend será feita (não adiada)
```

---

## 🎯 RESUMO DO ROADMAP REVISADO

| Fase | Foco | Status | Tempo Total |
|------|------|--------|------------|
| Sprint 1 | Heatmap Modal + Notificações | ✅ Ativa | 10-14h |
| Sprint 2 | Mobile + Search | ✅ Ativa | 8-10h |
| Sprint 3 | Analytics & Timeline | ✅ Ativa | 10-13h |
| Sprint 4 | Presentes & UX | ✅ Ativa | 9-12h |
| Sprint 5 | Offline & Backup | ✅ Ativa | 6.5-7.5h |
| Sprint 6 | Polish & Refinement | ✅ Ativa | 8h + testes |
| **Phase 9** | **Segurança** | **⏸️ Deferred** | **~45h (depois)** |

**Total UI/UX + Utilidade:** ~52-64 horas
**Total Segurança:** ~45 horas (depois)

---

## 💡 Como Usar Local Storage (Mock Backend)

Para não mexer com Firebase por enquanto, usar localStorage:

```typescript
// src/lib/localStorageMock.ts
export const birthdayService = {
  getAll: () => {
    const data = localStorage.getItem('birthdays');
    return data ? JSON.parse(data) : [];
  },
  
  add: (birthday: Birthday) => {
    const all = birthdayService.getAll();
    all.push({ ...birthday, id: Date.now().toString() });
    localStorage.setItem('birthdays', JSON.stringify(all));
    return birthday;
  },
  
  update: (id: string, birthday: Birthday) => {
    const all = birthdayService.getAll();
    const index = all.findIndex(b => b.id === id);
    if (index !== -1) {
      all[index] = { ...birthday, id };
      localStorage.setItem('birthdays', JSON.stringify(all));
    }
  },
  
  delete: (id: string) => {
    const all = birthdayService.getAll();
    const filtered = all.filter(b => b.id !== id);
    localStorage.setItem('birthdays', JSON.stringify(filtered));
  }
};
```

**Migração depois:**
Quando Firebase for integrado, basta trocar as chamadas para Firestore.

---

## ✅ O que PODE ser feito agora (Sem Firebase)

```
✅ Componentes React
✅ UI/UX improvements
✅ Animações (Framer Motion)
✅ Temas & Estilos (Tailwind)
✅ Lógica de estado (Zustand + localStorage)
✅ Busca & Filtros (cliente-side)
✅ Import/Export (client-side)
✅ Relatórios (dados locais)
✅ PWA & Service Worker
✅ Notificações do navegador
✅ Backup local (JSON export)
✅ Temas customizados
✅ Acessibilidade
✅ Responsive design
✅ Performance optimization
```

---

## ❌ O que fica ADIADO (Firebase)

```
❌ Autenticação Google OAuth
❌ Sincronização em nuvem (Firestore)
❌ Criptografia de dados (backend)
❌ Backup automático
❌ Compartilhamento de wishlists (requer backend)
❌ Notificações por email (requer backend)
❌ Integração Google Calendar (requer backend)
❌ SMS/WhatsApp (Twilio - requer backend)
❌ Security logging (backend)
❌ Anomaly detection (backend)
❌ GDPR/LGPD compliance (backend features)
```

---

## 🎯 Próximas Ações IMEDIATAS

**Semana 1 - Core Features:**

1. ✅ Implementar **Modal do Heatmap** (1.1)
   - Arquivo: `src/components/HeatmapModal.tsx`
   - Adicionar estado `selectedDate` em CalendarView
   - Filtrar birthdays do dia clicado

2. ✅ Implementar **Toast Notifications** (3.1)
   - Arquivo: `src/components/Toast.tsx`
   - Context para gerenciar toasts

3. ✅ Implementar **Lembretes (Browser)** (10.1 - parte)
   - Usar Web Notifications API
   - localStorage para preferences

4. ✅ Implementar **Import/Export CSV** (10.2)
   - Parser CSV
   - Exportar em JSON
   - Preview antes de import

**Quer que eu comece a implementar agora?** 🚀

Qual feature você prefere começar?
- 🎂 Modal do Heatmap
- 📢 Toast Notifications
- 📥 Import/Export
- 🔔 Lembretes
