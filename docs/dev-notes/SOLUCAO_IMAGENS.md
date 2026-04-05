# 🖼️ Solução - Imagens dos Animais

## ✅ Correções Aplicadas

As imagens dos animais não estavam aparecendo. As seguintes correções foram aplicadas:

---

## 🔧 1. Configuração do Next.js

### Arquivo: `next.config.js`

**Antes:**
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',  // Muito amplo, pode causar problemas
    },
  ],
}
```

**Depois:**
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',  // Específico para Unsplash
    },
  ],
  unoptimized: false,
}
```

**O que mudou:**
- ✅ Domínio específico do Unsplash
- ✅ Configuração mais segura e performática
- ✅ Otimização de imagens habilitada

---

## 🎨 2. Componente Image Otimizado

### Adicionado atributo `sizes`

**Antes:**
```tsx
<Image
  src={animal.image}
  alt={animal.name}
  fill
  className="object-cover"
/>
```

**Depois:**
```tsx
<Image
  src={animal.image}
  alt={animal.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  priority={false}
/>
```

**O que foi adicionado:**
- ✅ `sizes` - Otimiza o tamanho da imagem por viewport
- ✅ `priority={false}` - Lazy loading para melhor performance
- ✅ Background dark mode no container

---

## 🚀 **IMPORTANTE: REINICIE O SERVIDOR**

### Mudanças no `next.config.js` requerem restart!

```bash
# 1. Pare o servidor (Ctrl + C no terminal)

# 2. Reinicie:
npm run dev

# 3. Limpe o cache do navegador:
# Ctrl + Shift + R (Windows/Linux)
# Cmd + Shift + R (Mac)
```

---

## 🧪 Como Testar

### 1. Verifique se o servidor foi reiniciado

```bash
# Você deve ver:
> projeto-maya@0.1.0 dev
> next dev

- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

### 2. Teste a página inicial

```
http://localhost:3000
```

**Procure pela seção "Animais para Adoção"**
- ✅ Deve mostrar 6 cards com imagens
- ✅ Imagens de cães e gatos do Unsplash
- ✅ Carregamento suave

### 3. Teste a página de adoção

```
http://localhost:3000/adocao
```

**Deve mostrar:**
- ✅ Grid com 8 animais
- ✅ Todas as imagens visíveis
- ✅ Filtros funcionando
- ✅ Busca ativa

### 4. Teste a página de detalhes

```
http://localhost:3000/adocao/1
```

**Deve mostrar:**
- ✅ Imagem principal grande
- ✅ Galeria com 3 fotos
- ✅ Lightbox funcionando

---

## 🐛 Troubleshooting

### Problema 1: Imagens ainda não aparecem

**Solução:**

```bash
# 1. Pare o servidor (Ctrl + C)

# 2. Limpe o cache do Next.js
rm -rf .next
# Windows PowerShell:
Remove-Item -Recurse -Force .next

# 3. Reinstale dependências (se necessário)
npm install

# 4. Reinicie
npm run dev

