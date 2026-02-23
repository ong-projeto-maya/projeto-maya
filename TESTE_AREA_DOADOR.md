# 🧪 Guia Rápido de Teste - Área do Doador

## 🚀 Acesso Rápido

### URLs Principais:
- 🔐 Login: `http://localhost:3000/doador/login`
- 📝 Registro: `http://localhost:3000/doador/registro`
- 📊 Dashboard: `http://localhost:3000/doador/dashboard`

---

## ✅ Checklist de Testes (5 minutos)

### 1. **Criar Conta (30s)**
```
1. Ir para: /doador/registro
2. Preencher:
   - Nome: João Silva
   - Email: joao@teste.com
   - Senha: 123456
   - Confirmar: 123456
3. Clicar "Criar Conta"
4. ✓ Deve redirecionar para dashboard
```

### 2. **Explorar Dashboard (1min)**
```
1. Ver 4 cards de estatísticas
2. Verificar nível (Bronze 🥉)
3. Ver barra de progresso para Prata
4. Conferir status de assinatura
5. Ver últimas 5 doações
6. Clicar "Animais que Ajudei"
```

### 3. **Animais que Ajudei (1min)**
```
1. Ver banner com estatísticas
2. Conferir timeline de impacto
3. Ver grid de animais
4. Hover em um animal (botão "Ver Perfil")
5. Verificar badge de impacto em cada card
```

### 4. **Histórico de Doações (1min)**
```
1. Voltar ao dashboard
2. Clicar "Histórico Completo"
3. Usar busca: digitar "50"
4. Filtrar por "Mensais"
5. Ver tabela atualizar
6. Clicar "Baixar" em um recibo (mock)
```

### 5. **Gerenciar Assinatura (1min)**
```
1. No dashboard, clicar "Gerenciar Assinatura"
2. Verificar banner verde (Ativa)
3. Ver detalhes: R$ 50, próxima cobrança, cartão
4. Clicar "Pausar Assinatura"
5. Banner fica amarelo
6. Clicar "Reativar"
7. Banner volta a verde
```

### 6. **Editar Perfil (30s)**
```
1. No dashboard, clicar "Meu Perfil"
2. Alterar nome para "João Silva Santos"
3. Adicionar telefone: (11) 98765-4321
4. Adicionar CPF: 123.456.789-00
5. Salvar
6. ✓ Ver mensagem de sucesso verde
```

### 7. **Header Integration (30s)**
```
Desktop:
1. Olhar header (topo da página)
2. Ver botão "Minha Conta" (verde claro)
3. Clicar e verificar redirect para dashboard

Mobile:
1. Redimensionar janela (<1280px)
2. Abrir menu hambúrguer
3. Rolar até o final
4. Ver "Minha Conta (Doador)"
```

### 8. **Logout e Login (30s)**
```
1. No perfil, clicar "Sair da Conta"
2. Voltar para home (/)
3. Header volta a mostrar "Doar"
4. Ir para /doador/login
5. Login com mesmas credenciais
6. ✓ Dashboard carrega com dados salvos
```

---

## 🎯 Fluxo Completo (Tour Guiado)

### Cenário: Novo Doador

```
1. REGISTRO
   /doador/registro
   → Criar conta com nome, email, senha
   
2. DASHBOARD (Primeiro Acesso)
   /doador/dashboard
   → Ver suas métricas zeradas ou com mock
   → Explorar nível Bronze
   → Ver próxima doação agendada
   
3. VER IMPACTO
   /doador/animais
   → Conferir animais que suas doações ajudaram
   → Ver timeline de impacto
   
4. GERENCIAR ASSINATURA
   /doador/assinatura
   → Pausar ou ajustar doação mensal
   → Ver impacto mensal
   
5. HISTÓRICO
   /doador/doacoes
   → Revisar todas as doações
   → Baixar recibos
   → Filtrar e buscar
   
6. PERFIL
   /doador/perfil
   → Atualizar dados pessoais
   → Adicionar CPF para IR
```

---

## 🐛 Bugs Comuns e Soluções

