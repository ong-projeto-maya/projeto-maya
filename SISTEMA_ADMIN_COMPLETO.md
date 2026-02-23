# 🔧 Sistema Admin Completo - Documentação

## 📋 Visão Geral

O **Sistema Admin** permite gerenciar completamente os animais para adoção e os eventos do Projeto Maya através de uma interface intuitiva e funcional.

---

## ✅ Funcionalidades Implementadas

### 1. **Dashboard Principal** (`/admin`)
**Métricas Visíveis:**
- 📊 Animais Resgatados
- 💚 Adoções Realizadas  
- 👥 Voluntários Ativos
- 💰 Doações do Mês (com meta)

**Abas:**
- Visão Geral - Atividades recentes + Ações rápidas
- Animais - Tabela resumida
- Doações - Progresso de meta

**Ações Rápidas:**
- Gerenciar Animais → `/admin/animais`
- Gerenciar Eventos → `/admin/eventos`
- Ver Doações → `/doacoes`
- Ver Site → `/adocao`

---

### 2. **Gerenciar Animais** (`/admin/animais`)

#### **Recursos:**
✅ **Listar todos os animais**
- Tabela completa com foto, nome, tipo, idade, porte, status
- Busca por nome
- Filtro por tipo (Todos/Cães/Gatos)
- Contador de resultados

✅ **Adicionar novo animal**
- Modal com formulário completo
- Campos:
  - Nome *
  - Tipo (Cão/Gato) *
  - Gênero (Macho/Fêmea) *
  - Idade *
  - Porte (Pequeno/Médio/Grande) *
  - Temperamento (separado por vírgula) *
  - História *
  - URL da Imagem *
  - Checkboxes: Adotado, Filhote

✅ **Editar animal**
- Mesmo modal, pré-preenchido
- Salva alterações instantaneamente

✅ **Deletar animal**
- Confirmação antes de excluir
- Remove permanentemente

✅ **Toggle de Status**
- Clique no badge "Disponível/Adotado"
- Alterna status rapidamente

✅ **Feedback Visual**
- Mensagens de sucesso (verde)
- Animações suaves

---

### 3. **Gerenciar Eventos** (`/admin/eventos`)

#### **Recursos:**
✅ **Listar todos os eventos**
- Cards visuais com todas as informações
- Badges de tipo (Adoção/Arrecadação/Educacional/Outro)
- Badge "Encerrado" para eventos passados
- Contador de inscritos

✅ **Criar novo evento**
- Modal com formulário completo
- Campos:
  - Título do Evento *
  - Data *
  - Horário *
  - Local *
  - Tipo (Adoção/Arrecadação/Educacional/Outro) *
  - Capacidade (opcional)
  - Descrição *

✅ **Editar evento**
- Mesmo modal, pré-preenchido
- Atualização instantânea

✅ **Deletar evento**
- Confirmação antes de excluir
- Remove permanentemente

✅ **Filtros Avançados**
- Busca por título ou local
- Filtro temporal: Todos/Próximos/Passados
- Ordenação por data (mais recentes primeiro)

✅ **Informações Visuais**
- 📅 Data formatada em português
- 🕐 Horário
- 📍 Local
- 👥 Inscritos/Capacidade
- Ícones coloridos por tipo

---

## 🗂️ Estrutura de Arquivos

```
├── hooks/
│   ├── useAnimals.ts                   # Hook CRUD de animais
│   └── useEvents.ts                    # Hook CRUD de eventos
├── app/admin/
│   ├── page.tsx                        # Dashboard principal
│   ├── login/page.tsx                  # Login admin
│   ├── animais/page.tsx                # CRUD de animais
│   └── eventos/page.tsx                # CRUD de eventos
└── SISTEMA_ADMIN_COMPLETO.md          # Esta documentação
```

---

## 💾 Persistência de Dados

### **LocalStorage (Mock)**
Todos os dados são salvos em `localStorage` para demonstração:

```javascript
// Animais
localStorage.setItem('maya_animals', JSON.stringify(animals))

// Eventos
localStorage.setItem('maya_events', JSON.stringify(events))
```

### **Hooks Personalizados**

#### `useAnimals()`
```typescript
const {
  animals,        // Array de animais
  isLoading,      // Estado de carregamento
  addAnimal,      // Adicionar (data) => Animal
  updateAnimal,   // Atualizar (id, updates) => void
  deleteAnimal,   // Deletar (id) => void
  getAnimalById,  // Buscar (id) => Animal | undefined
} = useAnimals()
```

