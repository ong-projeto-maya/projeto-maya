-- APLICADO EM PRODUÇÃO em 06/11/2026. Registro: a estrutura está em supabase/migrations/.
-- Ajusta public.animais para caber os dados que a ONG realmente mantém.
-- Escrito em 2026-11-06 a partir da aba "Animais" da planilha GESTÃO PROJETO MAYA
-- e dos posts de adoção do @projeto.maya.
--
-- Já virou migration: supabase/migrations/20240209000000_animais_campos_da_ficha.sql
--
-- Por que é preciso: a tabela de hoje tem 3 portes e um booleano is_adopted.
-- A ONG usa 5 portes (P, P/M, M, M/G, G) e 4 estados (aguardando adoção,
-- adoção em andamento, em tratamento, adotado). Carregar os dados reais na
-- estrutura atual perderia informação em 17 dos 27 animais.

begin;

-- ---------------------------------------------------------------------------
-- 1. Porte: guardar o rótulo da ONG e manter size como eixo de filtro
-- ---------------------------------------------------------------------------
-- O site filtra por pequeno/médio/grande, e isso continua funcionando.
-- O que o visitante lê passa a ser o rótulo que a ONG escreve ("P/M"),
-- em vez de uma tradução que arredonda.

alter table public.animais
  add column if not exists porte_label text;

comment on column public.animais.porte_label is
  'Porte como a ONG escreve: P, P/M, M, M/G ou G. O campo size continua sendo o eixo de filtro do site.';

-- ---------------------------------------------------------------------------
-- 2. Status: quatro estados em vez de um booleano
-- ---------------------------------------------------------------------------
-- is_adopted não distingue "em tratamento" de "aguardando adoção", e hoje são
-- 4 animais em tratamento que apareceriam no site como disponíveis.

alter table public.animais
  add column if not exists status text not null default 'disponivel'
  check (status in ('disponivel','em_processo','em_tratamento','adotado'));

comment on column public.animais.status is
  'disponivel = aguardando adoção | em_processo = adoção em andamento | em_tratamento = não divulgar ainda | adotado';

-- is_adopted continua existindo para não quebrar o código atual, mas passa a
-- derivar de status. Quando o front-end estiver lendo status, dá para removê-la.
update public.animais set is_adopted = (status = 'adotado');

-- ---------------------------------------------------------------------------
-- 3. Ficha interna: o que a planilha tem e a tabela não
-- ---------------------------------------------------------------------------
-- Estes campos NÃO vão para a página pública. Servem ao painel, que hoje não
-- tem onde guardar o que a ONG controla na planilha.

alter table public.animais
  add column if not exists data_nascimento  date,
  add column if not exists data_entrada     date,
  add column if not exists lar_temporario   text,
  add column if not exists grupo_origem     text,
  add column if not exists vermifugado      boolean not null default false,
  add column if not exists vacinado         boolean not null default false,
  add column if not exists castrado         boolean not null default false,
  add column if not exists condicao_especial text,
  add column if not exists observacoes      text;

comment on column public.animais.lar_temporario is 'Nome do lar temporário. Dado interno — não exibir na página pública.';
comment on column public.animais.grupo_origem  is 'Ninhada ou resgate de origem, ex: "Ninhada Toy Story", "Acumuladora".';

-- ---------------------------------------------------------------------------
-- 4. Rastrear de onde veio o registro
-- ---------------------------------------------------------------------------
-- Enquanto a planilha e o site coexistirem, é preciso saber qual registro já
-- foi conferido por uma pessoa e qual veio de importação automática.

alter table public.animais
  add column if not exists origem_registro text not null default 'manual'
  check (origem_registro in ('manual','planilha','instagram')),
  add column if not exists instagram_url text,
  add column if not exists revisado boolean not null default false;

comment on column public.animais.revisado is
  'false = importado automaticamente e ainda não conferido por uma pessoa. O site público só deve listar revisado = true.';

-- ---------------------------------------------------------------------------
-- 5. Índices para as consultas que o site faz
-- ---------------------------------------------------------------------------
create index if not exists animais_status_idx   on public.animais (status);
create index if not exists animais_revisado_idx on public.animais (revisado) where revisado = true;

commit;

-- ---------------------------------------------------------------------------
-- Espécie: confirmado
-- ---------------------------------------------------------------------------
-- A coluna `type` ('dog' | 'cat') é obrigatória e a planilha não tem espécie.
-- Eduardo confirmou em 06/11/2026 que os 27 animais da planilha são todos cães,
-- então a carga entra com 'dog' em todos. Quando a ONG começar a cadastrar
-- gatos, a coluna de espécie precisa existir na planilha também — senão a
-- próxima importação volta a adivinhar.
