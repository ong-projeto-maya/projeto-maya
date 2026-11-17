-- =============================================================================
-- Migration 009 — Campos da ficha dos animais
--
-- Estrutura de docs/proposta-banco/01-ajuste-tabela-animais.sql, aplicada em
-- produção à mão em 06/11/2026. Entra aqui para que um banco montado do zero
-- (Supabase local, outro dev) fique igual ao que está no ar.
--
-- Por que existe: a tabela tinha 3 portes e um booleano is_adopted. A ONG usa
-- 5 portes (P, P/M, M, M/G, G) e 4 estados; carregar os dados reais na
-- estrutura antiga perderia informação em 17 dos 27 animais.
--
-- Pode rodar de novo sem efeito: scripts/apply-migrations.mjs roda todas as
-- migrations a cada execução. Por isso a cópia de is_adopted para status só
-- acontece quando a coluna status é criada; repetida, ela desfaria o que o
-- painel admin gravou em is_adopted.
-- =============================================================================

begin;

-- 1. Porte como a ONG escreve; size continua sendo o eixo de filtro do site.
alter table public.animais
  add column if not exists porte_label text;

comment on column public.animais.porte_label is
  'Porte como a ONG escreve: P, P/M, M, M/G ou G. O campo size continua sendo o eixo de filtro do site.';

-- 2. Status: quatro estados em vez de um booleano.
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'animais' and column_name = 'status'
  ) then
    alter table public.animais
      add column status text not null default 'disponivel'
      check (status in ('disponivel','em_processo','em_tratamento','adotado'));

    -- is_adopted continua existindo para não quebrar o código atual e passa
    -- a espelhar status.
    update public.animais set is_adopted = (status = 'adotado');
  end if;
end
$$;

comment on column public.animais.status is
  'disponivel = aguardando adoção | em_processo = adoção em andamento | em_tratamento = não divulgar ainda | adotado';

-- 3. Ficha interna: o que a planilha tem e a tabela não. Não vai para a
--    página pública.
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

-- 4. De onde veio o registro e se uma pessoa já conferiu.
alter table public.animais
  add column if not exists origem_registro text not null default 'manual'
  check (origem_registro in ('manual','planilha','instagram')),
  add column if not exists instagram_url text,
  add column if not exists revisado boolean not null default false;

comment on column public.animais.revisado is
  'false = importado automaticamente e ainda não conferido por uma pessoa. O site público só lista revisado = true.';

-- 5. Índices para as consultas do site.
create index if not exists animais_status_idx   on public.animais (status);
create index if not exists animais_revisado_idx on public.animais (revisado) where revisado = true;

commit;
