# O que a ONG já tem, e o que dá pra carregar no banco

Varredura feita na madrugada de 2026-11-06, em três fontes: o Drive do
`projetomaya20@gmail.com` sincronizado na sua máquina, a planilha GESTÃO PROJETO
MAYA, e o perfil público do `@projeto.maya`. Nada foi alterado em produção.

---

## Resposta curta

**Dá pra começar hoje, com 27 animais reais.** Mas não carregando na estrutura
atual, e não a partir do `seed.sql` que está no repositório.

Três coisas que apareceram e mudam o plano:

1. **O `supabase/seed.sql` tem dados inventados.** Oito animais com fotos de
   banco de imagens, uma campanha com "R$ 8.750 arrecadados" que nunca existiu,
   e estatísticas (347 resgatados, 289 adoções) que não batem com nada. Os
   números reais da ONG são 1.900 e 1.700. Esse arquivo não pode rodar em
   produção como está.
2. **A planilha e a tabela `animais` não se encaixam.** A ONG usa 5 portes e 4
   estados; a tabela aceita 3 portes e um sim/não para adotado. Carregar como
   está perderia informação em 17 dos 27 registros.
3. **Achei os links de doação do PagBank** — os oito que a gente estava
   esperando da Ana. Estão públicos no Linktree da ONG desde sempre. E **um
   deles está com defeito**, cobrando o valor errado.

---

## 1. O defeito no Linktree (resolver primeiro)

O `linktr.ee/projetomaya` tem oito botões de doação mensal. Abri os oito e
conferi o valor de cada um na página do PagBank:

| botão no Linktree | link | valor que o PagBank cobra |
| --- | --- | --- |
| R$ 5,00 | `pag.ae/81GhTRfS8` | R$ 5,00 ✓ |
| R$ 10,00 | `pag.ae/81Gi3hcB8` | R$ 10,00 ✓ |
| R$ 30,00 | `pag.ae/81Gi3S818` | R$ 30,00 ✓ |
| R$ 50,00 | `pag.ae/81Gi4k_Kp` | R$ 50,00 ✓ |
| R$ 80,00 | `pag.ae/81Gi9f-up` | R$ 80,00 ✓ |
| **R$ 100,00** | **`pag.ae/81Gi9f-up`** | **R$ 80,00 ✗** |
| R$ 150,00 | `pag.ae/81Gia47jp` | R$ 150,00 ✓ |
| R$ 300,00 | `pag.ae/81GiakDg4` | R$ 300,00 ✓ |

O botão de R$ 100 aponta para o mesmo link do de R$ 80. Quem clica em "doar
R$ 100" assina uma recorrência de R$ 80. Não existe link de R$ 100 — ou nunca
foi criado, ou o endereço errado foi colado.

São 38,4 mil seguidores e esse é o caminho de doação que o perfil inteiro
aponta. Vale avisar a Ana hoje, antes de qualquer coisa de site. Conserto: criar
a assinatura de R$ 100 no PagBank e trocar o link.

Os oito links servem direto para os botões de doação do site — era o que estava
faltando pra tirar a doação do "em breve".

---

## 2. O Drive da ONG

15.728 arquivos em 12 pastas. O grosso é mídia: 8.928 `.jpg`, 1.876 `.jpeg`,
594 `.mov`, 498 PDFs, 325 `.heic`, 261 `.mp4`.

| pasta | o que tem | serve pro site? |
| --- | --- | --- |
| `0 - JURÍDICO` | estatuto, CNPJ, atas, certidões negativas, reeleição 2025 | transparência |
| `1 - ADMINISTRAÇÃO GERAL` | **a planilha mestre**, 5 protocolos, prontuários, dossiê institucional | **sim, é a fonte** |
| `2 - FINANCEIRO` | caixa 2021–2023, financeiro 2024, estoque, extratos | prestação de contas |
| `3 - PARCERIAS` | planilha de parcerias, Pearson | página de parceiros |
| `5 - MÍDIA` | brandbook, logos, **fotos por animal**, apresentações | **sim, fotos** |
| `6 - FORMULÁRIOS` | 14 Google Forms: adoção, resgate, LT, protetores, voluntariado | o que o site substitui |
| `7 - ATAS` | atas de reunião | — |
| `8 - ADOÇÕES` | disponíveis / em processo | quase vazia (15 arquivos) |
| `9 - CAMPANHA CASTRAÇÃO` | inscrições, valores, doador mensal, fichas | campanha do site |
| `11 - EVENTOS` | Arraiá 5 anos, Puppy Zen, The Puppy Club | tabela `eventos` |
| `12 - ANA` | fotos organizadas, adesivos | — |

### O que mais me chamou atenção