### Problema: "Não redireciona após login"
**Solução:**
- Limpar LocalStorage
- Recarregar página
- Tentar novamente

### Problema: "Dados não aparecem"
**Solução:**
- Verificar Console (F12)
- Confirmar que localStorage tem 'maya_doador'
- Fazer logout e login novamente

### Problema: "Header não mostra 'Minha Conta'"
**Solução:**
- Verificar se está logado
- Limpar cache do navegador
- Recarregar página (Ctrl+Shift+R)

---

## 💡 Dicas de Teste

### Teste de Responsividade
```
1. Abrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Testar em:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1920px)
```

### Teste de Dark Mode
```
1. Clicar no toggle dark mode (☀️/🌙)
2. Navegar por todas as páginas de doador
3. Verificar contraste e legibilidade
```

### Teste de Dados Mock
**Doador Mock Padrão:**
- Nome: João Silva
- Total Doado: R$ 1.250
- Nível: Ouro 🥇
- Animais: 15
- Doações: 18
- Assinatura: R$ 50/mês (Ativa)

---

## 📊 Métricas para Validar

### Performance
- [ ] Página carrega em < 2s
- [ ] Transições suaves (sem travamentos)
- [ ] Imagens carregam progressivamente

### Visual
- [ ] Todos os ícones aparecem
- [ ] Cores consistentes
- [ ] Fonte legível
- [ ] Espaçamentos corretos

### Funcional
- [ ] Login funciona
- [ ] Logout funciona
- [ ] Dados persistem no refresh
- [ ] Navegação fluida entre páginas
- [ ] Botões todos funcionais

### Responsivo
- [ ] Mobile: 100% funcional
- [ ] Tablet: Layout adaptado
- [ ] Desktop: Máximo aproveitamento

---

## 🎨 Screenshots Recomendados

Tirar prints de:
1. ✅ Dashboard completo (visão geral)
2. ✅ Nível Ouro com barra de progresso
3. ✅ Tabela de histórico de doações
4. ✅ Gerenciamento de assinatura
5. ✅ Grid de animais que ajudou
6. ✅ Perfil editável
7. ✅ Header com "Minha Conta"
8. ✅ Mobile menu com link de doador
9. ✅ Dark mode ativado
10. ✅ Empty state (criar conta nova)

---

## 🚀 Testes Avançados

### 1. Múltiplas Contas
```
1. Criar conta A (joao@teste.com)
2. Fazer logout
3. Criar conta B (maria@teste.com)
4. Verificar dados separados
5. Alternar entre contas
```

### 2. Persistência
```
1. Login
2. Fechar aba
3. Abrir nova aba
4. Ir para /doador/dashboard
5. ✓ Deve estar logado automaticamente
```

### 3. Proteção de Rotas
```
1. Fazer logout
2. Tentar acessar /doador/dashboard diretamente
3. ✓ Deve redirecionar para /doador/login
```

### 4. Gamificação
```
1. No dashboard, anotar progresso atual
2. Simular mudança de totalDonated (via console)
3. Recarregar
4. ✓ Nível e barra atualizam
```

---

## 📝 Relatório de Teste

Use este template:

```
Data: ___/___/2026
Testador: _________________

FUNCIONALIDADES:
[ ] Login/Registro funcionando
[ ] Dashboard carrega corretamente
[ ] Histórico completo
[ ] Gerenciar assinatura OK
[ ] Perfil editável
[ ] Animais que ajudou
[ ] Header integrado
[ ] Níveis e badges
[ ] Responsivo mobile
[ ] Dark mode

BUGS ENCONTRADOS:
1. _____________________
2. _____________________

SUGESTÕES:
1. _____________________
2. _____________________

NOTA GERAL: ___/10
```

---

## 🎉 Teste Passou?

Se todos os itens acima funcionaram:

✅ **Área do Doador está 100% operacional!**

Próximos passos:
1. Integrar com backend real
2. Conectar Stripe
3. Implementar emails
4. Deploy para produção

---

**Divirta-se testando! 🧪💚**

*Qualquer dúvida, consulte: AREA_DOADOR_COMPLETA.md*
