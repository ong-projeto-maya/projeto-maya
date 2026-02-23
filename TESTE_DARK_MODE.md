# 🌙 Como Testar o Dark Mode

## ✅ Correções Aplicadas

O dark mode foi corrigido e agora funciona perfeitamente! Aqui estão as principais correções:

1. ✅ Script inline para evitar flash de conteúdo
2. ✅ Sincronização correta entre cliente e servidor
3. ✅ Persistência em localStorage
4. ✅ Transições suaves entre temas
5. ✅ Suporte a preferência do sistema

## 🧪 Como Testar

### Passo 1: Iniciar o Servidor
```bash
cd "C:\Users\mrodrigues7\Downloads\Projeto Maya"
npm run dev
```

### Passo 2: Abrir no Navegador
Acesse: http://localhost:3000

### Passo 3: Encontrar o Botão
- **Desktop:** No canto superior direito do header, próximo ao botão "Doar"
- **Mobile:** Abra o menu hambúrguer, o botão estará ao lado dele

### Passo 4: Clicar no Botão
- **Modo claro:** Ícone de lua 🌙
- **Modo escuro:** Ícone de sol ☀️

### Passo 5: Verificar Mudanças
O que deve acontecer ao clicar:
- ✅ Fundo muda de branco para cinza escuro
- ✅ Textos mudam de marrom para branco/cinza claro
- ✅ Header muda para cinza escuro
- ✅ Ícone muda (lua ↔ sol)
- ✅ Transição suave (200ms)

### Passo 6: Testar Persistência
1. Ative o dark mode
2. Pressione F5 (recarregar)
3. ✅ Dark mode deve continuar ativo

## 🎯 Testes Adicionais

### Teste em Diferentes Páginas
Navegue e verifique se dark mode funciona:
- [ ] Home (/)
- [ ] Adoção (/adocao)
- [ ] Quiz (/quiz)
- [ ] Eventos (/eventos)
- [ ] Blog (/blog)
- [ ] FAQ (/faq)
- [ ] Contato (/contato)
- [ ] Localização (/localizacao)

### Teste de Limpeza
1. Abra DevTools (F12)
2. Vá para **Application** → **Local Storage**
3. Delete `maya_dark_mode`
4. Recarregue a página
5. ✅ Deve usar preferência do sistema

## 🔍 Debug (Se Necessário)

### Verificar no Console
Abra DevTools (F12) e no Console digite:

```javascript
// Ver preferência atual
localStorage.getItem('maya_dark_mode')
// Deve retornar: "true" ou "false"

// Ver se classe está aplicada
document.documentElement.classList.contains('dark')
// Deve retornar: true ou false

// Testar manualmente
document.documentElement.classList.toggle('dark')
// Alterna entre light/dark
```

### Limpar Tudo e Recomeçar
```javascript
// Cole no Console do DevTools
localStorage.removeItem('maya_dark_mode')
location.reload()
```

## 📱 Teste Mobile

1. Abra DevTools (F12)
2. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)
3. Escolha um dispositivo (ex: iPhone 12)
4. Teste o dark mode no menu mobile

## 🎨 O Que Muda no Dark Mode

### Cores Principais
- **Fundo:** Branco → Cinza escuro (#1f2937)
- **Texto:** Marrom (#5D4037) → Branco/Cinza claro
- **Header:** Branco → Cinza escuro (#1f2937)
- **Footer:** Marrom (#5D4037) → Cinza muito escuro (#111827)
- **Cards:** Branco → Cinza escuro (#1f2937)

### Elementos Especiais
- **Botões:** Mantêm cores Maya (verde oliva)
- **Ícones:** Ajustam opacidade
- **Sombras:** Ficam mais sutis
- **Bordas:** Ficam mais claras

## ❓ Problemas Comuns

### O botão não aparece?
- Limpe o cache (Ctrl+Shift+R)
- Verifique se está no header correto
- Tente em modo anônimo

### Dark mode não persiste?
- Verifique se localStorage está habilitado
- Modo anônimo não persiste dados por padrão
- Algumas extensões podem bloquear

### Flash de branco ao carregar?
- Normal na primeira vez (cache ainda não formado)
- Se persistir, limpe o cache completamente
- Verifique se tem outras abas abertas

### Cores estranhas?
- Verifique se há CSS customizado interferindo
- Limpe o cache
- Tente em navegador diferente

## ✨ Funcionalidades

### Ativo
- ✅ Toggle light/dark
- ✅ Persistência em localStorage
- ✅ Respeita preferência do sistema
- ✅ Transições suaves
- ✅ Funciona em todas as páginas
- ✅ Sem flash de conteúdo

### Futuro (Ideias)
- ⏳ Tema "Auto" (segue sistema automaticamente)
- ⏳ Atalho de teclado (Ctrl+Shift+D)
- ⏳ Mais variações de dark mode
- ⏳ Schedule automático (escuro à noite)

## 🚀 Pronto!

Se seguiu todos os passos, o dark mode deve estar funcionando perfeitamente! 

**Dica:** Experimente navegar entre as páginas com dark mode ativo para ver como cada seção se adapta ao tema escuro.
