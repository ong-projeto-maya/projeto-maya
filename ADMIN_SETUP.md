# 🔐 Configuração do Dashboard Admin

## ⚠️ IMPORTANTE

O dashboard administrativo (`/admin`) está implementado com **autenticação básica** e demonstração visual. Para funcionalidade completa em produção, é necessário:

1. ✅ **Autenticação** - ✅ IMPLEMENTADO (básico)
2. ⚠️ Backend real (Supabase/Firebase/PostgreSQL)
3. ⚠️ APIs para CRUD de animais
4. ⚠️ Sistema de permissões avançado

---

## 🚀 Acesso Atual

### Login

**URL de Login:** `http://localhost:3000/admin/login`

**Credenciais de Demonstração:**
```
Usuário: admin
Senha: maya2024

OU

Usuário: projetomaya
Senha: admin123
```

### Dashboard

**URL do Dashboard:** `http://localhost:3000/admin`

✅ **Protegido por autenticação!** Usuários não autenticados são redirecionados para `/admin/login`

---

## 🔒 Sistema de Autenticação Implementado

### Funcionalidades Atuais

✅ **Tela de Login** (`/admin/login`)
- Design profissional e responsivo
- Validação de credenciais
- Toggle de mostrar/ocultar senha
- Feedback visual de erros
- Loading state durante login
- Suporte a dark mode

✅ **Proteção de Rotas**
- Dashboard só acessível para usuários autenticados
- Redirecionamento automático para login
- Verificação de sessão ao carregar páginas

✅ **Gestão de Sessão**
- Sessão salva em localStorage
- Expiração automática após 24 horas
- Botão de logout no dashboard
- Confirmação antes de deslogar

✅ **Informações do Usuário**
- Nome do usuário visível no dashboard
- Badge de "Administrador"
- Botão de logout acessível

### Arquivos Criados

1. **`hooks/useAuth.ts`**
   - Hook personalizado para gerenciar autenticação
   - Funções: `login()`, `logout()`, `isAuthenticated`
   - Verifica expiração de sessão
   - Integra com localStorage

2. **`app/admin/login/page.tsx`**
   - Página de login completa
   - Formulário com validação
   - UX profissional
   - Credenciais de demonstração visíveis

3. **`app/admin/page.tsx` (atualizado)**
   - Verifica autenticação antes de renderizar
   - Exibe informações do usuário
   - Botão de logout
   - Loading state

### Como Funciona

```typescript
// 1. Usuário acessa /admin
// 2. useAuth verifica localStorage
// 3. Se não autenticado → Redireciona para /admin/login
// 4. Usuário insere credenciais
// 5. login() valida credenciais
// 6. Se válido → Salva sessão e redireciona para /admin
// 7. Dashboard renderiza com informações do usuário
```

⚠️ **IMPORTANTE PARA PRODUÇÃO:** 
As credenciais estão hardcoded no arquivo `hooks/useAuth.ts`. Antes do deploy, você DEVE:

1. Remover credenciais hardcoded
2. Integrar com backend real
3. Usar hash de senhas (bcrypt)
4. Implementar tokens JWT ou sessions server-side
5. Adicionar rate limiting
6. Implementar 2FA (opcional)

---

## 🔒 Como Adicionar Autenticação

### Opção 1: NextAuth.js (Recomendado)

```bash
npm install next-auth
```

Crie `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Valide usuário aqui (cheque banco de dados)
        if (credentials?.email === 'admin@projetomaya.org' && credentials?.password === 'senha123') {
          return { id: '1', name: 'Admin', email: 'admin@projetomaya.org' }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
})

export { handler as GET, handler as POST }
```

Proteja a página admin:

```typescript
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/admin/login')
  }
  
  // ... resto do código
}
```

### Opção 2: Clerk (Mais Fácil)

```bash
npm install @clerk/nextjs
```

Configure em `app/layout.tsx`:

```typescript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

Proteja rotas em `middleware.ts`:

```typescript
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/adocao', '/doacoes', '/blog', '/faq', '/contato', '/quiz', '/eventos'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

---

## 💾 Conectar Banco de Dados

### Opção 1: Supabase (Recomendado)

```bash
npm install @supabase/supabase-js
```

Crie `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

Crie tabela `animals`:

```sql
CREATE TABLE animals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat')),
  age TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  temperament TEXT[] NOT NULL,
  story TEXT NOT NULL,
  image TEXT NOT NULL,
  images TEXT[] NOT NULL,
  is_adopted BOOLEAN DEFAULT false,
  is_puppy BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