**`1 - ADMINISTRAÇÃO GERAL/PROTOCOLOS E GUIAS/`** — cinco protocolos escritos:
resgate, adoção, cadastro de protetora, distribuição para protetores,
divulgação de animais. É o fluxo real da ONG, documentado. O painel
administrativo devia espelhar isso, e hoje não espelha nada — foi desenhado
sem olhar pra cá.

**`VOLUNTÁRIOS/5 - FICHA PERFIL DO ANIMAL.gdoc`** — a ficha que elas já usam
pra descrever um animal. É a especificação do formulário de cadastro do
painel, pronta, escrita por quem usa.

**`PRONTUÁRIOS/2025/Adultos/`** — um documento por animal (George, Hope,
Glória, Spike, Samantha, Charlie, Neymar, Sarah) e um `000 matriz.gdoc` que é
o modelo. Histórico veterinário individual.

**`5 - MÍDIA/FOTOS ADULTOS/`** — 116 fotos em 9 pastas, uma por animal:

| animal | fotos |
| --- | --- |
| George | 40 |
| Matilde | 16 |
| HOPE | 14 |
| Samantha | 13 |
| BENEDITA | 11 |
| Neymar | 10 |
| Zoe | 7 |
| Branca | 5 |
| Moana | 0 |

George, Hope, Neymar e Sarah aparecem nas três fontes ao mesmo tempo: planilha,
prontuário e pasta de fotos. São os quatro melhores candidatos pra primeira
ficha completa no site.

**Há um documento de senhas no Drive da ONG.** Não abri, e sugiro que ninguém
use aquele caminho. Senha em documento compartilhado, numa conta que já passou
por várias mãos de voluntário, é um problema que entra na mesma conversa de
segurança que a gente teve sobre o repositório. O caminho exato não vai escrito
aqui de propósito: este repositório é público.

---

## 3. A planilha GESTÃO PROJETO MAYA

É a que você mandou o link. Três abas: `Painel`, `Animais`, `Dashboard`.
A aba `Animais` tem 18 colunas e **27 animais**.

Trabalhei com a cópia `.xlsx` que o Drive mantém local, de **11/07/2026**. A
versão online pode estar mais nova — vale reexportar antes da carga de verdade.

### Como os 27 se distribuem

| status | quantos |
| --- | --- |
| Aguardando adoção | 13 |
| Adotado | 7 |
| Em tratamento | 4 |
| Adoção em andamento | 3 |

Porte: 12 são P/M, 6 são P, 5 M, 2 G, 2 M/G.
Sexo: 16 fêmeas, 11 machos. Idade: 15 adultos, 12 filhotes.
Lar temporário: 12 dos 27 estão em LT (Vivi com 4, Rep com 3, Bicharada 2,
Carol 1, Fernanda 1, Outros 1).
Grupo de origem: Ninhada Toy Story (6), Ninhada Florzinhas (4), Acumuladora (3),
Lixão (2), Hipismo (2), Lilo e Stich (2), Ermitage (1), MG (1).

### O que está vazio

Três colunas existem e nunca foram preenchidas: **Vacinas (0/27)**,
**Castração (0/27)** e **Próxima Consulta (0/27)**. Observações também: 0/27.

Isso contrasta com o que o Instagram afirma publicamente, no destaque
DISPONÍVEIS: *"Todos eles já foram liberados pela veterinária, receberam pelo
menos a primeira dose da vacina e, quando possuem mais de 6 meses, já são
castrados."* A política existe, o registro não. Se o site for exibir "vacinado"
e "castrado" por animal, esse dado vai ter que ser preenchido na mão primeiro —
e ninguém vai querer descobrir isso depois que a página estiver no ar.

---

## 4. O Instagram

`@projeto.maya` — **3.775 posts, 38.4 mil seguidores**, 2.890 seguindo.
Campinas-SP. Bio: "Projeto voluntário • do resgate à adoção 🤎".

É de longe o maior ativo digital da ONG, e muito maior do que o site vai ser no
primeiro ano. Vale pensar no site como destino do Instagram, não como canal
concorrente.

Consegui ler 274 posts com as legendas antes da sessão do navegador cair.
Destaques fixados: Doação Mensal, DISPONÍVEIS, Rifas Resultado, Puppy Zen,
Arraiá 5 anos, Ajude, Contato, Espaço x porte, Three Pets, Grupo Castração,
Conta, LT.

### As legendas de adoção têm formato fixo

Isso é a melhor notícia do levantamento. Os posts seguem um padrão rígido:

```
ADOTE A DENDÊ • Ninhada Bahia
55 dias • porte estimado P/M-M
Vermifugada ✅ 1ª V10 ✅

[história do animal, 1 a 3 parágrafos]
```

