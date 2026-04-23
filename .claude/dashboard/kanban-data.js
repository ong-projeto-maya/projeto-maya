window.KANBAN_DATA = {
  project: "projeto-maya",
  schemaVersion: "2.1.0",
  feature: "Aguardando tarefa...",
  phase: "Pronto para /lelouch",
  updatedAt: "13:16",
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
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
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
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
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
      status: "idle",
      task: "—",
      startedAt: null,
      output: [],
      log: "",
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
