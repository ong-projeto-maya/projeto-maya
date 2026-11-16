# Passagem de sessão — site do Projeto Maya

| | |
| --- | --- |
| **Sessão** | projeto-maya-central |
| **Grupo na barra lateral** | Projeto Maya |
| **Projeto** | Site institucional do Projeto Maya (ONG de resgate e adoção, Campinas-SP) |
| **Pasta do site** | `/Users/eduardopannain/Documents/Projects/projeto-maya` |
| **Pasta de documentos** | `/Users/eduardopannain/Documents/Projects/Projeto Maya` (outra pasta, nome parecido — confundir as duas já custou tempo) |
| **Repositório** | `https://github.com/ong-projeto-maya/projeto-maya` (remote chamado `ong`) |
| **Produção** | `https://projeto-maya-green.vercel.app` |
| **Data** | 2026-11-16 |

---

## 1. Objetivo da conversa

Assumir o site da ONG das mãos do desenvolvedor anterior (Marcelo / MGR Solutions) e deixá-lo
apresentável e com dados reais. Ao longo da sessão isso virou quatro frentes: revisar o design
contra o brandbook, varrer o Drive e o Instagram da ONG atrás do que existe de informação,
estruturar e carregar o banco com os animais de verdade, e ajustar o hero depois do retorno da
Raquel e da Ana.

---

## 2. Estado atual

### Pronto e conferido em produção

- **Repositório no nome da ONG**, histórico preservado (72 commits, `Commit Inicial` intacto), sem
  o brand book do desenvolvedor anterior no `main`. Repositório público para a Vercel Hobby aceitar.
- **Chaves do Supabase migradas** para os nomes novos (`sb_publishable_` / `sb_secret_`), com os
  antigos como reserva, em `lib/supabaseKeys.ts`. As antigas são descontinuadas até o fim de 2026.
- **Marca do desenvolvedor anterior removida** do rodapé, do README, do `SETUP_SUPABASE.md` e do
  `dependabot.yml`. A pasta `dashboard/` (8 arquivos, 848K, com logo de terceiros) foi apagada.
- **PRs #4 a #8 mergeados**: links do PagBank ligados, fichas de quatro animais, animais não
  revisados escondidos do site e do sitemap, cores e contraste, e-mail no lugar do WhatsApp,
  imagens da marca trocadas pelos arquivos do brandbook.
- **Banco carregado**: 27 cães reais, 13 disponíveis / 7 adotados / 4 em tratamento / 3 em processo
  (bate com a aba Dashboard da planilha). Estatísticas reais da ONG no lugar das inventadas.
- **A chave do Supabase na Vercel foi corrigida.** Conferi lendo os 13 chunks do bundle em
  produção: o `COLE_AQUI` sumiu e tem uma `sb_publishable_` de verdade. Isso tinha sido um bug
  sério — a Vercel estava guardando o texto do marcador como se fosse a chave, e o site nunca
  conseguiu ler o banco até alguém corrigir.

### Pela metade / não commitado

- **Hero e trilha de pegadas** — está tudo só na árvore de trabalho, na branch
  `banco/whisky-e-caju`, **sem commit**:
  - `components/home/Hero.tsx` (modificado)
  - `components/home/PawTrail.tsx` (novo, não rastreado)
  - `app/globals.css` (modificado — keyframes `pawTrail`)
  - `.claude/launch.json` (modificado)
  - `docs/pegadas-opcoes.html` (novo, não rastreado — página de comparação)
  - `docs/LEVANTAMENTO-DADOS.md` e `docs/proposta-banco/01` a `04` (novos, não rastreados)
  - Estado: `npx tsc --noEmit` limpo, 142 testes passando.
- **Branch `banco/whisky-e-caju`** tem 1 commit (`d746c11`, registro da saída do Whisky e adoção do
  Caju) que **nunca foi empurrado** e não tem PR. Veio de uma sessão fork que ficou esperando
  resposta sobre abrir PR ou deixar local.

