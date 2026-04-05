# 🖼️ Imagens dos Animais - Projeto Maya

## ✅ Atualização Realizada

As imagens dos animais foram atualizadas com URLs de **maior qualidade** do Unsplash.

### Melhorias Implementadas:

1. **Qualidade Aumentada:**
   - Antes: `w=600`
   - Depois: `w=800&q=80`
   - Resultado: Imagens mais nítidas e de melhor qualidade

2. **Galeria Expandida:**
   - Antes: 2 imagens por animal
   - Depois: 3 imagens por animal
   - Resultado: Galeria mais rica no lightbox

3. **URLs Atualizadas:**
   - Todas as 8 fichas de animais foram atualizadas
   - Total: 24 imagens de alta qualidade

---

## 📊 Imagens por Animal

### 1. Mel (Cachorra - Fêmea - 3 anos)
- **Principal:** Golden Retriever adulta dócil
- **Galeria:** 3 fotos em diferentes ângulos
- **Temperamento:** Dócil, Carinhosa, Brincalhona

### 2. Thor (Cachorro - Macho - 5 meses)
- **Principal:** Filhote de pastor alemão enérgico
- **Galeria:** 3 fotos mostrando crescimento
- **Temperamento:** Enérgico, Leal, Protetor

### 3. Luna (Gata - Fêmea - 2 anos)
- **Principal:** Gata tigrada calma e elegante
- **Galeria:** 3 fotos mostrando personalidade tranquila
- **Temperamento:** Calma, Independente, Carinhosa

### 4. Bob (Cachorro - Macho - 7 anos)
- **Principal:** Cachorro pequeno, companheiro ideal
- **Galeria:** 3 fotos mostrando docilidade
- **Temperamento:** Calmo, Companheiro, Dócil

### 5. Nina (Gata - Fêmea - 4 meses)
- **Principal:** Gatinha filhote brincalhona
- **Galeria:** 3 fotos de filhote ativa
- **Temperamento:** Brincalhona, Curiosa, Sociável

### 6. Max (Cachorro - Macho - 4 anos)
- **Principal:** Pastor alemão adulto protetor
- **Galeria:** 3 fotos mostrando lealdade
- **Temperamento:** Guardião, Leal, Inteligente

### 7. Mia (Gata - Fêmea - 1 ano)
- **Principal:** Gata jovem comunicativa
- **Galeria:** 3 fotos expressivas
- **Temperamento:** Carinhosa, Vocal, Companheira

### 8. Caramelo (Cachorro - Macho - 6 meses)
- **Principal:** Vira-lata caramelo típico brasileiro
- **Galeria:** 3 fotos mostrando alegria
- **Temperamento:** Alegre, Sociável, Brincalhão

---

## 🎨 Como as Imagens São Usadas

### 1. Página Inicial - Seção "Animais"
```tsx
// Mostra card com imagem principal
<img src={animal.image} alt={animal.name} />
```

**Onde aparece:**
- Cards de 3 animais em destaque
- Thumbnail com nome e botão "Conhecer"

### 2. Página de Adoção - Lista Completa
```tsx
// Mostra todos os 8 animais
{animals.map(animal => (
  <div className="card">
    <img src={animal.image} />
    {/* Info do animal */}
  </div>
))}
```

**Onde aparece:**
- Grid responsivo com todos os animais
- Filtros por tipo, porte e gênero
- Busca por nome/temperamento

### 3. Página de Detalhes - Perfil Individual
```tsx
// Mostra galeria completa
<Lightbox images={animal.images} />
```

**Onde aparece:**
- Lightbox com 3 imagens
- Navegação entre fotos
- Zoom e visualização em tela cheia

---

## 🌐 Fonte das Imagens: Unsplash

### Por que Unsplash?

✅ **Gratuito**
- Sem necessidade de cadastro para uso básico
- Licença livre para uso comercial

