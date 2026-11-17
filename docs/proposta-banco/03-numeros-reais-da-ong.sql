-- APLICADO EM PRODUÇÃO em 06/11/2026. Registro: são dados, não entram em migration.
-- Substitui os números inventados de supabase/seed.sql pelos números que a ONG
-- declara no próprio Dossiê Institucional (Drive, "1 - ADMINISTRAÇÃO GERAL/
-- DOSSIÊ INSTITUCIONAL/Dossie Institucional.docx", atualizado em 25/09/2025).
--
-- O que está em produção hoje, se o seed rodar:
--
--   chave          seed.sql   dossiê da ONG
--   rescued            347          ~1.900
--   adopted            289          ~1.700
--   volunteers          52       não informado
--   animals_helped     289          ~1.900
--
-- Os valores do seed não vieram de lugar nenhum. Publicar "347 resgatados" no
-- site de uma ONG que resgatou 1.900 é errado nos dois sentidos: subestima o
-- trabalho dela e é um número que ninguém consegue justificar se perguntarem.

begin;

insert into public.site_stats (key, value) values
  ('rescued',        1900),   -- "cerca de 1.900 animais", dossiê
  ('adopted',        1700),   -- "mais de 1.700 adoções responsáveis", dossiê
  ('castrations',    1300),   -- "cerca de 1.300 castrações", dossiê
  ('events',           28),   -- "28 feiras/eventos de adoção", dossiê
  ('animals_helped', 1900)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- volunteers fica de fora de propósito: o dossiê tem "[número] voluntários
-- ativos", com o espaço em branco. Perguntar à Lígia antes de publicar.
delete from public.site_stats where key = 'volunteers';

commit;

-- ---------------------------------------------------------------------------
-- Dois avisos
-- ---------------------------------------------------------------------------
-- 1. "cerca de" e "mais de" são aproximações da própria ONG. Se o site exibir
--    1.900 como número exato, vira precisão que o dado não tem. Sugiro exibir
--    "+1.900" ou "cerca de 1.900".
--
-- 2. O dossiê é de setembro de 2025. Os números de hoje são maiores.
--    Vale confirmar com a Lígia antes de publicar, e decidir quem atualiza
--    isso daqui pra frente — é o tipo de número que envelhece calado.