### Não testado / não confirmado

- **O `04-rls-so-mostra-revisado.sql` provavelmente NÃO foi aplicado.** Eu tentei rodar e fui
  bloqueado pelo classificador de produção (não estava no "pode rodar" que cobria o 01, 02 e 03).
  Depois a conversa seguiu para outro assunto e isso ficou no ar. O efeito prático dele —
  esconder animal não revisado — acabou sendo resolvido no código, pelo PR #5. **Conferir antes de
  assumir qualquer coisa** (consulta no item 6).
- **O token de acesso do Supabase em `.env.migrate` não vale mais.** Testei contra
  `GET https://api.supabase.com/v1/projects` e voltou **401**. Precisa gerar outro antes de mexer
  no banco.
- **A varredura do Instagram parou em 274 de 3.775 posts.** Detalhe no item 7.
- Os números da ONG publicados no site (1.900 resgates, 1.700 adoções, 1.300 castrações, 28 feiras)
  vêm do Dossiê Institucional de **setembro de 2025**. Ninguém confirmou com a Lígia se ainda valem.

---

## 3. Decisões tomadas, e por quê

**Manter o repositório existente mesmo com resíduo do brand book.** Três PRs antigos do Dependabot
guardam cópias do histórico velho em `refs/pull/N/head`, que sobrevivem para sempre e só sumiriam
apagando e recriando o repositório. Você decidiu seguir assim e lidar com isso se virar problema.

**Paleta: opção A, "Terroso".** O brandbook define a proporção de uso pelo tamanho dos retângulos
na página 16 — bege e marrom são as principais. O site tinha invertido isso: o azul virava a cor
dominante da home e o fundo era branco puro, que nem está na paleta. Descartadas a opção B (verde
como assinatura) e a C (azul aprofundado), que estão documentadas caso você mude de ideia.

**Tokens de interface separados das cores da marca.** As cores do brandbook foram desenhadas para
papel: verde, azul, laranja e rosa não passam de 2,6:1 sobre fundo claro, então não servem de
texto. Criamos versões escurecidas das mesmas matizes, até 4,5:1. Regra: cor da marca em área
grande, token escuro em texto, link, ícone e borda.

**Modo escuro removido do site público, mantido no painel.** Contei as classes `dark:` por arquivo:
as telas de `/admin` passavam de 100 cada, e os componentes da home tinham **zero**. O modo escuro
tinha sido feito para o painel e vazou para o site. Como a marca é de luz quente e ninguém mora
num site de ONG, terminar as ~20 telas públicas não se justificava.

**A Maya saiu de `position: absolute` e ganhou coluna própria na grade.** A Raquel reparou que o
texto ficava em cima do focinho. Medi: o bloco de texto ia de 4% a 96% da largura e a ilustração de
71% a 95% — dividiam o mesmo terço da tela, então em alguma largura sempre se encontravam. Não dava
para resolver empurrando; a grade elimina a classe inteira do problema.

**Patinhas paradas viraram rastro de dois cães.** A Ana pediu para tirar as sete patinhas soltas.
A alternativa que você propôs foi um rastro que some. Três rodadas de ajuste:
1. Primeira versão: os dedos apontavam para cima enquanto o rastro ia para a direita — parecia
   bicho andando de lado. Giro base virou 90°.
2. Zigue-zague de ±10% da altura parecia cambaleio. Cachorro deixa **duas linhas** de pegada, uma
   de cada lado do corpo: baixei para ±2%.
3. A opacidade deixou de ser escolhida no olho e passou a sair da **velocidade**: passeio 9–11%,
   trote 12–15%, corrida 17–20% (teto que você pediu). A parada para farejar não deixa pegada, só
   gasta tempo — é o que tira a cadência de metrônomo.
   Desenho B (pegada limpa) no cão maior, C (traço à mão) no menor, para lerem como dois bichos.

