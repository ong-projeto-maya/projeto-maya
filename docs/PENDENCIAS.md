# Pendências do site

Lista viva do que ficou em aberto. Atualizada em 06/11/2026.

Cada item diz o que é, por que importa e o que precisa acontecer. O que já foi
resolvido sai daqui — o histórico fica nos commits.

---

## Produto

### Os animais são carregados pelo navegador, não pelo servidor

`/adocao` e a seção de animais da home são componentes de cliente: o HTML chega
vazio e só depois o JavaScript consulta o Supabase e desenha os cards.

Duas consequências:

- Em conexão ruim há uma espera visível com a página já em branco na tela.
- O Google não vê os animais. O robô recebe a página sem nenhum nome, nenhuma
  história e nenhuma foto, então as fichas não entram na busca. Para uma ONG que
  depende de alguém procurar "cachorro para adoção em Campinas", isso é perda
  direta de adoção.

Conserto: mover a busca para o servidor (Server Component com a chave de
serviço, filtrando `revisado = true`, como já faz `/adocao/[id]`), mantendo os
filtros no cliente. Dá para fazer sem mudar o visual.

### A idade é texto, não data

A coluna `age` guarda `"8 anos"`, `"7 meses"`. Envelhece sozinha, errado: daqui a
seis meses o Whisky continua com sete meses no site.

A tabela já tem `data_nascimento`. Falta o site calcular a idade a partir dela na
hora de exibir. A planilha da ONG já faz isso com uma fórmula `TODAY()`.

### 23 dos 27 animais não têm ficha

Só Amélia, Café, Caju e Whisky têm foto e história, e por isso são os únicos com
`revisado = true`. Os outros 23 estão no banco, invisíveis para o público.

Para publicar cada um faltam: foto, história e conferência dos dados da planilha.
As fotos dos cards de adoção estão no Drive, em `8 - ADOÇÕES`.

---

## Urgente, com prazo

### O lar temporário do Café acaba no fim de novembro de 2026

Está na legenda do post de adoção dele. Depois disso a ONG precisa de outro lugar
para ele. Vale confirmar com a Lígia se o prazo mudou.

---

## Para falar com a ONG

### O botão de R$ 100 do Linktree cobra R$ 80

No Linktree da ONG, o botão de R$ 100 aponta para `pag.ae/81Gi9f-up`, que é o
mesmo link do de R$ 80. Não existe assinatura de R$ 100 criada no PagBank.

Quem escolhe R$ 100 paga R$ 80, e isso está no ar para 38,4 mil seguidores. O
site já contorna, oferecendo só os valores que existem de verdade, mas o
Linktree continua errado. A Ana precisa criar a assinatura de R$ 100 e corrigir o
link — aí é só acrescentar o valor em `lib/pagbank-links.ts`.

### O rosa do brandbook

`#E99797` ou `#DA5F75`? O segundo aparece na camada de texto do PDF, mas não no
quadrado impresso. O site usa `#E99797`. Vale confirmar com a Carolina, que fez o
brandbook.

### O porte do Café

O banco diz Pequeno; o card de adoção que a própria ONG publicou diz P/M.

### O número do WhatsApp

Temos dois: `5519994128408`, que está configurado no site, e `(19) 99422-4336`,
que aparece em material da ONG. Confirmar qual recebe as mensagens.

---

## Infraestrutura

### As variáveis do Supabase não estão marcadas em Preview na Vercel

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e
`SUPABASE_SECRET_KEY` estão só em Production.

Enquanto for assim, nenhum deploy de preview consegue ler o banco, e nenhum PR
pode ser conferido antes do merge: o preview sobe sem animais, sem campanhas e
sem área do doador. É marcar a caixa Preview nas três, em Settings →
Environment Variables.

### O login do /admin nunca foi testado

A conta `evpannain@gmail.com` foi criada mas ninguém entrou com ela. Vale testar
antes de precisar.

---

## Design

### O painel administrativo não foi revisado

A revisão de cor e contraste cobriu o site público. O `/admin` tem 296 usos de
cor de marca como texto e precisa da mesma passada. É tela de quem trabalha, não
de quem visita, então ficou para depois — mas são as mesmas cores claras usadas
como texto, com os mesmos problemas de leitura.

---

## Dados

### A extração do Instagram está pela metade

381 dos 3.775 posts do `@projeto.maya` foram lidos. O resto tem história de
animal, número de resgate e prestação de contas que ninguém mais registrou em
lugar nenhum.

Também ficaram cerca de 25 protocolos em `.gdoc` no Drive, não lidos.