E quando o animal é adotado, elas **editam o post** e trocam o título para
`[ADOTADA]`. Ou seja: nome, ninhada, idade, porte, situação vacinal, história e
status já estão estruturados, em texto, com três anos de histórico. Dos 274
posts que li, 66 são de adoção.

Consigo extrair isso pra dentro do banco de forma automática. Não fiz ainda
porque a sessão logada do Chrome saiu do ar no meio (detalhe no fim).

### A planilha está atrasada em relação ao Instagram

A planilha tem Rosa, Gardênia, Mel, Temaki, as Florzinhas e a Toy Story.
O Instagram, nos posts mais recentes, está divulgando ninhadas que **não estão
na planilha**: Era do Gelo (Brookie, Shira, Gladys), Bahia (Dendê, Cupuaçu,
Tapioca, Cajá, Acarajé, Moqueca), Pedras Preciosas (Ágata). Mais Café e Cupuaçu
divulgados individualmente.

Conclusão prática: **o Instagram é a fonte mais atual; a planilha é a mais
estruturada.** O site vai precisar das duas, e no fim vai ter que substituir as
duas — senão vira a terceira lista desatualizada.

### Dados institucionais que o Instagram confirma

- PIX (e-mail): `projetomaya@outlook.com`
- Itaú Unibanco – 341, AG 1652, CC 99858-2
- CNPJ 42.686.223/0001-02
- Adoção é por e-mail: `projetomaya@outlook.com`

### Um evento daqui a dez dias

Tem post sobre a **Lojinha do Projeto Maya na Feira FEM, domingo 16 de
novembro, das 10h às 17h**. Se a tabela `eventos` for carregada, é o primeiro
registro real — e é a única coisa deste documento com prazo.

---

## 5. O que o site tem hoje

### O `seed.sql` não pode rodar

| o que o seed insere | problema |
| --- | --- |
| 8 animais (Mel, Thor, Luna, Bob, Nina, Max, Mia, Caramelo) | 22 URLs do Unsplash — nenhum animal real |
| campanha "Castração Solidária" | `goal: 15000, raised: 8750` — arrecadação que não existiu |
| `rescued: 347`, `adopted: 289` | os números reais são ~1.900 e ~1.700 |
| `volunteers: 52` | o dossiê da ONG deixa esse campo em branco |

Números inventados num site de ONG não são placeholder, são prestação de contas
falsa. Qualquer um pode perguntar de onde saiu o R$ 8.750.

### A tabela `animais` não cabe os dados reais

```sql
size  text not null check (size in ('small','medium','large'))
is_adopted boolean not null default false
```

A ONG usa P, P/M, M, M/G, G — cinco. E quatro estados, não dois. Hoje, os
**4 animais em tratamento apareceriam no site como disponíveis para adoção**,
porque `is_adopted = false` é a única coisa que a tabela sabe dizer sobre eles.

Também não há onde guardar: data de nascimento, data de entrada, lar temporário,
grupo de origem, vermifugação, vacinação, castração, condição especial.

E falta o caminho inverso: a coluna `type` ('dog'/'cat') é obrigatória e **a
planilha não tem coluna de espécie**.

---

## 6. A proposta

Três arquivos em [docs/proposta-banco/](proposta-banco/), nenhum aplicado:

**[01-ajuste-tabela-animais.sql](proposta-banco/01-ajuste-tabela-animais.sql)**
— acrescenta `porte_label` (o rótulo que a ONG escreve, mantendo `size` como
eixo de filtro), `status` com os 4 estados reais, os campos de ficha interna, e
três colunas de rastreio: `origem_registro`, `instagram_url` e `revisado`.

Esse `revisado` é o que me deixa dormir tranquilo: todo registro importado entra
com `revisado = false`, e o site público só lista `revisado = true`. Nada que
uma máquina extraiu aparece pro visitante antes de uma pessoa olhar.

**[02-carga-animais-reais.sql](proposta-banco/02-carga-animais-reais.sql)** —
os 27 animais da planilha, gerados por script a partir do `.xlsx`, não digitados
por mim. Confere com o Dashboard da planilha: 13 / 7 / 4 / 3.

**[03-numeros-reais-da-ong.sql](proposta-banco/03-numeros-reais-da-ong.sql)** —
troca as estatísticas inventadas pelas do Dossiê Institucional: 1.900 resgates,
1.700 adoções, 1.300 castrações, 28 feiras. `volunteers` sai da lista, porque o
dossiê deixou o campo em branco e eu não vou preencher.

### Ordem sugerida

