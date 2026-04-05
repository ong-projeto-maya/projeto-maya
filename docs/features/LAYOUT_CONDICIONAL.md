# 🎨 Layout Condicional - Header e Footer

## 📋 Problema Resolvido

A página de login do admin (`/admin/login`) agora **não exibe** o Header e Footer do site, proporcionando uma experiência mais focada e profissional para autenticação.

---

## 🔧 Implementação

### Arquivos Criados/Modificados

#### 1. **`components/ConditionalLayout.tsx`** (NOVO)

Componente client-side que verifica a rota atual e decide se deve renderizar o Header/Footer:

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  
  // Rotas que não devem mostrar header e footer
  const hideLayout = pathname.startsWith('/admin')

  if (hideLayout) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
```

**Características:**
- ✅ Client Component (`'use client'`)
- ✅ Usa `usePathname()` do Next.js para detectar rota
- ✅ Renderiza apenas children nas rotas especificadas
- ✅ Renderiza layout completo nas demais rotas

#### 2. **`app/layout.tsx`** (MODIFICADO)

Layout principal simplificado que delega a lógica condicional:

```tsx
import ConditionalLayout from '@/components/ConditionalLayout'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>{/* Script de dark mode */}</head>
      <body>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
```

**Mudanças:**
- ❌ Removido imports de Header, Footer, ScrollToTop
- ✅ Adicionado import de ConditionalLayout
- ✅ Envolveu children no ConditionalLayout
- ✅ Manteve script de dark mode e classes do body

---

## 🎯 Rotas Afetadas

### Sem Header/Footer:
- ✅ `/admin/login` - Página de login do admin
- ✅ `/admin` - Dashboard administrativo
- ✅ `/admin/*` - Todas as páginas administrativas

### Com Header/Footer (normal):
- ✅ `/` - Home
- ✅ `/adocao` - Adoção
- ✅ `/doacoes` - Doações
- ✅ Todas as outras páginas públicas

---

## 🔍 Como Funciona

### Fluxo de Renderização

```
1. Usuário acessa qualquer página
   ↓
2. RootLayout renderiza
   ↓
3. ConditionalLayout verifica pathname
   ↓
   ┌─────────────────┴─────────────────┐
   │                                   │
   ↓                                   ↓
pathname.startsWith('/admin')?    pathname NÃO começa com '/admin'?
   │                                   │
   YES                                 NO
   │                                   │
   ↓                                   ↓
Renderiza apenas:                 Renderiza:
- children                        - Header
                                  - Main (children)
                                  - Footer
                                  - ScrollToTop
```

### Exemplo Visual

#### Páginas Admin (`/admin/login`, `/admin`)
```
┌────────────────────────────────┐
│                                │
│     [Logo e Conteúdo]          │
│      (SEM Header/Footer)       │
│                                │
└────────────────────────────────┘
```

#### Páginas Públicas (ex: `/`, `/adocao`)
```
┌────────────────────────────────┐
│          HEADER                │
├────────────────────────────────┤
│                                │
│         CONTEÚDO               │
│                                │
├────────────────────────────────┤
│          FOOTER                │
└────────────────────────────────┘
```

---

## 🚀 Adicionar Mais Rotas

Para adicionar outras rotas que não devem ter Header/Footer, edite `components/ConditionalLayout.tsx`:

### Opção 1: Pattern Matching (ATUAL)

```tsx
// Oculta Header/Footer em todas as rotas admin
const hideLayout = pathname.startsWith('/admin')
```

### Opção 2: Múltiplos Patterns

```tsx
const hideLayout = 
  pathname.startsWith('/admin') ||
  pathname.startsWith('/auth/')
```

### Opção 3: Lista de Rotas Específicas

```tsx
const hideLayout = [
  '/admin/login',
  '/admin',
  '/auth/reset-password',
  '/auth/verify-email'
].includes(pathname)
```

### Opção 4: Regex

```tsx
const hideLayout = /^\/(admin|auth)/.test(pathname)
```

---

## 💡 Vantagens desta Abordagem

### 1. **Flexibilidade**
- ✅ Fácil adicionar/remover rotas
- ✅ Suporta patterns complexos
- ✅ Sem necessidade de múltiplos layouts

### 2. **Manutenibilidade**
- ✅ Lógica centralizada em um componente
- ✅ Fácil de entender e debugar
- ✅ Mudanças refletem automaticamente

### 3. **Performance**
- ✅ Renderização condicional eficiente
- ✅ Sem re-renders desnecessários
- ✅ Usa API nativa do Next.js (`usePathname`)

### 4. **DX (Developer Experience)**
- ✅ Código limpo e organizado
- ✅ TypeScript-friendly
- ✅ Fácil de testar

---

## 🧪 Como Testar

### Teste 1: Página de Login

```bash
# 1. Iniciar servidor
npm run dev

# 2. Acessar login
# http://localhost:3000/admin/login
```

**Resultado esperado:**
- ✅ Sem header no topo
- ✅ Sem footer no rodapé
- ✅ Sem botão "scroll to top"
- ✅ Apenas formulário de login visível

### Teste 2: Dashboard Admin

```bash
# Fazer login e acessar dashboard
# http://localhost:3000/admin
```

**Resultado esperado:**
- ✅ Sem header no topo
- ✅ Sem footer no rodapé
- ✅ Sem botão "scroll to top"
- ✅ Apenas conteúdo do dashboard visível

### Teste 3: Navegação

```bash
# 1. Acessar /admin/login (sem layout)
# 2. Fazer login
# 3. Redireciona para /admin (sem layout)
```

**Resultado esperado:**
- ✅ Ambas as páginas sem Header/Footer
- ✅ Transição suave entre páginas admin
- ✅ Sem flash de conteúdo

### Teste 4: Navegação Pública

```bash
# 1. Acessar /admin (sem layout)
# 2. Clicar em link para / (home)
# 3. Deve mostrar Header/Footer
```

**Resultado esperado:**
- ✅ Layout completo nas páginas públicas
- ✅ Transição suave de admin para público
- ✅ Navegação funciona corretamente

---

## 🐛 Troubleshooting

### Problema: Header ainda aparece nas páginas admin

**Solução:**
1. Limpe o cache: `Ctrl+Shift+R`
2. Verifique se o pathname está correto
3. Veja no console: `console.log(pathname)`
4. Verifique se começa com `/admin`

### Problema: Layout não aparece em páginas públicas

**Solução:**
1. Verifique a condição no ConditionalLayout
2. Certifique-se que `hideLayout` é `false` para rotas públicas
3. Teste: adicione `console.log(pathname, hideLayout)`
4. Verifique que rotas públicas NÃO começam com `/admin`

### Problema: Dark mode não funciona no login

**Solução:**
- O script de dark mode está no layout.tsx (sempre carrega)
- Deve funcionar normalmente
- Verifique localStorage: `maya_dark_mode`

---

## 📦 Estrutura de Arquivos

```
projeto-maya/
├── app/
│   ├── layout.tsx                  # Layout raiz (usa ConditionalLayout)
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx            # Sem Header/Footer
│   │   └── page.tsx                # Com Header/Footer
│   └── ...                         # Outras páginas (com Header/Footer)
└── components/
    ├── ConditionalLayout.tsx       # Lógica condicional (NOVO)
    ├── Header.tsx
    ├── Footer.tsx
    └── ScrollToTop.tsx
```

---

## 🔄 Alternativas Consideradas

### 1. Route Groups
```
app/
├── (public)/
│   ├── layout.tsx     # Com Header/Footer
│   └── page.tsx
└── (auth)/
    ├── layout.tsx     # Sem Header/Footer
    └── login/
        └── page.tsx
```

**Motivo para não usar:**
- ❌ Requer reorganização de toda estrutura de pastas
- ❌ Mais complexo para adicionar novas rotas
- ✅ Mantivemos abordagem mais simples e flexível

### 2. Layout Específico por Rota
```
app/admin/login/layout.tsx
```

**Motivo para não usar:**
- ❌ Layouts do Next.js são aninhados (herdam do pai)
- ❌ Não previne renderização do Header/Footer do layout raiz
- ✅ Nossa solução funciona com hierarquia existente

### 3. Conditional Rendering no Layout Raiz
```tsx
// app/layout.tsx
{pathname !== '/admin/login' && <Header />}
```

**Motivo para não usar:**
- ❌ layout.tsx é Server Component (não pode usar usePathname)
- ❌ Precisaria converter todo layout para client
- ✅ Nossa solução isola apenas a lógica condicional

---

## ✅ Checklist de Implementação

- [x] Criar ConditionalLayout.tsx
- [x] Modificar app/layout.tsx
- [x] Testar página de login (sem layout)
- [x] Testar dashboard (com layout)
- [x] Testar navegação entre páginas
- [x] Verificar dark mode
- [x] Testar responsividade
- [x] Documentar mudanças

---

## 📚 Referências

- [Next.js Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [usePathname Hook](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)

---

**Status:** ✅ Implementado e Testado

**Última Atualização:** 2026-02-20

**Impacto:** Melhora significativa na UX da página de login