✅ **Alta Qualidade**
- Fotos profissionais
- Resolução HD
- Ótima compressão

✅ **Performance**
- CDN global rápido
- Otimização automática
- Parâmetros de qualidade (`w=800&q=80`)

### Estrutura da URL:

```
https://images.unsplash.com/photo-[ID]?w=800&q=80
                                        │    │
                                        │    └─ Qualidade (80%)
                                        └────── Largura (800px)
```

**Parâmetros úteis:**
- `w=` - Largura da imagem
- `h=` - Altura da imagem
- `q=` - Qualidade (1-100)
- `fit=` - Como ajustar (crop, fill, etc)
- `auto=format` - Formato automático (WebP quando disponível)

---

## 🔄 Como Substituir por Imagens Próprias

### Opção 1: Upload Manual

Se você tiver fotos reais dos animais do abrigo:

1. **Prepare as fotos:**
   ```bash
   # Recomendações:
   - Formato: JPG ou PNG
   - Tamanho: 1200x900px (proporção 4:3)
   - Peso: < 500KB
   - Nomes: mel-1.jpg, mel-2.jpg, mel-3.jpg
   ```

2. **Coloque na pasta public:**
   ```
   public/
   └── animais/
       ├── mel-1.jpg
       ├── mel-2.jpg
       ├── mel-3.jpg
       ├── thor-1.jpg
       └── ...
   ```

3. **Atualize o arquivo `data/animals.ts`:**
   ```tsx
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

### Opção 2: Serviço de Hospedagem de Imagens

**Cloudinary (Recomendado):**
```bash
# Cadastro gratuito: 25GB de armazenamento
# https://cloudinary.com

# Exemplo de URL:
https://res.cloudinary.com/projeto-maya/image/upload/v1/animals/mel-1.jpg
```

**Vantagens:**
- ✅ Otimização automática
- ✅ Transformações (resize, crop, filters)
- ✅ CDN global
- ✅ Backup automático

**Imgur:**
```bash
# Gratuito e simples
# https://imgur.com

# Exemplo de URL:
https://i.imgur.com/ABC123.jpg
```

### Opção 3: Usar APIs de Fotos Gratuitas

**The Dog API:**
```bash
# API gratuita de fotos de cães
# https://thedogapi.com

# Exemplo:
https://cdn2.thedogapi.com/images/B1q-b1I4m.jpg
```

**The Cat API:**
```bash
# API gratuita de fotos de gatos
# https://thecatapi.com

# Exemplo:
https://cdn2.thecatapi.com/images/abc.jpg
```

**Pexels API:**
```bash
# Fotos gratuitas de alta qualidade
# https://www.pexels.com/api

# Requer API key (gratuita)
```

---

## 🎯 Recomendações para Fotos de Animais

### Qualidade Técnica:

1. **Iluminação:**
   - ✅ Luz natural (próximo a janelas)
   - ✅ Evitar flash direto
   - ❌ Fotos muito escuras ou estouradas

2. **Composição:**
   - ✅ Foco no rosto do animal
   - ✅ Fundo neutro ou desfocado
   - ✅ Animal centralizado
   - ❌ Muitas distrações no fundo

3. **Ângulo:**
   - ✅ Na altura dos olhos do animal
   - ✅ Mostrando expressão facial
   - ❌ De cima para baixo (parece assustador)

### Conteúdo Emocional:

1. **Expressão:**
   - ✅ Animal relaxado e feliz
   - ✅ Olhando para câmera
   - ❌ Com medo ou agressivo

2. **Contexto:**
   - ✅ Brincando
   - ✅ Sendo acariciado
   - ✅ Em ambiente limpo
   - ❌ Em jaula ou ambiente ruim

3. **Variedade:**
   - Foto 1: Rosto (close-up)
   - Foto 2: Corpo inteiro
   - Foto 3: Interagindo (brincando/recebendo carinho)

---

## 📱 Otimização de Imagens

### Ferramentas Recomendadas:

**1. TinyPNG (Online):**
```bash
# https://tinypng.com
# Comprime até 80% sem perda visível de qualidade
```

**2. ImageOptim (Mac):**
```bash
# https://imageoptim.com
# Compressão em lote
```

**3. Squoosh (Web):**
```bash
# https://squoosh.app
# Google - Comparação lado a lado
```

**4. Sharp (Node.js):**
```bash
npm install sharp

