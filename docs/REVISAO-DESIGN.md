# Revisão de design do site — Projeto Maya

Feita em 2026-11-05 sobre https://projeto-maya-green.vercel.app, em desktop (1440×900) e celular
(375×812), nos modos claro e escuro.

> **Situação.** Os ajustes descritos aqui foram aplicados na branch local
> `design/cores-e-contraste`. **Produção continua como estava** — nada foi publicado. O que foi
> feito está no fim deste documento, em "O que foi alterado".
>
> **Uma correção ao diagnóstico original.** Duas das falhas que eu listei no modo claro — a legenda
> "Maya - 2018" e o "A estrelinha que inspirou tudo isso" — eram **falso positivo**. O script que
> eu usei para medir contraste lê a cor de fundo dos elementos, e não enxerga gradiente: ele subiu
> até o card bege e concluiu branco sobre bege. Na prática existe um `bg-gradient-to-t from-black/70`
> por cima da foto, e o texto é legível. Eram 9 falhas no claro; são 7.

Referência: `Identidade Visual/Brandbook_ProjetoMaya.pdf` (26 páginas, nov. 2025, por Carolina
Maluly). Os hexadecimais abaixo foram conferidos amostrando os pixels da página 16 do próprio PDF,
não lidos de memória.

---

## Resumo

A paleta do código está **correta** em relação ao brandbook. O problema não é quais cores foram
usadas, é **em que proporção e em que par**. O brandbook diz, com todas as letras, que a proporção
importa — e o site inverteu a dela.

Três coisas, em ordem de impacto:

1. A segunda linha do título da home, "o amor transforma.", tem contraste **1,22:1**. É o texto
   mais importante do site e está praticamente invisível.
2. O modo escuro existe só no topo. Os componentes da home não têm nenhuma regra de escuro, e os
   cards de "Como Ajudar" ficam com texto marrom sobre fundo quase preto — **1,57:1**.
3. As seções "Animais para Adoção" e "Campanhas Especiais" renderizam **zero cards**, sem nenhuma
   mensagem explicando. Ficam dois buracos no meio da página.

---

## 1. Bugs

### 1.1 O modo escuro quebrou na compilação

Em `app/globals.css` existe isto:

```css
.dark {
  .card { @apply bg-gray-800 text-gray-100; }
  .btn-outline { @apply border-maya-green text-maya-green hover:bg-maya-green hover:text-gray-900; }
}
```

É CSS aninhado. O `postcss.config.js` do projeto tem só `tailwindcss` e `autoprefixer` — falta o
plugin `tailwindcss/nesting`. Resultado: o Tailwind processou o `@apply` mas **jogou fora o `.dark`
de fora**. O CSS que foi para produção tem:

```css
.card{background-color:rgb(31 41 55);color:rgb(243 244 246)}   /* sem .dark na frente! */
.card{border-radius:1.5rem;background-color:rgb(255 255 255);...}
```

Duas regras `.card` soltas. A segunda vence por ordem, então no claro os cards continuam brancos —
por sorte. Mas a regra do escuro **nunca se aplica**, e a primeira regra está a uma reordenação de
distância de pintar todos os cards de cinza-escuro no modo claro.

Conferi no arquivo publicado: `grep '\.dark \.card'` no CSS compilado não retorna nada.

### 1.2 A home não tem modo escuro nenhum

Contei as classes `dark:` por arquivo:

| arquivo | ocorrências de `dark:` |
| --- | --- |
| `app/admin/page.tsx` | 118 |
| `app/admin/campanhas/page.tsx` | 113 |
| `components/Header.tsx` | 65 |
| `components/Footer.tsx` | 2 |
| `app/page.tsx` | **0** |
| `components/home/Hero.tsx` | **0** |
| `components/home/About.tsx` | 1 |
| `components/home/HowToHelp.tsx` | **0** |
| `components/home/Testimonials.tsx` | **0** |
| `components/home/CTAFinal.tsx` | **0** |
| `app/quem-somos/page.tsx` | **0** |