**Sorteio com semente fixa, não `Math.random()`.** O rastro precisa parecer acaso, mas tem que ser
reproduzível: com sorteio aberto ele mudaria a cada carregamento e nunca daria para reproduzir um
problema que você visse.

**Nada de migration no deploy.** Foi decisão de fato, não de projeto: as alterações de banco foram
aplicadas na mão pela Management API. Virou dívida — ver item 7.

**Caprasimo só nos títulos grandes.** O `globals.css` aplicava `font-display` a todos os `h1`–`h6`.
Caprasimo é display pesada; em `h4` para baixo atrapalha a leitura. O próprio brandbook usa Nunito
ExtraBold nos títulos menores.

---

## 4. Arquivos, branches, PRs e links

### Documentos produzidos nesta sessão

| caminho | o que é |
| --- | --- |
| `docs/REVISAO-DESIGN.md` | Revisão de design: 9 falhas de contraste no claro, 4 no escuro, bug do CSS aninhado, seções vazias, aderência ao brandbook, três opções de cor |
| `docs/LEVANTAMENTO-DADOS.md` | Varredura do Drive, da planilha e do Instagram; o que dá para carregar no banco |
| `docs/paleta-projeto-maya.html` | Comparativo visual das três paletas |
| `docs/pegadas-opcoes.html` | Comparativo das pegadas e do movimento (sem JavaScript — o visualizador do app bloqueia script) |
| `docs/proposta-banco/01-ajuste-tabela-animais.sql` | **APLICADO** — 14 colunas novas em `animais` |
| `docs/proposta-banco/02-carga-animais-reais.sql` | **APLICADO** — os 27 cães |
| `docs/proposta-banco/03-numeros-reais-da-ong.sql` | **APLICADO** — estatísticas reais |
| `docs/proposta-banco/04-rls-so-mostra-revisado.sql` | **PROVAVELMENTE NÃO APLICADO** — política de RLS |
| `docs/proposta-banco/05-fichas-dos-primeiros-quatro.sql` | De uma sessão fork (versionado) |
| `docs/proposta-banco/05-whisky-em-teste-caju-adotado.sql` | De uma sessão fork (versionado, commit não empurrado) |
| `docs/proposta-banco/animais-planilha.csv` | Os 27 animais exportados da planilha |
| `docs/proposta-banco/mapa-do-drive.txt` | Mapa do Drive da ONG até 3 níveis (2.149 linhas) |

### Código

| caminho | o que mudou |
| --- | --- |
| `components/home/Hero.tsx` | Grade de duas colunas; a Maya saiu do `absolute` |
| `components/home/PawTrail.tsx` | Novo — gera o rastro dos dois cães |
| `app/globals.css` | Keyframes `pawTrail`, 20s de ciclo, `--pico` por pegada, guarda de `prefers-reduced-motion` |
| `lib/supabaseKeys.ts` | Lê os nomes novos das chaves, com os antigos como reserva |

### Branches

- `main` — `513a003`, é o que está em produção
- `banco/whisky-e-caju` — **branch atual**, 1 commit à frente da main, **não empurrada**, sem PR,
  e é onde estão as alterações não commitadas do hero e das pegadas
- `feat/links-pagbank` — única outra branch que existe no remoto
- Branches locais já mergeadas e que dá para apagar: `design/cores-e-contraste`,
  `contato/email-no-lugar-do-whatsapp`, `trocar-imagens-pelo-brandbook`

### PRs

Todos no `ong-projeto-maya/projeto-maya`: **#4** (links PagBank + fichas), **#5** (esconder não
revisados), **#6** (cores e contraste), **#7** (e-mail no lugar do WhatsApp), **#8** (imagens do
brandbook) — **todos mergeados**. #1, #2 e #3 são do Dependabot, fechados.

### Links

