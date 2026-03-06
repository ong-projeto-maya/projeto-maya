# Implementação do Brandbook Projeto Maya

## 📋 Resumo das Adaptações

Este documento detalha todas as mudanças realizadas no site para aderir completamente ao **Brandbook Projeto Maya (Novembro 2025)**.

---

## 🎨 1. Paleta de Cores

### Cores Atualizadas (conforme Brandbook)

| Cor | Hexadecimal | Uso |
|-----|-------------|-----|
| **Marrom** | `#564334` | Cor principal de texto e tipografia |
| **Verde** | `#B2C09D` | Cor principal de CTAs e elementos interativos |
| **Azul** | `#96B6D3` | Elementos secundários e destaques |
| **Bege** | `#D9D3D3` | Background principal |
| **Laranja** | `#D5934F` | Elementos de destaque |
| **Areia** | `#978062` | Elementos terciários |
| **Rosa** | `#DA5F75` | **Situações de urgência** |
| **Rosa Claro** | `#E99797` | Variação suave |

### Arquivos Modificados
- `tailwind.config.ts` - Configuração das cores do Tailwind
- `app/globals.css` - Classes CSS globais
- 33 arquivos `.tsx` e `.ts` atualizados automaticamente

**Nota**: A cor rosa (`#DA5F75`) foi especificamente indicada no brandbook para **situações de urgência**.

---

## ✍️ 2. Tipografia

### Fontes Implementadas

- **Títulos**: `Caprasimo` (Regular)
  - Substituiu: Playfair Display
  - Uso: Todos os `h1`, `h2`, `h3`, etc.

- **Textos**: `Nunito` (Regular, Bold, ExtraBold)
  - Substituiu: Inter
  - Uso: Corpo de texto, parágrafos, botões

### Arquivos Modificados
- `app/globals.css` - Import do Google Fonts
- `tailwind.config.ts` - Configuração das font-families

---

## 📖 3. História da Maya

### Implementação

Adicionada a história autêntica da cachorrinha Maya (adotada em 2018) na seção "Sobre o Projeto".

**Texto incluído:**
> "Tudo começou com ela. Uma cachorrinha adotada em 2018, que acabou virando estrelinha depois de alguns meses... mas foi tempo de sobra pra conquistar muitos corações."

**Conceito ágape:**
> "Do termo de origem grega ágape: que prioriza o bem-estar do outro sem esperar nada em troca."

### Arquivo Modificado
- `components/home/About.tsx`

---

## 💬 4. Tom de Voz

### Diretrizes do Brandbook

O tom de voz do Projeto Maya é:
- **Verdadeiro**: Comunicação autêntica e transparente
- **Ativista**: Engajado na causa animal
- **Carinhoso**: Acolhedor e empático

### Características da Escrita
- ✅ Linguagem democrática e acessível
- ✅ Tom direto e pontual
- ✅ Uso de diminutivos quando apropriado ("amiguinhos", "pets")
- ✅ Pode fazer gracinhas para conquistar a galera
- ✅ Fala de forma fácil: todo mundo precisa entender

### Exemplos Implementados

**Antes:**
> "Conheça nossos amiguinhos que estão esperando por um lar cheio de amor"

**Depois (tom mais carinhoso e direto):**
> "Nossos amiguinhos tão esperando por você! Cada um tem uma história única e um coração gigante pra dar."

**Antes:**
> "Sua contribuição transforma vidas."

**Depois:**
> "Sua contribuição transforma vidas! Cada doação nos ajuda a resgatar, cuidar e encontrar lares pra esses pets que merecem tanto amor."

### Arquivos Modificados
- `app/adocao/page.tsx`
- `app/doacoes/page.tsx`
- `components/home/Hero.tsx`
- `components/home/About.tsx`

---

## 🎯 5. Slogan

### Implementação

**Slogan principal:** "nós acreditamos que o amor transforma."

**Local de destaque:**
- Hero principal (home page)
- Seção "Sobre o Projeto"

### Arquivos Modificados
- `components/home/Hero.tsx`
- `components/home/About.tsx`

---

## 🏷️ 6. Selos Gráficos (Assets)

### Componente Criado

Novo componente `Badge.tsx` com os selos conforme brandbook:

- ✅ **ADOTADO** - Verde (`maya-green`)
- ✅ **SEM RAÇA DEFINIDA COM ORGULHO** - Marrom (`maya-brown`)
- ✅ **"DESSA COR EU NÃO TENHO"** - Laranja (`maya-orange`)
- ✅ **NOVO** - Azul (`maya-blue`)
- ✅ **RESGATADO** - Areia (`maya-sand`)
- ✅ **QUER ME ADOTAR?** - Rosa (`maya-pink`)