O padrão é claríssimo: **o modo escuro foi feito para o painel administrativo e nunca chegou ao
site público.** É exatamente o que você viu — muda o cabeçalho e para por aí.

### 1.3 Contraste no modo escuro

Medido na página rodando, com o `.dark` ativo:

| elemento | cor | fundo | contraste |
| --- | --- | --- | --- |
| "Doação Única", "Doação Mensal", "Lar Temporário", "Voluntariado" | `#564334` | `#1F2937` | **1,57** |
| "Nosso trabalho não tem fins lucrativos." | branco | `#D9D3D3` | **1,48** |
| "Maya - 2018" (legenda da foto) | branco | `#D9D3D3` | **1,48** |
| "o amor transforma." | `#D5934F` | `#96B6D3` | **1,22** |

O mínimo da norma (WCAG AA) é 4,5 para texto comum e 3,0 para texto grande. Os quatro títulos dos
cards de "Como Ajudar" somem no escuro.

### 1.4 Contraste no modo claro

| elemento | cor | fundo | contraste |
| --- | --- | --- | --- |
| "o amor transforma." (h1, 72px) | `#D5934F` | `#96B6D3` | **1,22** |
| "Maya - 2018" / legenda da foto | branco | `#D9D3D3` | **1,48** |
| "Área do Doador" (cabeçalho) | `#B2C09D` | branco | **1,92** |
| "Doar Agora →" | `#B2C09D` | branco | **1,92** |
| "Ver Todos os Animais" (botão) | branco | `#B2C09D` | **1,92** |
| "Campanhas Especiais" (h2, 48px) | branco | `#96B6D3` | **2,12** |
| "Ser Apoiador →" | `#96B6D3` | branco | **2,12** |
| "Quero Ajudar →" | `#D5934F` | branco | **2,59** |
| "Ser Voluntário →" | `#978062` | branco | **3,76** |

Nove falhas só na home. A causa é sempre a mesma: **o verde, o azul e o laranja do brandbook são
cores claras**. Funcionam como fundo, não como texto, e não aceitam texto branco em cima.

### 1.5 Os mesmos botões, três tratamentos diferentes

Todos usam o fundo verde `#B2C09D`:

| botão | cor do texto | contraste |
| --- | --- | --- |
| "Quero Adotar" (hero) | marrom `#564334` | 4,86 — passa |
| "Fazer uma Doação" (rodapé) | marrom `#564334` | 4,86 — passa |
| "Ver Todos os Animais" | branco | **1,92 — falha** |

Não é só acessibilidade, é inconsistência visual: o mesmo botão muda de aparência conforme a seção.

### 1.6 Seções vazias sem estado vazio

Medi direto no DOM:

- **"Animais para Adoção"** — 0 cards. A seção inteira tem 440px: título, subtítulo e botão.
- **"Campanhas Especiais"** — 0 cards. Mesma coisa.

Provavelmente o banco está vazio (é o que a gente esperava). Mas o código não trata isso: em vez de
dizer "em breve, estamos cadastrando os animais", renderiza um vão em branco. Para quem visita, o
site parece quebrado.

### 1.7 O logotipo aparece duas vezes na dobra

No hero existe uma marca d'água grande de "projeto maya" em marrom, no canto superior esquerdo,
logo abaixo do logotipo de verdade do cabeçalho. No desktop ela colide visualmente com o `<h1>`; no
celular fica espremida em cima dele. Lê como duplicata, não como elemento decorativo.

### 1.8 Celular

- O ilustração da Maya some no celular, e o espaço dela continua reservado: sobram uns 200px de
  azul vazio abaixo dos botões.
- A marca d'água de 1.7 fica ainda mais próxima do título.
- O `h1` quebra em duas linhas com a segunda ilegível (o mesmo 1,22:1).

### 1.9 Observação sobre as animações

