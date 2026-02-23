# 🎨 Logos do Projeto Maya

Esta pasta contém os assets visuais do projeto.

---

## 📁 Arquivos Disponíveis

### `logo.png` ⭐ (Principal)
- **Uso:** Logo principal do projeto
- **Onde aparece:**
  - Header (topo de todas as páginas)
  - Hero da home page (grande)
  - Footer
  - Página de doações
  - Página de sucesso

### `logo-2.png` (Alternativa)
- **Uso:** Logo alternativa/secundária
- **Disponível para:** Uso futuro ou variações
- **Sugestões de uso:**
  - Emails
  - Materiais impressos
  - Redes sociais
  - Versão para fundos escuros

### `favicon.png` (Ícone do navegador)
- **Uso:** Favicon que aparece na aba do navegador
- **Configurado em:** `app/layout.tsx`
- **Formato:** PNG (Next.js converte automaticamente)

---

## 🔄 Como Trocar as Logos

### Substituir Logo Principal

1. Substitua o arquivo `logo.png` nesta pasta
2. Mantenha o mesmo nome
3. Formato recomendado: PNG com fundo transparente
4. Tamanho recomendado: 500x500px ou maior

### Usar Logo Alternativa

Para usar `logo-2.png` ao invés da principal:

**Opção 1: Renomear**
```bash
# Fazer backup
mv logo.png logo-backup.png
# Usar alternativa
mv logo-2.png logo.png
```

**Opção 2: Editar Componentes**

Substitua `"/logo.png"` por `"/logo-2.png"` nos arquivos:
- `components/Header.tsx`
- `components/home/Hero.tsx`
- `components/Footer.tsx`
- `app/doacoes/page.tsx`
- `app/doacoes/sucesso/page.tsx`

### Trocar Favicon

1. Substitua `favicon.png`
2. Formato: PNG, ICO ou SVG
3. Tamanho: 32x32px ou 64x64px
4. O navegador pode levar alguns minutos para atualizar (limpe cache)

---

## 🎨 Especificações Técnicas

### Logo Principal
```
Formato: PNG
Transparência: Sim (recomendado)
Tamanho usado no Header: height: 48px (auto width)
Tamanho usado no Hero: height: 128px (auto width)
Otimização: Compressão PNG recomendada
```

### Favicon
```
Formato: PNG/ICO
Tamanho: 32x32px, 64x64px ou 512x512px
Cores: Compatível com tema claro e escuro
```

---

## 🖼️ Onde as Logos Aparecem

### Header (Todas as Páginas)
```tsx
<img src="/logo.png" alt="Projeto Maya" className="h-12 w-auto" />
```
- Altura fixa: 48px
- Largura proporcional
- Aparece em todas as páginas
- Mobile: texto "Projeto Maya" fica oculto, só logo aparece

### Hero (Home Page)
```tsx
<img src="/logo.png" alt="Projeto Maya" className="h-32 w-auto" />
```
- Altura: 128px (maior para impacto)
- Centralizada
- Com sombra (drop-shadow-2xl)

### Footer
```tsx
<img src="/logo.png" className="h-10 w-auto brightness-0 invert" />
```
- Altura: 40px
- **Filtros aplicados:**
  - `brightness-0 invert` → Inverte cores (logo fica branca no fundo escuro)
- Remove se quiser manter cores originais

### Página de Doações
```tsx
<img src="/logo.png" className="h-20 w-auto" />
```
- Altura: 80px
- Centralizada acima do título

### Página de Sucesso
```tsx
<img src="/logo.png" className="h-32 w-auto animate-bounce" />
```
- Altura: 128px
- Animação de bounce (pula celebrando)
- Com badge de sucesso no canto

---

## 🎯 Otimização

### Comprimir Logos (Recomendado)

Para melhor performance, comprima suas logos:

**Online:**
- TinyPNG: https://tinypng.com
- Squoosh: https://squoosh.app

**Reduzir tamanho sem perder qualidade:**
- PNG: 70-90% compressão
- Manter transparência
- Resultado: carregamento mais rápido

### Formatos Alternativos

O Next.js suporta:
- ✅ PNG (recomendado para logos)
- ✅ SVG (melhor para escalabilidade)
- ✅ JPG (não suporta transparência)
- ✅ WebP (moderna, menor tamanho)

**SVG é ideal se sua logo for vetorial:**
- Escala infinitamente
- Tamanho de arquivo pequeno
- Pode ser animada com CSS

---

## 🔧 Troubleshooting

### Logo não aparece
1. Verifique se o arquivo está em `public/logo.png`
2. Reinicie o servidor: `npm run dev`
3. Limpe cache do navegador: Ctrl+Shift+R

### Logo aparece pixelizada
1. Use logo com resolução maior (mínimo 500px)
2. Prefira PNG ou SVG
3. Evite JPG para logos

### Logo muito grande/pequena
Ajuste a classe `h-` nos componentes:
- `h-8` = 32px
- `h-12` = 48px
- `h-16` = 64px
- `h-20` = 80px
- `h-32` = 128px

### Favicon não atualiza
1. Limpe cache do navegador
2. Feche e abra o navegador
3. Use modo anônimo para testar

---

## 📱 Outros Assets (Futuro)

Você pode adicionar mais arquivos aqui:

```
public/
├── logo.png           ← Logo principal
├── logo-2.png         ← Logo alternativa
├── favicon.png        ← Favicon
├── logo-white.png     ← (Futuro) Versão branca
├── logo-icon.png      ← (Futuro) Só o ícone
├── og-image.png       ← (Futuro) Open Graph (redes sociais)
└── animals/           ← (Futuro) Fotos dos animais
```

---

## 🌐 Meta Tags e Redes Sociais (Futuro)

Para melhorar compartilhamentos em redes sociais, adicione:

```tsx
// app/layout.tsx
export const metadata = {
  // ... existente
  openGraph: {
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}
```

Crie `og-image.png`:
- Tamanho: 1200x630px
- Formato: PNG ou JPG
- Inclua logo + texto do projeto

---

**As logos estão integradas e funcionando! 🎉**

Qualquer alteração nos arquivos desta pasta refletirá automaticamente no site.
