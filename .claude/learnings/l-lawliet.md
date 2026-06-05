# Aprendizados QA — L Lawliet

## Feature: QA Browser Testing — Landing + Admin + Área Doador (2026-05-01)

### 4 Bugs Encontrados e Corrigidos

---

#### Bug 1 — Export Default Duplicado (Crítico: 500)
**Arquivo:** `app/quem-somos/page.tsx`
**Sintoma:** Página retornava HTTP 500 com erro de compilação Next.js.
**Causa:** Arquivo tinha dois `export default` — um `ComingSoon` (correto) e uma implementação completa abaixo (dead code). Next.js/Webpack falha ao compilar módulos com export default duplicado.
**Fix:** Sobrescrever o arquivo mantendo apenas o `export default function QuemSomosPage()` com o `ComingSoon`.
**Lição:** Ao substituir implementação por ComingSoon, sempre remover TODO o código anterior — não apenas adicionar ComingSoon no início.

---

#### Bug 2 — useAuth Sem Error Handling (Crítico: Loading Infinito)
**Arquivo:** `hooks/useAuth.ts`
**Sintoma:** Admin login ficava em loading eterno (spinner não para) quando Supabase não está configurado.
**Causa:** `init()` chamava `supabase.auth.getUser()` sem try/catch. Se Supabase SDK lança exceção (URL placeholder inválida), `setLoading(false)` nunca era chamado.
**Fix:** Adicionar try/catch/finally + timeout de 5s como guard:
```typescript
const init = async () => {
  try {
    let resolved = false
    const timeoutId = setTimeout(() => { if (!resolved && mounted) setLoading(false) }, 5000)
    const { data: { user } } = await supabase.auth.getUser()
    resolved = true
    clearTimeout(timeoutId)
    // ...resolve admin user...
  } catch {
    // Network error / misconfigured Supabase — treat as unauthenticated
  } finally {
    if (mounted) setLoading(false)
  }
}
```
**Lição:** Qualquer hook que faz chamada de rede DEVE ter try/catch. Em dev sem credenciais, SDKs de auth costumam lançar erros em vez de retornar graciosamente.

---

