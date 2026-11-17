-- APLICADO EM PRODUÇÃO em 06/11/2026. Registro: NÃO rodar de novo — apaga os animais da planilha e desfaz as fichas do 05.
-- Os 27 animais reais do Projeto Maya, extraídos da aba "Animais" da planilha
-- GESTÃO PROJETO MAYA (cópia .xlsx de 11/07/2026, no Drive da ONG).
--
-- Depende de 01-ajuste-tabela-animais.sql.
--
-- ATENÇÃO, LEIA ANTES DE RODAR
--
-- 1. Todos entram com revisado = false. O site público não deve listá-los
--    enquanto uma pessoa não conferir cada um.
-- 2. A espécie está como 'dog' em todos. A planilha não tem coluna de espécie;
--    o Eduardo confirmou em 06/11/2026 que os 27 são cães.
-- 3. story e image estão vazios. A planilha não tem texto nem foto; as fotos
--    estão em "5 - MÍDIA/FOTOS ADULTOS" (9 animais, 116 arquivos) e os textos
--    estão nas legendas do Instagram.
-- 4. Isto NÃO substitui supabase/seed.sql, que contém 8 animais fictícios com
--    fotos de banco de imagens. Aquele arquivo não pode rodar em produção.

begin;

-- Protege contra rodar duas vezes: remove só o que esta carga inseriu antes.
delete from public.animais where origem_registro = 'planilha';

insert into public.animais
  (name, type, age, gender, size, porte_label, status,
   data_nascimento, data_entrada, lar_temporario, grupo_origem,
   vermifugado, condicao_especial, is_puppy, is_adopted, sort_order,
   origem_registro, revisado)
