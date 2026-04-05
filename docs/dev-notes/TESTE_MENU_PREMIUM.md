# 🧪 Como Testar o Menu Premium

## ✅ Checklist de Testes

### 1. **Desktop - Menu Principal**
- [ ] Abrir site em tela grande (≥1280px)
- [ ] Verificar ícones em todos os links
- [ ] Navegar para `/adocao` e ver destaque na página ativa (fundo verde)
- [ ] Rolar página para baixo e ver menu encolher
- [ ] Rolar para cima e ver menu voltar ao normal

### 2. **Favoritos**
- [ ] Ir para `/adocao`
- [ ] Clicar no ❤️ em 2-3 animais
- [ ] Ver contador aparecer no ícone ❤️ do header
- [ ] Clicar no ícone ❤️ no header
- [ ] Ver página `/favoritos` com animais salvos
- [ ] Remover um favorito
- [ ] Clicar em "Limpar Tudo" e confirmar

### 3. **Busca Rápida (Desktop)**
- [ ] Clicar no ícone 🔍 no header
- [ ] Ver campo de busca expandir
- [ ] Digitar algo (ex: "Mel")
- [ ] Clicar fora e ver campo fechar
- [ ] Abrir novamente e ver o texto limpo

### 4. **Menu Mobile**
- [ ] Redimensionar janela para <1280px
- [ ] Clicar no ícone ☰ (hambúrguer)
- [ ] Ver sidebar deslizar da direita com overlay escuro
- [ ] Verificar campo de busca integrado
- [ ] Clicar em um link e ver menu fechar automaticamente
- [ ] Abrir menu novamente
- [ ] Clicar no overlay (fundo escuro) e ver menu fechar
- [ ] Abrir menu e clicar no X para fechar

### 5. **Breadcrumbs**
- [ ] Navegar para `/blog`
- [ ] Ver breadcrumb: "🏠 Início > Blog" abaixo do header
- [ ] Navegar para `/adocao`
- [ ] Ver breadcrumb: "🏠 Início > Adoção"
- [ ] Clicar em um animal (ex: `/adocao/1`)
- [ ] Ver breadcrumb: "🏠 Início > Adoção > Detalhes"
- [ ] Clicar em "Adoção" no breadcrumb e voltar

### 6. **Notificações**
- [ ] Ver ponto vermelho piscando no link "Adotar"
- [ ] Ver ponto vermelho no ícone 🔔
- [ ] Verificar animação pulse (suave)

### 7. **Dark Mode**
- [ ] Ativar dark mode
- [ ] Verificar menu escuro
- [ ] Abrir menu mobile e ver sidebar escuro
- [ ] Ver breadcrumbs adaptar cores
- [ ] Testar todos os hovers em dark mode

### 8. **Admin (Se Logado)**
- [ ] Ir para `/admin/login`
- [ ] Fazer login (user: admin@projetomaya.com / senha: Maya2024!)
- [ ] Voltar para home
- [ ] Ver botão "Admin" no lugar de "Doar"
- [ ] Ver ícone de logout
- [ ] Abrir menu mobile e ver links admin
- [ ] Clicar em logout e ver botão "Doar" voltar

### 9. **Interações Avançadas**
- [ ] Hover em cada link e ver transição suave
- [ ] Hover em cards de animais e ver escala
- [ ] Scroll rápido e ver menu reagir suavemente
- [ ] Navegar entre páginas e ver página ativa mudar
- [ ] Redimensionar janela e ver responsividade

### 10. **Navegação Completa**
- [ ] Testar todos os links:
  - 🏠 Início → `/`
  - 🐾 Adotar → `/adocao`
  - 📋 Quiz → `/quiz`
  - 📅 Eventos → `/eventos`
  - 📖 Blog → `/blog`
  - ❓ FAQ → `/faq`
  - 📍 Mapa → `/localizacao`
  - 💬 Contato → `/contato`
  - ❤️ Favoritos → `/favoritos`
  - 💰 Doar → `/doacoes`