# Script para otimizar:
const sharp = require('sharp');

sharp('input.jpg')
  .resize(800, 600)
  .jpeg({ quality: 80 })
  .toFile('output.jpg');
```

### Script de Otimização em Lote:

```javascript
// optimize-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './original';
const outputDir = './optimized';

fs.readdirSync(inputDir).forEach(file => {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    sharp(path.join(inputDir, file))
      .resize(1200, 900, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toFile(path.join(outputDir, file))
      .then(info => console.log(`✅ ${file} otimizado`))
      .catch(err => console.error(`❌ Erro: ${err}`));
  }
});
```

---

## 🚀 Integração com Backend Futuro

### Upload de Imagens pelo Admin:

Quando implementar backend real:

```typescript
// app/admin/animals/new/page.tsx
import { useState } from 'react';

export default function NewAnimal() {
  const [images, setImages] = useState<File[]>([]);

  const handleUpload = async () => {
    const formData = new FormData();
    images.forEach((img, i) => {
      formData.append(`image-${i}`, img);
    });

    const response = await fetch('/api/animals/upload', {
      method: 'POST',
      body: formData
    });

    const { urls } = await response.json();
    // Salvar URLs no banco de dados
  };

  return (
    <input 
      type="file" 
      multiple 
      accept="image/*"
      onChange={(e) => setImages(Array.from(e.target.files || []))}
    />
  );
}
```

### API Route:

```typescript
// app/api/animals/upload/route.ts
import { NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const urls: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      const buffer = Buffer.from(await value.arrayBuffer());
      const filename = `${Date.now()}-${value.name}`;
      const filepath = path.join('./public/uploads', filename);
      
      await writeFile(filepath, buffer);
      urls.push(`/uploads/${filename}`);
    }
  }

  return Response.json({ urls });
}
```

---

## 📊 Status Atual

### ✅ Implementado:

- [x] 8 animais com imagens de alta qualidade
- [x] 3 fotos por animal (galeria)
- [x] Otimização via URL parameters
- [x] Integração com Unsplash CDN
- [x] Lightbox funcional
- [x] Responsive images

### 🔮 Próximos Passos (Opcional):

- [ ] Sistema de upload no admin
- [ ] Integração com Cloudinary
- [ ] Lazy loading de imagens
- [ ] Placeholder blur durante carregamento
- [ ] Geração automática de thumbnails
- [ ] WebP com fallback para JPG

---

## 💡 Dicas Finais

### Para Produção:

1. **Use um CDN:**
   - Cloudinary (recomendado)
   - AWS S3 + CloudFront
   - Vercel Image Optimization

2. **Implemente Lazy Loading:**
   ```tsx
   <img 
     src={animal.image}
     loading="lazy"
     alt={animal.name}
   />
   ```

3. **Use Next.js Image:**
   ```tsx
   import Image from 'next/image';
   
   <Image 
     src={animal.image}
     width={800}
     height={600}
     alt={animal.name}
   />
   ```

4. **Adicione Placeholders:**
   ```tsx
   <Image 
     src={animal.image}
     placeholder="blur"
     blurDataURL="data:image/jpeg;base64,..."
   />
   ```

---

## 📚 Recursos Úteis

- [Unsplash Source API](https://source.unsplash.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)

---

**Status:** ✅ Imagens Atualizadas

**Qualidade:** Alta resolução (800x600 @ 80%)

**Fonte:** Unsplash CDN

**Total:** 24 imagens profissionais