APIs:

```typescript
// app/api/animals/route.ts
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase.from('animals').select('*')
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { data, error } = await supabase.from('animals').insert(body)
  return NextResponse.json(data)
}
```

### Opção 2: Prisma + PostgreSQL

```bash
npm install prisma @prisma/client
npx prisma init
```

Configure `schema.prisma`:

```prisma
model Animal {
  id          String   @id @default(uuid())
  name        String
  type        String
  age         String
  gender      String
  size        String
  temperament String[]
  story       String
  image       String
  images      String[]
  isAdopted   Boolean  @default(false)
  isPuppy     Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

---

## 🔧 Funcionalidades a Implementar

### 1. CRUD de Animais

#### Adicionar Animal

```typescript
// app/api/animals/route.ts
export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  // Valide os dados
  // Salve no banco
  return NextResponse.json({ success: true })
}
```

#### Editar Animal

```typescript
// app/api/animals/[id]/route.ts
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const body = await request.json()
  // Atualize no banco
  return NextResponse.json({ success: true })
}
```

#### Deletar Animal

```typescript
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Delete do banco
  return NextResponse.json({ success: true })
}
```

### 2. Upload de Imagens

Use **Cloudinary** ou **Uploadthing**:

```bash
npm install uploadthing
```

```typescript
import { createUploadthing } from 'uploadthing/next'

const f = createUploadthing()

export const uploadRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 5 } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url }
    }),
}
```

### 3. Estatísticas Reais

```typescript
// app/api/stats/route.ts
export async function GET() {
  const rescued = await supabase.from('animals').select('count')
  const adopted = await supabase.from('animals').select('count').eq('is_adopted', true)
  const donations = await supabase.from('donations').select('sum(amount)')
  
  return NextResponse.json({
    rescued: rescued.count,
    adopted: adopted.count,
    totalDonations: donations.sum
  })
}
```

### 4. Histórico de Doações

```typescript
// Tabela donations
CREATE TABLE donations (
  id UUID PRIMARY KEY,
  amount DECIMAL NOT NULL,
  type TEXT CHECK (type IN ('single', 'monthly')),
  donor_email TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎨 Melhorias UI Sugeridas

### Formulário de Adicionar Animal

```typescript
'use client'

export default function AddAnimalForm() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog',
    age: '',
    // ... outros campos
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/animals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    // Handle response
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### Modal de Edição

Use **Radix UI** ou **Headless UI** para modais acessíveis.

### Drag & Drop de Imagens

Use **react-dropzone**:

```bash
npm install react-dropzone
```

---

## 🔐 Níveis de Permissão (Futuro)

```typescript
enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  VIEWER = 'viewer'
}

// Middleware
export function requireRole(role: Role) {
  return async (req, res, next) => {
    const session = await getServerSession()
    if (session?.user?.role !== role) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}
```

---

## 📊 Dashboard Analytics (Futuro)

Integre com **Google Analytics** ou **Plausible**:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

---

## ✅ Checklist de Implementação

- [ ] Escolher sistema de autenticação
- [ ] Configurar banco de dados
- [ ] Criar APIs CRUD
- [ ] Adicionar validação de dados
- [ ] Implementar upload de imagens
- [ ] Proteger rotas admin
- [ ] Testar permissões
- [ ] Adicionar logs de auditoria
- [ ] Fazer backup regular

---

## 🚀 Deploy Seguro

**ANTES DE FAZER DEPLOY:**

1. ✅ Adicione autenticação
2. ✅ Configure variáveis de ambiente
3. ✅ Teste permissões
4. ✅ Adicione rate limiting
5. ✅ Configure CORS
6. ✅ Use HTTPS

**Variáveis de Ambiente (Produção):**

```env
# Autenticação
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=gere_um_secret_forte_aqui

# Banco de Dados
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=... (NUNCA EXPONHA!)

# Upload
UPLOADTHING_SECRET=...
UPLOADTHING_APP_ID=...
```

---

## 📚 Recursos Úteis

- **NextAuth:** https://next-auth.js.org
- **Clerk:** https://clerk.com
- **Supabase:** https://supabase.com/docs
- **Prisma:** https://www.prisma.io/docs
- **Uploadthing:** https://uploadthing.com

---

**Status:** 🟡 Dashboard Preparado (Requer Backend)

**Prioridade para produção:** 🔴 ALTA (Adicione autenticação!)
