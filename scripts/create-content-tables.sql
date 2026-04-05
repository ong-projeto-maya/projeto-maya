-- ============================================================
-- Projeto Maya — Content Tables Migration
-- Run this in the Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/lnyzamgkxeyxgyoqpjmj/sql/new
-- ============================================================

-- ── 1. ANIMAIS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.animais (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  type        text NOT NULL CHECK (type IN ('dog','cat')),
  age         text NOT NULL,
  gender      text NOT NULL CHECK (gender IN ('male','female')),
  size        text NOT NULL CHECK (size IN ('small','medium','large')),
  temperament text[] NOT NULL DEFAULT '{}',
  story       text NOT NULL DEFAULT '',
  image       text NOT NULL DEFAULT '',
  images      text[] NOT NULL DEFAULT '{}',
  is_adopted  boolean NOT NULL DEFAULT false,
  is_puppy    boolean NOT NULL DEFAULT false,
  is_rescued  boolean NOT NULL DEFAULT true,
  is_mixed    boolean NOT NULL DEFAULT false,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.animais ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_animais" ON public.animais;
CREATE POLICY "public_select_animais" ON public.animais
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_animais" ON public.animais;
CREATE POLICY "admin_write_animais" ON public.animais
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

-- ── 2. CAMPANHAS ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.campanhas (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                     text NOT NULL,
  slug                      text NOT NULL UNIQUE,
  description               text NOT NULL DEFAULT '',
  long_description          text NOT NULL DEFAULT '',
  goal                      numeric NOT NULL DEFAULT 0,
  raised                    numeric NOT NULL DEFAULT 0,
  start_date                date NOT NULL,
  end_date                  date NOT NULL,
  is_active                 boolean NOT NULL DEFAULT true,
  image                     text NOT NULL DEFAULT '',
  icon                      text NOT NULL DEFAULT 'Heart',
  category                  text NOT NULL DEFAULT 'saude',
  urgency                   text NOT NULL DEFAULT 'media',
  benefits                  text[] NOT NULL DEFAULT '{}',
  impact_story              text NOT NULL DEFAULT '',
  allows_registration       boolean NOT NULL DEFAULT false,
  registration_description  text,
  registration_spots        int NOT NULL DEFAULT 0,
  registration_registered   int NOT NULL DEFAULT 0,
  registration_requirements text[] NOT NULL DEFAULT '{}',
  created_at                timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_campanhas" ON public.campanhas;
CREATE POLICY "public_select_campanhas" ON public.campanhas
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_campanhas" ON public.campanhas;
CREATE POLICY "admin_write_campanhas" ON public.campanhas
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

-- ── 3. EVENTOS ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.eventos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  date        date NOT NULL,
  time        text NOT NULL DEFAULT '',
  location    text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image       text,
  type        text NOT NULL DEFAULT 'other' CHECK (type IN ('adoption','fundraising','educational','other')),
  capacity    int,
  registered  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_eventos" ON public.eventos;
CREATE POLICY "public_select_eventos" ON public.eventos
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_eventos" ON public.eventos;
CREATE POLICY "admin_write_eventos" ON public.eventos
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

-- ── 4. SITE_STATS ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.site_stats (
  key        text PRIMARY KEY,
  value      int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_site_stats" ON public.site_stats;
CREATE POLICY "public_select_site_stats" ON public.site_stats
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_site_stats" ON public.site_stats;
CREATE POLICY "admin_write_site_stats" ON public.site_stats
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

-- ── 5. SEED DATA ──────────────────────────────────────────────────────────────

INSERT INTO public.site_stats (key, value) VALUES
  ('rescued',      347),
  ('adopted',      289),
  ('volunteers',   52),
  ('monthly_goal', 10000)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

DELETE FROM public.animais;
INSERT INTO public.animais (name, type, age, gender, size, temperament, story, image, images, is_adopted, is_puppy, is_rescued, is_mixed, sort_order) VALUES
('Mel', 'dog', '3 anos', 'female', 'medium',
  ARRAY['Dócil','Carinhosa','Brincalhona'],
  'Mel foi resgatada das ruas com seus filhotes. Depois de cuidar de todos eles, agora chegou a hora dela encontrar uma família amorosa. É super carinhosa e adora crianças!',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80','https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&q=80','https://images.unsplash.com/photo-1598133893773-de3574464ef0?w=800&q=80'],
  false, false, true, true, 1),
('Thor', 'dog', '5 meses', 'male', 'large',
  ARRAY['Enérgico','Leal','Protetor'],
  'Thor é um filhote cheio de energia que foi abandonado ainda bebê. Está crescendo forte e saudável, procurando uma família que goste de aventuras!',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&q=80','https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80','https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&q=80'],
  false, true, true, false, 2),
('Luna', 'cat', '2 anos', 'female', 'small',
  ARRAY['Calma','Independente','Carinhosa'],
  'Luna foi encontrada machucada na rua. Após tratamento veterinário completo, está pronta para conhecer seu lar definitivo. Adora carinho e é muito tranquila.',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80','https://images.unsplash.com/photo-1573865526739-10c1dd7ac636?w=800&q=80','https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=800&q=80'],
  false, false, true, false, 3),
('Bob', 'dog', '7 anos', 'male', 'small',
  ARRAY['Calmo','Companheiro','Dócil'],
  'Bob é um senhor de idade que precisa de uma família paciente e amorosa. Apesar da idade, ainda tem muito amor para dar. Ideal para quem busca um companheiro tranquilo.',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&q=80','https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80','https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80'],
  false, false, true, true, 4),
('Nina', 'cat', '4 meses', 'female', 'small',
  ARRAY['Brincalhona','Curiosa','Sociável'],
  'Nina é uma gatinha filhote super ativa e curiosa. Foi resgatada de um terreno abandonado. Adora brincar e está pronta para alegrar uma nova família!',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80','https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=800&q=80','https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&q=80'],
  false, true, true, false, 5),
('Max', 'dog', '4 anos', 'male', 'large',
  ARRAY['Guardião','Leal','Inteligente'],
  'Max foi resgatado de maus-tratos. Após muito carinho e tratamento, recuperou a confiança nos humanos. É um cão leal e protetor, perfeito para quem busca um guardião.',
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&q=80','https://images.unsplash.com/photo-1587723958656-ee042cc565a1?w=800&q=80','https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&q=80'],
  false, false, true, true, 6),
('Mia', 'cat', '1 ano', 'female', 'small',
  ARRAY['Carinhosa','Vocal','Companheira'],
  'Mia é uma gatinha que adora conversar! Foi resgatada de uma colônia e socializada com muito amor. Perfeita para quem quer um pet comunicativo e afetuoso.',
  'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=800&q=80','https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80','https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800&q=80'],
  false, false, true, false, 7),
('Caramelo', 'dog', '6 meses', 'male', 'medium',
  ARRAY['Alegre','Sociável','Brincalhão'],
  'Caramelo é o típico vira-lata brasileiro: cheio de amor, leal e super inteligente. Foi resgatado com a mãe e irmãos, todos já adotados. Agora é a vez dele!',
  'https://images.unsplash.com/photo-1600804889194-e2f6cfac7fb8?w=800&q=80',
  ARRAY['https://images.unsplash.com/photo-1600804889194-e2f6cfac7fb8?w=800&q=80','https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80','https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=800&q=80'],
  false, true, true, true, 8);

DELETE FROM public.campanhas;
INSERT INTO public.campanhas (title, slug, description, long_description, goal, raised, start_date, end_date, is_active, image, icon, category, urgency, benefits, impact_story, allows_registration, registration_description, registration_spots, registration_registered, registration_requirements) VALUES
(
  'Campanha de Castração Solidária',
  'castracao-solidaria',
  'Ajude a controlar a população de animais de rua através de castrações gratuitas.',
  'A castração é fundamental pra diminuir o número de animais abandonados nas ruas. Com sua ajuda, conseguimos oferecer esse procedimento de forma gratuita pra tutores de baixa renda e animais de rua.',
  15000, 8750, '2026-03-01', '2026-05-31', true,
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
  'Heart', 'saude', 'alta',
  ARRAY['50 castrações realizadas','Controle populacional humanitário','Prevenção de doenças','Diminuição de animais nas ruas','Atendimento a famílias de baixa renda'],
  'A cada R$ 300 doados, conseguimos realizar uma castração completa, incluindo exames pré-operatórios, cirurgia, medicação e acompanhamento pós-operatório.',
  true,
  'Inscreva seu pet para castração gratuita. Voltado para tutores de baixa renda.',
  50, 32,
  ARRAY['Comprovar renda familiar de até 2 salários mínimos','Ser morador de São Paulo (SP)','Animal deve ter mais de 6 meses','Apresentar RG/CPF do tutor','Animal em bom estado de saúde geral']
),
(
  'Doação de Ração',
  'doacao-racao',
  'Garanta alimentação nutritiva para todos os nossos pets.',
  'Queremos garantir ração de qualidade e suplementação adequada pra todos os nossos resgatados. Com sua ajuda, nenhum animalzinho fica sem comida!',
  8000, 5200, '2026-03-01', '2026-08-31', true,
  'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&q=80',
  'Utensils', 'alimentacao', 'media',
  ARRAY['Ração premium pra 100 animais','Suplementação vitamínica','Petiscos nutritivos','Alimentação adequada pra filhotes','Dieta especial pra idosos'],
  'R$ 80 por mês garante a alimentação completa de um pet. Animais bem alimentados são mais saudáveis e felizes!',
  true,
  'Cadastre-se para receber ração e suplementação gratuita para seu pet.',
  100, 67,
  ARRAY['Comprovar renda familiar de até 2 salários mínimos','Ser morador da região metropolitana de São Paulo','Informar quantidade e tipo de animais','Apresentar documento com foto']
);

DELETE FROM public.eventos;
INSERT INTO public.eventos (title, date, time, location, description, image, type, capacity, registered) VALUES
('Feira de Adoção', '2026-05-15', '10:00', 'Parque Taquaral — Campinas/SP',
  'Grande feira de adoção com mais de 30 animais disponíveis. Venha conhecer seu novo melhor amigo! Traga toda a família.',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
  'adoption', 100, 45),
('Bazar Beneficente', '2026-05-22', '09:00', 'Praça da Liberdade — Campinas/SP',
  'Bazar com roupas, acessórios e produtos pet. Toda a renda será revertida para o Projeto Maya.',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'fundraising', 200, 78),
('Palestra: Posse Responsável', '2026-06-05', '19:00', 'Auditório da Biblioteca Municipal — Campinas/SP',
  'Palestra educativa sobre posse responsável de animais, cuidados básicos e saúde pet. Entrada gratuita.',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
  'educational', 50, 32),
('Caminhada Pet Solidária', '2026-06-20', '08:00', 'Parque Municipal — Campinas/SP',
  'Caminhada de 5km com seus pets. Inscrições revertem em doações para o projeto. Traga água e coleira!',
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600',
  'fundraising', 150, 89);

-- ============================================================
-- NEW TABLES — Forms, Newsletter, Testimonials
-- ============================================================

-- ── MENSAGENS (contact form) ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.mensagens (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      text NOT NULL,
  email     text NOT NULL,
  telefone  text,
  assunto   text NOT NULL DEFAULT 'outro',
  mensagem  text NOT NULL,
  lida      boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert mensagens"
  ON public.mensagens FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manages mensagens"
  ON public.mensagens USING ((auth.jwt() ->> 'role') = 'admin');

-- ── CAMP_REGISTRATIONS (campaign signup) ─────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.camp_registrations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id     uuid REFERENCES public.campanhas(id) ON DELETE SET NULL,
  campaign_title  text NOT NULL,
  nome            text NOT NULL,
  email           text NOT NULL,
  telefone        text NOT NULL,
  cpf             text,
  endereco        text,
  nome_pet        text,
  tipo_pet        text,
  motivo          text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.camp_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert camp_registrations"
  ON public.camp_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manages camp_registrations"
  ON public.camp_registrations USING ((auth.jwt() ->> 'role') = 'admin');

-- ── NEWSLETTER_SUBSCRIBERS ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  ativo      boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manages newsletter"
  ON public.newsletter_subscribers USING ((auth.jwt() ->> 'role') = 'admin');

-- ── DEPOIMENTOS (testimonials) ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.depoimentos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       text NOT NULL,
  animal     text NOT NULL,
  texto      text NOT NULL,
  avaliacao  int NOT NULL DEFAULT 5 CHECK (avaliacao BETWEEN 1 AND 5),
  aprovado   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.depoimentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads approved depoimentos"
  ON public.depoimentos FOR SELECT USING (aprovado = true);
CREATE POLICY "Anyone can submit depoimentos"
  ON public.depoimentos FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manages depoimentos"
  ON public.depoimentos USING ((auth.jwt() ->> 'role') = 'admin');

-- ── SITE_STATS — seed new keys ────────────────────────────────────────────────

INSERT INTO public.site_stats (key, value) VALUES
  ('total_donors',   0),
  ('total_raised',   0),
  ('animals_helped', 289)
ON CONFLICT (key) DO NOTHING;