# 5. Limpe cache do navegador
Ctrl + Shift + R
```

---

### Problema 2: Erro "Invalid src prop"

**Sintoma:**
```
Error: Invalid src prop (https://images.unsplash.com/...)
hostname "images.unsplash.com" is not configured
```

**Solução:**

Verifique se `next.config.js` está correto:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: false,
  },
}

module.exports = nextConfig
```

Depois **REINICIE O SERVIDOR**.

---

### Problema 3: Imagens carregam lentamente

**Solução 1: Adicionar priority nas primeiras imagens**

```tsx
// Para as primeiras 3 imagens da home:
<Image
  src={animal.image}
  alt={animal.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  priority={true}  // ← Carrega imediatamente
/>
```

**Solução 2: Usar placeholder blur**

```tsx
<Image
  src={animal.image}
  alt={animal.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

---

### Problema 4: Erro 429 (Too Many Requests)

**Sintoma:**
```
Failed to load image from Unsplash
Status: 429 Too Many Requests
```

**Causa:**
- Unsplash tem limite de requisições
- Muitas recargas rápidas da página

**Solução:**

Aguarde alguns minutos ou use imagens locais:

```bash
# 1. Coloque imagens em public/animais/
public/
└── animais/
    ├── mel-1.jpg
    ├── mel-2.jpg
    └── ...

# 2. Atualize data/animals.ts
{
  id: '1',
  name: 'Mel',
  image: '/animais/mel-1.jpg',
  images: [
    '/animais/mel-1.jpg',
    '/animais/mel-2.jpg',
    '/animais/mel-3.jpg'
  ],
  // ...
}
```

---

### Problema 5: Imagens aparecem cortadas

**Solução:**

Verifique se o container tem `position: relative`:

```tsx
<div className="relative h-64 mb-4 rounded-xl overflow-hidden">
  {/* ↑ relative é ESSENCIAL para fill funcionar */}
  <Image
    src={animal.image}
    fill
    className="object-cover"  // object-cover para preencher
  />
</div>
```

---

### Problema 6: Console mostra warnings de Image

**Warning:**
```
Image with src "..." has either width/height or the fill property
```

**Solução:**

Quando usar `fill`, **não** adicione `width` ou `height`:

```tsx
// ❌ ERRADO
<Image src="..." fill width={800} height={600} />

// ✅ CORRETO
<Image src="..." fill />
```

---

## 📊 Verificação de URLs

### URLs das Imagens dos Animais:

Todas as URLs devem seguir este formato:

```
https://images.unsplash.com/photo-[ID]?w=800&q=80
                                        │    │
                                        │    └─ Qualidade 80%
                                        └────── Largura 800px
```

### Teste manual de uma URL:

Abra esta URL no navegador:

```
https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80
```

**Deve:**
- ✅ Carregar uma imagem de cachorro
- ✅ Abrir sem erros
- ✅ Mostrar imagem de boa qualidade

Se não carregar, o problema é de conectividade ou firewall.

---

## 🔍 Inspecionar no DevTools

### Chrome/Edge/Firefox:

1. **Abra o DevTools:** `F12`

2. **Vá para Network > Img**

3. **Recarregue a página:** `Ctrl + R`

4. **Verifique:**
   - ✅ Requests para `images.unsplash.com`
   - ✅ Status `200 OK` (sucesso)
   - ❌ Status `403` ou `429` (bloqueado ou limite)
   - ❌ Status `404` (URL errada)

### Console Errors:

Procure por erros como:

```javascript
// ❌ Erro de configuração
Error: Invalid src prop

// ❌ Erro de rede
Failed to load resource: net::ERR_BLOCKED_BY_CLIENT

// ❌ Erro do Unsplash
429 Too Many Requests
```

---

## 🌐 Alternativas ao Unsplash

### Se Unsplash não funcionar:

#### Opção 1: Picsum Photos

```javascript
// data/animals.ts
{
  id: '1',
  name: 'Mel',
  image: 'https://picsum.photos/800/600?random=1',
  images: [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3'
  ],
}

// next.config.js
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'picsum.photos',
  },
]
```

#### Opção 2: Placeholder.com

```javascript
{
  image: 'https://via.placeholder.com/800x600/8B9A5B/FFFFFF?text=Mel',
}

// next.config.js
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'via.placeholder.com',
  },
]
```

#### Opção 3: Imagens Locais

```bash
# 1. Crie a pasta
mkdir public/animais

# 2. Adicione imagens (JPG, PNG)
# Nomeie: animal-id-numero.jpg
# Exemplo: mel-1.jpg, mel-2.jpg, thor-1.jpg

# 3. Atualize animals.ts
{
  id: '1',
  name: 'Mel',
  image: '/animais/mel-1.jpg',
  images: [
    '/animais/mel-1.jpg',
    '/animais/mel-2.jpg',
    '/animais/mel-3.jpg'
  ],
}
```

---

## ✅ Checklist Final

Antes de considerar o problema resolvido:

- [ ] `next.config.js` atualizado
- [ ] Servidor foi **REINICIADO** (Ctrl+C e `npm run dev`)
- [ ] Cache do navegador limpo (Ctrl+Shift+R)
- [ ] Página inicial mostra 6 animais com imagens
- [ ] Página de adoção mostra 8 animais
- [ ] Página de detalhes mostra galeria com 3 fotos
- [ ] DevTools Network não mostra erros 403/404/429
- [ ] Console não mostra erros de Image

---

## 📝 Arquivos Modificados

```
projeto-maya/
├── next.config.js                    ✅ ATUALIZADO
├── app/adocao/page.tsx              ✅ OTIMIZADO
├── components/home/Animals.tsx       ✅ OTIMIZADO
└── data/animals.ts                   ✅ URLs atualizadas anteriormente
```

---

## 🆘 Ainda não funciona?

### Verifique:

1. **Internet:**
   ```bash
   ping images.unsplash.com
   ```

2. **Firewall/Antivírus:**
   - Pode estar bloqueando Unsplash
   - Tente desabilitar temporariamente

3. **Proxy/VPN:**
   - Alguns proxies bloqueiam CDNs de imagens
   - Tente desconectar

4. **Next.js Version:**
   ```bash
   npm list next
   # Deve ser >= 13.0.0
   ```

5. **Node Version:**
   ```bash
   node -v
   # Deve ser >= 18.0.0
   ```

---

## 💡 Dica Pro

### Usar Image.onError para debugging:

```tsx
<Image
  src={animal.image}
  alt={animal.name}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  onError={(e) => {
    console.error('Erro ao carregar imagem:', e);
    console.log('URL:', animal.image);
  }}
/>
```

Isso mostrará no console qual imagem falhou e por quê.

---

## 📞 Contato de Suporte

Se após todas estas etapas as imagens ainda não aparecerem:

1. Verifique o console do navegador (F12)
2. Copie TODOS os erros que aparecerem
3. Tire screenshot da página
4. Anote qual navegador e versão está usando

---

**Status:** ✅ Correções Aplicadas

**Próximo Passo:** **REINICIE O SERVIDOR** (`npm run dev`)

**Teste:** Acesse `http://localhost:3000` e verifique as imagens