- Artifact com as três opções de paleta: `https://claude.ai/artifact/5aunWB134VEjKz2adxy1U2`
- Planilha mestre: `https://docs.google.com/spreadsheets/d/11BA4MT0v6u1mH86AMEPyo_0pE0pyPElTeUXJKVINcSM`
- Instagram da ONG: `https://www.instagram.com/projeto.maya/` (3.775 posts, 38,4 mil seguidores)
- Linktree da ONG: `https://linktr.ee/projetomaya`

### Onde ficam os segredos (não estão neste arquivo, e não devem estar)

- `.env.migrate` na raiz do site — `SUPABASE_URL` e o token pessoal da Management API. **O token
  atual está inválido (401).** Gerar outro em Supabase → Account → Access Tokens. É pessoal, da sua
  conta, não do projeto: não compartilhar.
- `.env.vercel` na raiz do site — modelo para importar variáveis na Vercel.
- Variáveis de produção: painel da Vercel, em Settings → Environment Variables.
- Chaves da aplicação: Supabase → Settings → **API Keys**, aba "Publishable and secret API keys".
  Não existe mais uma página "Settings → API" separada.
- O `.gitignore` ignora qualquer `.env*` e abre exceção só para o `.env.example`.
- ⚠️ Existe um `1 - ADMINISTRAÇÃO GERAL/Senhas.gdoc` no Drive da ONG. Não abri. Senha em documento
  compartilhado, numa conta que já passou por várias mãos de voluntário — entra na mesma conversa
  de segurança do repositório.

---

## 5. Dados da ONG levantados (não estão no código)

- **CNPJ** 42.686.223/0001-02 · **Endereço** Rua Professora Flávia Vieira, 180, Sousas,
  Campinas/SP, 13106-196 · **E-mail** projetomaya@outlook.com
- **PIX**: chave é o e-mail acima. Itaú Unibanco 341, AG 1652, CC 99858-2.
- **Fundada em 2020.** Campanha de castração desde 2022.
- Dossiê Institucional (set/2025): ~1.900 resgates, ~1.300 castrações, 28 feiras, +1.700 adoções.
- **Telefone divergente**: a variável do site tem `5519994128408`; o dossiê traz **(19) 99422-4336**.
  Ninguém confirmou qual é o institucional.
- **Brandbook**: `Identidade Visual/Brandbook_ProjetoMaya.pdf` na pasta de documentos (26 páginas,
  nov/2025, por Carolina Maluly). Paleta na página 16, conferida amostrando os pixels:
  bege `#D9D3D3`, marrom `#564334`, verde `#B2C09D`, azul `#96B6D3`, rosa `#E99797`,
  laranja `#D5934F`, areia `#978062`. Tipografia: Caprasimo nos títulos, Nunito no corpo.
  **Regra do brandbook: rosa só para urgência.**
- O `tailwind.config.ts` tinha `maya-pink: #DA5F75`, que **não é cor do brandbook** — o rosa é
  `#E99797`. Já corrigido, mas vale confirmar com a Carolina.

### Links de doação do PagBank (estão no Linktree, públicos)

R$ 5 `pag.ae/81GhTRfS8` · R$ 10 `pag.ae/81Gi3hcB8` · R$ 30 `pag.ae/81Gi3S818` ·
R$ 50 `pag.ae/81Gi4k_Kp` · R$ 80 `pag.ae/81Gi9f-up` · R$ 150 `pag.ae/81Gia47jp` ·
R$ 300 `pag.ae/81GiakDg4`

⚠️ **O botão de R$ 100 do Linktree aponta para o mesmo link do de R$ 80 e cobra R$ 80.** Conferi
abrindo os oito e lendo o valor em cada página do PagBank. Não existe link de R$ 100. **A Ana foi
avisada? Não sei — isso ficou em aberto.**

---

## 6. Comandos que importam, e as armadilhas

```bash
cd /Users/eduardopannain/Documents/Projects/projeto-maya
npm ci
npm run dev -- --port 3002     # a porta 3000 é do painel da OUTRA pasta
npx tsc --noEmit
npm test                        # 142 testes
npm run build
```

