'use client'

import { BookOpen, Dog, Cat, Heart, Droplets, Utensils, Syringe, Scissors, Sun, Moon, AlertTriangle, ThermometerSun, Bath, PawPrint } from 'lucide-react'

const careGuides = [
  {
    icon: Utensils,
    title: 'Alimentação',
    bgColor: 'bg-maya-green/10',
    textColor: 'text-maya-green',
    tips: [
      'Ofereça ração de qualidade adequada à idade e porte do animal',
      'Mantenha água fresca e limpa sempre disponível',
      'Evite dar alimentos como chocolate, uva, cebola e alho',
      'Estabeleça horários fixos para as refeições',
      'Não substitua ração por comida caseira sem orientação veterinária',
    ],
  },
  {
    icon: Syringe,
    title: 'Vacinação',
    bgColor: 'bg-maya-blue/10',
    textColor: 'text-maya-blue',
    tips: [
      'Mantenha a carteira de vacinação sempre atualizada',
      'Cães: V10 (múltipla) e antirrábica são essenciais',
      'Gatos: V4 ou V5 (tríplice/quádrupla) e antirrábica',
      'Filhotes precisam de doses de reforço — siga o calendário do veterinário',
      'Vacinas anuais protegem contra doenças graves e transmissíveis',
    ],
  },
  {
    icon: Scissors,
    title: 'Castração',
    bgColor: 'bg-maya-orange/10',
    textColor: 'text-maya-orange',
    tips: [
      'A castração previne doenças como câncer de mama e de próstata',
      'Reduz comportamentos de fuga e agressividade',
      'Ajuda a controlar a superpopulação de animais abandonados',
      'Pode ser realizada a partir dos 6 meses de idade',
      'É um procedimento seguro e com recuperação rápida',
    ],
  },
  {
    icon: Bath,
    title: 'Higiene',
    bgColor: 'bg-maya-sand/10',
    textColor: 'text-maya-sand',
    tips: [
      'Banhos a cada 15 dias (ou conforme orientação veterinária)',
      'Escove os pelos regularmente para evitar nós e queda excessiva',
      'Limpe orelhas e olhos semanalmente com produtos adequados',
      'Corte as unhas com frequência ou peça ao veterinário',
      'Mantenha o ambiente do pet sempre limpo',
    ],
  },
  {
    icon: Droplets,
    title: 'Vermifugação e Antipulgas',
    bgColor: 'bg-maya-pink/10',
    textColor: 'text-maya-pink',
    tips: [
      'Vermifugue a cada 3 a 6 meses (conforme orientação veterinária)',
      'Use antipulgas e carrapaticidas regularmente',
      'Filhotes devem ser vermifugados a partir de 15 dias de vida',
      'Pulgas e carrapatos transmitem doenças graves — previna!',
      'Prefira produtos indicados pelo veterinário ao invés de genéricos',
    ],
  },
  {
    icon: Sun,
    title: 'Exercícios e Bem-Estar',
    bgColor: 'bg-maya-green/10',
    textColor: 'text-maya-green',
    tips: [
      'Passeios diários são essenciais para cães — pelo menos 30 minutos',
      'Gatos precisam de enriquecimento ambiental (arranhadores, brinquedos)',
      'Brincadeiras estimulam a mente e fortalecem o vínculo com o tutor',
      'Evite expor o animal ao sol forte entre 10h e 16h',
      'Socialização desde filhote previne medos e agressividade',
    ],
  },
]

const emergencySigns = [
  'Vômito ou diarreia persistente',
  'Recusa total de alimento por mais de 24h',
  'Dificuldade para respirar ou respiração ofegante',
  'Sangramento sem causa aparente',
  'Convulsões ou tremores intensos',
  'Apatia extrema ou perda de consciência',
  'Inchaço abdominal repentino',
  'Dificuldade para urinar ou sangue na urina',
]

export default function ManualCuidadosPage() {
  return (
    <div className="min-h-screen bg-maya-beige dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <BookOpen className="w-16 h-16 text-maya-green mx-auto mb-4" />
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display text-maya-brown dark:text-white mb-4">
            Manual de Cuidados
          </h1>
          <p className="text-xl text-maya-brown/70 dark:text-gray-300 max-w-2xl mx-auto">
            Dicas essenciais para garantir saúde, bem-estar e uma vida feliz ao seu pet
          </p>
        </div>

        {/* Care Guides Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {careGuides.map((guide) => {
            const Icon = guide.icon
            return (
              <div
                key={guide.title}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-14 h-14 ${guide.bgColor} rounded-2xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-7 h-7 ${guide.textColor}`} />
                </div>
                <h3 className="font-display text-xl text-maya-brown dark:text-white mb-4">
                  {guide.title}
                </h3>
                <ul className="space-y-3">
                  {guide.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-maya-brown/70 dark:text-gray-300">
                      <PawPrint size={14} className="text-maya-green flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Emergency Signs */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <h2 className="font-display text-2xl md:text-3xl text-red-700 dark:text-red-300">
                Sinais de Emergência
              </h2>
            </div>
            <p className="text-red-600/80 dark:text-red-300/80 mb-6">
              Se o seu pet apresentar qualquer um destes sinais, procure um veterinário imediatamente:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {emergencySigns.map((sign, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-1" />
                  <span className="text-sm text-red-700 dark:text-red-300">{sign}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-2xl mx-auto text-center mt-16">
          <p className="text-maya-brown/60 dark:text-gray-400 mb-4">
            Em caso de dúvida, consulte sempre um médico veterinário de confiança.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20cuidados%20com%20meu%20pet."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 justify-center"
            >
              <Heart size={18} />
              Falar com a Gente
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