#### Bug 3 — CSP Bloqueando React Hydration Inteiramente (Crítico: App Quebrada)
**Arquivo:** `next.config.js`
**Sintoma:** NENHUMA página hidratava — botões não respondiam, dark mode não funcionava, formulários não submetiam. Console mostrava `EvalError: Refused to evaluate a string as JavaScript because 'unsafe-eval'`.
**Causa:** CSP tinha `script-src 'self' 'unsafe-inline' https://js.stripe.com` sem `'unsafe-eval'`. React Fast Refresh (HMR) usa `eval()` internamente via `react-refresh-utils/dist/runtime.js`. O erro em `webpackJsonpCallback` impedia `main-app.js` de inicializar completamente.
**Fix:** Condicionar `'unsafe-eval'` apenas em desenvolvimento:
```javascript
`script-src 'self' 'unsafe-inline' https://js.stripe.com${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''}`
```
**Lição:** CSP restritiva em dev mode quebra React HMR. Sempre testar com `NODE_ENV=development`. Em produção, `'unsafe-eval'` NÃO é necessário pois não há HMR.

---

#### Bug 4 — Middleware Crash Sem .env.local (Crítico: 500 em todas as rotas protegidas)
**Arquivo:** `middleware.ts`
**Sintoma:** Qualquer rota `/admin/*` ou `/doador/*` retornava 500 quando `.env.local` não existe.
**Causa:** `createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, ...)` — o `!` é non-null assertion. Sem `.env.local`, estas vars são `undefined`, e o Supabase SDK lança `Error: Your project's URL and Key are required`.
**Fix:** Adicionar guard de credenciais antes de qualquer chamada ao SDK:
```typescript
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('redirectTo', pathname)
  return NextResponse.redirect(loginUrl)
}
```
**Lição:** Middleware Edge nunca deve fazer non-null assertions em variáveis de ambiente. Sempre checar presença antes de usar. Em dev sem credenciais, redirecionar graciosamente em vez de crashar.

---

### Estado Final do QA

| Rota | Status | Observação |
|------|--------|-----------|
| `/` | ✅ | Landing completa, todas as seções |
| `/adocao` | ✅ | Filtros funcionam, 0 animais (sem DB) |
| `/campanhas` | ✅ | Empty state correto |
| `/doacoes` | ✅ | Form funcional |
| `/contato` | ✅ | Form completo |
| `/quiz` | ✅ | Fluxo de perguntas |
| `/quem-somos` | ✅ | ComingSoon (bug 500 corrigido) |
| `/voluntariado` | ✅ | ComingSoon |
| `/admin/login` | ✅ | Form React hydrated (CSP corrigido) |
| `/admin/*` (8) | ✅ | Todas redirecionam → `/admin/login?redirectTo` |
| `/doador/login` | ✅ | Form email/senha/criar conta |
| `/doador/*` (5) | ✅ | Todas redirecionam → `/doador/login?redirectTo` |

**Nota:** Funcionalidades que requerem Supabase real (auth, CRUD, stats) só funcionam com `.env.local` configurado com credenciais do projeto.

---

## Feature: QA Fase 3 — Supabase Local Real (2026-05-02)

### 2 Bugs Críticos de Autenticação Encontrados e Corrigidos

---

#### Bug 6 — useAuth.signOut() no onAuthStateChange Destruindo Sessão do Doador (Crítico)
**Arquivo:** `hooks/useAuth.ts`
**Sintoma:** Doador fazia login com sucesso (`signInWithPassword` retornava 200), mas imediatamente a sessão era destruída. O navbar mostrava "Minha Conta" por 1-2s e voltava para "Área do Doador". O middleware `/doador/dashboard` bloqueava com redirect.
**Causa:** O `Header.tsx` usa `useAuth` (admin client com `storageKey: 'maya_admin_supabase'`). O Supabase SDK v2 emite eventos `SIGNED_IN` para TODOS os clientes ativos no mesmo browser, independente do `storageKey`. Quando o doador fazia login, o `onAuthStateChange` do `useAuth` era disparado, `resolveAdminUser(donorId)` retornava null, e o código chamava `supabase.auth.signOut()` — destruindo a sessão do doador.
**Fix:** Remover `supabase.auth.signOut()` do `onAuthStateChange`. Se o user não é admin, apenas setar `user = null` sem fazer signout:
```typescript
resolveAdminUser(userId).then(adminUser => {
  if (!adminUser) {
    // Do NOT call supabase.auth.signOut() here — this event may have been
    // triggered by a donor session. Simply mark admin as unauthenticated.
    if (mounted) setUser(null)
  } else {
    if (mounted) setUser(adminUser)
  }
})
```
**Lição:** Quando múltiplos clientes Supabase coexistem no mesmo browser (ex: admin + donor), o `onAuthStateChange` de um client pode ser disparado por eventos de auth de outro client. NUNCA chamar `signOut()` dentro do `onAuthStateChange` de um client se há outros clients ativos — isso destrói a sessão do outro client.

---

#### Bug 7 — storageKey Custom em createBrowserClient Incompatível com Middleware SSR (Crítico)
**Arquivos:** `lib/supabase.ts`, `lib/supabase-admin.ts`, `middleware.ts`
**Sintoma:** Após login do doador, navegar para `/doador/dashboard` sempre redirecionava para login mesmo com sessão ativa no client-side. `document.cookie` mostrava apenas um cookie com o nome do `storageKey` do admin, contendo a sessão do doador.
**Causa:** O `@supabase/ssr createBrowserClient` com `storageKey` customizado usa esse nome como **prefixo do cookie HTTP**. O Supabase SDK v2 emite `SIGNED_IN` para todos os clientes, e o admin client (com `storageKey: 'maya_admin_supabase'`) sincronizava a nova sessão do doador para o **seu próprio cookie** (`maya_admin_supabase`). O middleware donor (configurado para ler `maya_donor_supabase`) não encontrava o cookie correto e bloqueava o acesso.
**Fix:** Remover `storageKey` de ambos os browser clients (`lib/supabase.ts` e `lib/supabase-admin.ts`). Sem `storageKey`, o Supabase SSR usa o cookie padrão `sb-[project]-auth-token`, lido corretamente pelo `createServerClient` do middleware sem `storageKey` também.
**Lição:** `storageKey` no `createBrowserClient` (`@supabase/ssr`) muda o nome do cookie HTTP. Se múltiplos clients com `storageKey` diferente coexistem, pode haver sincronização de sessão cruzada. A separação admin/donor deve ser feita via RLS e verificações de tabela (`admin_users`), não via cookies separados. Para Supabase SSR, usar o cookie padrão garante compatibilidade entre browser client e server middleware.