Banco local, se quiser um Postgres de verdade sem tocar em produção:

```bash
supabase start                  # precisa de Docker; config.toml já está no repo
```

Aplicar migrations (**sempre dizendo qual banco** — o script não tem mais padrão):

```bash
set -a; . ./.env.migrate; set +a && npm run db:migrate
```

Conferir se o `04` (RLS) foi aplicado — é a dúvida aberta do item 2:

```sql
select policyname, qual from pg_policies where tablename='animais' and policyname='public_select_animais';
```

Se o `qual` for `true`, **não foi aplicado**. Se for `revisado = true`, foi.

### Armadilhas que custaram tempo

- **`preview_start` sobe o projeto errado.** Existe um `.claude/launch.json` nas duas pastas; ele
  insiste em subir o painel da pasta `Projeto Maya` na porta 3000. Rode o dev server na mão.
- **O visualizador de arquivos do app bloqueia JavaScript.** A primeira versão da página de
  pegadas montava tudo por script e abria em branco. As páginas em `docs/*.html` são HTML e CSS
  puros por causa disso.
- **`NEXT_PUBLIC_` é gravado no bundle na hora do build.** Mudar a variável na Vercel não basta:
  tem que publicar de novo. Foi o que deixou o site sem ler o banco por dias.
- **Importar o `.env.vercel` sem preencher os marcadores** faz a Vercel guardar o texto
  `COLE_AQUI_A_CHAVE_...` como se fosse a chave. Já aconteceu uma vez.
- **CSS aninhado não funciona neste projeto.** O `postcss.config.js` não tem o plugin de nesting,
  então `.dark { .card { @apply ... } }` compila errado e joga fora o `.dark` de fora.
