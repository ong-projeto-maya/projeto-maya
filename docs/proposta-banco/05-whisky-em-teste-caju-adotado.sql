-- Tirar o Whisky do site (está em período de teste) e marcar o Caju como adotado.
--
-- Pedido da equipe em 06/11/2026. Os dois foram resgatados juntos, do mesmo
-- local onde outro cachorro tinha sido atropelado.
--
-- Como rodar: painel do Supabase -> SQL Editor -> colar isto -> Run.
-- Não dá para fazer daqui: a política `public_select_animais` libera leitura,
-- mas escrita só pela política de admin, que exige sessão autenticada. Com a
-- chave publicável o UPDATE volta 200 com zero linhas afetadas.
--
-- O que cada campo faz:
--   status    = o estado real do animal, para a equipe e para os relatórios.
--   is_adopted= espelho de (status = 'adotado'); é o que o site lê hoje.
--   revisado  = é o que o público enxerga. A migration 04 fez a política de
--               leitura ser `using (revisado = true)`, então `false` tira o
--               animal do site sem apagar nada. O painel admin continua vendo,
--               porque a política de admin é avaliada em OR com essa.

begin;

-- Whisky: em período de teste com uma família. Sai do site; se o teste não
-- der certo, é só voltar revisado para true e status para 'disponivel'.
update public.animais
   set status   = 'em_processo',
       revisado = false
 where name = 'Whisky';

-- Caju: adotado.
update public.animais
   set status     = 'adotado',
       is_adopted = true,
       revisado   = false
 where name = 'Caju';

commit;

-- Confere o resultado:
--   select name, status, is_adopted, revisado
--     from public.animais
--    where name in ('Whisky','Caju');
--
-- Para desfazer (se o teste do Whisky não vingar):
--   update public.animais
--      set status = 'disponivel', revisado = true
--    where name = 'Whisky';