Quando se rola a página rápido, seções inteiras aparecem em branco por um instante — o
`ScrollReveal` entra com os elementos em `opacity: 0`. Conferi depois pelo DOM e nenhum elemento
fica preso invisível, então não é um travamento: é a animação sendo lenta demais para a rolagem.
Ainda assim dá a impressão de página quebrada. Vale reduzir a duração ou acionar o reveal um pouco
antes do elemento entrar na tela.

---

## 2. O brandbook, e onde o site se afasta dele

### O que está certo

- **Tipografia.** Caprasimo nos títulos e Nunito no corpo, exatamente como a página 17 manda.
- **Hexadecimais.** Os seis tons principais do `tailwind.config.ts` batem com a página 16.
- **Tom de voz.** "Do resgate, à adoção", "prazer, maya", "Quer fazer parte dessa causa?" — direto,
  carinhoso, com diminutivo. É o que a página 9 pede.
- **O rodapé.** Marrom cheio com texto bege é o par que o brandbook mais usa. É a seção mais bonita
  e mais "Maya" do site inteiro.

### O que se afasta

**A proporção está invertida.** A página 16 representa a proporção de uso pelo tamanho dos
retângulos: bege e marrom ocupam a metade de cima, verde e azul vêm abaixo em tamanho médio, e
rosa, laranja e areia são faixas finas. O site faz o contrário:

| cor | peso no brandbook | peso na home |
| --- | --- | --- |
| bege `#D9D3D3` | principal | uma seção de 440px |
| marrom `#564334` | principal | só o rodapé |
| azul `#96B6D3` | secundário | **hero (765px) + campanhas (480px)** |
| branco puro | não está na paleta | **1.620px, o fundo dominante** |

O azul virou a cor do site e o branco virou o fundo. Os dois tons que deveriam carregar a marca
viraram detalhe.

**O fundo branco não é do brandbook.** Em `app/layout.tsx` o body é `bg-white`, e isso sobrescreve
o `bg-maya-beige` que está no `globals.css`. Sobraram duas regras discordando entre si, e ganhou a
que não é da marca.

**O rosa.** O `tailwind.config.ts` tem `maya-pink: #DA5F75`. Amostrando o pixel da página 16, o
rosa do brandbook é **`#E99797`** — que no config está como `maya-pink-light`. O `#DA5F75` aparece
na camada de texto do PDF mas não no quadrado impresso, então pode ser uma versão anterior que
ficou no arquivo. Vale uma pergunta à Carolina antes de usar.

E uma regra do brandbook que o código não registra em lugar nenhum: **"o uso da cor rosa é indicado
para situações de urgência"**. Hoje nada impede alguém usar rosa num botão comum.

**Caprasimo em todo h1–h6.** O `globals.css` aplica `font-display` a todos os níveis de título. O
Caprasimo é uma display pesada, feita para chamada grande. Em `h4`/`h5`/`h6` de painel e formulário
ela atrapalha a leitura. O próprio brandbook, nos textos de apoio e títulos pequenos das páginas,
usa Nunito ExtraBold — repare na página 16: "paleta cromática" está em Nunito, não em Caprasimo.

---

## 3. Sobre as cores não estarem agradáveis

Você tem razão, e dá para dizer por quê, sem achismo.

**O "bege" `#D9D3D3` não é bege.** Em RGB é 217/211/211 — quase sem saturação, com um resíduo de
vermelho. É um **cinza**. No papel, com o CMYK que o brandbook especifica (C0 M3 Y3 K15), ele puxa
para o quente porque o papel já é quente. Na tela, ao lado de branco puro `#FFFFFF`, ele lê como
cinza sujo. É daí que vem a sensação de desbotado: a cor que deveria dar o aconchego da marca está
funcionando como cinza de interface.

**Falta um ponto escuro.** Tirando o marrom, toda a paleta vive entre 60% e 85% de luminosidade.
Quando tudo tem o mesmo peso, nada tem hierarquia — por isso botão, título e texto de apoio
competem em vez de se organizarem.

**Nada tem contraste de verdade.** Nenhuma combinação da paleta entre si passa de 4,9:1. Os pares
que funcionam são todos com marrom ou com branco, e o site usa pouco os dois.

