-- =============================================================================
-- Migration 008 — Consertar as políticas de RLS do painel admin
--
-- Três problemas, todos de autorização:
--
-- 1. O painel admin lê com a chave anônima (createAdminClient é um cliente de
--    navegador), então está sujeito a RLS. Mas não existia política de admin
--    em doadores, doacoes nem assinaturas — só "cada um lê o seu". E nas
--    quatro tabelas de conteúdo a política era
--        (auth.jwt() ->> 'role') = 'admin'
--    que nunca é verdadeira: no Supabase esse claim vale 'authenticated' ou
--    'anon'. O papel de admin deste projeto vive na tabela admin_users, e é
--    assim que as políticas de animais/campanhas/eventos já fazem.
--    Resultado: as telas de Doadores, Mensagens, Adotantes e os contadores de
--    Relatórios devolviam lista vazia, sem erro nenhum.
--
-- 2. O insert de depoimentos era `with check (true)`, que não restringe
--    coluna alguma — incluindo `aprovado`. A home renderiza depoimento com
--    aprovado = true, e a chave anônima vai no bundle, então dava para
--    publicar texto na página inicial sem passar por moderação.
--
-- 3. O update de assinaturas pelo doador não tinha `with check`, então a linha
--    podia ser gravada fora da própria condição do `using` — mudando valor,
--    status ou apontando doador_id/doador_email para outra pessoa.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Helper: quem é admin. Security definer para a subconsulta não depender do
-- RLS de admin_users, e com search_path fixo (regra do linter do Supabase).
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where id = auth.uid() and role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'True quando o usuário autenticado tem linha em admin_users com role = admin. Usada nas políticas de RLS do painel.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- -----------------------------------------------------------------------------
-- 1. Leitura de admin nas tabelas financeiras e de cadastro
--    Só select: toda escrita nessas tabelas passa pelas rotas de API com a
--    service role key, nunca pelo navegador.
-- -----------------------------------------------------------------------------

drop policy if exists "admin_select_doadores" on public.doadores;
create policy "admin_select_doadores" on public.doadores
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_doacoes" on public.doacoes;
create policy "admin_select_doacoes" on public.doacoes
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin_select_assinaturas" on public.assinaturas;
create policy "admin_select_assinaturas" on public.assinaturas
  for select to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Tabelas de conteúdo: trocar a política morta pela que funciona
--    Aqui é gestão completa, que era a intenção do nome "Admin manages X".
-- -----------------------------------------------------------------------------

drop policy if exists "Admin manages mensagens" on public.mensagens;
create policy "admin_manages_mensagens" on public.mensagens
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin manages camp_registrations" on public.camp_registrations;
create policy "admin_manages_camp_registrations" on public.camp_registrations
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin manages newsletter" on public.newsletter_subscribers;
create policy "admin_manages_newsletter" on public.newsletter_subscribers
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin manages depoimentos" on public.depoimentos;
create policy "admin_manages_depoimentos" on public.depoimentos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Depoimento enviado pelo público entra sempre como não aprovado
-- -----------------------------------------------------------------------------

drop policy if exists "Anyone can submit depoimentos" on public.depoimentos;
create policy "Anyone can submit depoimentos"
  on public.depoimentos for insert
  with check (aprovado = false);

-- -----------------------------------------------------------------------------
-- 4. Doador não reescreve a própria assinatura pelo navegador
--    Pausar, retomar, cancelar e trocar o valor são feitos por
--    /api/subscription/* com a service role key, depois de validar o token.
--    Essa política era superfície aberta sem uso.
-- -----------------------------------------------------------------------------

drop policy if exists "Donors can update own subscription status" on public.assinaturas;
