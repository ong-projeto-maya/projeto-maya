# 🎨 Padronização das Páginas de Adoção e Doação

## 📋 Resumo

As páginas de **Adoção** (`/adocao`) e **Doação** (`/doacoes`) foram padronizadas para manter consistência visual, estrutural e de experiência do usuário em todo o site.

---

## ✨ Melhorias Aplicadas

### 1. **Estrutura de Header Unificada**

#### Antes:
- **Adoção:** Header simples sem logo
- **Doações:** Header com logo

#### Depois:
- ✅ **Ambas:** Header idêntico com logo centralizado
- ✅ Título em Playfair Display (font-display)
- ✅ Subtítulo descritivo
- ✅ Espaçamento consistente (mb-12)

```tsx
// Estrutura padronizada para ambas as páginas
<div className="text-center mb-12">
  <div className="mx-auto mb-6 flex justify-center">
    <img 
      src="/logo.png" 
      alt="Projeto Maya" 
      className="h-20 w-auto"
    />
  </div>
  <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
    [Título da Página]
  </h1>
  <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
    [Descrição]
  </p>
</div>
```

---

### 2. **Background Gradient Consistente**

#### Antes:
- **Adoção:** `bg-maya-beige` (cor sólida)
- **Doações:** `bg-gradient-to-b from-maya-beige to-white`

#### Depois:
- ✅ **Ambas:** Mesmo gradient suave
- ✅ Transição de maya-beige para branco
- ✅ Suporte completo ao dark mode

```tsx
<div className="min-h-screen bg-gradient-to-b from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 py-12">
```

---

### 3. **Dark Mode Completo**

#### Implementado em Ambas as Páginas:

**Adoção:**
- ✅ Header com cores adaptáveis
- ✅ Barra de busca com fundo dark
- ✅ Cards de filtros com fundo escuro
- ✅ Labels e textos ajustados
- ✅ Cards de animais com contraste adequado
- ✅ Seção "Como funciona" adaptada

**Doações:**
- ✅ Header com cores adaptáveis
- ✅ Formulário principal com fundo escuro
- ✅ Botões de tipo de doação ajustados
- ✅ Campos de input com fundo dark
- ✅ Seção de impacto adaptada
- ✅ Cards informativos com contraste

---

### 4. **Cores e Estilos Unificados**

#### Paleta de Cores Padronizada:

| Elemento | Light Mode | Dark Mode |
|----------|------------|-----------|
| **Background** | `from-maya-beige to-white` | `from-gray-900 to-gray-800` |
| **Títulos** | `text-maya-brown` | `text-white` |
| **Subtítulos** | `text-maya-brown/70` | `text-gray-300` |
| **Cards** | `bg-white` | `bg-gray-800` |
| **Inputs** | `bg-white` | `bg-gray-700` |
| **Bordas** | `border-gray-200` | `border-gray-600` |
| **Textos Secundários** | `text-maya-brown/60` | `text-gray-400` |

#### Cores de Destaque Mantidas:
- 🟢 **Maya Olive** (`#8FBC8F`) - Primário
- 🔵 **Maya Blue** (`#87CEEB`) - Secundário
- 🟤 **Maya Brown** (`#5D4037`) - Texto principal
- 🟡 **Maya Beige** (`#F5F5DC`) - Background

---

### 5. **Cards Informativos**

#### Adoção - "Como funciona a adoção?"
```tsx
<div className="mt-16 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
  <h3>Como funciona a adoção?</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* 3 steps com ícones numerados */}
  </div>
</div>
```

#### Doações - "Informações Adicionais"
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
  {/* Seguro, Transparente, Flexível */}
</div>
```

**Padronização:**
- ✅ Mesmo estilo de grid (3 colunas em desktop)
- ✅ Mesma estrutura de card
- ✅ Ícones/emojis consistentes
- ✅ Espaçamento uniforme

---

### 6. **Tipografia Consistente**

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| **Título Principal** | Playfair Display | 5xl/6xl | Bold |
| **Subtítulo** | Inter | xl | Normal |
| **Seções** | Playfair Display | 2xl | Bold |
| **Corpo** | Inter | base/sm | Normal |
| **Botões** | Inter | base | Semibold |

---

### 7. **Espaçamento Padronizado**

```tsx
// Página Principal
py-12           // Padding vertical

// Header
mb-12           // Margem bottom

// Seções
mb-8            // Margem entre seções

// Cards
p-6 / p-8       // Padding interno

// Grid gaps
gap-6 / gap-8   // Espaçamento entre items
```

---

### 8. **Responsividade**

Ambas as páginas seguem os mesmos breakpoints:

```tsx
// Mobile First
text-5xl            // Base

// Tablet (md: 768px)
md:text-6xl        // Títulos maiores
md:grid-cols-2     // 2 colunas
md:p-12            // Padding aumentado