---

## 4. Três caminhos para a cor

Nenhum deles troca a identidade. A ideia é separar duas coisas que hoje estão misturadas:
**as cores da marca** (o que está no brandbook, imutável) e **os tokens de interface** (variações
das mesmas matizes, calculadas para ter contraste em tela). Marca é para reconhecer; token é para
ler. Toda marca séria tem os dois.

Em todas as opções, três mudanças são comuns:

- O fundo deixa de ser `#FFFFFF` e passa a `#F4EFE8` — um off-white quente derivado do bege. O
  marrom em cima dele dá 8,17:1, e a página inteira esquenta.
- `#D9D3D3` sai de fundo de página e vira **borda, divisor e fundo de card secundário**.
- Botão primário nunca mais usa texto branco sobre cor clara.

### Opção A — Terroso (a mais fiel ao brandbook)

Devolve ao marrom e ao bege o peso que a página 16 dá a eles. O azul e o verde voltam a ser
detalhe: faixa de seção, ícone, tag.

| papel | cor | contraste |
| --- | --- | --- |
| fundo da página | `#F4EFE8` | — |
| texto | `#564334` | 8,17 sobre o fundo |
| botão primário | fundo `#564334`, texto `#F4EFE8` | **8,17** |
| botão secundário | borda `#564334`, texto `#564334` | 8,17 |
| seção de destaque | fundo `#564334`, texto `#D9D3D3` | 6,0 |
| acento | `#B2C09D` em fundo de tag, `#677C48` em link | 4,61 |

É o rodapé atual aplicado ao site todo — e o rodapé é hoje a melhor parte da página.

### Opção B — Verde natureza

Para dar ao verde o papel de cor assinatura, mas num tom que aguenta texto. O `#677C48` é o mesmo
matiz de `#B2C09D`, só mais escuro.

| papel | cor | contraste |
| --- | --- | --- |
| fundo da página | `#F4EFE8` | — |
| texto | `#564334` | 8,17 |
| botão primário | fundo `#677C48`, texto branco | **4,61** |
| fundo de seção | `#E8EBE2` (verde bem claro) | — |
| acento forte | `#B2C09D` em blocos grandes | — |

Combina com o tema — resgate, grama, ar livre — e é o que a página 19 do brandbook pede nas fotos
("paredes e gramados são muito mais do que bem-vindos").

### Opção C — Azul heterocromia

Mantém a escolha que o site já fez, mas corrigida. O azul tem um significado bonito no brandbook:
são os olhos da Maya. O problema não é o azul, é que `#96B6D3` é claro demais para o que estão
pedindo dele.

| papel | cor | contraste |
| --- | --- | --- |
| fundo da página | `#F4EFE8` | — |
| texto | `#564334` | 8,17 |
| botão primário | fundo `#407AAE`, texto branco | **4,55** |
| hero | `#96B6D3` com texto `#564334` | 4,42 (só título grande) |
| acento | `#B2C09D` | — |

### A minha recomendação

**Opção A.** Três motivos: é a que o brandbook de fato descreve; é a única em que o par principal
(marrom/bege) já passa de 8:1, o que resolve acessibilidade sem ficar negociando; e é a que menos
precisa inventar cor nova — só reposiciona o que já existe. O verde e o azul ficam mais bonitos
como acento raro do que como fundo de tela inteira.

Se quiser um meio-termo: Opção A no site público e o azul reservado para a área do doador, criando
uma separação visual entre "site" e "sistema".

### Escala derivada, se quiser montar os tokens

Mesmas matizes do brandbook, escurecidas até passarem 4,5:1 sobre branco. Servem para texto, link e
ícone — nunca substituem a cor da marca em área grande.

| cor da marca | versão para texto | contraste sobre `#FFFFFF` |
| --- | --- | --- |
| verde `#B2C09D` | `#677C48` | 4,61 |
| azul `#96B6D3` | `#407AAE` | 4,55 |
| laranja `#D5934F` | `#A76522` | 4,64 |
| areia `#978062` | `#8A7150` | 4,61 |
| rosa `#E99797` | `#D83855` | 4,55 |