- **Nenhum `select` do site filtra por `revisado` sozinho** — isso é feito no código (PR #5), não
  por RLS, enquanto o `04` não for aplicado.
- A pasta do Drive sincronizado é `/Users/eduardopannain/Library/CloudStorage/GoogleDrive-projetomaya20@gmail.com`
  (o atalho na home é um symlink). `grep -r` nela demora minutos — filtre por extensão antes.
- Arquivos `.gdoc` no Drive **não têm conteúdo local**, só um ponteiro de 180 bytes.

---

## 7. Próximos passos, em ordem

1. **Commitar o hero e as pegadas.** Está tudo pronto e testado, só não commitado. Sugestão: branch
   nova a partir da `main`, porque a `banco/whisky-e-caju` tem outro assunto dentro.
2. **Conferir se o `04` (RLS) foi aplicado** com a consulta do item 6, e aplicar se não foi.
3. **Transformar o `01` e o `04` em migrations de verdade** dentro de `supabase/migrations/`.
   Hoje o schema do repositório para em `20240208` e o banco de produção está à frente: quem clonar
   e rodar `npm run db:migrate` recebe um schema **diferente** do que está no ar. O `02` e o `03`
   são dados, não estrutura — esses vão para o seed, não para migration.
4. **Decidir o que fazer com a `banco/whisky-e-caju`**: abrir PR ou deixar local. A sessão fork
   parou esperando essa resposta.
5. **Avisar a Ana do link de R$ 100** do Linktree, se ainda não foi avisada.
6. **Proteção da branch `main`** — você disse "depois". Hoje ela não tem proteção nenhuma: dá para
   empurrar direto, sem PR, e **um push que quebra o CI publica em produção do mesmo jeito**,
   porque a Vercel não lê o check do GitHub. Vira urgente no dia em que entrar outro dev.
7. **Terminar a varredura do Instagram** (ver perguntas abertas).
8. **Apagar o `supabase/seed.sql` ou reescrevê-lo.** Ele tem 8 animais fictícios com fotos de banco
   de imagens e uma campanha com "R$ 8.750 arrecadados" que nunca existiu. Nunca rodou em produção,
   mas está lá esperando alguém rodar `npm run db:migrate:seed` sem saber.
9. **Sentry e Upstash** continuam sem configurar. Sem eles, erro não é reportado e o limitador de
   requisições conta na memória do servidor — ou seja, zera a cada reinício e não limita de verdade.

### Perguntas abertas para você

- **Qual é o WhatsApp institucional?** A variável do site e o dossiê discordam.
- **O rosa `#DA5F75`**: confirmar com a Carolina se existiu em alguma versão do brandbook.
- **Os números da ONG** (1.900 / 1.700 / 1.300 / 28) são de set/2025. A Lígia confirma? E quem passa
  a atualizar isso?
- **Quantos voluntários ativos?** O dossiê deixou o campo em branco, e por isso a chave
  `volunteers` foi deliberadamente removida do `site_stats`.
- **Instagram**: a aba logada que você deixava aberta saía do grupo de abas que eu controlo, e a que
  eu abro vem deslogada. O jeito que funciona é você **entrar no Instagram dentro da aba que eu
  abrir** e me avisar. Faltam ~3.500 dos 3.775 posts. Vale: as legendas de adoção têm formato fixo
  (`ADOTE A DENDÊ • Ninhada Bahia / 55 dias • porte estimado P/M-M / Vermifugada ✅ 1ª V10 ✅`) e
  viram `[ADOTADA]` quando o animal é adotado, então dá para extrair ficha automaticamente. E o
  Instagram está **mais atualizado que a planilha**: tem ninhadas lá (Era do Gelo, Bahia, Pedras
  Preciosas) que não estão na planilha.

### Combinados e preferências que não estão em arquivo nenhum

- **Mensagens para a ONG**: texto corrido, sem formatação. E quando o assunto for o pai da Raquel
  (o domínio), perguntar em vez de afirmar.
- **Não alterar produção sem você autorizar**, mesmo quando a alteração parece inofensiva.
- As skills de Instagram do `Jakeschincariol/instagram-agent-skill` estão instaladas em
  `~/.claude/skills/` (13 skills, código conferido: só biblioteca padrão, sem rede, sem subprocesso).
  São para **escrever** Instagram, não para ler. Úteis mais para frente: `/ig-profile` quando o site
  entrar e a bio mudar, e `/ig-audit` com os 3.775 posts de histórico. O `templates/voice.md` está
  em `~/.claude/instagram/voice.md` e precisa ser preenchido com o tom da ONG — a página 9 do
  brandbook já tem isso escrito.

---

## 8. Prompt de retomada

Cole isto no chat novo:

```
Estou retomando o trabalho no site do Projeto Maya, ONG de resgate e adoção de Campinas.
Sou voluntário e assumi o site do desenvolvedor anterior.

Leia docs/sessoes/2026-11-16-site-maya-design-dados-e-deploy.md no repositório
(https://github.com/ong-projeto-maya/projeto-maya) — é a passagem da sessão anterior,
com estado, decisões, armadilhas e pendências.

Pasta do site: /Users/eduardopannain/Documents/Projects/projeto-maya
Produção: https://projeto-maya-green.vercel.app

Contexto rápido: PRs #4 a #8 estão mergeados e no ar. O banco tem 27 cães reais
carregados. Ficaram sem commit, na branch banco/whisky-e-caju, as alterações do hero
(a Maya saiu de position absolute para uma coluna da grade) e a trilha de pegadas dos
dois cães — tsc limpo e 142 testes passando.

Comece por:
1. Conferir se a política de RLS do 04-rls-so-mostra-revisado.sql foi aplicada
   (a consulta está no item 6 do documento).
2. Me dizer como commitar o hero e as pegadas sem misturar com o assunto da
   branch banco/whisky-e-caju.

Antes disso: o token do Supabase em .env.migrate está inválido (401) — preciso gerar
outro em Supabase → Account → Access Tokens antes de qualquer coisa de banco.

Não altere nada em produção sem me perguntar.
```