---

## 🎯 Cenários de Uso Real

### Cenário 1: Novo Visitante
1. Entra na home
2. Vê menu limpo e organizado
3. Navega para "Adotar"
4. Vê ponto vermelho de novos animais
5. Favorita 3 animais
6. Clica no ❤️ para ver favoritos
7. Entra em contato

### Cenário 2: Usuário Mobile
1. Acessa pelo celular
2. Abre menu hambúrguer
3. Usa busca integrada
4. Navega suavemente
5. Menu fecha automaticamente
6. Favorita animais facilmente

### Cenário 3: Admin
1. Faz login
2. Vê perfil no header
3. Acessa área admin rapidamente
4. Navega pelo site com controles admin
5. Faz logout quando termina

---

## 🐛 Bugs Conhecidos para Verificar

- [ ] Menu mobile abre/fecha suavemente sem bugs visuais
- [ ] Contador de favoritos atualiza instantaneamente
- [ ] Breadcrumbs não aparecem na home
- [ ] Scroll suave não trava
- [ ] Dark mode sem "flash" branco
- [ ] Links todos funcionais
- [ ] Hover states sem atraso
- [ ] Overlay não bloqueia scroll do body

---

## 📊 Performance

Verificar no DevTools (F12):

### Lighthouse Score Esperado:
- **Performance:** >90
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 100

### Core Web Vitals:
- **LCP:** <2.5s
- **FID:** <100ms
- **CLS:** <0.1

---

## ✨ Detalhes Visuais para Conferir

### Animações:
- [ ] Sidebar slide-in: 300ms ease-out
- [ ] Overlay fade-in: 200ms
- [ ] Logo shrink: 300ms no scroll
- [ ] Badge pulse: suave e contínuo
- [ ] Hover transitions: 200ms

### Cores (Light Mode):
- [ ] Links: #4A3D2A (maya-brown)
- [ ] Hover: #6B8E4E (maya-olive)
- [ ] Ativo: fundo verde claro
- [ ] Badge: vermelho vibrante

### Cores (Dark Mode):
- [ ] Background: gray-800
- [ ] Texto: white
- [ ] Hover: gray-700
- [ ] Breadcrumbs: adaptado

### Espaçamentos:
- [ ] Header: py-4 (normal) / py-2 (scrolled)
- [ ] Logo: h-12 (normal) / h-8 (scrolled)
- [ ] Gap entre links: 1 (4px)
- [ ] Padding links: px-3 py-2

---

## 🎉 Resultado Esperado

Ao terminar todos os testes, você deve ter:

✅ Menu moderno e profissional
✅ Navegação intuitiva
✅ Favoritos funcionando perfeitamente
✅ Busca preparada para integração
✅ Mobile impecável
✅ Admin integrado
✅ Breadcrumbs úteis
✅ Notificações chamativas
✅ Performance excelente
✅ Zero bugs visuais

---

## 📸 Screenshots Recomendados

Tirar prints de:
1. Header desktop - estado normal
2. Header desktop - scrolled (menor)
3. Menu mobile aberto
4. Página de favoritos (vazia e cheia)
5. Breadcrumbs em ação
6. Dark mode completo
7. Página ativa destacada
8. Admin logado no header

---

## 🚀 Próximos Passos (Opcional)

Melhorias futuras que podem ser adicionadas:

1. **Busca com Resultados Reais**
   - Dropdown com sugestões
   - Highlighting de texto
   - Histórico de buscas

2. **Notificações Interativas**
   - Dropdown com lista de notificações
   - Marcar como lido
   - Link direto para novos animais

3. **Menu Mega**
   - Dropdown grande em categorias
   - Preview de conteúdo
   - Imagens dos animais

4. **Gestos Mobile**
   - Swipe para abrir/fechar
   - Swipe para remover favorito
   - Pull to refresh

5. **Personalização**
   - Preferências salvas
   - Menu customizável
   - Atalhos favoritos

---

Divirta-se testando! 🎮