---

## 5. O modo escuro faz sentido?

**No site público, não.** Três razões:

1. **A marca é de luz quente.** Tons terrosos, fundos sólidos claros, fotos de bicho em parede e
   gramado. O escuro apaga justamente o que o brandbook define como a cara do projeto.
2. **Nunca foi feito.** Os componentes da home têm zero regras de escuro. Terminar isso significa
   revisar umas 20 telas públicas que hoje não têm nenhuma — trabalho real, para um site que ainda
   não tem os animais cadastrados.
3. **Ninguém mora no site.** A pessoa entra, vê um animal, doa ou chama no WhatsApp, e sai. O modo
   escuro compensa em ferramenta de uso diário, não em visita de três minutos.

**No painel, sim.** `/admin` e `/doador` já estão prontos (118, 113, 106 classes `dark:` por
página). Ali as pessoas passam tempo, às vezes à noite, e o trabalho já foi feito.

Então a sugestão é: **tirar o botão do cabeçalho público e manter dentro do painel.** Some o
problema sem jogar nada fora, e o site público passa a ter uma aparência só — que é a aparência que
o brandbook descreve.

A alternativa, se você quiser manter: completar as telas públicas e, antes disso, consertar o CSS
aninhado do item 1.1, senão o resto continua não pegando.

---

## 6. Ordem sugerida

Nada aqui foi aplicado. Por ordem de quanto muda para quem visita:

1. **"o amor transforma." legível.** Trocar o laranja por marrom `#564334` sobre o azul (4,42, passa
   em texto grande) ou escurecer o laranja para `#A76522`. Uma linha de código, e é o título do site.
2. **Estado vazio em Animais e Campanhas.** Um texto de "em breve" no lugar dos dois buracos.
3. **Decidir o modo escuro** — tirar do público ou terminar. Hoje é a pior das três opções.
4. **Padronizar o botão verde** com texto marrom em todos os lugares.
5. **Corrigir os nove contrastes** do item 1.4, usando a escala derivada do item 4.
6. **Trocar o fundo branco** por `#F4EFE8` e rebalancear a proporção das cores.
7. **Tirar a marca d'água** do hero, ou afastá-la do título.
8. **Caprasimo só em h1 e h2**; h3 para baixo em Nunito ExtraBold.

Os itens 1 a 4 são pequenos e não mexem na identidade. Do 5 em diante é uma rodada de design com
tempo, e vale conversar com a ONG antes — e, se der, com a Carolina, que fez o brandbook.

---

## O que foi alterado

Branch local `design/cores-e-contraste`, a partir de `28c64e4`. Produção intacta.

### Paleta

`tailwind.config.ts` passou a ter dois blocos separados e comentados:

- **Cores da marca** — as sete do brandbook, com a regra do rosa ("só urgência") escrita ali.
  O `maya-rosa` agora é `#E99797`, que é o que está impresso na página 16. O `maya-pink` virou
  alias dele; o `#DA5F75` que estava no lugar não é do brandbook.
- **Tokens de interface** — as mesmas matizes escurecidas até 4,5:1 sobre o fundo da página:
  `maya-green-dark #607344`, `maya-blue-dark #3D71A0`, `maya-orange-dark #9B5F20`,
  `maya-sand-dark #7F694C`, `maya-rosa-dark #D22626`, mais `maya-orange-light #E3A96A` para
  destaque sobre marrom, `maya-cream #F4EFE8` de fundo e `maya-line #DFD5C8` de borda.

A regra está escrita no arquivo: cor da marca em área grande, token escuro em texto, link, ícone
e borda.

### Modo escuro

A classe `.dark` agora só entra em `/admin` e `/doador`, nos dois lugares que decidem isso: o
script de inicialização em `app/layout.tsx` e o `hooks/useDarkMode.ts`. O botão sumiu do
cabeçalho público e continua na área do doador. Nem a preferência do sistema operacional liga o
escuro no site público.

