-- APLICADO EM PRODUÇÃO em 06/11/2026, junto com 01, 02 e 03.
-- Conferido em 17/11/2026 por pg_policies (havia dúvida; o Eduardo rodou de novo no SQL Editor).
-- Registro: a política está em supabase/migrations/20240210000000_animais_so_revisado_publico.sql.
--
-- Por que existe: a política `public_select_animais` liberava SELECT com
-- `using (true)` — qualquer visitante lê a tabela inteira. Com os 27 animais
-- carregados pelo 02 (todos com story e image vazios, porque a planilha não
-- tem texto nem foto), isso significa que, assim que o site conseguir ler o
-- banco, a home renderiza 6 cards com <Image src=""> e quebra.
--
-- O 01 criou a coluna `revisado` exatamente para isso. Esta migration faz a
-- coluna valer: o público só enxerga o que uma pessoa já conferiu.
--
-- Quem continua vendo tudo:
--   - o painel admin, pela política admin_write_animais (cmd ALL), que é
--     avaliada em OR com esta;
--   - o código de servidor, que usa a chave secreta e ignora RLS.

begin;

drop policy if exists public_select_animais on public.animais;

create policy public_select_animais
  on public.animais
  for select
  to anon, authenticated
  using (revisado = true);

commit;

-- Para publicar um animal depois de conferir nome, foto e história:
--   update public.animais set revisado = true where name = 'Hope';
--
-- Para publicar todos de uma vez (só depois que todos tiverem foto e texto):
--   update public.animais set revisado = true;
