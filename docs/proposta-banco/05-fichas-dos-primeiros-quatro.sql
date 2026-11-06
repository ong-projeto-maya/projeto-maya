-- Fichas completas dos quatro primeiros animais, prontas para o site público.
--
-- Fonte das histórias: legendas dos posts de adoção do @projeto.maya, lidas em
-- 06/11/2026. O texto é da própria ONG; só retirei a chamada final de contato,
-- porque o site tem a dele.
-- Fonte das fotos: "8 - ADOÇÕES" no Drive da ONG. São os cards de adoção que
-- elas mesmas publicam, 1080x1350, recomprimidos para JPEG em public/animais/.
--
-- Estes quatro são os únicos, dos 27, que hoje têm história E foto. Todos estão
-- com status 'disponivel'. Ao fim, viram revisado = true e passam a aparecer no
-- site — são os primeiros a sair do limbo.
--
-- Onde a legenda do Instagram e a planilha divergem, segui o Instagram: é mais
-- recente e é o que a ONG afirma em público. As diferenças estão anotadas.

begin;

-- ---------------------------------------------------------------------------
-- Amélia
-- Planilha dizia "10 anos e 6 meses"; o post diz 8 anos. Peso informado: 15 kg,
-- então o size vira 'medium' (a planilha tinha 'small' pela regra do P/M).
-- ---------------------------------------------------------------------------
update public.animais set
  age = '8 anos',
  size = 'medium',
  story = $txt$Ela só precisa de duas coisas: um sofá e bastante carinho. É muito tranquila, boazinha, amorosa e companheira. Se dá bem com outros cachorros e, por ser muito dócil, acreditamos que também possa conviver com gatos.

A Amélia foi resgatada de um lixão e tinha um tumor bem feio no olho. Foi preciso remover esse olhinho, e agora virou o charme dela.

Ela teve uma vida muito triste. Agora tem alimentação e segurança no canil do hotel, mas queremos muito encontrar um lar pra ela, uma família que queira dar pra ela uma vida tranquila e cheia de amor.$txt$,
  image = '/animais/amelia.jpg',
  images = array['/animais/amelia.jpg'],
  temperament = array['Tranquila','Amorosa','Companheira','Dócil'],
  castrado = true,
  vacinado = true,
  condicao_especial = 'Vive bem com um olho só — o outro foi removido por causa de um tumor',
  instagram_url = 'https://www.instagram.com/p/DdhOpt3mzAF/',
  revisado = true,
  updated_at = now()
where name = 'Amélia';

-- ---------------------------------------------------------------------------
-- Café
-- ATENÇÃO: o post diz que o lar temporário só fica até o final de novembro.
-- ---------------------------------------------------------------------------
update public.animais set
  age = '2 anos',
  story = $txt$O Café foi um dos cachorros resgatados daquela casa da acumuladora, e acabou sendo o último deles que ainda não encontrou uma família. Todos os outros já foram adotados; agora falta só ele.

Ele é muito bonzinho, carinhoso e cheio de energia. Ama brincar, mas também ama um carinho, e vai no colo de todo mundo nos nossos eventos.

Tem um pouco de medo de outros cachorros novos no início, mas acreditamos que, com paciência, daria super certo com outros animais. Inclusive, ele convivia com gatos também, na casa da acumuladora.$txt$,
  image = '/animais/cafe.jpg',
  images = array['/animais/cafe.jpg'],
  temperament = array['Carinhoso','Brincalhão','Energético'],
  castrado = true,
  vacinado = true,
  observacoes = 'URGENTE: o lar temporário só consegue ficar com ele até o final de novembro de 2026.',
  instagram_url = 'https://www.instagram.com/p/De_81taG73u/',
  revisado = true,
  updated_at = now()
where name = 'Café';

-- ---------------------------------------------------------------------------
-- Caju
-- Post: 14 kg, 1 ano. Planilha: "1 ano e 1 mês", porte M. Mantido medium.
-- ---------------------------------------------------------------------------
update public.animais set
  age = '1 ano',
  story = $txt$O Caju é provavelmente um dos cachorros mais queridos que temos. É MUITO amoroso, daqueles que gostam de ficar pertinho o tempo todo. Super bonzinho, brincalhão, feliz, e ama outros cachorros.

O Caju vivia em um local que uma de nós frequenta e, infelizmente, outro cachorrinho que vivia por ali acabou sendo atropelado. A gente resolveu pegar o Caju antes que ele fosse o próximo.

Quem adotá-lo vai ter muita sorte. Ele é muito especial.$txt$,
  image = '/animais/caju.jpg',
  images = array['/animais/caju.jpg'],
  temperament = array['Amoroso','Grudento','Brincalhão','Sociável'],
  castrado = true,
  vacinado = true,
  instagram_url = 'https://www.instagram.com/p/DcJD1pilzbn/',
  revisado = true,
  updated_at = now()
where name = 'Caju';

-- ---------------------------------------------------------------------------
-- Whisky
-- Planilha dizia "05 meses"; o post diz 7 meses. Porte M/G -> size 'large'.
-- Tem requisitos de adoção que a ONG deixa explícitos — ficam em observacoes.
-- ---------------------------------------------------------------------------
update public.animais set
  age = '7 meses',
  size = 'large',
  story = $txt$O Whisky foi resgatado junto com o Caju, daquele local onde outro cachorrinho acabou sendo atropelado. A gente resolveu tirar os dois de lá antes que acontecesse o mesmo com eles.

Ele é muito dócil, amoroso, brincalhão e companheiro. Como é forte e tem muita energia, tem tendência a brincadeiras mais brutas com as pessoas. Precisa de uma família com experiência em cães maiores, que continue o adestramento que já vem sendo feito. Se dá super bem com outros cachorros, e o ideal seria uma família que já tenha outro cachorro pra ele brincar e gastar essa energia toda.

É um cachorro muito inteligente e com bastante potencial. Já faz trabalho com adestrador desde o resgate, e o adestrador também acompanha a adaptação na nova família.$txt$,
  image = '/animais/whisky.jpg',
  images = array['/animais/whisky.jpg'],
  temperament = array['Dócil','Brincalhão','Companheiro','Enérgico'],
  castrado = true,
  vacinado = true,
  observacoes = 'Requisitos da ONG: casa com quintal; família com experiência em cães maiores; compromisso com adestramento; ideal ter outro cachorro em casa. A adaptação é acompanhada por adestrador.',
  instagram_url = 'https://www.instagram.com/p/DdRnV5nm0w0/',
  revisado = true,
  updated_at = now()
where name = 'Whisky';

commit;

-- Conferência: deve devolver 4 linhas, todas com revisado = true e image preenchida.
-- select name, age, size, porte_label, castrado, vacinado, revisado, image
--   from public.animais where revisado = true order by name;
