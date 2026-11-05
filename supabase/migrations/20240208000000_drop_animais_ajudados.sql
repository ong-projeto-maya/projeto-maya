-- =============================================================================
-- Migration 009 — Remover a coluna animais_ajudados e a função órfã
--
-- A coluna nasceu com `default 0` (20240101000000_foundation.sql) e **nada em
-- lugar nenhum do código a incrementa**. O painel admin mostrava esse número
-- por doador, com ícone, e somava todos num cartão "Animais Impactados" — um
-- total que só podia ser zero.
--
-- Num app de prestação de contas de ONG, número decorativo é pior que número
-- ausente: quem lê acredita nele.
--
-- Nenhum dado se perde: por construção, toda linha tem 0.
--
-- Se um dia a ONG quiser esse número de verdade, ele se deriva de `doacoes`
-- (quantos animais a doação de alguém ajudou a fechar), não de um contador
-- mantido à mão.
-- =============================================================================

-- A função handle_new_donor (migration 003) era a única que escrevia essa
-- coluna explicitamente, e **já estava órfã**: a migration 006
-- (20240205000000_auto_create_donor_profile.sql) repontou o trigger
-- on_auth_user_created para handle_new_user e nunca removeu a antiga. Ou seja,
-- a função existe no banco e nada a chama desde então.
--
-- O trigger em uso, handle_new_user, insere só id, email e nome e deixa o
-- resto para os defaults das colunas — não precisa ser tocado aqui.
drop function if exists public.handle_new_donor();

alter table public.doadores
  drop column if exists animais_ajudados;
