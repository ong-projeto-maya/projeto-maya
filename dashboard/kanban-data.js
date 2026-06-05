window.KANBAN_DATA = {
  project: "projeto-maya",
  schemaVersion: "2.1.0",
  feature: "QA Fase 3: Supabase local Docker + login admin + CRUD + quiz + doador",
  phase: "QA com Supabase real — CONCLUÍDA",
  updatedAt: "2026-05-02T18:20:00.000Z",
  quality: {
    validationStatus: "pass",
    lastValidationAt: "2026-04-20T02:57:40.442Z",
    consistency: {
      totalProjects: 1,
      ok: 1,
      warnings: 0,
      failed: 0
    }
  },
  basePath: "C:/git/pessoal/projeto-maya",
  history: [],
  agents: [
    {
      id: "lelouch",
      name: "Lelouch vi Britannia",
      role: "Orchestrator",
      color: "#6366f1",
      emoji: "⚡",
      status: "done",
      task: "QA Fase 3: login admin ✅ → CRUD animal ✅ → quiz com seed ✅ → área doador ✅",
      startedAt: "2026-05-01T02:40:00.000Z",
      updatedAt: "2026-05-02T18:20:00.000Z",
      output: [
        "QA Fase 1+2 concluída: 5 bugs corrigidos, 25+ cenários testados",
        "Fase 3: Supabase local Docker up, schema + seed aplicados, admin user criado",
        "3 arquivos TSX com sintaxe quebrada corrigidos (admin/page, adotantes/page, doador/dashboard)",
        "Login admin com Supabase real: admin/admin123 → dashboard carregado ✅",
        "CRUD animal: Bolinha criado, editado (porte Pequeno), deletado ✅",
        "Quiz: 5 questões respondidas, match 'Bob' (7 anos, Pequeno, Calmo) via seed real ✅",
        "Área doador: registro nova conta, login, dashboard com dados reais ✅",
        "🐛 BUG 6 CORRIGIDO: hooks/useAuth.ts — signOut() no onAuthStateChange destruía sessão do doador",
        "🐛 BUG 7 CORRIGIDO: lib/supabase*.ts — storageKey custom em createBrowserClient incompatível com middleware (cookie name mismatch); removido storageKey para usar padrão sb-*"
      ],
      log: "L Lawliet ativado para QA Fase 3: CRUD animal, quiz com seed, área doador.",
      dependsOn: [],
      notFor: [
        "tarefa única simples",
        "bug rápido sem paralelismo",
        "pergunta pontual"
      ]
    },
    {
      id: "kakashi",
      name: "Kakashi Hatake",
      role: "Tech Lead",
      color: "#7c3aed",
      emoji: "🎯",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "erwin"
      ],
      notFor: [
        "escrever código de produção",
        "bug de CSS",
        "query de banco",
        "CI/CD"
      ]
    },
    {
      id: "geralt",
      name: "Geralt de Rivia",
      role: "Backend Developer",
      color: "#94a3b8",
      emoji: "🔘",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "edward"
      ],
      notFor: [
        "migrations de banco",
        "componentes frontend",
        "auditoria de segurança"
      ]
    },
    {
      id: "link",
      name: "Link",
      role: "Frontend Developer",
      color: "#06b6d4",
      emoji: "🔵",
      status: "done",
      task: "Implementar /admin/adotantes (camp_registrations) e /admin/relatorios (KPIs + CSS charts)",
      startedAt: "2026-04-30T00:00:00.000Z",
      output: [
        "app/admin/adotantes/page.tsx — tabela de inscrições camp_registrations, modal, busca, filtro, ações email/WhatsApp",
        "app/admin/relatorios/page.tsx — KPI cards, gráfico 6 meses CSS, distribuição por tipo/espécie, campanhas",
        "app/admin/page.tsx — badges 'Em breve' removidos de Adotantes e Relatórios"
      ],
      log: "/quem-somos e /voluntariado mantidos como ComingSoon a pedido do cliente. Zero erros TypeScript.",
      dependsOn: [
        "geralt",
        "isabelle"
      ],
      notFor: [
        "lógica de backend",
        "schema de banco",
        "auditoria de segurança"
      ]
    },
    {
      id: "edward",
      name: "Edward Elric",
      role: "Database Engineer",
      color: "#eab308",
      emoji: "🟡",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "kakashi"
      ],
      notFor: [
        "lógica de negócio",
        "componentes frontend",
        "análise estatística"
      ]
    },
    {
      id: "snake",
      name: "Solid Snake",
      role: "Security Engineer",
      color: "#dc2626",
      emoji: "🔐",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "geralt",
        "link"
      ],
      notFor: [
        "queries de banco",
        "componentes frontend",
        "análise de produto"
      ]
    },
    {
      id: "l-lawliet",
      name: "L Lawliet",
      role: "QA Engineer",
      color: "#ca8a04",
      emoji: "🔍",
      status: "done",
      task: "QA Fase 3: CRUD admin (animal), quiz com seed (8 animais), área doador (registro + login + dashboard)",
      startedAt: "2026-04-30T00:25:00.000Z",
      updatedAt: "2026-05-02T18:20:00.000Z",
      output: [
        "✅ / (landing) — hero, seções, stats, footer",
        "✅ /adocao — filtros, grid (0 animais esperado sem DB)",
        "✅ /campanhas — empty state correto",
        "✅ /doacoes — botões R$ 25/50/100/250 atualizam 'Doar R$ X' corretamente",
        "✅ /contato — preenchimento + submit exibe erro amigável (Supabase indisponível)",
        "✅ /quiz — fluxo 5 questões completo; tela de conclusão quando sem animais",
        "✅ /quem-somos — ComingSoon (bug 500 corrigido)",
        "✅ /voluntariado — ComingSoon funcional",
        "✅ /admin/login — preenchimento + erro 'Usuário ou senha incorretos' exibido",
        "✅ /admin/* (8 rotas) — todas redirecionam para /admin/login?redirectTo=...",
        "✅ /doador/login — formulário email/senha/entrar/criar conta",
        "✅ /doador/* (5 rotas protegidas) — todas redirecionam para /doador/login?redirectTo=...",
        "✅ Nav dropdowns — Adotar (Ver Animais, Quiz) e Como Ajudar (Doação, Campanhas, Voluntariado)",
        "✅ Dark mode toggle — liga/desliga, html.dark aplicado corretamente",
        "✅ Hero CTAs — 8 links corretos (adocao, doacoes, campanhas, contato, WhatsApp)",
        "✅ Mobile hamburger — presente no DOM, oculto em desktop via Tailwind responsivo",
        "✅ FASE 3 — Login admin Supabase real: admin/admin123 → dashboard ✅",
        "✅ FASE 3 — CRUD animal: criou Bolinha, editou porte, deletou ✅",
        "✅ FASE 3 — Quiz: 5 questões, match Bob (seed real) → link /adocao/UUID ✅",
        "✅ FASE 3 — Área doador: registro, login, dashboard (R$0, 0 doações, nível Bronze) ✅",
        "🐛 BUG 1 CORRIGIDO: app/quem-somos/page.tsx — export default duplicado causava 500",
        "🐛 BUG 2 CORRIGIDO: hooks/useAuth.ts — sem error handling, loading infinito sem Supabase",
        "🐛 BUG 3 CORRIGIDO: next.config.js — CSP sem unsafe-eval bloqueava React hydration inteiramente",
        "🐛 BUG 4 CORRIGIDO: middleware.ts — crash sem .env.local por falta de guard de credenciais",
        "🐛 BUG 5 CORRIGIDO: app/quiz/page.tsx — quiz travava em Q5 sem feedback quando animals.length === 0",
        "🐛 BUG 6 CORRIGIDO: hooks/useAuth.ts onAuthStateChange — signOut() destruía sessão do doador (sessões cross-client)",
        "🐛 BUG 7 CORRIGIDO: lib/supabase*.ts — storageKey custom incompatível com middleware SSR; removido para usar padrão sb-*"
      ],
      log: "5 bugs corrigidos total. Stripe IntegrationError em /doacoes é esperado sem .env.local. Server localhost:3002 estável.",
      dependsOn: [
        "geralt",
        "link"
      ],
      notFor: [
        "implementar features",
        "revisão arquitetural",
        "code review lógico (Levi)"
      ]
    },
    {
      id: "bulma",
      name: "Bulma",
      role: "DevOps Engineer",
      color: "#6b7280",
      emoji: "⚙️",
      status: "done",
      task: "Instalar Supabase CLI (Windows), supabase init + start, aplicar schema + seed, gerar .env.local",
      startedAt: "2026-05-01T02:45:00.000Z",
      updatedAt: "2026-05-02T18:20:00.000Z",
      output: [
        "Supabase CLI v2.95.4 instalado em C:\\Users\\Marcelo\\AppData\\Local\\supabase\\",
        "supabase start: 13 containers Docker up (Kong, Auth, PostgREST, Realtime, Storage, Studio...)",
        "3 migrations aplicadas, seed.sql executado (7 animais + admin_users)",
        "Admin user criado: admin@admin.projetomaya.br / admin123, UUID c3ad93ea",
        ".env.local configurado com SUPABASE_URL=http://127.0.0.1:54321",
        "CSP fix: http://127.0.0.1:54321 adicionado ao connect-src no next.config.js"
      ],
      log: "Setup completo. Dev server reiniciado na porta 3002.",
      dependsOn: [
        "l-lawliet",
        "snake"
      ],
      notFor: [
        "código de aplicação",
        "lógica de negócio",
        "design de UI"
      ]
    },
    {
      id: "2b",
      name: "2B",
      role: "AI Engineer",
      color: "#16a34a",
      emoji: "🤖",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "geralt"
      ],
      notFor: [
        "análise estatística pura (Senku)",
        "queries SQL de produto (Light)"
      ]
    },
    {
      id: "isabelle",
      name: "Isabelle",
      role: "UX/UI Designer",
      color: "#ec4899",
      emoji: "🎨",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "erwin"
      ],
      notFor: [
        "implementar componentes React (Link)",
        "backend e APIs",
        "copy de marketing (Dio)"
      ]
    },
    {
      id: "nami",
      name: "Nami",
      role: "Technical Writer",
      color: "#0891b2",
      emoji: "📝",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "link",
        "geralt"
      ],
      notFor: [
        "implementar features",
        "testes automatizados",
        "code review"
      ]
    },
    {
      id: "erwin",
      name: "Erwin Smith",
      role: "Product Manager",
      color: "#92400e",
      emoji: "🟤",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [],
      notFor: [
        "implementar features",
        "testes",
        "DevOps",
        "modelagem de banco"
      ]
    },
    {
      id: "dio",
      name: "Dio Brando",
      role: "Growth & Marketing",
      color: "#b91c1c",
      emoji: "🔴",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "link",
        "erwin"
      ],
      notFor: [
        "código técnico e APIs",
        "retenção por cohort (Light)",
        "compliance legal (Phoenix)"
      ]
    },
    {
      id: "light",
      name: "Light Yagami",
      role: "Data Analyst",
      color: "#0d9488",
      emoji: "🖖",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "geralt",
        "edward"
      ],
      notFor: [
        "ML e feature engineering (Senku)",
        "campanhas de growth (Dio)",
        "código de produção"
      ]
    },
    {
      id: "phoenix",
      name: "Phoenix Wright",
      role: "Regulatory Compliance",
      color: "#8b5cf6",
      emoji: "⚖️",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "geralt",
        "erwin"
      ],
      notFor: [
        "implementar features",
        "testes",
        "análise estatística",
        "design de UI"
      ]
    },
    {
      id: "korosensei",
      name: "Korosensei",
      role: "Scrum Master",
      color: "#06b6d4",
      emoji: "🔄",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [],
      notFor: [
        "desenvolvimento de features",
        "código de produção",
        "design e ADRs (Kakashi)"
      ]
    },
    {
      id: "holo",
      name: "Holo",
      role: "Discovery Analyst",
      color: "#a16207",
      emoji: "🐺",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [],
      notFor: [
        "implementar sem discovery prévia",
        "análise estatística (Senku)",
        "code review"
      ]
    },
    {
      id: "senku",
      name: "Senku Ishigami",
      role: "Data Scientist",
      color: "#10b981",
      emoji: "🧪",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "edward",
        "light"
      ],
      notFor: [
        "queries analíticas de produto simples (Light)",
        "integração com LLMs (2B)"
      ]
    },
    {
      id: "levi",
      name: "Levi Ackermann",
      role: "Code Reviewer",
      color: "#0284c7",
      emoji: "🔎",
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
      dependsOn: [
        "geralt",
        "link"
      ],
      notFor: [
        "revisão arquitetural (Kakashi)",
        "implementar features",
        "escrever testes (L Lawliet)"
      ]
    }
  ]
};