1. Avisar a Ana do link de R$ 100. É o único item que custa dinheiro agora.
2. ~~Confirmar a espécie dos 27.~~ Feito em 06/11: são todos cães.
3. Rodar 01, 02 e 03. **Não existe staging** — a ONG tem um projeto Supabase só,
   então isso é produção. Conferi o estado dele em 06/11, antes de qualquer
   coisa: `animais`, `campanhas`, `eventos` e `site_stats` estão **com zero
   linhas**, e `doadores` tem 2 registros de teste. O `seed.sql` com os dados
   inventados nunca foi aplicado — o banco está limpo, e é por isso que as duas
   seções da home aparecem vazias. Carregar aqui é baixo risco: não há nada para
   sobrescrever.
4. Ligar os 8 links do PagBank nos botões de doação.
5. Escrever o estado vazio das seções de Animais e Campanhas — enquanto os
   registros estiverem com `revisado = false`, o site continua mostrando os
   dois buracos que achei ontem.
6. Importar as fichas do Instagram, com revisão humana por animal.

---

## 7. O que eu não consegui resolver sozinho

**~~A espécie dos 27 animais.~~** Resolvido em 06/11: o Eduardo confirmou que
são todos cães. Fica o registro de que a planilha não tem coluna de espécie —
quando a ONG cadastrar o primeiro gato, a próxima importação volta a adivinhar
se essa coluna não existir até lá.

**O WhatsApp do site pode estar errado.** A variável de ambiente é
`5519994128408`. O Dossiê Institucional traz **(19) 99422-4336**. São números
diferentes. Pode ser que um seja pessoal e outro institucional, mas vale
confirmar antes do site mandar gente pro número errado.

**A planilha online pode estar na frente da cópia local.** Trabalhei com o
`.xlsx` de 11 de julho. Quando você estiver acordado e logado, exporto a versão
de hoje e comparo — se tiver animal novo, a carga muda.

**O Instagram caiu no meio.** A aba logada que você deixou aberta saiu do grupo
de abas que eu controlo, e a aba nova que abri veio deslogada (Instagram mostra
o muro de login). Consegui 274 posts e 66 fichas de adoção antes disso. Pra
terminar a extração das ~3.775 publicações, preciso que você deixe uma aba
logada e me avise — aí eu puxo o resto de uma vez.

**Os `.gdoc` não têm conteúdo local.** Protocolos, prontuários, diretrizes de
adoção, textos prontos: o Drive guarda só um ponteiro de 180 bytes. Pra ler o
conteúdo preciso abrir cada um no navegador logado. São uns 25 documentos, e
alguns deles (os protocolos, a ficha de perfil do animal) são exatamente o que
deveria guiar o painel administrativo. Vale uma sessão dedicada.

---

## 8. A skill de Instagram que você mandou

Instalei as 13 em `~/.claude/skills/`. Li o código antes: os seis scripts Python
usam só biblioteca padrão, não fazem rede, não chamam subprocesso. Limpo.

**Mas nenhuma delas serve pro que você pediu hoje.** São skills de *escrever*
Instagram, não de *ler*: reel, carrossel, legenda, story, DM, comentário,
resposta, plano semanal. A captura de informação do perfil eu fiz com o
navegador mesmo.

Duas valem pra ONG, mais pra frente:

- **`/ig-profile`** pontua o perfil contra uma rubrica de 12 itens. A bio do
  Projeto Maya hoje é "Projeto voluntário • do resgate à adoção 🤎" e manda pro
  Linktree. Quando o site entrar, essa bio e esse link mudam — é a hora de usar.
- **`/ig-audit`** olha o que já foi postado e diz o que funcionou. Com 3.775
  posts de histórico, tem material.

Tem uma terceira, a `/ig-human`, que tira cacoete de texto gerado por máquina.
Se a ONG for usar IA pra escrever legenda, vale passar tudo por ela antes —
o tom de voz do brandbook ("verdadeiro, carinhoso e ativista", diminutivo
liberado) é o oposto de texto de robô, e é fácil estragar.

Deixei o `templates/voice.md` em `~/.claude/instagram/voice.md`. Ele precisa ser
preenchido com o tom da ONG pra qualquer uma delas funcionar direito — e a
página 9 do brandbook já tem isso escrito, é só transpor.

---

## Arquivos gerados nesta varredura

- [docs/LEVANTAMENTO-DADOS.md](LEVANTAMENTO-DADOS.md) — este documento
- [docs/proposta-banco/01-ajuste-tabela-animais.sql](proposta-banco/01-ajuste-tabela-animais.sql)
- [docs/proposta-banco/02-carga-animais-reais.sql](proposta-banco/02-carga-animais-reais.sql)
- [docs/proposta-banco/03-numeros-reais-da-ong.sql](proposta-banco/03-numeros-reais-da-ong.sql)
- [docs/REVISAO-DESIGN.md](REVISAO-DESIGN.md) — a revisão de ontem
