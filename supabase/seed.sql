-- =============================================================================
-- Seed data
-- Run with: supabase db seed   (or paste in the Supabase SQL Editor)
-- Safe to re-run — uses ON CONFLICT DO NOTHING / DO UPDATE.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- site_stats
-- ---------------------------------------------------------------------------
insert into public.site_stats (key, value) values
  ('rescued',      347),
  ('adopted',      289),
  ('volunteers',   52),
  ('monthly_goal', 10000),
  ('total_donors',   0),
  ('total_raised',   0),
  ('animals_helped', 289)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- ---------------------------------------------------------------------------
-- animais
-- ---------------------------------------------------------------------------
insert into public.animais (name, type, age, gender, size, temperament, story, image, images, is_adopted, is_puppy, is_rescued, is_mixed, sort_order) values
(
  'Mel', 'dog', '3 anos', 'female', 'medium',
  array['Dócil','Carinhosa','Brincalhona'],
  'Mel foi resgatada das ruas com seus filhotes. Depois de cuidar de todos eles, agora chegou a hora dela encontrar uma família amorosa. É super carinhosa e adora crianças!',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  array['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80','https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80','https://images.unsplash.com/photo-1598133893773-de3574464ef0?w=800&q=80'],
  false, false, true, true, 1
),
(
  'Thor', 'dog', '5 meses', 'male', 'large',
  array['Enérgico','Leal','Protetor'],
  'Thor é um filhote cheio de energia que foi abandonado ainda bebê. Está crescendo forte e saudável, procurando uma família que goste de aventuras!',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
  array['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80','https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80','https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80'],
  false, true, true, false, 2
),
(
  'Luna', 'cat', '2 anos', 'female', 'small',
  array['Calma','Independente','Carinhosa'],
  'Luna foi encontrada machucada na rua. Após tratamento veterinário completo, está pronta para conhecer seu lar definitivo. Adora carinho e é muito tranquila.',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
  array['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80','https://images.unsplash.com/photo-1573865526739-10c1dd7ac636?w=800&q=80','https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80'],
  false, false, true, false, 3
),
(
  'Bob', 'dog', '7 anos', 'male', 'small',
  array['Calmo','Companheiro','Dócil'],
  'Bob é um senhor de idade que precisa de uma família paciente e amorosa. Apesar da idade, ainda tem muito amor para dar. Ideal para quem busca um companheiro tranquilo.',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
  array['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80','https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80','https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80'],
  false, false, true, true, 4
),
(
  'Nina', 'cat', '4 meses', 'female', 'small',
  array['Brincalhona','Curiosa','Sociável'],
  'Nina é uma gatinha filhote super ativa e curiosa. Foi resgatada de um terreno abandonado. Adora brincar e está pronta para alegrar uma nova família!',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  array['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80','https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&q=80','https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&q=80'],
  false, true, true, false, 5
),
(
  'Max', 'dog', '4 anos', 'male', 'large',
  array['Guardião','Leal','Inteligente'],
  'Max foi resgatado de maus-tratos. Após muito carinho e tratamento, recuperou a confiança nos humanos. É um cão leal e protetor, perfeito para quem busca um guardião.',
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80',
  array['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80','https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=800&q=80','https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80'],
  false, false, true, true, 6
),
(
  'Mia', 'cat', '1 ano', 'female', 'small',
  array['Carinhosa','Vocal','Companheira'],
  'Mia é uma gatinha que adora conversar! Foi resgatada de uma colônia e socializada com muito amor. Perfeita para quem quer um pet comunicativo e afetuoso.',
  'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80',
  array['https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80','https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80','https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80'],
  false, false, true, false, 7
),
(
  'Caramelo', 'dog', '6 meses', 'male', 'medium',
  array['Alegre','Sociável','Brincalhão'],
  'Caramelo é o típico vira-lata brasileiro: cheio de amor, leal e super inteligente. Foi resgatado com a mãe e irmãos, todos já adotados. Agora é a vez dele!',
  'https://images.unsplash.com/photo-1600804889194-e2f6cfac7fb8?w=800&q=80',
  array['https://images.unsplash.com/photo-1600804889194-e2f6cfac7fb8?w=800&q=80','https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80','https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&q=80'],
  false, true, true, true, 8
)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- campanhas
-- ---------------------------------------------------------------------------
insert into public.campanhas (title, slug, description, long_description, goal, raised, start_date, end_date, is_active, image, icon, category, urgency, benefits, impact_story, allows_registration, registration_description, registration_spots, registration_registered, registration_requirements) values
(
  'Campanha de Castração Solidária',
  'castracao-solidaria',
  'Ajude a controlar a população de animais de rua através de castrações gratuitas.',
  'A castração é fundamental pra diminuir o número de animais abandonados nas ruas. Com sua ajuda, conseguimos oferecer esse procedimento de forma gratuita pra tutores de baixa renda e animais de rua.',
  15000, 8750, '2026-03-01', '2026-05-31', true,
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
  'Heart', 'saude', 'alta',
  array['50 castrações realizadas','Controle populacional humanitário','Prevenção de doenças','Diminuição de animais nas ruas','Atendimento a famílias de baixa renda'],
  'A cada R$ 300 doados, conseguimos realizar uma castração completa, incluindo exames pré-operatórios, cirurgia, medicação e acompanhamento pós-operatório.',
  true, 'Inscreva seu pet para castração gratuita. Voltado para tutores de baixa renda.',
  50, 32, array['Comprovar renda familiar de até 2 salários mínimos','Ser morador de São Paulo (SP)','Animal deve ter mais de 6 meses','Apresentar RG/CPF do tutor','Animal em bom estado de saúde geral']
),
(
  'Doação de Ração',
  'doacao-racao',
  'Garanta alimentação nutritiva para todos os nossos pets.',
  'Queremos garantir ração de qualidade e suplementação adequada pra todos os nossos resgatados. Com sua ajuda, nenhum animalzinho fica sem comida!',
  8000, 5200, '2026-03-01', '2026-08-31', true,
  'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&q=80',
  'Utensils', 'alimentacao', 'media',
  array['Ração premium pra 100 animais','Suplementação vitamínica','Petiscos nutritivos','Alimentação adequada pra filhotes','Dieta especial pra idosos'],
  'R$ 80 por mês garante a alimentação completa de um pet. Animais bem alimentados são mais saudáveis e felizes!',
  true, 'Cadastre-se para receber ração e suplementação gratuita para seu pet.',
  100, 67, array['Comprovar renda familiar de até 2 salários mínimos','Ser morador da região metropolitana de São Paulo','Informar quantidade e tipo de animais','Apresentar documento com foto']
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- eventos
-- ---------------------------------------------------------------------------
insert into public.eventos (title, date, time, location, description, image, type, capacity, registered) values
(
  'Feira de Adoção', '2026-05-15', '10:00', 'Parque Taquaral — Campinas/SP',
  'Grande feira de adoção com mais de 30 animais disponíveis. Venha conhecer seu novo melhor amigo! Traga toda a família.',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
  'adoption', 100, 45
),
(
  'Bazar Beneficente', '2026-05-22', '09:00', 'Praça da Liberdade — Campinas/SP',
  'Bazar com roupas, acessórios e produtos pet. Toda a renda será revertida para o Projeto Maya.',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'fundraising', 200, 78
),
(
  'Palestra: Posse Responsável', '2026-06-05', '19:00', 'Auditório da Biblioteca Municipal — Campinas/SP',
  'Palestra educativa sobre posse responsável de animais, cuidados básicos e saúde pet. Entrada gratuita.',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'educational', 50, 32
),
(
  'Caminhada Pet Solidária', '2026-06-20', '08:00', 'Parque Municipal — Campinas/SP',
  'Caminhada de 5km com seus pets. Inscrições revertem em doações para o projeto. Traga água e coleira!',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600',
  'fundraising', 150, 89
)
on conflict do nothing;