values
  ('Rosa', 'dog', '06 meses', 'female', 'small', 'P', 'em_processo', '2026-02-01', '2026-06-14', null, 'Ninhada Florzinhas', true, null, true, false, 1, 'planilha', false),
  ('Gardênia', 'dog', '06 meses', 'female', 'small', 'P', 'em_processo', '2026-02-01', '2026-06-14', null, 'Ninhada Florzinhas', true, null, true, false, 2, 'planilha', false),
  ('Mel', 'dog', '3 anos e 1 mês', 'female', 'small', 'P/M', 'em_processo', '2023-06-01', '2026-06-01', null, 'Acumuladora', true, null, false, false, 3, 'planilha', false),
  ('Temaki', 'dog', '06 meses', 'male', 'small', 'P/M', 'adotado', '2026-02-01', '2026-05-01', 'Bicharada', null, true, null, false, true, 4, 'planilha', false),
  ('Margarida', 'dog', '06 meses', 'female', 'small', 'P', 'adotado', '2026-02-01', '2026-06-14', null, 'Ninhada Florzinhas', true, null, true, true, 5, 'planilha', false),
  ('Camélia', 'dog', '06 meses', 'female', 'small', 'P', 'adotado', '2026-02-01', '2026-06-14', null, 'Ninhada Florzinhas', true, null, true, true, 6, 'planilha', false),
  ('Jessie', 'dog', '03 meses', 'female', 'small', 'P/M', 'adotado', '2026-04-15', '2026-06-01', null, 'Ninhada Toy Story', true, null, true, true, 7, 'planilha', false),
  ('Betty', 'dog', '03 meses', 'female', 'small', 'P/M', 'disponivel', '2026-04-15', '2026-06-01', null, 'Ninhada Toy Story', true, null, true, false, 8, 'planilha', false),
  ('Dolly', 'dog', '03 meses', 'female', 'small', 'P/M', 'adotado', '2026-04-15', '2026-06-01', null, 'Ninhada Toy Story', true, null, true, true, 9, 'planilha', false),
  ('Trixie', 'dog', '03 meses', 'female', 'small', 'P/M', 'adotado', '2026-04-15', '2026-06-01', null, 'Ninhada Toy Story', true, null, true, true, 10, 'planilha', false),
  ('Woody', 'dog', '03 meses', 'male', 'small', 'P/M', 'adotado', '2026-04-15', '2026-06-01', null, 'Ninhada Toy Story', true, null, true, true, 11, 'planilha', false),
  ('Buzz', 'dog', '03 meses', 'male', 'small', 'P/M', 'disponivel', '2026-04-15', '2026-06-01', null, 'Ninhada Toy Story', true, null, true, false, 12, 'planilha', false),
  ('Amélia', 'dog', '10 anos e 6 meses', 'female', 'small', 'P/M', 'disponivel', '2016-01-01', '2026-03-01', null, 'Lixão', true, null, false, false, 13, 'planilha', false),
  ('Muffin', 'dog', '2 anos e 6 meses', 'male', 'small', 'P/M', 'disponivel', '2024-01-01', '2026-06-22', null, 'Acumuladora', true, null, false, false, 14, 'planilha', false),
  ('Café', 'dog', '2 anos e 6 meses', 'male', 'small', 'P/M', 'disponivel', '2024-01-01', '2026-06-22', null, 'Acumuladora', true, null, false, false, 15, 'planilha', false),
  ('Cidinha', 'dog', '12 anos e 6 meses', 'female', 'medium', 'M', 'disponivel', '2014-01-01', '2026-04-01', 'Vivi', 'Lixão', true, null, false, false, 16, 'planilha', false),
  ('Margot', 'dog', '4 anos e 6 meses', 'female', 'medium', 'M', 'disponivel', '2022-01-01', '2026-04-01', 'Vivi', 'Ermitage', true, null, false, false, 17, 'planilha', false),
  ('Sarah', 'dog', '13 anos e 6 meses', 'female', 'large', 'G', 'disponivel', '2013-01-01', '2021-01-01', 'Vivi', 'MG', true, null, false, false, 18, 'planilha', false),
  ('Whisky', 'dog', '05 meses', 'male', 'large', 'M/G', 'disponivel', '2026-02-10', '2026-06-08', 'Rep', 'Hipismo', true, null, false, false, 19, 'planilha', false),
  ('Caju', 'dog', '1 ano e 1 mês', 'male', 'medium', 'M', 'disponivel', '2025-06-08', '2026-06-08', 'Rep', 'Hipismo', true, null, false, false, 20, 'planilha', false),
  ('Neymar', 'dog', '6 anos e 6 meses', 'male', 'large', 'M/G', 'disponivel', '2020-01-01', '2020-12-20', 'Rep', null, true, null, false, false, 21, 'planilha', false),
  ('Hope', 'dog', '6 anos e 11 meses', 'female', 'small', 'P', 'disponivel', '2019-07-20', '2020-05-20', 'Carol', null, true, 'Paraplégica', false, false, 22, 'planilha', false),
  ('George', 'dog', '13 anos e 6 meses', 'male', 'large', 'G', 'disponivel', '2013-01-01', '2024-01-01', 'Fernanda', null, true, null, false, false, 23, 'planilha', false),
  ('Melo', 'dog', '7 anos e 6 meses', 'male', 'medium', 'M', 'em_tratamento', '2019-01-01', '2026-04-01', null, null, true, null, false, false, 24, 'planilha', false),
  ('Layla', 'dog', '2 anos e 6 meses', 'female', 'small', 'P', 'em_tratamento', '2024-01-01', '2026-04-26', 'Vivi', null, true, null, false, false, 25, 'planilha', false),
  ('Lilo', 'dog', '08 meses', 'female', 'small', 'P/M', 'em_tratamento', '2025-12-01', '2026-06-01', 'Bicharada', 'Lilo e Stich', true, null, true, false, 26, 'planilha', false),
  ('Stich', 'dog', '08 meses', 'male', 'medium', 'M', 'em_tratamento', '2025-12-02', '2026-06-02', 'Outros', 'Lilo e Stich', true, null, true, false, 27, 'planilha', false);

commit;

-- Conferência: deve devolver 13 disponíveis, 7 adotados, 4 em tratamento,
-- 3 em processo — os mesmos números da aba Dashboard da planilha.
-- select status, count(*) from public.animais where origem_registro='planilha' group by status;