#### `useEvents()`
```typescript
const {
  events,         // Array de eventos
  isLoading,      // Estado de carregamento
  addEvent,       // Adicionar (data) => Event
  updateEvent,    // Atualizar (id, updates) => void
  deleteEvent,    // Deletar (id) => void
  getEventById,   // Buscar (id) => Event | undefined
  isPastEvent,    // Verificar (event) => boolean
} = useEvents()
```

---

## 🎨 Interface e UX

### **Design Consistente**
- Paleta Maya (verde oliva, marrom, azul, bege)
- Dark mode completo
- Cards arredondados
- Sombras suaves
- Transições animadas

### **Modais**
- Overlay escurecido
- Formulários centralizados
- Validação de campos obrigatórios
- Botões "Cancelar" e "Salvar"
- Fechar com X ou ESC

### **Tabelas e Cards**
- Hover effects
- Badges coloridos para status
- Ícones intuitivos
- Ações inline (editar/deletar)

### **Feedback**
- Mensagens de sucesso (verde com check)
- Confirmações para ações destrutivas
- Loading states
- Empty states

---

## 🔐 Autenticação

### **Proteção de Rotas**
Todas as páginas admin verificam autenticação:

```typescript
useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.push('/admin/login')
  }
}, [isAuthenticated, loading, router])
```

### **Credenciais (Mock)**
```
Email: admin@projetomaya.com
Senha: Maya2024!
```

---

## 🧪 Como Testar

### **1. Fazer Login**
```
1. Ir para /admin/login
2. Email: admin@projetomaya.com
3. Senha: Maya2024!
4. Clicar "Entrar"
```

### **2. Gerenciar Animais**
```
Dashboard → Gerenciar Animais

ADICIONAR:
1. Clicar "Adicionar Animal"
2. Preencher formulário
3. Salvar
4. Ver animal na lista

EDITAR:
1. Clicar ícone ✏️ em um animal
2. Modificar dados
3. Salvar
4. Ver alterações

DELETAR:
1. Clicar ícone 🗑️
2. Confirmar
3. Animal removido

TOGGLE STATUS:
1. Clicar no badge "Disponível"
2. Muda para "Adotado"
3. Clicar novamente volta para "Disponível"
```

### **3. Gerenciar Eventos**
```
Dashboard → Gerenciar Eventos

CRIAR:
1. Clicar "Criar Evento"
2. Preencher:
   - Título: Feira de Adoção
   - Data: 2026-04-01
   - Horário: 10:00
   - Local: Shopping Center
   - Tipo: Adoção
   - Capacidade: 50
   - Descrição: Descrição do evento
3. Salvar
4. Ver na lista

EDITAR:
1. Clicar ✏️ em um evento
2. Modificar dados
3. Salvar

DELETAR:
1. Clicar 🗑️
2. Confirmar

FILTRAR:
1. Usar busca para encontrar por nome/local
2. Clicar "Próximos" para ver só eventos futuros
3. Clicar "Passados" para ver histórico
```

---

## 📊 Tipos de Dados

### **Animal**
```typescript
interface Animal {
  id: string
  name: string
  type: 'dog' | 'cat'
  age: string
  gender: 'male' | 'female'
  size: 'small' | 'medium' | 'large'
  temperament: string[]
  story: string
  image: string
  images: string[]
  isAdopted: boolean
  isPuppy: boolean
}
```

### **Event**
```typescript
interface Event {
  id: string
  title: string
  date: string                    // YYYY-MM-DD
  time: string                    // HH:MM
  location: string
  description: string
  image?: string
  type: 'adoption' | 'fundraising' | 'educational' | 'other'
  capacity?: number
  registered?: number
}
```

---

## 🚀 Integração Backend (Futuro)

### **API Necessária**

#### Animais
```typescript
// Listar
GET /api/admin/animals

// Criar
POST /api/admin/animals
Body: AnimalData

// Atualizar
PATCH /api/admin/animals/:id
Body: Partial<AnimalData>

// Deletar
DELETE /api/admin/animals/:id
```

#### Eventos
```typescript
// Listar
GET /api/admin/events

// Criar
POST /api/admin/events
Body: EventData

// Atualizar
PATCH /api/admin/events/:id
Body: Partial<EventData>

// Deletar
DELETE /api/admin/events/:id
```

### **Upload de Imagens**
```typescript
// Atualmente usa URLs externas
// Para produção, implementar:
POST /api/upload
Body: FormData (file)
Response: { url: string }
```