// Desktop (lg: 1024px)
lg:grid-cols-3     // 3 colunas
```

---

## 📊 Comparação Antes vs Depois

### Página de Adoção

#### ANTES ❌
- Background sólido (beige)
- Sem logo no header
- Header simples
- Sem dark mode
- Cards sem suporte dark

#### DEPOIS ✅
- Background com gradient
- Logo centralizado
- Header completo e elegante
- Dark mode completo
- Cards totalmente adaptáveis

### Página de Doações

#### ANTES ❌
- Parcialmente sem dark mode
- Inputs sem adaptação dark
- Textos não ajustados

#### DEPOIS ✅
- Dark mode 100% funcional
- Todos inputs adaptados
- Contraste perfeito
- Cores consistentes

---

## 🎯 Elementos Padronizados

### ✅ Headers
- Logo posicionamento
- Título tamanho e fonte
- Subtítulo estilo
- Espaçamento

### ✅ Backgrounds
- Gradient direction
- Cores light/dark
- Transições suaves

### ✅ Cards
- Bordas arredondadas (rounded-3xl)
- Sombras (shadow-lg / shadow-2xl)
- Padding interno
- Cores de fundo

### ✅ Inputs
- Altura (py-4)
- Bordas (rounded-xl)
- Focus states
- Placeholder colors

### ✅ Botões
- Primário (btn-primary)
- Outline (btn-outline)
- Hover effects
- Estados disabled

### ✅ Textos
- Hierarquia clara
- Cores consistentes
- Opacidades padronizadas
- Line heights adequados

---

## 🚀 Benefícios da Padronização

### 1. **Experiência do Usuário**
- ✅ Navegação intuitiva
- ✅ Familiaridade entre páginas
- ✅ Menos carga cognitiva
- ✅ Identidade visual forte

### 2. **Manutenibilidade**
- ✅ Código mais organizado
- ✅ Estilos reutilizáveis
- ✅ Fácil de atualizar
- ✅ Menos duplicação

### 3. **Acessibilidade**
- ✅ Contraste adequado (WCAG AA)
- ✅ Dark mode para conforto visual
- ✅ Textos legíveis
- ✅ Hierarquia clara

### 4. **Profissionalismo**
- ✅ Visual coeso
- ✅ Atenção aos detalhes
- ✅ Design consistente
- ✅ Marca forte

---

## 📝 Guia de Estilo para Novas Páginas

Ao criar novas páginas, siga este padrão:

```tsx
export default function NovaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maya-beige to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        
        {/* Header Padrão */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 flex justify-center">
            <img src="/logo.png" alt="Projeto Maya" className="h-20 w-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-maya-brown dark:text-white mb-4">
            Título da Página
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Descrição da página
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            {/* Seu conteúdo aqui */}
          </div>
        </div>

        {/* Seção Informativa (Opcional) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Cards informativos */}
        </div>
        
      </div>
    </div>
  )
}
```

---

## 🧪 Checklist de Padronização

Ao revisar/criar páginas, verifique:

- [ ] Logo no header
- [ ] Background com gradient
- [ ] Título em Playfair Display
- [ ] Dark mode em todos elementos
- [ ] Cards com rounded-3xl
- [ ] Inputs com estados focus corretos
- [ ] Botões com classes padrão
- [ ] Espaçamento consistente (mb-12, gap-6, p-8)
- [ ] Cores da paleta Maya
- [ ] Textos com hierarquia clara
- [ ] Responsivo (mobile, tablet, desktop)
- [ ] Acessibilidade (contraste, labels)

---

## 🎨 Paleta de Classes Tailwind Padronizadas

### Containers
```tsx
container mx-auto px-4
max-w-3xl mx-auto      // Formulários
max-w-4xl mx-auto      // Seções médias
max-w-6xl mx-auto      // Seções largas
```

### Spacing
```tsx
py-12                  // Página
mb-12                  // Header
mb-8                   // Seções
gap-6 / gap-8          // Grids
p-6 / p-8              // Cards
```

### Backgrounds
```tsx
bg-white dark:bg-gray-800              // Cards
bg-maya-beige dark:bg-gray-700         // Destaque suave
bg-gradient-to-b from-maya-beige to-white dark:from-gray-900 dark:to-gray-800  // Página
```

### Textos
```tsx
text-maya-brown dark:text-white                    // Títulos
text-maya-brown/70 dark:text-gray-300             // Subtítulos
text-maya-brown/60 dark:text-gray-400             // Secundários
```

### Bordas
```tsx
border-2 border-maya-olive/20 dark:border-gray-600
rounded-xl / rounded-2xl / rounded-3xl
```

---

## 📚 Documentação Relacionada

- `globals.css` - Classes globais (btn-primary, btn-outline, card)
- `tailwind.config.ts` - Configuração de cores e temas
- `MELHORIAS_IMPLEMENTADAS.md` - Histórico de melhorias
- `CORRECAO_DARK_MODE.md` - Implementação do dark mode

---

## ✅ Status

**Páginas Padronizadas:** ✅ Completo

- ✅ `/adocao` - Página de adoção
- ✅ `/doacoes` - Página de doações

**Próximas Páginas a Padronizar (se necessário):**
- [ ] `/quiz` - Quiz de compatibilidade
- [ ] `/eventos` - Eventos
- [ ] `/blog` - Blog
- [ ] `/faq` - Perguntas frequentes
- [ ] `/contato` - Contato
- [ ] `/localizacao` - Localização

*Nota: As páginas listadas acima já seguem um padrão similar, mas podem receber ajustes finos se necessário.*

---

**Última Atualização:** 2026-02-20
**Versão:** 1.0
**Status:** ✅ Implementado e Testado