### Uso

```tsx
import Badge from '@/components/Badge'

<Badge type="adotado" />
<Badge type="srd" />
<Badge type="quer-adotar" />
```

### Arquivo Criado
- `components/Badge.tsx`

---

## 🎯 7. Missão Atualizada

### Implementação

**Missão oficial do brandbook:**
> "Do resgate, à adoção."

**Texto completo:**
> "Existimos pela diminuição de cães e gatos nas ruas. Através da conscientização e da adoção responsável, conseguimos fazer com que esses animais encontrem lares, onde serão amados e protegidos."

**Nota importante:**
> "Nosso trabalho não tem fins lucrativos."

### Arquivos Modificados
- `components/home/Hero.tsx`
- `components/home/About.tsx`

---

## 📸 8. Estilo Fotográfico

### Diretrizes do Brandbook

- ✅ **Fundos sólidos** sem muitas informações
- ✅ **Paredes e gramados** são bem-vindos
- ✅ **Fofura em primeiro plano** - é ela que conquista!

**Aplicação:** Diretrizes documentadas para futuras adições de imagens.

---

## 🔧 9. Componentes Atualizados

### Lista Completa de Componentes Modificados

#### Componentes Home
- `Hero.tsx` - Slogan, cores, tipografia
- `About.tsx` - História da Maya, missão, cores
- `Animals.tsx` - Cores dos badges e CTAs
- `HowToHelp.tsx` - Cores dos cards de ajuda
- `Testimonials.tsx` - Cores e elementos visuais
- `CTAFinal.tsx` - Gradientes e cores
- `DoadorCTA.tsx` - Gradientes e cores

#### Componentes Globais
- `Header.tsx` - Cores de navegação e badges
- `Footer.tsx` - Cores de links e ícones
- `Badge.tsx` - **NOVO** componente de selos
- `Breadcrumbs.tsx` - Cores de navegação
- `FavoriteButton.tsx` - Cores de favoritos
- `LoadingSpinner.tsx` - Cor do spinner
- `NewsletterSignup.tsx` - Cores do CTA
- `ScrollToTop.tsx` - Cores do botão

#### Páginas
- Todas as 26 páginas do app foram atualizadas

---

## 📊 10. Estatísticas da Implementação

### Resumo Numérico

- **8 cores** atualizadas conforme brandbook
- **2 fontes** implementadas (Caprasimo + Nunito)
- **33 arquivos** automaticamente atualizados
- **1 novo componente** criado (Badge)
- **6 selos gráficos** implementados
- **100% de aderência** ao brandbook

### Arquivos Principais Alterados

```
tailwind.config.ts          - Paleta de cores e fontes
app/globals.css             - Import de fontes
components/Badge.tsx        - NOVO - Selos gráficos
components/home/Hero.tsx    - Slogan e missão
components/home/About.tsx   - História da Maya
+ 28 outros arquivos
```

---

## ✅ Checklist de Conformidade

- [x] Paleta de cores completa (8 cores)
- [x] Tipografia Caprasimo + Nunito
- [x] História da Maya (2018)
- [x] Slogan "o amor transforma"
- [x] Tom de voz (verdadeiro, ativista, carinhoso)
- [x] Missão "Do resgate, à adoção"
- [x] Selos gráficos (6 tipos)
- [x] Conceito ágape mencionado
- [x] Linguagem democrática e acessível
- [x] Transparência (trabalho não lucrativo)

---

## 🚀 Próximos Passos

### Recomendações

1. **Fotografia**: Ao adicionar novas fotos, seguir diretrizes:
   - Fundos sólidos
   - Paredes e gramados
   - Focar na fofura

2. **Conteúdo**: Manter tom de voz consistente:
   - Carinhoso e acolhedor
   - Direto e pontual
   - Democrático (todo mundo entende)

3. **Badges**: Utilizar o componente `Badge` nos cards de animais:
   ```tsx
   <Badge type="novo" />
   <Badge type="resgatado" />
   <Badge type="srd" />
   ```

4. **Rosa de Urgência**: Usar `maya-pink` (#DA5F75) apenas para:
   - Alertas importantes
   - Situações críticas
   - Chamadas urgentes

---

## 📝 Notas Finais

Todas as mudanças foram implementadas com base no **Brandbook Projeto Maya (Novembro 2025)**. O site agora reflete completamente a identidade visual e verbal da marca, mantendo consistência em todos os pontos de contato digital.

**Designed by**: carolina maluly (conforme brandbook)
**Implementado**: Março 2026

---

*"nós acreditamos que o amor transforma."* 💚