O CSS aninhado de `globals.css` virou seletor plano (`.dark .card`). Conferido no CSS compilado:
antes `grep '\.dark \.card'` não achava nada, agora a regra está lá.

### Contraste

Rodei a mesma medição que gerou as tabelas acima, agora na home local, contando texto grande
(≥24px, ou ≥18,66px em negrito) pelo limite de 3,0 e o resto por 4,5:

- home, modo claro: **0 falhas** (eram 7)
- `/doador/login`, modo escuro: **0 falhas**

O que mudou para chegar lá:

| antes | depois |
| --- | --- |
| hero azul, título branco, 2ª linha laranja em 1,22 | hero marrom, título creme, 2ª linha `maya-orange-light` em 4,51 |
| `.btn-primary` verde com texto branco (1,92) | marrom com texto creme (8,17) |
| `.btn-secondary` azul com texto branco (2,12) | verde da marca com texto marrom (4,86) |
| ícones brancos sobre os quadrados pastel (1,9 a 3,8) | ícones creme sobre a matiz escurecida |
| links "Doar Agora", "Ser Apoiador", "Quero Ajudar", "Ser Voluntário" | cada um no token escuro da sua cor |
| faixa de campanhas em azul-claro com texto branco | `maya-blue-dark` com texto creme |
| "Área do Doador" e item ativo do menu em verde sobre branco | `maya-green-dark`, e o fundo da pílula de /10 para /25 |
| rodapé: copyright em `white/40` e "Reportar Resgate" em laranja (3,61) | bege e `maya-orange-light` |
| `.section-subtitle` com `opacity-80` | `maya-sand-dark`, sem opacidade |

### Proporção e fundo

O fundo branco puro saiu. A home agora alterna marrom (hero) → creme → bege → creme →
azul-escuro → marrom (rodapé), que é a hierarquia da página 16: marrom e bege carregando, verde e
azul como acento. As ondas divisórias em `app/page.tsx`, no hero e no topo do rodapé foram
reajustadas para casar com as cores novas.

### Estados vazios

"Animais para Adoção" e "Campanhas Especiais" passaram a dizer o que está acontecendo em vez de
deixar um vão. A classe `.estado-vazio` está no `globals.css` para reaproveitar nas outras listas.

### Outros

- A marca d'água do logotipo saiu do hero.
- O hero no celular caiu de `min-h-[85vh]` para `min-h-[70vh]`, o que elimina o espaço morto que
  sobrava onde a ilustração da Maya não aparece.
- Caprasimo agora para no `h2`; `h3` a `h6` usam Nunito ExtraBold, como o próprio brandbook faz
  nos títulos menores.
- O gradiente do `.text-shimmer` trocou o `#DA5F75` pelo rosa do brandbook.

### Verificação

- `npx tsc --noEmit` — sem erros
- `npm run build` — sucesso, 40 rotas
- `npm test` — 142 testes, 13 arquivos, todos passando
- Home, `/doador/login`, desktop e celular, claro e escuro, conferidos no navegador

---

## Pendente

**A gravação de tela.** O arquivo não abriu: o macOS bloqueia a pasta temporária onde a gravação
fica antes de ser salva (`Operation not permitted`, mesmo tentando copiar). Salvando na Mesa e
mandando de novo, dá para rever os bugs que você mostrou ali — esta revisão é o que eu encontrei
por conta própria, sem ver o vídeo.

**Para conversar com a ONG**, e se possível com a Carolina, que fez o brandbook:

- A troca do hero de azul para marrom é a mudança mais visível. Reverter é trocar uma classe.
- O rosa: confirmar se é `#E99797` mesmo. O `#DA5F75` aparece na camada de texto do PDF, mas não
  no quadrado impresso.
- O painel administrativo não foi revisado. Ele tem 296 usos de cor de marca como texto e vai
  precisar da mesma passada, mas é tela de quem trabalha, não de quem visita.
