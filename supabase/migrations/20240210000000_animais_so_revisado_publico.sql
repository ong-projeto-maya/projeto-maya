-- =============================================================================
-- Migration 010 — O público só lê animal revisado
--
-- Política de docs/proposta-banco/04-rls-so-mostra-revisado.sql. Em produção,
-- conferida em 17/11/2026 por pg_policies: public_select_animais usa
-- (revisado = true).
--
-- Antes, public_select_animais liberava SELECT com using (true): qualquer
-- visitante lia a tabela inteira, inclusive os animais carregados da planilha
-- sem foto nem texto. O código também filtra por revisado (PR #5); esta
-- política é a trava no banco.
--
-- Quem continua vendo tudo: o painel admin, pela política admin_write_animais
-- (cmd ALL, avaliada em OR com esta), e o servidor com a chave secreta.
--
-- Pode rodar de novo sem efeito.
-- =============================================================================

begin;

drop policy if exists public_select_animais on public.animais;

create policy public_select_animais
  on public.animais
  for select
  to anon, authenticated
  using (revisado = true);

commit;