---

## ⚙️ Configurações

### **Dados Iniciais**

**Animais:**
Carrega de `data/animals.ts` na primeira vez

**Eventos:**
4 eventos mock pré-criados no `useEvents.ts`:
1. Feira de Adoção - Shopping Center
2. Bazar Beneficente
3. Palestra: Posse Responsável
4. Caminhada Pet Solidária

### **Reset de Dados**
Para resetar ao estado inicial:
```javascript
// Console do navegador
localStorage.removeItem('maya_animals')
localStorage.removeItem('maya_events')
// Recarregar página
```

---

## 🎯 Validações

### **Animais**
- ✅ Nome obrigatório
- ✅ Idade obrigatória
- ✅ Temperamento obrigatório
- ✅ História obrigatória
- ✅ URL de imagem válida

### **Eventos**
- ✅ Título obrigatório
- ✅ Data obrigatória
- ✅ Horário obrigatório
- ✅ Local obrigatório
- ✅ Descrição obrigatória
- ✅ Capacidade (se informada) deve ser número positivo

---

## 🎨 Tipos de Evento

| Tipo | Badge | Uso |
|------|-------|-----|
| **Adoção** | Verde oliva | Feiras de adoção |
| **Arrecadação** | Azul | Bazares, rifas |
| **Educacional** | Roxo | Palestras, workshops |
| **Outro** | Cinza | Outros tipos |

---

## 📱 Responsividade

### Desktop (≥1024px)
- Tabelas completas
- Cards em grid 2 colunas
- Modais centralizados

### Tablet (768px-1023px)
- Tabelas scrolláveis horizontalmente
- Cards em 1-2 colunas
- Botões empilhados

### Mobile (<768px)
- Tabelas scrolláveis
- Cards em 1 coluna
- Formulários verticais
- Botões full-width

---

## 💡 Dicas de Uso

### **Animais**
1. Use URLs do Unsplash para imagens de qualidade
2. Separe temperamentos por vírgula: "Dócil, Brincalhão, Carinhoso"
3. Escreva histórias envolventes para aumentar adoções
4. Marque como "Adotado" assim que o animal for adotado

### **Eventos**
1. Crie eventos com antecedência
2. Defina capacidade para controlar inscrições
3. Use descrições claras e atrativas
4. Eventos passados ficam cinzas automaticamente

---

## 🐛 Troubleshooting

### Problema: Dados não salvam
**Solução:** Verificar se localStorage está habilitado no navegador

### Problema: Não consigo adicionar animal
**Solução:** Preencher todos os campos obrigatórios (*)

### Problema: Eventos não aparecem
**Solução:** Verificar filtro de tempo (Todos/Próximos/Passados)

### Problema: Imagem não carrega
**Solução:** Usar URL válida e acessível (HTTPS)

---

## 📈 Próximas Funcionalidades (Roadmap)

### Curto Prazo
- [ ] Dashboard com gráficos interativos
- [ ] Filtros avançados (múltiplos critérios)
- [ ] Exportar dados (CSV/PDF)
- [ ] Ordenação de colunas

### Médio Prazo
- [ ] Upload de imagens real
- [ ] Editor WYSIWYG para descrições
- [ ] Histórico de alterações (audit log)
- [ ] Notificações de novos animais/eventos

### Longo Prazo
- [ ] Sistema de permissões (admin/moderador)
- [ ] Relatórios e analytics
- [ ] Integração com CRM
- [ ] App mobile para admin

---

## 🏆 Resultado Final

O sistema admin agora permite:

✅ **Gerenciar animais completos** - CRUD funcional  
✅ **Gerenciar eventos** - Calendário completo  
✅ **Interface intuitiva** - UX profissional  
✅ **Persistência local** - Mock para demonstração  
✅ **Validações** - Formulários seguros  
✅ **Feedback visual** - Mensagens e animações  
✅ **Dark mode** - Tema escuro completo  
✅ **Responsivo** - Funciona em todos os devices  

---

## 📞 Suporte

**Para Admins:**
- Documentação: Este arquivo
- Guia rápido: Seção "Como Testar"
- Reset de dados: localStorage.clear()

**Para Desenvolvedores:**
- Hooks: `useAnimals.ts`, `useEvents.ts`
- Componentes: `/app/admin/`
- Tipos: TypeScript completo

---

**🐾 Sistema Admin pronto para gerenciar o Projeto Maya!**

*Versão: 1.0.0 | Data: Fevereiro 2026*
