'use client'

import { useState, useEffect } from 'react'
import {
  BookOpen, Syringe, Scissors, Utensils, GraduationCap, Phone, Tag,
  ChevronRight, ChevronLeft, AlertTriangle, CheckCircle, XCircle,
  Shield, Bug, Apple, HeartPulse, Info, PawPrint, Home, Star,
  Lightbulb, Mail, Camera, Check, ShoppingBag, Pill, Ruler, Droplets, Bed,
  Download, Zap, Clock, Baby, Dog, Calendar
} from 'lucide-react'

const tabs = [
  { id: 'saude', label: 'Saúde', icon: Syringe },
  { id: 'castracao', label: 'Castração', icon: Scissors },
  { id: 'alimentacao', label: 'Alimentação', icon: Utensils },
  { id: 'educacao', label: 'Adaptação & Educação', icon: GraduationCap },
  { id: 'identificacao', label: 'Identificação', icon: Tag },
  { id: 'contatos', label: 'Contatos', icon: Phone },
]

function SectionCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl text-maya-brown dark:text-white mb-4 flex items-center gap-2">
      {children}
    </h2>
  )
}

function BulletList({ items, color = 'text-maya-green' }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
          <CheckCircle size={14} className={`${color} flex-shrink-0 mt-0.5`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function StatusTag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {children}
    </span>
  )
}

// Badge "Exigência do Projeto Maya"
function MayaBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-maya-brown text-white">
      <PawPrint size={9} /> Exigência Maya
    </span>
  )
}

// Card de Emergência (aparece em todas as abas)
function EmergencyCard() {
  return (
    <div className="mb-6 bg-red-600 text-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-lg">
      <div className="flex items-center gap-2 flex-shrink-0">
        <Zap size={28} className="fill-white" />
        <span className="font-display text-lg">Sinais de Emergência</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          'Vômito persistente', 'Convulsão', 'Sangue nas fezes/urina',
          'Dificuldade para respirar', 'Fraqueza extrema / desmaio',
          'Não come há +24h', 'Ingeriu alimento proibido',
        ].map(s => (
          <span key={s} className="bg-white/20 text-xs px-2 py-1 rounded-full font-medium">{s}</span>
        ))}
      </div>
    </div>
  )
}

// Timeline Vacinal
function VaccineTimeline() {
  const events = [
    { age: '45 dias', label: '1ª V10', color: 'bg-maya-blue', detail: 'Início do protocolo' },
    { age: '7–9 sem', label: '2ª V10', color: 'bg-maya-blue', detail: '+21–28 dias' },
    { age: '10–12 sem', label: '3ª V10', color: 'bg-maya-blue', detail: '+21–28 dias' },
    { age: '4 meses', label: 'Antirrábica', color: 'bg-red-500', detail: 'Junto com a 3ª V10' },
    { age: 'Anual', label: 'Reforços', color: 'bg-maya-green', detail: '1 dose de cada' },
  ]
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-start gap-0 min-w-max">
        {events.map((e, i) => (
          <div key={e.age} className="flex items-start">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full ${e.color} flex items-center justify-center text-white flex-shrink-0`}>
                <Syringe size={16} />
              </div>
              <div className="mt-2 text-center w-24">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{e.label}</p>
                <p className="text-[10px] text-maya-blue font-semibold">{e.age}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{e.detail}</p>
              </div>
            </div>
            {i < events.length - 1 && (
              <div className="h-0.5 bg-gray-300 dark:bg-gray-600 w-8 mt-5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Grade de desenvolvimento por fase
function DevelopmentGrid() {
  const phases = [
    {
      label: '0–3 meses', icon: Baby, color: 'border-pink-300 bg-pink-50 dark:bg-pink-900/10',
      items: ['Desmame e adaptação', '1ª e 2ª doses V10', 'Vermífugos', 'Anti-pulgas', 'Não passear ainda', 'Cama, coleira e tapetinho'],
    },
    {
      label: '3–6 meses', icon: PawPrint, color: 'border-maya-orange/50 bg-maya-orange/5',
      items: ['3ª V10 + Antirrábica', 'Primeiros passeios!', 'Iniciar socialização', 'Agendar castração (porte P/M)', 'Ração de filhote', 'Iniciar educação básica'],
    },
    {
      label: '6–12 meses', icon: Dog, color: 'border-maya-blue/40 bg-maya-blue/5',
      items: ['Castração (obrigatória até 1 ano)', 'Transição para ração adulta', 'Reforços vacinais anuais', 'Vermífugos a cada 4–6 meses', 'Anti-pulgas em dia', 'Adestramento se necessário'],
    },
    {
      label: 'Adulto+', icon: Calendar, color: 'border-maya-green/40 bg-maya-green/5',
      items: ['Vacinação anual', 'Anti-pulgas contínuo', 'Check-up veterinário', 'Ração adulto/sênior (8+ anos)', 'Enriquecimento ambiental', 'Monitorar comportamento'],
    },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {phases.map(p => {
        const Icon = p.icon
        return (
          <div key={p.label} className={`border-2 rounded-xl p-4 ${p.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <Icon size={18} className="text-maya-brown dark:text-white" />
              <p className="text-sm font-bold text-maya-brown dark:text-white">{p.label}</p>
            </div>
            <ul className="space-y-1">
              {p.items.map(item => (
                <li key={item} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle size={11} className="text-maya-green flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

// Checklist interativo (salvo no localStorage)
const CHECKLIST_KEY = 'maya-checklist-v1'
const checklistItems = [
  { id: 'vacinas', label: 'Protocolo vacinal em dia (V10 + Antirrábica)', tab: 'saude' },
  { id: 'vermifugo', label: 'Vermífugo aplicado', tab: 'saude' },
  { id: 'pulgas', label: 'Anti-pulgas/carrapatos em dia', tab: 'saude' },
  { id: 'castracao', label: 'Castração agendada/realizada', tab: 'castracao' },
  { id: 'racao', label: 'Ração Super Premium ou Natural escolhida', tab: 'alimentacao' },
  { id: 'agua', label: 'Água sempre disponível e fresca', tab: 'alimentacao' },
  { id: 'identificacao', label: 'Tag de identificação na coleira', tab: 'identificacao' },
  { id: 'caminha', label: 'Caminha e potes comprados', tab: 'educacao' },
  { id: 'espaco', label: 'Espaço limitado preparado para o filhote', tab: 'educacao' },
  { id: 'brinquedos', label: 'Mordedores e brinquedos disponíveis', tab: 'educacao' },
  { id: 'vet', label: 'Veterinário de confiança escolhido', tab: 'saude' },
  { id: 'manual', label: 'Manual de cuidados lido completo', tab: 'identificacao' },
]

function AdoptionChecklist({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHECKLIST_KEY)
      if (saved) setChecked(JSON.parse(saved))
    } catch {}
  }, [])

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next)) } catch {}
  }

  const done = Object.values(checked).filter(Boolean).length
  const pct = Math.round((done / checklistItems.length) * 100)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-maya-brown dark:text-white flex items-center gap-2">
          <CheckCircle size={20} className="text-maya-green" />
          Checklist de Adoção
        </h3>
        <span className="text-sm font-bold text-maya-green">{done}/{checklistItems.length}</span>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-5">
        <div
          className="bg-maya-green h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {checklistItems.map(item => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-2 text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
          >
            <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
              checked[item.id]
                ? 'bg-maya-green border-maya-green'
                : 'border-gray-300 dark:border-gray-600 group-hover:border-maya-green'
            }`}>
              {checked[item.id] && <Check size={11} className="text-white" />}
            </div>
            <span className={`text-xs transition-colors ${checked[item.id] ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
              {item.label}
            </span>
            {!checked[item.id] && (
              <button
                onClick={e => { e.stopPropagation(); onNavigate(item.tab) }}
                className="ml-auto text-[10px] text-maya-blue hover:underline flex-shrink-0 hidden group-hover:block"
              >
                ver →
              </button>
            )}
          </button>
        ))}
      </div>
      {pct === 100 && (
        <div className="mt-4 p-3 bg-maya-green/10 rounded-xl text-center">
          <p className="text-sm font-bold text-maya-green">Parabéns! Seu pet está em ótimas mãos! 🐾</p>
        </div>
      )}
    </div>
  )
}

// ── SAÚDE ──────────────────────────────────────────────────────────────────────
function SaudeTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Primeiros Cuidados */}
      <SectionCard className="md:col-span-2 bg-maya-blue/5 border-maya-blue/20">
        <SectionTitle>
          <HeartPulse size={20} className="text-maya-blue" />
          Primeiros Cuidados
        </SectionTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Ao adotar um filhote, é necessário ter ciência de que a imunidade dele ainda é muito frágil. Ele pode ter alguma doença incubada, que foi transmitida pela mãe na gestação. Portanto, é indicado acompanhar com hemograma mesmo após o início da vacinação.
        </p>
        <BulletList color="text-maya-blue" items={[
          'Dar as vacinas iniciais, antes de passear',
          'Repetir o hemograma do filhote após cerca de 15 dias da adoção',
          'Acompanhar as fezes (pode ser necessário revermifugar)',
          'Dar medicação anti pulgas e carrapato',
        ]} />
      </SectionCard>

      {/* Vacinas */}
      <SectionCard>
        <SectionTitle>
          <Syringe size={20} className="text-maya-blue" />
          Vacinas
        </SectionTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          As vacinas são indispensáveis — são a única forma de evitar doenças fatais. O filhote só pode passear após finalizar o protocolo vacinal obrigatório.
        </p>

        <div className="space-y-4">
          <div className="border-l-4 border-maya-blue pl-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm text-maya-brown dark:text-white">Vacina Múltipla (V8/V10)</span>
              <StatusTag color="bg-red-100 text-red-700">Obrigatória</StatusTag>
              <MayaBadge />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">3 doses quando filhote + reforço anual. Protege contra parvovirose, cinomose, coronavirose, parainfluenza, adenovirose, hepatite e leptospirose.</p>
          </div>

          <div className="border-l-4 border-maya-blue pl-3">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm text-maya-brown dark:text-white">Antirrábica</span>
              <StatusTag color="bg-red-100 text-red-700">Obrigatória</StatusTag>
              <MayaBadge />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">1 dose a partir de 4 meses + reforço anual. Protege contra a raiva, zoonose transmissível entre animais e pessoas.</p>
          </div>

          <div className="border-l-4 border-gray-300 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-maya-brown dark:text-white">Gripe Canina</span>
              <StatusTag color="bg-gray-100 text-gray-700">Opcional</StatusTag>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">1 ou 2 doses conforme tipo. Protege contra a tosse dos canis (Bordetella).</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-300 flex items-center gap-1"><AlertTriangle size={12} className="flex-shrink-0" /> Vacinas sempre importadas! <MayaBadge /></p>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">A vacina nacional não possui certificação — transporte, armazenamento e aplicação não são fiscalizados. Pode não ter efeito ou até fazer mal ao animal.</p>
        </div>
      </SectionCard>

      {/* Protocolo Vacinal */}
      <SectionCard>
        <SectionTitle>
          <BookOpen size={20} className="text-maya-blue" />
          Protocolo Vacinal Obrigatório
        </SectionTitle>

        <div className="space-y-4">
          <div className="bg-maya-blue/10 rounded-xl p-4">
            <p className="text-sm font-semibold text-maya-blue mb-2">3 Doses da Vacina Múltipla (V8/V10)</p>
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <p><span className="font-medium">Início:</span> a partir de 45 dias (filhote saudável)</p>
              <p><span className="font-medium">Intervalo:</span> 21 a 28 dias entre doses</p>
              <p><span className="font-medium">Reforço:</span> anual (1 dose)</p>
            </div>
          </div>

          <div className="bg-maya-blue/10 rounded-xl p-4">
            <p className="text-sm font-semibold text-maya-blue mb-2">1 Dose da Vacina Antirrábica</p>
            <div className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <p><span className="font-medium">Início:</span> a partir de 4 meses (junto com a 3ª V10)</p>
              <p><span className="font-medium">Reforço:</span> anual (1 dose)</p>
            </div>
          </div>

          <div className="p-3 bg-maya-orange/10 rounded-xl border border-maya-orange/20">
            <p className="text-xs text-maya-orange font-semibold">Intervalo passado de 28 dias?</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">É necessário começar o protocolo do zero para evitar falha vacinal.</p>
          </div>
        </div>

        {/* Timeline vacinal */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-1"><Clock size={12} /> Linha do tempo</p>
          <VaccineTimeline />
        </div>
      </SectionCard>

      {/* Anti Pulgas */}
      <SectionCard>
        <SectionTitle>
          <Bug size={20} className="text-maya-orange" />
          Anti Pulgas e Carrapatos
        </SectionTitle>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Imprescindível manter sempre em dia. Pulgas e carrapatos transmitem doenças que podem levar a complicações sérias e até à morte.
        </p>

        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Marcas indicadas (comprimido — mais eficaz):</p>
          <div className="flex flex-wrap gap-2">
            {['Nexgard (30 dias)', 'Credeli (30 dias)', 'Simparic (30 dias)', 'Bravecto (90 dias)'].map(m => (
              <span key={m} className="bg-maya-green/10 text-maya-green text-xs px-2 py-1 rounded-full">{m}</span>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Coleiras Scalibor e Seresto também são boas opções (a partir de 8 meses), mas os comprimidos são superiores.</p>
        </div>

        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
          <p className="text-xs font-semibold text-red-700 dark:text-red-300">Doença do Carrapato</p>
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">A picada de um único carrapato pode causar <strong>erliquiose, babesiose ou anaplasmose</strong> — doenças que atacam o sangue e podem levar à morte se não tratadas. Tem cura, mas a prevenção é essencial!</p>
        </div>
      </SectionCard>

      {/* Vermífugo + Giárdia */}
      <SectionCard>
        <SectionTitle>
          <Shield size={20} className="text-maya-green" />
          Vermífugo & Parasitas Internos
        </SectionTitle>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Vermífugo</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Vermes podem ser transmitidos pela mãe na gestação e também estão no ambiente. O vermífugo deve ser dado quando filhote e depois a cada 4 a 6 meses, por toda a vida.</p>
            <BulletList color="text-maya-green" items={[
              '1 dose conforme o peso + 1 reforço após 15 dias (ciclo dos vermes)',
              'Marcas indicadas: Top Dog, Drontal, Endogard',
            ]} />
          </div>

          <div className="border-t dark:border-gray-600 pt-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Giárdia e Isóspora</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Infecções protozoárias que atacam o sistema gastrointestinal. Principal sintoma: diarreia (pode ser acompanhada de vômito). Tratamento com antibióticos + probióticos. Animais doentes devem ser isolados dos saudáveis e o ambiente higienizado com desinfetantes.</p>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

// ── CASTRAÇÃO ─────────────────────────────────────────────────────────────────
function CastracaoTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Por que castrar */}
      <SectionCard className="md:col-span-2 bg-maya-orange/5 border-maya-orange/20">
        <SectionTitle>
          <HeartPulse size={20} className="text-maya-orange" />
          Por que a Castração é Obrigatória?
        </SectionTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          A castração é um ato de amor e é <strong>obrigatória</strong> para todos os filhotes adotados no Projeto Maya. Existem 30 milhões de animais abandonados só no Brasil — a castração é a melhor forma de evitar que isso continue.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Controle Populacional', icon: PawPrint, desc: 'Evita ninhadas indesejadas e reduz o abandono' },
            { label: 'Prevenção de Doenças', icon: Pill, desc: 'Reduz riscos de tumores e doenças transmissíveis' },
            { label: 'Melhora do Comportamento', icon: GraduationCap, desc: 'Menos fugas, agressividade e marcação' },
          ].map(({ label, icon: Icon, desc }) => (
            <div key={label} className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2"><Icon size={28} className="text-maya-orange" /></div>
              <p className="text-xs font-semibold text-maya-brown dark:text-white mb-1">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Fêmeas */}
      <SectionCard>
        <SectionTitle>
          <Scissors size={20} className="text-pink-500" />
          Por que Castrar as Fêmeas?
        </SectionTitle>
        <BulletList color="text-pink-500" items={[
          'Evita acasalamentos indesejáveis e cios',
          'Reduz o risco de câncer de mama em até 100%',
          'Evita a piometra (grave infecção uterina, pode ser fatal)',
          'Evita gravidez psicológica e suas consequências',
          'Evita doenças sexualmente transmissíveis (TVT)',
          'Evita quedas de imunidade relacionadas ao cio',
        ]} />

        <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
          <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-1">Quando castrar?</p>
          <p className="text-xs text-gray-700 dark:text-gray-300"><span className="font-medium">Porte P e M:</span> indicamos com 6 meses</p>
          <p className="text-xs text-gray-700 dark:text-gray-300"><span className="font-medium">Porte G:</span> entre 8 e 10 meses</p>
          <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1 flex-wrap"><AlertTriangle size={12} className="flex-shrink-0" /> Obrigatório até 1 ano de idade (multa R$ 500 + perda da guarda) <MayaBadge /></p>
        </div>
      </SectionCard>

      {/* Machos */}
      <SectionCard>
        <SectionTitle>
          <Scissors size={20} className="text-blue-500" />
          Por que Castrar os Machos?
        </SectionTitle>
        <BulletList color="text-blue-500" items={[
          'Evita fugas (motivadas por atração sexual)',
          'Melhora muito o comportamento e socialização',
          'Evita marcação de território (xixi por todo canto)',
          'Reduz agressividade motivada por excitação sexual',
          'Evita tumores testiculares e problemas na próstata',
          'Evita doenças sexualmente transmissíveis (TVT)',
        ]} />

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Quando castrar?</p>
          <p className="text-xs text-gray-700 dark:text-gray-300"><span className="font-medium">Porte P e M:</span> entre 5 e 6 meses</p>
          <p className="text-xs text-gray-700 dark:text-gray-300"><span className="font-medium">Porte G:</span> entre 8 e 10 meses</p>
          <p className="text-xs font-semibold text-red-600 mt-1 flex items-center gap-1 flex-wrap"><AlertTriangle size={12} className="flex-shrink-0" /> Obrigatório até 1 ano de idade (multa R$ 500 + perda da guarda) <MayaBadge /></p>
        </div>
      </SectionCard>

      {/* Anestesia */}
      <SectionCard>
        <SectionTitle>
          <Info size={20} className="text-maya-blue" />
          Anestesia e Valores
        </SectionTitle>

        <div className="space-y-3 text-sm">
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-700">
            <p className="text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-1"><XCircle size={12} className="flex-shrink-0" /> Anestesia Dissociativa (injetável)</p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Mais barata, porém mais arriscada. Sem acompanhamento dos parâmetros durante o procedimento. <span className="font-semibold">Não indicamos.</span></p>
          </div>

          <div className="p-3 bg-maya-green/10 rounded-xl border border-maya-green/20">
            <p className="text-xs font-semibold text-maya-green flex items-center gap-1 flex-wrap"><CheckCircle size={12} className="flex-shrink-0" /> Anestesia Inalatória — Obrigatória no Projeto Maya <MayaBadge /></p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Muito mais segura. Permite reverter qualquer problema durante a cirurgia. Veterinário anestesista acompanha junto com o cirurgião.</p>
          </div>

          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Valores estimados (anestesia inalatória):</p>
            <p className="text-xs text-gray-600 dark:text-gray-300"><span className="font-medium">Machos:</span> R$ 500 a R$ 1.000</p>
            <p className="text-xs text-gray-600 dark:text-gray-300"><span className="font-medium">Fêmeas:</span> R$ 700 a R$ 1.500</p>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">Campanhas de castração</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Geralmente não indicamos para quem pode pagar por particular (podem reutilizar materiais, usar anestesia dissociativa). Porém é melhor castrar em campanha do que não castrar.</p>
          </div>
        </div>
      </SectionCard>

      {/* Mitos e Verdades */}
      <SectionCard>
        <SectionTitle>
          <Star size={20} className="text-maya-orange" />
          Mitos e Verdades
        </SectionTitle>
        <div className="space-y-3">
          {[
            { mito: false, text: 'Animal castrado faz menos xixi por todos os cantos', detail: 'Correto! Marcação de território é reduzida ou eliminada.' },
            { mito: false, text: 'Castração é um procedimento seguro', detail: 'Quando feita corretamente com anestesia adequada, não causa sofrimento.' },
            { mito: true, text: 'Castração faz o animal engordar', detail: 'Falso. Gordura vem de dieta inadequada e pouco exercício.' },
            { mito: false, text: 'Castração reduz riscos de câncer', detail: 'Sim! Risco de tumores é bastante reduzido ou zerado.' },
            { mito: true, text: 'Macho perde a masculinidade com a castração', detail: 'Falso científico. Personalidade não muda, só o instinto de procriar.' },
            { mito: true, text: 'Fêmea deve ter pelo menos uma cria antes', detail: 'Falso! Quanto antes castrar, menor a chance de tumores.' },
            { mito: false, text: 'Castração faz com que o animal fuja menos', detail: 'Sim. Machos não castrados tentam escapar atrás de fêmeas no cio.' },
            { mito: false, text: 'Animal castrado briga menos', detail: 'Sim! Agressividade nos machos está relacionada à disputa sexual.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              {item.mito
                ? <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                : <CheckCircle size={14} className="text-maya-green flex-shrink-0 mt-0.5" />}
              <div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{item.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

// ── ALIMENTAÇÃO ───────────────────────────────────────────────────────────────
function AlimentacaoTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Tipos de Ração */}
      <SectionCard className="md:col-span-2">
        <SectionTitle>
          <Utensils size={20} className="text-maya-green" />
          Tipos de Ração
        </SectionTitle>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">A alimentação está diretamente ligada à saúde e longevidade do animal. Existem 4 categorias — jamais indicamos Standard:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              level: 'Standard', badge: 'Não indicamos', color: 'border-red-300 bg-red-50 dark:bg-red-900/10',
              badgeColor: 'bg-red-100 text-red-700', examples: 'Pedigree, Magnus, Dog Chow',
              desc: 'Contém aromatizantes e corantes artificiais (cancerígenos). Baixa digestibilidade.'
            },
            {
              level: 'Premium', badge: 'Indicamos parcialmente', color: 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10',
              badgeColor: 'bg-yellow-100 text-yellow-700', examples: 'Golden, Gran Plus, Royal Performance',
              desc: 'Mais de uma fonte de proteína. Pode conter conservantes e corantes artificiais.'
            },
            {
              level: 'Super Premium', badge: 'Indicamos', color: 'border-maya-green bg-maya-green/5',
              badgeColor: 'bg-maya-green/20 text-maya-green', examples: 'Hills, Royal Canin, Pro Plan, Premier',
              desc: 'Excelente nutrição, proteínas de alta qualidade, antioxidantes e protetores articulares.'
            },
            {
              level: 'Super Premium Natural', badge: 'Mais indicamos', color: 'border-maya-green bg-maya-green/10',
              badgeColor: 'bg-maya-green/30 text-maya-green', examples: 'Fórmula Natural, N&D, Biofresh, Guabi Natural',
              desc: 'Todas as qualidades da Super Premium + sem transgênicos, corantes ou aromatizantes artificiais.'
            },
          ].map(r => (
            <div key={r.level} className={`border-2 rounded-xl p-4 ${r.color}`}>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.badgeColor}`}>{r.badge}</span>
              <p className="font-bold text-sm text-maya-brown dark:text-white mt-2 mb-1">{r.level}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 italic">{r.examples}</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">{r.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Quantidade e Frequência */}
      <SectionCard>
        <SectionTitle>
          <BookOpen size={20} className="text-maya-blue" />
          Quantidade e Frequência
        </SectionTitle>
        <div className="space-y-3">
          <div className="p-3 bg-maya-blue/10 rounded-xl">
            <p className="text-xs font-semibold text-maya-blue">Como calcular a quantidade diária?</p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Pela tabela no verso da embalagem, de acordo com o porte estimado quando adulto e a idade atual.</p>
          </div>
          <BulletList color="text-maya-blue" items={[
            'Até 6 meses: dividir em 3 porções por dia',
            'Após 6 meses: dar 2 vezes ao dia',
            'Até 12 meses: ração específica de filhote',
            'Entre 1 e 7 anos: ração de adulto',
            'A partir de 8 anos: ração sênior',
            'Não deixar ração à vontade (perde nutrientes, atrai insetos e fungos)',
            'Água sempre disponível, limpa e fresca',
          ]} />
        </div>
      </SectionCard>

      {/* Troca de Ração */}
      <SectionCard>
        <SectionTitle>
          <ChevronRight size={20} className="text-maya-orange" />
          Troca Gradual de Ração
        </SectionTitle>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">A troca abrupta pode causar dores de barriga, gases e desconfortos. Faça a transição em 7 dias:</p>
        <div className="space-y-3">
          {[
            { days: '1º e 2º dia', old: 75, newR: 25 },
            { days: '3º e 4º dia', old: 50, newR: 50 },
            { days: '5º e 6º dia', old: 25, newR: 75 },
            { days: '7º dia', old: 0, newR: 100 },
          ].map(d => (
            <div key={d.days}>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{d.days}</p>
              <div className="flex rounded-full overflow-hidden h-5 text-[10px] font-medium">
                {d.old > 0 && (
                  <div className="bg-maya-orange/40 flex items-center justify-center text-white" style={{ width: `${d.old}%` }}>
                    {d.old}% antiga
                  </div>
                )}
                {d.newR > 0 && (
                  <div className="bg-maya-green flex items-center justify-center text-white" style={{ width: `${d.newR}%` }}>
                    {d.newR}% nova
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Frutas permitidas */}
      <SectionCard>
        <SectionTitle>
          <Apple size={20} className="text-maya-green" />
          Frutas e Legumes Permitidos
        </SectionTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Os petiscos não devem constituir mais de 10% das calorias diárias. 90% deve ser ração!</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Manga (sem caroço e casca)', 'Maçã (sem sementes)', 'Banana (sem casca)',
            'Melancia (sem sementes)', 'Cenoura (crua/cozida)', 'Brócolis (cru/cozido)',
            'Pepino (cru, cortado)', 'Mandioquinha (cozida)', 'Abobrinha (crua/cozida)',
          ].map(item => (
            <span key={item} className="bg-maya-green/10 text-maya-green text-xs px-3 py-1 rounded-full">{item}</span>
          ))}
        </div>
      </SectionCard>

      {/* Alimentos proibidos */}
      <SectionCard>
        <SectionTitle>
          <AlertTriangle size={20} className="text-red-500" />
          Alimentos Proibidos
        </SectionTitle>
        <p className="text-xs text-red-600 dark:text-red-400 mb-3 font-semibold">A ingestão de alguns desses alimentos pode ser fatal. Se suspeitar de ingestão, procure veterinário imediatamente — é emergência!</p>
        <div className="flex flex-wrap gap-2">
          {[
            'Chocolate', 'Cebola', 'Alho', 'Alho-poró', 'Uva',
            'Uva Passa', 'Abacate', 'Café', 'Laticínios', 'Macadâmia',
            'Ovo Cru', 'Açúcar', 'Frutas Cítricas', 'Pimenta', 'Pão',
          ].map(item => (
            <span key={item} className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-3 py-1 rounded-full">{item}</span>
          ))}
        </div>
      </SectionCard>

      {/* Mordedores e Petiscos */}
      <SectionCard className="md:col-span-2">
        <SectionTitle>
          <PawPrint size={20} className="text-maya-brown" />
          Mordedores e Petiscos
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-maya-brown dark:text-white mb-2">Prefira naturais desidratados:</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Pulmão, casco, orelha, traqueia, vergalho, pé de frango etc. — sem aromatizantes ou conservantes artificiais. Biscoitos naturais também são ótimas opções!</p>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="text-xs font-semibold text-red-600 flex items-center gap-1"><XCircle size={12} className="flex-shrink-0" /> Nunca dê ossos de nó alvejados!</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Possuem muitos produtos químicos na composição e podem causar engasgos e sufocamento.</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-maya-brown dark:text-white mb-2 flex items-center gap-2"><ShoppingBag size={16} className="text-maya-green" /> Parceria Three Pets:</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Loja online de SP com entrega para todo o país. Muitas opções naturais de qualidade. Use nosso cupom no checkout:</p>
            <div className="p-3 bg-maya-green/10 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-maya-green flex items-center gap-1"><Check size={12} /> 10% de desconto</p>
              <p className="text-xs font-semibold text-maya-green flex items-center gap-1"><Check size={12} /> 10% revertido para a ONG</p>
              <a href="https://www.threepets.com.br" target="_blank" rel="noopener noreferrer" className="text-xs text-maya-blue hover:underline block mt-1">www.threepets.com.br | @threepetsbr</a>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

// ── EDUCAÇÃO ──────────────────────────────────────────────────────────────────
function EducacaoTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Preparação da Casa */}
      <SectionCard>
        <SectionTitle>
          <Home size={20} className="text-maya-blue" />
          Preparação da Casa
        </SectionTitle>
        <div className="space-y-3">
          {[
            { icon: Ruler, title: 'Limitar os espaços', desc: 'Não deixe o filhote livre pela casa nos primeiros dias. Separe um espaço e amplie gradualmente. Garanta poucos fios e móveis para ele entender o que pode e não pode morder.' },
            { icon: Droplets, title: 'Higiene', desc: 'Se ele não usar o quintal, vai precisar de tapetinho higiênico (descartável ou reutilizável).' },
            { icon: Star, title: 'Brinquedos', desc: 'Mordedores e pelúcias são ótimas opções para os primeiros momentos.' },
            { icon: Bed, title: 'Caminha', desc: 'Adequada ao tamanho do filhote. Prefira uma mais resistente.' },
            { icon: Utensils, title: 'Alimentação', desc: 'Ração de alta qualidade + potes para água e ração.' },
            { icon: Shield, title: 'Proteção', desc: 'Anti parasitários e vermífugos podem ser dados em casa ou pelo veterinário.' },
            { icon: Tag, title: 'Identificação', desc: 'Uma tag com seu nome e telefone na coleira, para ficar sempre com ele.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon size={18} className="text-maya-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Adaptação */}
      <SectionCard>
        <SectionTitle>
          <HeartPulse size={20} className="text-pink-500" />
          Adaptação
        </SectionTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          É normal que o filhote chore bastante e estranhe o novo lar nos primeiros dias e até semanas. Ele estava acostumado com a mãe e os irmãos — mas isso sempre passa!
        </p>
        <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl mb-3">
          <p className="text-xs font-semibold text-pink-700 dark:text-pink-300 mb-2">Como facilitar:</p>
          <BulletList color="text-pink-500" items={[
            'Ofereça carinho para ele se sentir acolhido',
            'Respeite o espaço dele para mostrar que está seguro',
            'Tenha paciência — a personalidade aflora aos poucos',
            'Evite agarrar e pegar no colo o tempo todo',
            'Não force a aproximação em filhotes mais medrosos',
          ]} />
        </div>
        <div className="p-3 bg-maya-blue/10 rounded-xl">
          <p className="text-xs font-semibold text-maya-blue">Dê atenção, mas espaço também!</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Alguns filhotes são mais medrosos no início e precisam de um tempo maior para confiar nas pessoas. Com o tempo, se aproximam de forma natural!</p>
        </div>
      </SectionCard>

      {/* Ansiedade de Separação */}
      <SectionCard>
        <SectionTitle>
          <AlertTriangle size={20} className="text-maya-orange" />
          Ansiedade de Separação
        </SectionTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Nos primeiros dias, fique o maior tempo possível com ele. Depois, acostume-o gradualmente a ficar sozinho: comece com 20 min, depois 30, 40... até 1 hora, e continue estendendo.
        </p>
        <div className="p-3 bg-maya-orange/10 rounded-xl mb-3">
          <p className="text-xs font-semibold text-maya-orange mb-1">O que pode causar ansiedade:</p>
          <BulletList color="text-maya-orange" items={[
            'Não acostumar o pet a ficar sozinho',
            'Estimulação excessiva na fase de filhote',
            'Separação precoce da mãe',
            'Evento traumático ou mudança de ambiente (mudança, doação)',
          ]} />
        </div>
        <div className="p-3 bg-maya-blue/10 rounded-xl">
          <p className="text-xs font-semibold text-maya-blue flex items-center gap-1"><Lightbulb size={12} className="flex-shrink-0" /> Dificuldade? Contrate um adestrador!</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">É um investimento que vale muito a pena em diversas situações.</p>
        </div>
      </SectionCard>

      {/* Educação */}
      <SectionCard>
        <SectionTitle>
          <GraduationCap size={20} className="text-maya-green" />
          Educação
        </SectionTitle>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          É normal que filhotes confundam o que é e o que não é brinquedo. Para acabar com o tédio, coçar os dentes ou chamar atenção, podem destruir tapetes, caminhas e móveis.
        </p>
        <BulletList color="text-maya-green" items={[
          'Filhotes precisam de atenção e supervisão — não deixar sozinho mais de algumas horas',
          'Limite o espaço e estabeleça uma rotina',
          'Ensine o que pode e o que não pode (paciência: pode levar semanas/meses)',
          'Se viu algo errado na hora: repreenda com "não" mais firme — NUNCA grite ou bata',
          'Elogie os acertos com carinho e/ou petiscos (reforço positivo)',
          'Deixe sempre brinquedos variados disponíveis',
        ]} />
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
          <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">A culpa nunca é do animal!</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">É do tutor que não está fazendo o manejo correto. Não hesite em buscar ajuda profissional de um adestrador ou especialista em comportamento animal.</p>
        </div>
      </SectionCard>

      {/* Brinquedos */}
      <SectionCard>
        <SectionTitle>
          <Star size={20} className="text-maya-orange" />
          Brinquedos e Mordedores
        </SectionTitle>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Nem todo brinquedo é igual! Os que realmente gastam energia podem não ser os mais baratos, mas valem mais do que um sofá novo.</p>
        <div className="space-y-3">
          <div className="border-l-4 border-maya-orange pl-3">
            <p className="text-xs font-semibold text-maya-brown dark:text-white">Mordedores Sintéticos (nylon — atóxicos e resistentes)</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Aliviam tédio e ansiedade. Auxiliam na limpeza dos dentes.</p>
            <p className="text-xs text-gray-400 italic">Marcas: Benebone, Kong, Buddy Nylon, Pet Games</p>
          </div>
          <div className="border-l-4 border-maya-brown pl-3">
            <p className="text-xs font-semibold text-maya-brown dark:text-white">Mordedores Naturais Desidratados</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Cascos, chifres, traqueia, vergalho, pé de frango. Suprem necessidade natural de roer e auxiliam no desenvolvimento mental.</p>
            <p className="text-xs text-gray-400 italic">Marcas: Luv, Dipetti, Natural Farm, Natuka, Wood&apos;n&apos;Pets</p>
          </div>
          <div className="border-l-4 border-maya-blue pl-3">
            <p className="text-xs font-semibold text-maya-brown dark:text-white">Recheáveis (Kong, labirintos)</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Gastam muita energia mental, reduzem ansiedade. Recheie com ração úmida (Pet Delícia, Live Long) congelada, ou frutas e legumes permitidos.</p>
          </div>
        </div>
      </SectionCard>

      {/* Enriquecimento */}
      <SectionCard>
        <SectionTitle>
          <Star size={20} className="text-maya-green" />
          Enriquecimento Ambiental
        </SectionTitle>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          Oferecer dentro de casa tudo que o cão precisa para satisfazer seus instintos naturais. É fundamental para que seja saudável e feliz — vai muito além de alimentação e abrigo.
        </p>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-2">Principais benefícios:</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {['Estimulação mental', 'Exercício físico', 'Redução de comportamentos indesejados', 'Alívio do estresse', 'Fortalecimento do vínculo'].map(b => (
            <span key={b} className="bg-maya-green/10 text-maya-green text-xs px-2 py-0.5 rounded-full">{b}</span>
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">Dicas práticas:</p>
        <BulletList color="text-maya-green" items={[
          'Espalhe ração e petiscos pela casa para simular a caça e estimular o faro',
          'Quando puder passear, leve a ambientes diferentes para socializar',
          'Ofereça mordedores sintéticos e naturais variados',
          'Brinquedos de texturas diferentes: pelúcias, nylon, corda, bolinhas',
          'Coloque ração em brinquedos dispenser (DDR) ou garrafa pet com furos',
          'Enrole ração em um pano para ele desenrolar com o focinho',
          'Use comedouros desafiadores com "ondulações" ou ração escondida',
          'Brinquedos recheáveis com ração úmida congelada',
        ]} />
      </SectionCard>
    </div>
  )
}

// ── IDENTIFICAÇÃO ─────────────────────────────────────────────────────────────
function IdentificacaoTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SectionCard className="bg-maya-green/5 border-maya-green/20">
        <SectionTitle>
          <Tag size={20} className="text-maya-green" />
          Identificação — Não deixe pra depois!
        </SectionTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Uma tag com seu nome e telefone na coleira pode ser a diferença entre encontrar ou não seu pet caso ele fuja. <strong>Não espere ele fugir para comprar — pode ser tarde demais.</strong>
        </p>
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl">
          <p className="font-semibold text-maya-brown dark:text-white mb-2">Pet Name — Tags de Silicone</p>
          <BulletList color="text-maya-green" items={[
            'Feitas de silicone — disponível em diversas cores e modelos',
            'Não risca, não desgasta, não faz barulho',
            'À prova d\'água',
            'Ajuda ONGs como o Projeto Maya!',
          ]} />
          <a href="https://www.petname.com.br" target="_blank" rel="noopener noreferrer" className="mt-3 block p-3 bg-maya-green/10 rounded-xl text-xs font-semibold text-maya-green hover:underline">
            www.petname.com.br | @petnamebr →
          </a>
        </div>
      </SectionCard>

      <SectionCard className="bg-maya-blue/5 border-maya-blue/20">
        <SectionTitle>
          <Info size={20} className="text-maya-blue" />
          Sobre este Manual
        </SectionTitle>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          Este material foi escrito com muito cuidado pela equipe do Projeto Maya, com o apoio de médicas veterinárias especializadas:
        </p>
        <div className="space-y-3 mb-4">
          <div className="p-3 bg-white dark:bg-gray-700 rounded-xl">
            <p className="text-sm font-semibold text-maya-brown dark:text-white">Daniella Garske Schiavinato</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CRMV 60856-SP</p>
          </div>
          <div className="p-3 bg-white dark:bg-gray-700 rounded-xl">
            <p className="text-sm font-semibold text-maya-brown dark:text-white">Thais Cruz Martins</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">CRMV 43903-SP</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Em caso de dúvida, consulte sempre um médico veterinário de confiança.
        </p>
      </SectionCard>
    </div>
  )
}

// ── CONTATOS ──────────────────────────────────────────────────────────────────
function ContatosTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SectionCard>
        <SectionTitle>
          <Phone size={20} className="text-maya-blue" />
          Parceiros em Campinas/SP
        </SectionTitle>
        <div className="space-y-4">
          {[
            {
              name: 'ANIMALE PET CARE',
              phones: '(19) 99931-4440 | (19) 3217-9394',
              desc: 'Clínica veterinária completa com internação. Descontos para adotantes em consultas, vacinas e castração.',
              location: 'Jardim Chapadão — Campinas/SP',
              color: 'border-maya-blue',
            },
            {
              name: 'SR. CHICO PET CRECHE',
              phones: '(19) 99401-2929 | (19) 99248-9229',
              desc: 'Creche para cães. Descontos para adotantes.',
              location: 'Jardim Nova Europa e Jardim Chapadão — Campinas/SP',
              color: 'border-maya-green',
            },
            {
              name: 'POUSADA BICHARADA',
              phones: '(19) 99204-9447',
              desc: 'Creche e hospedagem para cães.',
              location: 'Sousas — Campinas/SP',
              color: 'border-maya-orange',
            },
            {
              name: 'DOG CITY BRASIL',
              phones: '(19) 98286-2142',
              desc: 'Adestramento, creche e hospedagem para cães.',
              location: 'Sousas — Campinas/SP',
              color: 'border-maya-brown',
            },
            {
              name: 'ROSSANA CLEMENTE',
              phones: '(19) 99612-5175',
              desc: 'Terapeuta canina, hospedagem familiar e cuidados à domicílio.',
              location: 'Sousas — Campinas/SP',
              color: 'border-pink-400',
            },
          ].map(c => (
            <div key={c.name} className={`border-l-4 ${c.color} pl-4`}>
              <p className="text-sm font-bold text-maya-brown dark:text-white">{c.name}</p>
              <p className="text-xs text-maya-blue font-medium">{c.phones}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{c.desc}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">{c.location}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="space-y-5">
        <SectionCard>
          <SectionTitle>
            <GraduationCap size={20} className="text-maya-green" />
            Adestradores
          </SectionTitle>
          <div className="space-y-2">
            {[
              { name: 'Mateus Roberto', local: 'Campinas/SP', phone: '(19) 98781-4482' },
              { name: 'Anderson Estevam', local: 'Campinas/SP', phone: '(19) 98806-6072' },
              { name: 'Luiz Soares', local: 'Campinas/SP', phone: '(19) 99909-2720' },
              { name: 'Pets de Casa', local: 'São Paulo/SP', phone: '(11) 97228-2430' },
              { name: 'Luiz Roberto', local: 'São Paulo/SP', phone: '(11) 91732-1112' },
            ].map(a => (
              <div key={a.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <p className="text-sm font-semibold text-maya-brown dark:text-white">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.local}</p>
                </div>
                <p className="text-xs font-medium text-maya-blue">{a.phone}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="bg-maya-brown/5 border-maya-brown/20">
          <SectionTitle>
            <HeartPulse size={20} className="text-maya-orange" />
            Projeto Maya
          </SectionTitle>
          <div className="space-y-2">
            <a href="mailto:projetomaya@outlook.com" className="flex items-center gap-2 text-sm text-maya-blue hover:underline">
              <Mail size={14} className="flex-shrink-0" /> projetomaya@outlook.com
            </a>
            <a href="https://instagram.com/projeto.maya" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-maya-blue hover:underline">
              <Camera size={14} className="flex-shrink-0" /> @projeto.maya
            </a>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function ManualCuidadosPage() {
  const [activeTab, setActiveTab] = useState('saude')
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['saude']))

  const navigate = (tabId: string) => {
    setActiveTab(tabId)
    setVisitedTabs(prev => new Set([...prev, tabId]))
    window.scrollTo(0, 0)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'saude': return <SaudeTab />
      case 'castracao': return <CastracaoTab />
      case 'alimentacao': return <AlimentacaoTab />
      case 'educacao': return <EducacaoTab />
      case 'identificacao': return <IdentificacaoTab />
      case 'contatos': return <ContatosTab />
      default: return null
    }
  }

  const currentIndex = tabs.findIndex(t => t.id === activeTab)
  const prevTab = currentIndex > 0 ? tabs[currentIndex - 1] : null
  const nextTab = currentIndex < tabs.length - 1 ? tabs[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-maya-cream py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-10">
          <BookOpen className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Manual de Cuidados
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Material elaborado pela equipe Projeto Maya com apoio de médicas veterinárias especializadas.
          </p>
          <a
            href="/manual-cuidados.pdf"
            download="Manual de Cuidados - Projeto Maya.pdf"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-maya-brown text-white rounded-xl font-semibold text-sm hover:bg-maya-brown/90 transition-all hover:-translate-y-0.5 shadow-sm"
          >
            <Download size={16} />
            Baixar PDF completo
          </a>
        </div>

        {/* Tab Navigation (sticky) */}
        <div className="sticky top-0 z-20 bg-maya-beige/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-maya-brown/10 dark:border-gray-700 -mx-4 px-4 mb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center overflow-x-auto gap-1 py-2" style={{ scrollbarWidth: 'none' }}>
              {tabs.map((tab) => {
                const Icon = tab.icon
                const visited = visitedTabs.has(tab.id)
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.id)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-maya-brown text-white shadow-sm'
                        : visited
                        ? 'text-maya-green dark:text-maya-green hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                    {visited && activeTab !== tab.id && (
                      <CheckCircle size={11} className="text-maya-green" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Emergency card — always visible */}
          <EmergencyCard />

          {renderTab()}

          {/* Development grid — shown on last content tab */}
          {activeTab === 'identificacao' && (
            <div className="mt-6">
              <SectionCard>
                <SectionTitle>
                  <Calendar size={20} className="text-maya-brown" />
                  Evolução por Fase de Vida
                </SectionTitle>
                <DevelopmentGrid />
              </SectionCard>
            </div>
          )}

          {/* Checklist — shown on last tab */}
          {activeTab === 'contatos' && (
            <div className="mt-6">
              <AdoptionChecklist onNavigate={navigate} />
            </div>
          )}

          {/* Prev / Next chapter navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-maya-brown/10 dark:border-gray-700">
            <div>
              {prevTab && (
                <button
                  onClick={() => navigate(prevTab.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-maya-brown dark:hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Anterior: </span>
                  {prevTab.label}
                </button>
              )}
            </div>

            <span className="text-xs text-gray-400 dark:text-gray-600">
              {currentIndex + 1} / {tabs.length}
            </span>

            <div>
              {nextTab && (
                <button
                  onClick={() => navigate(nextTab.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-maya-brown dark:hover:text-white transition-colors"
                >
                  <span className="hidden sm:inline">Próximo: </span>
                  {nextTab.label}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
